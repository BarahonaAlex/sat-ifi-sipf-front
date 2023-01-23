import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { analyzeAndValidateNgModules, collectExternalReferences } from '@angular/compiler';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { EquipoTrabajoService } from 'src/app/general-module/componentes-comunes/servicios/equipo-trabajo.service';
import { Authorizer, Operator } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { SaveTransferRequest, TransferRequest } from 'src/app/general-module/componentes-comunes/interfaces/equipo-trabajo.class';
import { MatStep } from '@angular/material/stepper';
import { MatRadioButton } from '@angular/material/radio';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';
import { Button, FormStructure, Input, TextArea } from 'mat-dynamic-form';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-traslado-integrantes',
  templateUrl: './traslado-integrantes.component.html',
  styleUrls: ['./traslado-integrantes.component.css']
})

export class TrasladoIntegrantesComponent implements OnInit {

  @ViewChild('archivo') archivo!: UploadFileComponent;
  structure!: FormStructure;
  validateActionsDefault!: Button[];

  //****************Tabla que muestra las solicitudes en base a login******************* */
  displayedColumns: string[] = ['idSolicitud', 'nombreColaborador', 'motivo', 'estado', 'symbol'];
  tableRequestXLogin = new MatTableDataSource<any>()
  formRequest!: FormGroup;
  //****************Tabla que muestra detalle de Operador******************* */
  displayedColumnsOperator: string[] = ['nombreColaborador', 'nitAprobador', 'nombreAprobador', 'nombreGrupo', 'unidadAdmin', 'estado'];
  tableOperator = new MatTableDataSource<any[]>()

  //****************Tabla que muestra detalle de Aprobador******************* */
  displayedColumnsApprover: string[] = ['accion', 'idGrupo', 'nombreGrupo', 'estado', 'nombreUnidad'];
  tableAuthorizerTeamsUnits = new MatTableDataSource<any>()

  //****************Tabla que muestra detalle de solicitd******************* */
  displayedColumnsRequestDetail: string[] = ['nombreColaborador', 'nitSolicitante', 'nombreAprobador', 'nombreUnidadAdmin', 'nombreGrupoNuevo', 'estadoDetalle', 'tipoTraslado', 'accion']
  tableRequestDetail = new MatTableDataSource<any>();

  creacionSoli: boolean = false;
  detalle: boolean = false;
  generalFrom!: FormGroup;
  generalFromAuto!: FormGroup;
  scope!: FormGroup;
  saveColaboratorInfo!: Operator;
  saveAprobadorInfo!: Authorizer[];
  //primer checkbox
  selection = new SelectionModel<Authorizer>(true, []);
  radioButtonSelection!: Authorizer[];
  aprobarSolicitud!: Operator;
  enviar: any;
  detalleSolicitud!: TransferRequest[];
  nit!: string;
  nitAuthorizer!: string;
  disabled = false;
  login!: string;
  listDataSource: any[] = [];
  mostrarAutorizador = false;
  mostrarOperador = false;
  mostrarTexto = false;
  mostrarContentAuto = false;
  mostrarBotones = true;
  isLinear = false;
  regresar = false;
  idGrupoOperador!: number;
  listTypeTransfer!: Catalog[];
  listCollaborator!: Operator[];
  @ViewChild('stepper') stepper!: MatStep;

  constructor(

    private colaboradoresService: ColaboradoresService,
    private equipoTrabajoService: EquipoTrabajoService,
    private userService: UserService,
    public dialog: DialogService,
    private catalogSrv: CatalogosService,
    private router: Router

  ) {
    this.generalFrom = new FormGroup({
      nitColaborador: new FormControl(null, Validators.required),
      typeTransfer: new FormControl(null, Validators.required),
    })

    this.generalFromAuto = new FormGroup({
      nitAprobador: new FormControl(null, Validators.required),
      motivo: new FormControl(null, Validators.required),
      fechaInicio: new FormControl(null, Validators.required),
      fechaFin: new FormControl(null),
      transferDoc: new FormControl(null, Validators.required)
    })
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
  }

  changeType() {
    if (this.generalFrom.controls.typeTransfer.value === 1069) {
      this.generalFromAuto.controls.fechaFin.clearValidators();
    } else {
      this.generalFromAuto.controls.fechaFin.setValidators(Validators.required);
    }
    this.generalFromAuto.controls.fechaFin.updateValueAndValidity();
    this.generalFromAuto.updateValueAndValidity();

  }

  ngOnInit(): void {
    this.catalogSrv.getCatalogDataByIdCatalog(107).toPromise().then(result => {
      this.listTypeTransfer = result;
      console.log(this.listTypeTransfer);
    });
    this.getTransferRequestByLogin()
    this.regresar = false;
    this.mostrarAutorizador = false;
    this.mostrarOperador = false;
    this.mostrarContentAuto = false;
    this.generalFrom.reset();
    this.generalFromAuto.reset();
    this.tableOperator.data = [];
    this.tableAuthorizerTeamsUnits.data = []
  }

  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.tableRequestXLogin.paginator = mp1;
  }

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.tableAuthorizerTeamsUnits.paginator = mp2;
  }


  /**
   * @description Funcion que coloca en true la variable creacionSoli, para que se pueda mostrar el detalle de la solicitud
   * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
   * @since edited 23/06/2022
   */
  createRequest() {
    this.creacionSoli = true;
    this.isLinear = true;
  }

  /**
  * @description Metodo obtener id de la solicitud que se enviara al detalle de solicitud
  * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
  * @since edited 23/06/2022
  */
  getIdRequest(param: any) {
    this.detalle = true;
    this.enviar = {
      "idSolicitud": param.idSolicitud
    }
    console.log(this.enviar);
  }

  /**
 * @description Metodo para regresar a la vista principal y se muestra el resumen de las solicitudes
 * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
 * @since edited 23/06/2022
 */
  returnSummary() {
    this.detalle = false;
    this.regresar = false;
    this.getTransferRequestByLogin()//insertar login
  }

  /**
 * @description Metodo para validar si el operador ya cuenta con una solicitud activa
 * @author aalsuruyq (aalsuruyq)
 */
  async validateRequest(nit: string) {
    this.equipoTrabajoService.validateRequestOperator(nit).toPromise().then(res => {
      if (res) {
        this.creacionSoli = false;
        this.isLinear = false;
        this.ngOnInit();
        this.dialog.show({
          title: 'Validar NIT',
          text: `El operador ya cuenta con una solicitud de traslado.`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        console.log('El operador no cuenta con solicitudes activas')
      }

    })
  }

  /**
   * @description Funcion que consulta equipo de trabajo y Autorizador de un Operador en base al nit
   * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
   * @since edited 23/06/2022
   */
  async getOperatorByNit(nit: string) {
    this.mostrarOperador = false;
    this.mostrarContentAuto = false;
    if (nit !== "" && nit !== null) {
      await this.colaboradoresService.getTeamsByNitOperator(nit).toPromise().then(res => {
        this.listCollaborator = res;
        if (this.listCollaborator.length !== 0) {
          var grupoActivo = false;
          var colaboradorInactivo = false;
          var grupoInactivo = false;
          for (let i = 0; i < this.listCollaborator.length; i++) {
            if (this.listCollaborator[i].estadoGrupo == 163 && this.listCollaborator[i].estadoColaboradorGrupo == 170) {
              this.mostrarOperador = true
              this.mostrarContentAuto = true
              this.saveColaboratorInfo = this.listCollaborator[i];
              this.listDataSource = []
              this.idGrupoOperador = this.listCollaborator[i].grupo;
              this.listDataSource.push(this.saveColaboratorInfo)
              this.tableOperator.data = this.listDataSource;
              this.aprobarSolicitud = this.listCollaborator[i];
              grupoActivo = true;
              break;
            }
            else if (this.listCollaborator[i].estadoGrupo == 163 && this.listCollaborator[i].estadoColaboradorGrupo == 171) {
              colaboradorInactivo = true;
            }
            else if (this.listCollaborator[i].estadoGrupo == 164) {
              grupoInactivo = true;
            }
          }
          
          if (!grupoActivo) {
            if (colaboradorInactivo) {
              if (grupoInactivo) {
                this.reset(false);
                this.dialog.show({
                  title: 'Validar NIT',
                  text: `El colaborador se encuentra en un equipo de trabajo INACTIVO.`,
                  icon: 'warning',
                  showCancelButton: false,
                  disableClose: true,
                  showCloseButton: false
                })
              }
              else {
                this.reset(false);
                this.dialog.show({
                  title: 'Validar NIT',
                  text: `El NIT del colaborador ingresado no se encuentra en un equipo de trabajo o es incorrecto, por favor validar.`,
                  icon: 'warning',
                  showCancelButton: false,
                  disableClose: true,
                  showCloseButton: false
                })
              }
            }
            else if (grupoInactivo) {
              this.reset(false);
              this.dialog.show({
                title: 'Validar NIT',
                text: `El colaborador se encuentra en un equipo de trabajo INACTIVO.`,
                icon: 'warning',
                showCancelButton: false,
                disableClose: true,
                showCloseButton: false
              })
            }
          }

        }
        else {
          this.reset(false);
          this.dialog.show({
            title: 'Validar NIT',
            text: `El NIT del colaborador ingresado no se encuentra en un equipo de trabajo o es incorrecto, por favor validar.`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          })
        }

      }).catch(error => {
        this.reset(false);
        this.dialog.show({
          title: 'Validar NIT',
          text: `El NIT del colaborador ingresado no se encuentra en un equipo de trabajo o es incorrecto, por favor validar.`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      })
    }
    else {
      this.reset(false);
      this.dialog.show({
        title: 'Validar NIT',
        text: `El NIT del colaborador ingresado no se encuentra en un equipo de trabajo o es incorrecto, por favor validar.`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    }

  }

  /**
   * @description Funcion que consulta equipo de trabajo y unidad admininistrativa de un Autorizador en base al nit
   * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
   * @since edited 23/06/2022
   */
  getApproverByNit(id: string) {
    if (id !== null && id !== "") {
      this.colaboradoresService.getTeamsUntisByNitAuthorizer(id).toPromise().then(res => {
        console.log('el get aprover by nit')
        console.log(res)
        if (res.length == 0) {
          this.mostrarAutorizador = false;
          this.dialog.show({
            title: 'Validar NIT',
            text: `El NIT del Colaborador es incorrecto, por favor validar.`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          });
        } else {


          this.mostrarAutorizador = true;
          this.tableAuthorizerTeamsUnits.data = res.filter(item => item.idGrupo != this.idGrupoOperador);

          //const grupo=this.tableAuthorizerTeamsUnits.data.filter((item:any)=>item.idGrupo==this.idGrupoOperador)
          //console.log('esto es el group')
          //console.log(grupo)
          //let i=this.tableAuthorizerTeamsUnits.data.indexOf(grupo[0]);
          //this.tableAuthorizerTeamsUnits.data.splice(i,1);
          this.saveAprobadorInfo = res;
        }
      })

    }
    else {
      this.mostrarAutorizador = false;
      this.dialog.show({
        title: 'Validar NIT',
        text: `El NIT del Colaborador es incorrecto, por favor validar.`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      });
    }
  }

  //primer checkbox
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableAuthorizerTeamsUnits.data?.length;
    return numSelected === numRows;

  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableAuthorizerTeamsUnits.data?.forEach((row) =>
        this.selection.select(row),
        this.disabled = true
      );

  }

  /**
  * @description Obtener una solicitud en base al id de la solicitud
  * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
  * @since edited 23/06/2022
  */
  getTransferRequestById(id: any) {
    this.detalle = true;
    this.regresar = true;
    this.equipoTrabajoService.getTransferRequestById(id.idSolicitud).toPromise().then(res => {
      console.log(res);
      this.tableRequestXLogin.data = res;
      this.tableRequestDetail.data = res;
    })
  }

  /**
  * @description Metodo que realiza la aprobacion de la solicitud de traslado
  * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
  * @since edited 23/06/2022
  */
  approveTransferRequest(idSolicitud: number) {
    this.dialog.show({
      title: 'Confirmación',
      text: `¿Está seguro que desea aprobar esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(async resultado => {
      if (resultado == 'cancel') {
        console.log('No se guarda la informacion');
      }
      if (resultado == 'primary') {
        console.log("aprobo")
        this.equipoTrabajoService.saveApproveTransferRequest(idSolicitud).toPromise().then(res => {
          console.log(res)
          this.tableRequestXLogin.data = []
          this.tableRequestDetail.data = []
          if (res) {
            this.detalle = false;
            this.ngOnInit()
          }
          else {
            this.detalle = false;
            this.ngOnInit()
            this.dialog.show({
              title: 'Solicitud de traslado',
              text: `Solicitud de traslado con error, verificar.`,
              icon: 'error',
              showCloseButton: false
            })
          }
        });
      }
    })
  }
  /**
 * @description Metodo que realiza el rechazo de la solicitud de traslado
 * @author aalsuruyq (Anderson Suruy)
 */
  declineTransferRequest(idSolicitud: number) {
    this.structure = new FormStructure().apply({
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
      title: `Rechazar la solicitud de traslado`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    }).then(result => {
      if (result !== 'primary') return;
      let item = this.structure.getControlById('comentarios')?.value
      if (item.replace(/\s/g, "").length > 0) {
        this.equipoTrabajoService.saveDeclineTransferRequest(idSolicitud,
          this.structure.getControlById('comentarios')?.value).toPromise().then(res => {
            this.detalle = false;
            this.ngOnInit()
            this.dialog.show({
              icon: 'success',
              title: 'IFI-200',
              text: "Se ha rechazado la solicitud correctamente"
            })
          });
      } else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "El comentario no puede ir vacío",
          icon: "error",
        }).then(() => {
          this.dialog.close('primary');
        });
      }
    });
  }

  /**
  * @description Funcion que guarda solicitud de transferencia de colaborador
  * @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
  * @since edited 23/06/2022
  */
  openDialogSaveRequest() {
    console.log(this.saveColaboratorInfo.nitAprobador)
    console.log(this.radioButtonSelection)
    if (this.radioButtonSelection === undefined) {
      this.dialog.show({
        title: 'Validar Informacíon',
        text: `Por favor seleccione un equipo de trabajo`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      });
    } else {
      this.dialog.show({
        title: 'Confirmación',
        text: `¿Está seguro que desea guardar la solicitud?`,
        icon: 'question',
        showCancelButton: true,
        disableClose: true,
        showCloseButton: false
      }).then(async resultado => {
        if (resultado == 'cancel') {
          console.log('No se guarda la informacion');
        }
        if (resultado == 'primary') {
          console.log(this.radioButtonSelection[0])

          this.enviar = this.radioButtonSelection[0].idGrupo
          /* this.selection.selected.forEach(prueba => {
              this.enviar = prueba.idGrupo;
              console.log(this.enviar);
            })  */
          const save = new FormData();
          const saveInfoRequest: SaveTransferRequest = {
            fechaEfectivaTraslado: this.generalFromAuto.controls.fechaInicio.value,
            fechaNotificacionTraslado: moment().format('YYYY-MM-DD'),
            fechaEfectivaRetorno: (this.generalFromAuto.controls.fechaFin) ? this.generalFromAuto.controls.fechaFin.value : null,
            idTipoTraslado: this.generalFrom.controls.typeTransfer.value,
            idAprobadorAcepta: this.generalFromAuto.value.nitAprobador,//autorizador que recibe solicitud (aprueba)
            idAprobadorSolicitante: this.saveColaboratorInfo.nitAprobador,//autorizador que manda solicitud (solicita)
            idGrupoAnterior: this.saveColaboratorInfo.grupo,
            idGrupoNuevo: this.enviar,
            motivo: this.generalFromAuto.value.motivo,
            nitColaborador: this.generalFrom.value.nitColaborador
          }
          console.log(saveInfoRequest)
          save.append('file', this.generalFromAuto.controls.transferDoc.value);
          save.append('data', JSON.stringify(saveInfoRequest));
          this.equipoTrabajoService.saveTransferRequestMultipart(save).toPromise().then(res => {
            console.log(res);
            this.dialog.show({
              title: 'IFI-200',
              text: `Solicitud creada correctamente. La solicitud se envió a la bandeja de traslado de integrantes del Autorizador.`,
              icon: 'success',
              showCloseButton: false
            }).then(() => {
              this.reset(true);
            })
          })
        }

      })
    }
  }

  /**
* @description Funcion que muestra dialogo de erro nit incorrecto
* @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
* @since edited 23/06/2022
*/
  dialogError() {
    this.dialog.show({
      icon: 'error',
      title: 'NIT Incorrecto',
      text: 'El NIT que usted ingreso no es valido, verifique nuevamente.',
      width: '400px'
    }).then((res) => {
      if (res == 'primary') {
        console.log("todo correcto")
      }
    })
    this.dialog.close
  }

  /**
* @description Funcion que consulta solicitudes de traslado en base al login
* @author ajsbatzmo, lfvillag (Jamier Batz, Luis Villagran)
* @since edited 23/06/2022
*/
  async getTransferRequestByLogin() {
    this.equipoTrabajoService.getTransferRequest().toPromise().then(res => {
      if (res.length == 0) {
        this.mostrarTexto = true
      } else {
        this.tableRequestXLogin.data = res;
        this.tableRequestDetail.data = res;
        this.detalleSolicitud = res;
        this.mostrarTexto = false;
      }
    })
  }

  logRadio(e: any) {
    console.log(e.value);
    this.radioButtonSelection = [e.value]
  }

  reset(reset: boolean) {
    console.log(reset);

    this.creacionSoli = !reset;
    if (reset) {
      this.ngOnInit();
    }
    else {
      this.mostrarOperador = false;
      this.mostrarAutorizador = false;
      this.stepper.reset();
      this.generalFrom.reset();
      this.generalFromAuto.reset();
      this.tableOperator.data = [];
      this.radioButtonSelection = [];
      this.tableAuthorizerTeamsUnits.data = []
    }
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

  catalogSearchFilter(event: Event) {
    this.tableRequestXLogin.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

  }

}
