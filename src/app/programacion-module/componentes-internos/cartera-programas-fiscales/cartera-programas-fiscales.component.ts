import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Button, FormStructure, TextArea, CustomNode } from 'mat-dynamic-form';
import { FiscalProgramInterface, TaxInterface } from 'src/app/general-module/componentes-comunes/interfaces/FiscalProgram.interface';
import { ProgramasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/programas-fiscales.service';
import { Catalog, Item } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { MatPaginator } from '@angular/material/paginator';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import * as moment from 'moment';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';


@Component({
  selector: 'app-cartera-programas-fiscales',
  templateUrl: './cartera-programas-fiscales.component.html',
  styleUrls: ['./cartera-programas-fiscales.component.scss']
})



export class CarteraProgramasFiscalesComponent implements OnInit {


  structure!: FormStructure;
  fiscalProgramData: FiscalProgramInterface = {};

  btnUpdateText = 'Actualizar';
  txtMatTabActivo = '';
  questionText = '¿Desea guardar los cambios, el programa se enviara a revisión?';
  askChangesStatus = 107;
  askRevisionStatus = 110;
  searchStatus!: number;
  updateStatus!: number;
  changesMessageText = '';

  showTable = true;
  showUnlock = false;
  showChangesMessage = false;
  showUpdate = false;
  showAskChanges = false;
  showAskChangesBlock = false;
  showNew = false;
  askRevision = false;
  showButtons = true;
  showLock = false;

  strUpdate!: string;

  /*
  listar para mostrar en combos
  */
  listFiscalProgramType!: Catalog[];
  listFiscalProgramRouting!: Catalog[];
  listFiscalProgramCountrysideRouting!: Catalog[];
  listFiscalProgramOrigin!: Catalog[];
  listFiscalProgramRegional!: Catalog[];
  listFiscalProgramTaxes!: Catalog[];
  listProgramerDepartment!: Catalog[];
  listFiscalProgramStatus!: Catalog[];

  generalFormGroup!: FormGroup;
  searchFormGroup!: FormGroup;
  searchAllFormGroup!: FormGroup;

  dataSource = new MatTableDataSource();
  dataSource3 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource<FiscalProgramInterface>();
  dataSourceActivos = new MatTableDataSource<FiscalProgramInterface>();
  dataSource4 = new MatTableDataSource();
  //dataSource3 = new MatTableDataSource();

  displayedColumns: string[] = ['nombrePrograma', 'nombreDireccionamientoAuditoria', 'usuarioModifica', 'fechaModifica', 'acciones'];
  displayedColumns2: string[] = ['nombrePrograma', 'nombreDireccionamientoAuditoria', 'usuarioSolicitaCorreccion', 'estado', 'acciones'];


  showTabGroup: boolean = true;
  newProgramBoolean: boolean = true;
  showMessage = false;

  //@ViewChild('MatPaginator') paginator!: MatPaginator;
  //@ViewChild('MatPaginator2') paginator2!: MatPaginator;

  @ViewChild('MatPaginator') set matPaginator(mp1: MatPaginator) {

    this.dataSource.paginator = mp1;

  }


  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {

    this.dataSource2.paginator = mp2;

  }
  @ViewChild('MatPaginatorActivos') set MatPaginatorActivos(mp2: MatPaginator) {

    this.dataSourceActivos.paginator = mp2;

  }

  @ViewChild('MatPaginator3') set MatPaginator3(mp3: MatPaginator) {

    this.dataSource3.paginator = mp3;

  }
  @ViewChild('MatPaginator4') set MatPaginator4(mp4: MatPaginator) {

    this.dataSource4.paginator = mp4;

  }
  /* ngAfterViewInit(): void {
     this.dataSource.paginator = this.paginator;
     this.dataSource2.paginator = this.paginator2;
     //this.dataSource3.paginator = this.paginator;
   }*/

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
      /*input.onchange = (event: Event) => {

        // Crear ruta pre-firmada para el archivo desde S3
        const file = (event.target as HTMLInputElement).files?.item(0);
        this.gestor.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.ngZone)
          errorHandler.handleError(error)
        })
      }*/
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


  constructor(private fiscalProgramService: ProgramasFiscalesService,
    private catalogoService: CatalogosService,
    private dialog: DialogService,
    private router: Router) {

    this.generalFormGroup = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      idTipoPrograma: new FormControl('', Validators.required),
      idDireccionamientoAuditoria: new FormControl('', Validators.required),
      idTipoAuditoria: new FormControl('', Validators.required),
      idGerencia: new FormControl('', Validators.required),
      impuestos: new FormControl('', Validators.required),
      idDepartamento: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required),
      periodoInicio: new FormControl('', Validators.required),
      periodoFin: new FormControl('', Validators.required),
      usuarioAgrega: new FormControl('', Validators.nullValidator),
      fechaModifica: new FormControl('', Validators.nullValidator),
    });

    this.searchFormGroup = new FormGroup({
      idGerenciaBusqueda: new FormControl('', Validators.required),
      periodoDelBusqueda: new FormControl('', Validators.required),
      periodoAlBusqueda: new FormControl('', Validators.required),
    });

    this.searchAllFormGroup = new FormGroup({
      idGerenciaBusqueda: new FormControl('', Validators.required),
      periodoDelBusqueda: new FormControl('', Validators.required),
      periodoAlBusqueda: new FormControl('', Validators.required),
      idStatus: new FormControl('', Validators.required),
    });

  }


  onClick(actionId: string): void {
    if (actionId === 'guardar') {
      this.dialog.close('primary');
    } else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.fillCatalogs();

    this.showAskChanges = true;
    this.showAskChangesBlock = false;
    if (this.router.url === '/programacion/programa/cartera/jefe') {
      this.txtMatTabActivo = 'PENDIENTES DE AUTORIZAR';
      this.getProgramLocked();
      // 111 aprobacion
      this.updateStatus = 108;
      this.strUpdate = 'Se ha autorizado el programa de forma exitosa.';
      this.searchStatus = 111;
      this.fiscalProgramService.getFiscalProgramApproval().toPromise().then(result => {
        this.dataSource2.data = result;
        console.log(result)
      });
    }
    else if (this.router.url === '/programacion/programa/cartera/supervisor') {
      this.getProgramLocked();
      this.txtMatTabActivo = 'PENDIENTES DE APROBAR ';
      // 110 revision
      this.updateStatus = 111;
      this.strUpdate = 'Se ha enviado el programa para autorización.';
      this.searchStatus = 110;
      // this.dataSource.data = await this.fiscalProgramService.getFiscalProgramByStatus(110).toPromise();
      this.fiscalProgramService.getFiscalProgramRevision().toPromise().then(result => {
        //console.log(result);
        console.log(result);
        this.dataSource2.data = result;
      });
    }
    else {

      //this.displayedColumns.push('usuarioSolicitaCorreccion');
      this.txtMatTabActivo = 'ACTIVOS';
      // 107 es estado creado
      this.showNew = false;
      this.showAskChanges = false;
      this.showAskChangesBlock = true;
      this.searchStatus = 107;
      // this.dataSource.data = await this.fiscalProgramService.getFiscalProgramByStatus(107).toPromise();
      this.fiscalProgramService.getFiscalProgramByUserAndStatus().toPromise().then(result => {
        this.dataSource2.data = result;
        this.showMessage = result.filter(fl => fl.comentarios != null).length === 0;
      });
      // this.getProgramLocked();
    }
    // this.consultar();
    //this.searchFormGroup.controls.idGerenciaBusqueda.setValue('1');
    this.fiscalProgramService.getFiscalProgramAuthorized().toPromise().then(result => {
      this.dataSource4.data = result;
    });
  }

  async fillCatalogs(): Promise<void> {
    const listIdCatalog: Array<string> = new Array();
    listIdCatalog.push(String(Constantes.CAT_REGIONAL));
    listIdCatalog.push(String(Constantes.CAT_TAXES));
    listIdCatalog.push(String(Constantes.CAT_FISCAL_PROGRAM_TYPE));
    listIdCatalog.push(String(Constantes.CAT_FISCAL_PROGRAM_ROUTING));
    listIdCatalog.push(String(Constantes.CAT_FISCAL_PROGRAM_COUNTRYSIDE_ROUTING));
    listIdCatalog.push(String(Constantes.CAT_SUPPLY_ORIGIN));
    listIdCatalog.push(String(Constantes.CAT_FISCAL_PROGRAM_PROGRAMER_DEPARTMENT));
    listIdCatalog.push(String(Constantes.CAT_FISCAL_PROGRAM_STATUS));
    await this.catalogoService.getCatalogDataByListIdCatalog(listIdCatalog).toPromise().then(resultSet => {
      this.listFiscalProgramRegional = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_REGIONAL);
      this.listFiscalProgramTaxes = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_TAXES);
      this.listFiscalProgramType = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_FISCAL_PROGRAM_TYPE);
      this.listFiscalProgramRouting = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_FISCAL_PROGRAM_ROUTING);
      this.listFiscalProgramCountrysideRouting =
        resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_FISCAL_PROGRAM_COUNTRYSIDE_ROUTING);
      this.listFiscalProgramOrigin = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_SUPPLY_ORIGIN);
      this.listProgramerDepartment = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_INGRESO_CASES_DEPARTAMENTO);
      this.listFiscalProgramStatus = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_FISCAL_PROGRAM_STATUS);

    });
    this.fillFiscalProgramList();
  }

  async fillFiscalProgramList(): Promise<void> {
    this.showAskChanges = true;
    this.showAskChangesBlock = true;
    if (this.router.url === '/programacion/programa/cartera/jefe') {
      // 111 aprobacion
      this.updateStatus = 108;
      this.searchStatus = 111;
      // this.dataSource.data = await this.fiscalProgramService.getFiscalProgramByStatus(111).toPromise();
    }
    else if (this.router.url === '/programacion/programa/cartera/supervisor') {

      // 110 revision
      this.updateStatus = 111;
      this.searchStatus = 110;
      // this.dataSource.data = await this.fiscalProgramService.getFiscalProgramByStatus(110).toPromise();
    }
    else {
      // 107 es estado creado
      this.showAskChanges = false;
      this.showAskChangesBlock = true;
      this.searchStatus = 107;
      // this.dataSource.data = await this.fiscalProgramService.getFiscalProgramByStatus(107).toPromise();
    }
    //this.consultar();
  }



  verDetalle(pFiscalProgramData: FiscalProgramInterface): void {
    if (this.router.url === '/programacion/programa/cartera/jefe') {
      this.btnUpdateText = 'Autorizar';
      this.questionText = '¿Desea autorizar el programa? ';
    }
    else if (this.router.url === '/programacion/programa/cartera/supervisor') {
      this.btnUpdateText = 'Aprobar';
      this.questionText = '¿Desea aprobar el programa?';
    }

    this.askRevision = false;
    this.showTable = false;
    this.showNew = false;
    this.showUpdate = true;
    this.showUnlock = false;
    this.showTabGroup = false;
    this.buscarPrograma(pFiscalProgramData);

    if (pFiscalProgramData.idEstadoAnterior == 187) {
      console.log(pFiscalProgramData.idEstadoAnterior)
      this.showLock = true;
    }

  }

  verDetalleDesbloquear(pFiscalProgramData: FiscalProgramInterface): void {
    this.verDetalle(pFiscalProgramData);
    this.showUpdate = false;
    this.showUnlock = true;
    this.newProgramBoolean = false;
  }

  showProgramDetail(pFiscalProgramData: FiscalProgramInterface): void {
    this.showButtons = false;
    this.verDetalle(pFiscalProgramData);
    this.showUpdate = false;
    this.showUnlock = true;
    this.newProgramBoolean = false;
    this.generalFormGroup.disable();
  }

  solicitarRevision(pFiscalProgramData: FiscalProgramInterface): void {
    this.showTabGroup = false;
    this.updateStatus = this.askRevisionStatus;
    this.strUpdate = 'Se ha solicitado la revisión del programa.';
    this.askRevision = true;
    this.btnUpdateText = 'Solicitar revisión';
    this.questionText = '¿Desea solicitar revisión del programa?';
    this.showTable = false;
    this.showNew = false;
    this.showUpdate = true;
    this.buscarPrograma(pFiscalProgramData);
  }

  modificar(pFiscalProgramData: FiscalProgramInterface): void {
    this.showTabGroup = false;
    this.btnUpdateText = 'Actualizar';
    this.questionText = '¿Desea guardar los cambios, el programa se enviara a revisión?';
    this.showTable = false;
    this.showNew = false;
    this.showUpdate = true;
    this.askRevision = false;
    this.buscarPrograma(pFiscalProgramData);
  }




  buscarPrograma(pFiscalProgramData: FiscalProgramInterface): void {
    //console.log('entra en el buscar programa ');
    //console.log(pFiscalProgramData)
    this.fiscalProgramData.idPrograma = pFiscalProgramData.idPrograma;
    this.generalFormGroup.patchValue(pFiscalProgramData);
    const str = pFiscalProgramData.impuesto;
    const splitted = str.split('-');
    const codigoSeleccionados: number[] = [];
    for (const codigo of splitted) {
      if (this.listFiscalProgramTaxes.find(x => x.codigoIngresado === codigo)?.codigo) {
        codigoSeleccionados.push(this.listFiscalProgramTaxes.find(x => x.codigoIngresado === codigo)?.codigo);
      }
    }
    this.generalFormGroup.patchValue({ impuestos: codigoSeleccionados });
    this.generalFormGroup.enable();
    ////console.log(pFiscalProgramData.idEstado)
    if (pFiscalProgramData.idEstado === 110
      || pFiscalProgramData.idEstado === 111
      || this.askRevision) {
      this.generalFormGroup.disable();
      this.showChangesMessage = false;
      if (pFiscalProgramData.idEstadoAnterior == 187) {
        this.changesMessageText = pFiscalProgramData.comentarios || '';
      }
    }
    else {
      //console.log(pFiscalProgramData.comentarios)
      if (pFiscalProgramData.idEstado === 109) {
        this.generalFormGroup.disable();
      }
      if (pFiscalProgramData.comentarios) {

        this.showChangesMessage = true;
        this.changesMessageText = pFiscalProgramData.comentarios;
      }
      else {
        this.showChangesMessage = false;
        this.changesMessageText = '';
      }
    }
    this.generalFormGroup.get('idEstado')?.disable();
  }

  nuevo(): void {
    this.showTable = false;
    this.showNew = true;
    this.showUpdate = false;
    this.showTabGroup = false;
    this.generalFormGroup.enable();
    this.showChangesMessage = false;
    this.showUnlock = false;
    this.generalFormGroup.get('idEstado')?.disable();
    this.generalFormGroup.reset();
    this.generalFormGroup.patchValue({
      idEstado: 110/// estado de creado por default
    });

  }

  async guardar(): Promise<void> {
    let fecha = this.generalFormGroup.get('periodoInicio')?.value
    let fecha2 = this.generalFormGroup.get('periodoFin')?.value
    if (fecha > fecha2) {
      this.dialog.show({
        icon: 'warning',
        title: 'Validar Fechas.',
        text: 'El periodo hasta no puede ser menor que el perido desde.',
        showCloseButton: false,
      })
    } else if (fecha.year() != fecha2.year()) {
      this.dialog.show({
        icon: 'warning',
        title: 'Validar Fechas.',
        text: 'El periodo no corresponde al mismo año seleccionado.',
        showCloseButton: false,
      })
    } else {
      this.dialog.show({
        icon: 'question',
        title: 'IFI-100',
        text: '¿Desea crear y solicitar revisión?',
        showCancelButton: true,
        confirmButtonText: `Si`,
        cancelButtonText: 'No, cancelar',
        disableClose: true,
      }).then(resultado => {
        if (resultado === 'primary') {
          let programa: FiscalProgramInterface;
          programa = this.fillFiscalProgramData();
          // programa.estado = 107; // estado por defaul para la creacion
          this.fiscalProgramService.postFiscalPrograma(programa).toPromise().then(
            programaReturn => {
              this.cancel();
              this.fillFiscalProgramList().then(result => {
                this.dialog.showSnackBar({
                  icon: 'success',
                  title: 'IFI-200',
                  text: `Se ha creado y enviado a revisión el programa ${programaReturn.nombre}, exitosamente.`,
                  duration: 3000
                });
              });
              this.ngOnInit();

            }
          );
        }
      });
    }
  }

  solicitarCambios(): void {

    this.structure = new FormStructure().apply({
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
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.structure = this.structure

    this.dialog.show({
      title: `Solicitar correcciones. `,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.structure.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        const programa = this.fillFiscalProgramData();
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.idEstado = this.askChangesStatus;
        //console.log("esto es el programa")
        //console.log(programa)
        this.fiscalProgramService.putFiscalPrograma(programa.idPrograma, programa).toPromise()
          .then(result => {

            this.cancel();
            this.fillFiscalProgramList().then(
              secondResult => {
                this.dialog.showSnackBar({
                  icon: 'success',
                  title: 'IFI-200',
                  text: 'Se ha realizado la solicitud de correcciones, exitosamente.',
                  duration: 3000
                });
              }
            );
            ////console.log("esto es el length " + this.paginator)

            this.ngOnInit();
            //this.dataSource.paginator = this.paginator;
          });



      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vacio",
          icon: "error"
        });

      }
    });
  }


  bloquear(): void {
    this.structure = new FormStructure().apply({
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
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.structure = this.structure

    this.dialog.show({
      title: `Bloquear Programa. `,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.structure.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        const programa = this.fillFiscalProgramData();
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.idEstado = '109';

        this.fiscalProgramService.putFiscalPrograma(programa.idPrograma, programa).toPromise()
          .then(result => {

            this.cancel();
            this.fillFiscalProgramList().then(
              secondResult => {
                this.dialog.showSnackBar({
                  icon: 'success',
                  title: 'IFI-200',
                  text: 'Se ha bloqueado el programa, exitosamente.',
                  duration: 3000
                });
              }
            );
            this.ngOnInit();
          });
      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vacio",
          icon: "error"
        });

      }
    });
  }

  desbloquear(): void {

    this.structure = new FormStructure().apply({
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
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.structure = this.structure

    this.dialog.show({
      title: `Activar Programa. `,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.structure.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        const programa = this.fillFiscalProgramData();
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.comentarios = this.structure.getValue<any>().comentarios;
        programa.idEstado = '187';

        this.fiscalProgramService.putFiscalPrograma(programa.idPrograma, programa).toPromise()
          .then(result => {

            this.cancel();
            this.fillFiscalProgramList().then(
              secondResult => {
                this.dialog.showSnackBar({
                  icon: 'success',
                  title: 'IFI-200',
                  text: 'Se ha activado el programa, exitosamente.',
                  duration: 3000
                });
                this.ngOnInit();
              }
            );

          });
      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vacio",
          icon: "error"
        });

      }
    });
  }



  actualizar(): void {

    this.strUpdate = "se ha actualizado el programa, exitosamente."
    this.dialog.show({
      icon: 'question',
      title: 'IFI-100',
      text: this.questionText,
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(
      result => {

        if (result === 'primary') {
          this.fiscalProgramData = this.fillFiscalProgramData();

          this.fiscalProgramData.idEstado = this.updateStatus;
          this.fiscalProgramService.putFiscalPrograma(this.fiscalProgramData.idPrograma, this.fiscalProgramData).toPromise()
            .then(program => {
              this.cancel();
              this.fillFiscalProgramList().then(secondResult => {
                this.dialog.showSnackBar({
                  icon: 'success',
                  title: 'IFI-200',
                  text: this.strUpdate,
                  duration: 3000
                });
                this.ngOnInit();
              });
            });
        }
      }
    );
  }

  cancel(): void {
    this.showButtons = true;
    this.showTable = true;
    this.showNew = false;
    this.showUpdate = false;
    this.showUnlock = false;
    this.showTabGroup = true;
    this.showLock = false;
    this.searchFormGroup.get('idGerenciaBusqueda')?.setValue('');
    this.searchFormGroup.get('periodoDelBusqueda')?.setValue('');
    this.searchFormGroup.get('periodoAlBusqueda')?.setValue('');
    this.searchFormGroup.markAsUntouched();
    this.searchFormGroup.updateValueAndValidity();
    this.searchAllFormGroup.reset();
    this.dataSource3.data = [];
    this.dataSource.data = [];
    if (!this.newProgramBoolean) {
      this.newProgramBoolean = true;
    }
    this.ngOnInit();
  }

  fillFiscalProgramData(): FiscalProgramInterface {
    let strTaxe = '';
    let strTaxeNames = '';
    for (const item of this.generalFormGroup.controls.impuestos.value) {
      const catalogo = this.listFiscalProgramTaxes.find(x => x.codigo === item);
      strTaxe = strTaxe + '-' + catalogo?.codigoIngresado;
      if (strTaxeNames) {
        strTaxeNames = strTaxeNames + ', ' + catalogo?.nombre;
      }
      else {
        strTaxeNames = strTaxeNames + catalogo?.nombre;
      }
    }
    this.fiscalProgramData.idTipoPrograma = this.generalFormGroup.controls.idTipoPrograma.value;
    const catalogoPrograma = this.listFiscalProgramType.find(x => x.codigo === this.fiscalProgramData.idTipoPrograma);
    this.fiscalProgramData.idDireccionamientoAuditoria = this.generalFormGroup.controls.idDireccionamientoAuditoria.value;
    const catalogoDireccionamiento =
      this.listFiscalProgramRouting.find(x => x.codigo === this.fiscalProgramData.idDireccionamientoAuditoria);
    this.fiscalProgramData.idOrigenInsumo = 'null';
    // let catalogoOrigen = this.listFiscalProgramOrigin.find(x => x.codigo == this.fiscalProgramData.idOrigenInsumo);
    // this.datosProgrma.impuesto = this.generalFormGroup.controls['impuestos'].value;
    this.fiscalProgramData.idDepartamento = this.generalFormGroup.controls.idDepartamento.value;
    this.fiscalProgramData.idEstado = '110';
    this.fiscalProgramData.periodoInicio = this.generalFormGroup.controls.periodoInicio.value;
    this.fiscalProgramData.periodoFin = this.generalFormGroup.controls.periodoFin.value;
    this.fiscalProgramData.nombre = this.generalFormGroup.controls.nombre.value;
    this.fiscalProgramData.descripcion = this.generalFormGroup.controls.descripcion.value;
    this.fiscalProgramData.anio = (new Date()).getFullYear();
    this.fiscalProgramData.correlativo = 1;

    this.fiscalProgramData.idGerencia = this.generalFormGroup.controls.idGerencia.value;
    const catalogoGerecia = this.listFiscalProgramRegional.find(x => x.codigo === this.fiscalProgramData.idGerencia);
    this.fiscalProgramData.idTipoAuditoria = this.generalFormGroup.controls.idTipoAuditoria.value;
    const catalogoDireccionamientoCampo =
      this.listFiscalProgramCountrysideRouting.find(x => x.codigo === this.fiscalProgramData.idTipoAuditoria);

    this.fiscalProgramData.impuesto = strTaxe;
    // this.fiscalProgramData.impuestos = this.generalFormGroup.controls['impuestos'].value;
    this.fiscalProgramData.impuestos = new Array();
    for (const imp of this.generalFormGroup.controls.impuestos.value) {
      const tax: TaxInterface = {};
      tax.idImpuesto = imp;
      this.fiscalProgramData.impuestos.push(tax);
    }

    this.fiscalProgramData.codificacionPrograma = catalogoPrograma?.codigoIngresado
      + '-' + catalogoDireccionamiento?.codigoIngresado
      + '-' + catalogoDireccionamientoCampo?.codigoIngresado
      + '-' + catalogoGerecia?.codigoIngresado
      + strTaxe;
    this.fiscalProgramData.impuestoNombres = strTaxeNames;
    //this.fiscalProgramData.ipModifica = '10.10.10.10';
    return this.fiscalProgramData;
  }

  consultar() {
    let fecha = this.searchFormGroup.get('periodoDelBusqueda')?.value
    let fecha2 = this.searchFormGroup.get('periodoAlBusqueda')?.value
    if (fecha > fecha2) {
      this.dialog.showSnackBar({
        title: "IFI-400",
        text: "Rango de fechas incorrecto: Fecha del no puede ser mayor a Fecha al.",
        icon: "error",
        duration: 3000
      });
    }
    else {
      this.searchStatus = 109;
      if (!this.searchFormGroup.invalid) {

        this.fiscalProgramService.getFiscalProgramByStatusAndRangeOfDates(
          this.searchStatus,
          this.searchFormGroup.controls.idGerenciaBusqueda.value,
          this.searchFormGroup.controls.periodoDelBusqueda.value,
          this.searchFormGroup.controls.periodoAlBusqueda.value).toPromise().then(result => {

            this.dataSource.data = result;
          });
      }
    }
  }

  searchAll() {
    let fecha = this.searchAllFormGroup.get('periodoDelBusqueda')?.value
    let fecha2 = this.searchAllFormGroup.get('periodoAlBusqueda')?.value
    if (fecha > fecha2) {
      this.dialog.showSnackBar({
        title: "IFI-400",
        text: "Rango de fechas incorrecto: Fecha del no puede ser mayor a Fecha al.",
        icon: "error",
        duration: 3000
      });
    }
    else {
      if (!this.searchAllFormGroup.invalid) {
        this.fiscalProgramService.getFiscalProgramByStatusAndRangeOfDates(
          this.searchAllFormGroup.controls.idStatus.value,
          this.searchAllFormGroup.controls.idGerenciaBusqueda.value,
          this.searchAllFormGroup.controls.periodoDelBusqueda.value,
          this.searchAllFormGroup.controls.periodoAlBusqueda.value).toPromise().then(result => {

            this.dataSource3.data = result;
          });
      }
    }
  }
  getProgramLocked() {
    let year = new Date().getFullYear();
    this.fiscalProgramService.getFiscalProgramByLocked(new Date(year + "-01-01"), new Date(year + "-12-31")).toPromise().then(result => {
      this.dataSource.data = result;
      console.log(result);
    })
  }

}
