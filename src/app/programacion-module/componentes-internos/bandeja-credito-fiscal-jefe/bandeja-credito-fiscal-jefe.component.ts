import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  Button,
  Dropdown,
  FormStructure,
  Input,
  OptionChild,
  TextArea,
} from 'mat-dynamic-form';
import { NewSolicitudCreditoFiscalComponent } from 'src/app/det-sel-module/componente-externos/solicitud-devolucion-credito-fiscal/new-solicitud-credito-fiscal/new-solicitud-credito-fiscal.component';
import {
  RejectedEmail,
  solicitudes,
} from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { Professional } from 'src/app/general-module/componentes-comunes/interfaces/desasignacion-casos';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import { DesasignacionCasosService } from 'src/app/general-module/componentes-comunes/servicios/desasignacion-caso.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';

@Component({
  selector: 'app-bandeja-credito-fiscal-jefe',
  templateUrl: './bandeja-credito-fiscal-jefe.component.html',
  styleUrls: ['./bandeja-credito-fiscal-jefe.component.css'],
})
export class BandejaCreditoFiscalJefeComponent implements OnInit {
  @ViewChild('MatPaginator') set matPaginator2(mp: MatPaginator) {
    this.Solicitud.paginator = mp;
  }

  professionals: Professional[] = [];

  BandejaSolicitud: string[] = [
    'idSolicitud',
    'numeroFormulario',
    'nitContribuyente',
    'pinicio',
    'pfin',
    'estado',
    'Accion',
  ];
  Solicitud = new MatTableDataSource<solicitudes>();
  lenghtTableSolicitudes!: number;
  estructura!: FormStructure;
  @ViewChild('formulario') formulario:
    | NewSolicitudCreditoFiscalComponent
    | undefined;
  showFormBool: boolean = false;
  idSolicitud: any;
  vShow: number = 0;
  dataContribuyente: any = [];
  showVisor: Boolean = true;
  arrayProperties: { name: string; key: string }[] = [];
  node: EntryNodoAcs | undefined;
  dataContador: any = [];
  idSolicitudDetalle!: number;
  nitContribuyente!: string;
  validateActionsDefault!: Button[];
  constructor(
    private creditServices: CreditoFiscal,
    private router: Router,
    private dialogService: DialogService,
    private servicesComponentUnassign: DesasignacionCasosService,
    private gestorService: GestorService,
    private dialogo: DialogService
  ) {}
  ngOnInit(): void {
    this.getRequestAdmited();
    console.log();
    /* this.professionals = [
      {
        nombreContribuyente: 'Débora Fernanda Top Vargas',
        idRol: 18,
        nitContribuyente: '111782430',
        nombreEstado: 'Activo',
      },
      {
        nombreContribuyente: 'RUDY ARMANDO  CULAJAY SEIJAS',
        idRol: 18,
        nitContribuyente: '93849559',
        nombreEstado: 'Activo',
      },
    ]; */
    this.servicesComponentUnassign
      .getProfetionals()
      .toPromise()
      .then((res) => {
        this.professionals = res;
        console.log(res);
      });
  }
  click(idSoli: number) {
    this.idSolicitud = idSoli;
    let Cedulas = 'Cedulas';
    this.gestorService
      .contentSitesBasePathByParams('CEDULA_CREDITO', {
        idSolicitud: this.idSolicitud,
        carpeta: Cedulas,
      })
      .toPromise()
      .then((res) => {
        console.log(res);
        if (res != null) {
          this.gestorService
            .contentSitesFolderByIdNodesChildren(res.id)
            .toPromise()
            .then((data) => {
              console.log(data);
              this.node = data?.list?.entries?.find(
                (res) => res.entry.name === 'Cédula de no admisión.pdf'
              )?.entry;
              this.showVisor = this.node?.isFile ? false : true;
              if (!this.node) {
                this.dialogo.show({
                  icon: 'error',
                  title: 'IFI-404',
                  text: 'No se ha encontrado la cedula para la solicitud seleccionada.',
                });
              }
            });
        } else {
          this.dialogo.show({
            icon: 'error',
            title: 'IFI-404',
            text: 'No se ha encontrado la cedula para la solicitud seleccionada.',
          });
        }
      });
  }
  getRequestAdmited() {
    this.creditServices
      .getRequestAdmitedService()
      .toPromise()
      .then((res) => {
        this.lenghtTableSolicitudes = res.length;
        this.Solicitud.data = res;
        console.log(res);
      });
  }
  getDataContribuyente() {
    this.dataContribuyente = this.creditServices
      .getDataContribuyente(this.nitContribuyente)
      .toPromise()
      .then((res) => {
        this.dataContribuyente = res;
        this.formulario?.FirstSteper.patchValue({
          NITcontribuyente: this.dataContribuyente.nit,
          NombreRazonSocial: this.dataContribuyente.nombre,
          DomicilioFiscal:
            this.dataContribuyente.calleAvenida +
            ', ' +
            this.dataContribuyente.municipio +
            ', ' +
            this.dataContribuyente.departamento,
          DireccionEmail: this.dataContribuyente.email,
        });

        this.getDatosContador(
          this.dataContribuyente.nitContador,
          this.dataContribuyente.fechaNombramientoContador
        );
      });
  }
  getDatosContador(nitContador: string, fechaNombramiento: string) {
    this.creditServices
      .getContador(nitContador)
      .toPromise()
      .then((res) => {
        this.dataContador = res;
        this.formulario?.SecondSteper.patchValue({
          NITcontador: this.dataContador.nitContado,
          CUIcontador: this.dataContador.cui,
          NombreContador: this.dataContador.nombreContador,
          FechaNombramiento: fechaNombramiento,
        });
      });
  }
  showDetail(idSolicitud: number, nit: string) {
    this.idSolicitudDetalle = idSolicitud;
    this.showFormBool = !this.showFormBool ? true : false;
    this.nitContribuyente = nit;
    console.log('IDSolicitud', this.idSolicitudDetalle);
    console.log('SHOWBOOL', this.showFormBool);
  }
  regresar() {
    this.showFormBool = false;
    //Variable showVisor con el valor "true" dejara de mostrar el visor y mostrará los registros en la tabla principal.
    this.showVisor = true;
  }
  asignar() {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Dropdown(
          'nit',
          'Profesional',
          this.professionals.map(
            (res) => new OptionChild(res.nombre!, res.nit!)
          )
        ).apply({
          singleLine: true,
        }),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          onEvent: () => this.dialogService.close(),
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('save', 'Guardar', {
          onEvent: (event) => {
            console.log(event.structure.getValue());

            const formString = JSON.stringify({
              ...event.structure.getValue(),
            });
            const form = JSON.parse(formString);
            const body = {
              nit: form.nit,
            };
            console.log(form.nit);
            console.log(this.idSolicitud);

            this.creditServices
              .assignSolicitud(this.idSolicitudDetalle, form.nit)
              .toPromise()
              .then((res) => {
                if (res) {
                  this.dialogService
                    .show({
                      title: 'Asignación de solicitud',
                      text: 'Solicitud asignada correctamente',
                      icon: 'success',
                    })
                    .then(() => {
                      window.location.reload();
                    });
                }
              });
          },
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.dialogService.show({
      title: 'Asignar',
      formStructure: this.estructura,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  /**
   * @author Luis Villagran (lfvillag)
   * @description "Metodo encargado de realizar la aprobación de una cédula."
   * @since 19/12/2022
   */
  sendEmailAccept() {
    //Servicio que enviar email al contribuyente u operador y cambia de estado la solicitud.
    this.creditServices
      .putSendEmailAccept(this.idSolicitud)
      .toPromise()
      .then((res) => {
        this.dialogService
          .show({
            title: 'Aceptación exitosa',
            text: `Se acepta el rechazo de la solicitud de crédito fiscal`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false,
          })
          .then(() => {
            //Variable showVisor con el valor "true" dejara de mostrar el visor y mostrará los registros en la tabla principal.
            this.showVisor = true;
            this.ngOnInit();
          });
      });
  }
  /**
   * @author Luis Villagran (lfvillag)
   * @description "Metodo que crea un dialog para poder realizar un comentario de rechazo. Utilizando el DinamicForm"
   * @since 19/12/2022
   */
  sendEmailRejected() {
    console.log(this.idSolicitud);
    //creación de objeto de tipo formsStructure que almacenara los inputs necesarios.
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('comentario', 'Comentarios').apply({
          singleLine: true,
          maxCharCount: 400,
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('guardar', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    //Llamado de dialog utilizando como formStructure la variable que almacenara el nuevo objeto "estructura."
    this.dialogService.show({
      title: `Corrección de Cédula`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  /*   AprovedsendEmailAccept(idSolicitud: number) {
    console.log((this.idSolicitud = idSolicitud));
    this.creditServices
      .putSendEmailAccept(this.idSolicitud)
      .toPromise()
      .then((res) => {
        console.log(res);
        this.dialogService.show({
          title: 'Aprobación exitosa',
          text: `Se aprueba la solicitud de crédito fiscal`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
      }).then( () =>{
        this.showVisor = true
        this.ngOnInit()
      })
      });

  }
  AprovedsendEmailRejected(idSolicitud: number) {
    console.log((this.idSolicitud = idSolicitud));
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('comentario', 'Comentarios').apply({
          singleLine: true,
          maxCharCount: 400,
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('guardar', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    this.dialogService.show({
      title: `Corrección de Cédula`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  } */
  /**
   * @author Luis Villagrán (lfvillag)
   * @description "Metodo encargado de realizar el rechazo de una cédula"
   * @since 19/12/2022
   * @param actionId
   */
  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogo.close('primary');
      //Variable que contiene un objeto conformado por el cometario y el id de la solicitud.
      let detalleRechazo: RejectedEmail = {
        idSolicitud: this.idSolicitud,
        comentario: this.estructura.getControlById('comentario')?.value,
      };
      //Servicio que enviar email al contribuyente u operador y cambia de estado la solicitud.
      this.creditServices
        .putSendEmailRejected(detalleRechazo)
        .toPromise()
        .then((res) => {
          console.log(res);
          this.showFormBool = false;
          //Variable showVisor con el valor "true" dejara de mostrar el visor y mostrará los registros en la tabla principal.
          this.showVisor = true;
          //Se llama al metodo que se encarga de recargar los registros de la tabla principal.
          this.getRequestAdmited();
        });
      this.dialogService.show({
        icon: 'success',
        title: 'Denegación Exitosa',
        text: 'Se ha denegado de forma correcta.',
      });
    } else {
      this.dialogo.close('cancel');
    }
  }
  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }
}
