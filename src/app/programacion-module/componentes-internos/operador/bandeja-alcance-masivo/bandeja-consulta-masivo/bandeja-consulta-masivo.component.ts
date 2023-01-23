
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { MatTableDataSource } from '@angular/material/table';
import { FindingDetail } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';

@Component({
  selector: 'app-bandeja-consulta-masivo',
  templateUrl: './bandeja-consulta-masivo.component.html',
  styleUrls: ['./bandeja-consulta-masivo.component.scss']
})
export class BandejaConsultaMasivoComponent implements OnInit {

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
  idCaso!: number;
  @Output('programa') programaEmitter = new EventEmitter();
  dataSource2 = new MatTableDataSource<FindingDetail>()
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taxPayerService: ContribuyenteService,
    private caseService: CasosService,
    private casesDteService: CasosDTEService,
    private contentService: GestorService,
    private dialog: DialogService,
    private fiscalProgramService: ProgramasFiscalesService
  ) {
    this.selectionFormGroup = new FormGroup({
      selectedProgram: new FormControl(''),
    });

    this.validateActionsDefault = [
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
    ];

    this.route.paramMap.subscribe(params => {
      this.idCaso = parseInt(params.get('idCaso') as string);
    });
  }

  ngOnInit() {
    this.fiscalProgramService.getFiscalProgramByStatusAndCurrentYear(108).toPromise().then(res => {
      this.listFiscalProgram = res;
    });

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('idCaso') ?? '-1');

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

            this.taxPayer = {
              name: parsearNombre(detail),
              activity: data.actividadEconomica?.nombre?.toLocaleLowerCase() ?? 'No especificada',
              dpi: detail.dpi ? this.separateCUI(detail.dpi) : 'No especificado',
              taxes: taxes == '' ? 'No especificados' : taxes,
              address: location?.vistaPrevia.toLocaleLowerCase() ?? 'No especificada',
              classification: detail.codigo_Clasificacion_Desc.toLocaleLowerCase() ?? 'No especificada',
              taxPayerType: data.tipoContribuyente.valueDesc.toLocaleLowerCase() ?? 'No especificado'
            }
          });


        if (this.taxPayerCase.idPrograma) {
          this.idProgram = this.taxPayerCase.idPrograma;

          this.selectionFormGroup.get('selectedProgram')?.setValue(this.taxPayerCase.idPrograma);
        }
      });


    });

    this.toggleTaxPayer();

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
        new TextArea('comentarios', 'Comentarios', '').apply({
          singleLine: true, maxCharCount: 400
        })
      ],
      validateActions: this.validateActionsDefault
    });

    this.dialog.show({
      title: `Rechazar Caso`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    }).then(result => {
      if (result !== 'primary') return;
      this.caseService.putDeclineOperator(this.id, this.estructura.getControlById('comentarios')?.value).toPromise().then(res => {
        this.dialog.show({
          icon: 'success',
          title: 'IFI-200',
          text: "Rechazo de Caso Exitoso.",
        });
        this.router.navigate(['/programacion/operador/cartera/casos'])
      })
     // console.log(this.estructura.getControlById('comentarios')?.value);
    });
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialog.close('primary');
    } else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
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

  eventCatcher(e: any) {
    this.dataSource2.data = e;
  }
}

