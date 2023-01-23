import { CatalogosService } from './../../../../general-module/componentes-comunes/servicios/catalogos.service';
import { CaseDetail } from './../../../../general-module/componentes-comunes/interfaces/casos.interface';
import { Component, EventEmitter, OnInit, Output, Injector, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, CustomNode, FormStructure, TextArea } from 'mat-dynamic-form';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { VisorComponent } from 'src/app/general-module/componentes-comunes/visor/visor.component';
import { ProgramasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/programas-fiscales.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FiscalProgramInterface } from 'src/app/general-module/componentes-comunes/interfaces/FiscalProgram.interface';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { MatTableDataSource } from '@angular/material/table';
import { FindingDetail } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { Input as InputCore } from '@angular/core';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';

@Component({
  selector: 'app-bandeja-consulta',
  templateUrl: './bandeja-consulta.component.html',
  styleUrls: ['./bandeja-consulta.component.scss']
})
export class BandejaConsultaComponent implements OnInit {

  @InputCore('idCase') idCase!: number;
  authorized: boolean = true;
  loaded: boolean = true;
  id!: number;
  idProgram!: number;
  taxPayerData!: Contribuyente.Respuesta;
  taxPayer = { name: '', activity: '', dpi: '', address: '', classification: '', taxPayerType: '', taxes: '' };
  files: EntryNodoAcs[] = [];
  taxPayerCase!: CaseDetail;
  nameProgram!: string;
  listFiscalProgram!: FiscalProgramInterface[];
  selectionFormGroup!: FormGroup;
  validateActionsDefault!: Button[];
  estructura!: FormStructure;
  estado!: number;
  listRegional!: Catalog[];
  dateBegin!: Date;
  dateEnd!: Date;
  showProgramSelect = false;
  regionalErrorMessage = `No existen programas fiscales para seleccionar.`;
  regionalValid = false;
  @Output('programa') programaEmitter = new EventEmitter();

  dataSource2 = new MatTableDataSource<FindingDetail>()

  options = {
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help charmap emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit insert format table',
    toolbar: 'undo redo | bold italic underline strikethrough | formatselect fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen preview print | charmap image table',
    toolbar_sticky: true,
    content_style: '* { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; }',
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    resize: false,
    importcss_append: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.style.display = 'none';
      if (meta.filetype === 'image') {
        input.accept = 'image/*';
      } else if (meta.filetype === 'media') {
        input.accept = 'video/*';
      } else input.accept = '*/*';
      input.onchange = (event: Event) => {

        // Crear ruta pre-firmada para el archivo desde S3
        const file = (event.target as HTMLInputElement).files?.item(0);
        this.contentService.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.ngZone)
          errorHandler.handleError(error)
        })
      }
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image quicktable table",
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taxPayerService: ContribuyenteService,
    private caseService: CasosService,
    private casesDteService: CasosDTEService,
    private contentService: GestorService,
    private dialog: DialogService,
    private fiscalProgramService: ProgramasFiscalesService,
    private catalogService: CatalogosService,
    private injector: Injector,
    private ngZone: NgZone
  ) {
    this.selectionFormGroup = new FormGroup({
      selectedRegional: new FormControl(''),
      selectedProgram: new FormControl(''),
    });

    /*this.validateActionsDefault = [
      new Button('cancelar', 'Cancelar', {
        callback: this, style: 'warn'
      }).apply({
        icon: 'close'
      }),
      new Button('guardar', 'Guardar', {
        callback: this, style: 'primary',
      }).apply({
        validateForm: true,
        icon: 'save'
      }),
    ];*/

  }

  ngOnInit() {

    const today = new Date();


    this.dateBegin = new Date('January 01 ,' + today.getFullYear());
    this.dateEnd = new Date('December 31 ,' + today.getFullYear());
    // catalogo de gerencias 
    this.catalogService.getCatalogDataByIdCatalog(9).toPromise().then(result => {
      this.listRegional = result;
    });


    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id') ?? '-1');

      const body = {
        caso: this.id,
        carpeta: "Archivos Respaldo"
      }

      this.casesDteService.getPath(body).toPromise().then(res => {
        this.contentService.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
          if (result != null) {
            this.files = result.list.entries.map(file => ({ ...file.entry, icon: file.entry.name.split('.').pop() }));
          }
        });
      });

      this.caseService.getCaseById(this.id).toPromise().then(result => {
        this.taxPayerCase = result.caso;
        this.estado = result.caso.idEstado;

        this.taxPayerService.getGeneralTaxpayerInformation(result.caso.nitContribuyente).
          toPromise().then(resultTwo => {
            this.taxPayerData = resultTwo;

            const data = this.taxPayerData.data.attributes.datos;
            const detail = data.contribuyente?.persona ?? data.empresa;
            const location = data.ubicacion.ubicaciones?.pop();
            const taxes = Object.keys(data.afiliacionImpuesto ?? {}).filter(key => (data.afiliacionImpuesto as any)[key] != null).join('/')?.toUpperCase();
            let activity = '';
            if (data.tipoContribuyente.value == "1" || data.tipoContribuyente.value == '0') {
              activity = data.contribuyente.persona.actividadEconomicaPrincipal ? data.contribuyente.persona.actividadEconomicaPrincipal.ciiu + ' - ' + data.contribuyente.persona.actividadEconomicaPrincipal.nombreActividadEconomica : 'No posee actividad económica';
            } else {
              activity = data.empresa.actividadEconomicaPrincipal ? data.empresa.actividadEconomicaPrincipal.ciiu + ' - ' + data.empresa.actividadEconomicaPrincipal.nombreActividadEconomica : 'No posee actividad económica';
            }
            this.taxPayer = {
              name: parsearNombre(detail),
              activity: activity,
              dpi: detail.dpi ? this.separateCUI(detail.dpi) : 'No especificado',
              taxes: taxes == '' ? 'No especificados' : taxes,
              address: location?.vistaPrevia.toLocaleLowerCase() ?? 'No especificada',
              classification: detail.codigo_Clasificacion_Desc.toLocaleLowerCase() ?? 'No especificada',
              taxPayerType: data.tipoContribuyente.valueDesc.toLocaleLowerCase() ?? 'No especificado'
            }
          });


        if (this.taxPayerCase.idPrograma) {
          this.idProgram = this.taxPayerCase.idPrograma;
          this.fiscalProgramService.getFiscalProgramById(this.taxPayerCase.idPrograma).toPromise().then(
            result2 => {
              this.getProgramListData(result2.idGerencia);
              this.selectionFormGroup.get('selectedRegional')?.setValue(result2.idGerencia);
            }
          );

          this.selectionFormGroup.get('selectedProgram')?.setValue(this.taxPayerCase.idPrograma);
        }
      });


    });

    this.toggleTaxPayer();
  }


  eventCatcher(e: any) {
    this.dataSource2.data = e;
  }

  toggleTaxPayer() {
    const container = document.getElementById('toggleTayPayer');
    const taxIcon = document.getElementById('tax-icon');

    container?.classList.toggle("tp-open")
    container?.classList.toggle("tp-close")

    taxIcon?.classList.toggle('close')
    taxIcon?.classList.toggle('open')

    document.getElementById('option-container')?.classList.toggle('ms-2')
  }

  selectOption(id: string) {
    const children = document.getElementById('option-container')?.children ?? [];
    const option = document.getElementById(id);
    const button = document.getElementById(`${id}_button`);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childButton = document.getElementById(`${child.id}_button`);
      child.classList.remove('selected');
      childButton?.classList.remove('mat-raised-button')
    }

    option?.classList.add('selected');

    button?.classList.add('mat-raised-button')
  }

  separateCUI(cui: string): string {
    return `${cui.slice(0, 4)} ${cui.slice(4, 9)} ${cui.slice(9, 13)}`
  }

  showFile(node: EntryNodoAcs) {
    const structure = new FormStructure().apply({
      showTitle: false,
      nodes: [
        new CustomNode<VisorComponent>('viewer', VisorComponent, {
          nodeId: node.id,
          arregloPropiedades: node.properties
        }).apply({ singleLine: true })
      ],
      validateActions: []
    });
    this.dialog.show({
      title: 'Visor de archivos',
      formStructure: structure,
      width: '100%',
      showCloseButton: true,
      showConfirmButton: false,
    });
  }

  /* getFiscalProgram(idCaso: number){
    this.caseService.getCaseById(idCaso).toPromise().then(res=>{
      console.log(res.caso.idPrograma)
      this.fiscalProgramService.getFiscalProgramById(res.caso.idPrograma).toPromise().then(data=>{
        console.log(data.nombre)
        this.program = data
      }).catch(error=>{
        console.log("programa: " + error)

      })
    }).catch(err=>{
      console.log("Caso: "+err)
    })
  } */

  rechazo() {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('comentarios', RichTextComponent).apply({
          singleLine: true,
          options: this.options,
          outputFormat: "html"
        })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardarComentario', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura

    this.dialog.show({
      title: `Rechazar Caso `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.estructura.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        this.caseService.putDeclineOperator(this.id, this.estructura.getControlById('comentarios')?.value).toPromise().then(res => {
          this.dialog.show({
            icon: 'success',
            title: 'IFI-200',
            text: "Rechazo de Caso Exitoso.",
          });
          this.router.navigate(['/programacion/operador/cartera/casos'])
        })
      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vacío",
          icon: "error"
        });

      }
    });
    
  }


  onClick(actionId: string): void {
    if (actionId == 'guardarComentario') {
      this.dialog.close('primary');
    } else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  updateProgramList() {

    this.getProgramListData(this.selectionFormGroup.get('selectedRegional')?.value);
    this.selectionFormGroup.get('selectedProgram')?.setValue(null);
    this.idProgram = 0;

  }


  getProgramListData(idRegional: number) {
    this.fiscalProgramService.getFiscalProgramByStatusAndRegional(108, idRegional).toPromise().then(res => {
      this.listFiscalProgram = res;
      this.showProgramSelect = true;
      this.regionalValid = false;
      if (this.listFiscalProgram.length == 0) {
        this.showProgramSelect = false;
        this.regionalValid = true;
      }

    });
  }

  asignarPrograma() {

    this.fiscalProgramService.assignFiscalProgram(
      parseInt(this.selectionFormGroup.get('selectedProgram')?.value),
      this.id).toPromise().then(res => {
        if (res.idPrograma = ! null) {
          this.dialog.close();
          this.dialog.show({
            title: 'IFI-200',
            text: `Se ha asignado correctamente el programa fiscal al caso`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true
          });

          this.listFiscalProgram.forEach(item => {
            if (item.idPrograma === this.selectionFormGroup.get('selectedProgram')?.value) {
              this.taxPayerCase.nombrePrograma = item.nombre;
            }
          })


        }
        this.idProgram = res.idPrograma;
      });
  }

  validateState(): boolean {
    if (this.estado == 18 || this.estado == 19 || this.estado == 133) {
      this.selectOption('scope')
      return false;
    } else {
      return true;
    }

  }
}
