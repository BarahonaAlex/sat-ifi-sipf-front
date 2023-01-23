import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  solicitudes,
  saveArchivo,
  dataContribuyente,
  dataCalculoDeclaraciones,
  dataSaveSolicitud,
  DatosSaveSolicitud,
  DatosSavelistaDeclaracion,
} from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { stringify } from 'querystring';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-new-solicitud-credito-fiscal',
  templateUrl: './new-solicitud-credito-fiscal.component.html',
  styleUrls: ['./new-solicitud-credito-fiscal.component.css'],
})
export class NewSolicitudCreditoFiscalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatHorizontalStepper;
  @Input('isRevision') isRevision: boolean = false;
  @Input('idSolicitud') idSolicitudDetalle!: number;
  @ViewChild('MatPaginator') set matPaginator(mp: MatPaginator) {
    this.calculoDeclaraciones.paginator = mp;
  }
  FirstSteper!: FormGroup;
  SecondSteper!: FormGroup;
  ThreeSteper!: FormGroup;
  BandejaSolicitud: string[] = [
    'idSolicitud',
    'numeroFormulario',
    'pinicio',
    'monto',
    'credito',
    'devolucion',
    'multa',
  ];
  tablaCalculoDeclaraciones: string[] = [
    'periodos',
    'numeroFormulario',
    'montoCalculado',
    'montoSolicitud',
    'creditoNoSolicitado',
    'devolucion',
    'multa',
  ];
  Solicitud = new MatTableDataSource<solicitudes>();
  direccion: any = '';
  email: any = '';
  dataContribuyente: any = [];
  listaRepresentantes: any = [];
  dataContador: any = [];
  calculoDeclaraciones = new MatTableDataSource<DatosSavelistaDeclaracion>();
  declaracionesSave: DatosSavelistaDeclaracion =
    {} as DatosSavelistaDeclaracion;
  periodoInicio: any;
  periodoFin: any;
  datosSolicitud: DatosSaveSolicitud = {};
  prueba: string = '';
  dataSolicitud: any = [];
  total: number = 0;
  userLogged!: UserLogged;
  constructor(
    private creditServices: CreditoFiscal,
    private router: Router,
    private dialog: DialogService,
    private userService: UserService
  ) {
    //INPUTS DEL PRIMER STEPPER
    this.FirstSteper = new FormGroup({
      NITcontribuyente: new FormControl(''),
      nitRepresentante: new FormControl(''),
      NombreRazonSocial: new FormControl(''),
      DomicilioFiscal: new FormControl(''),
      DomicilioOpcional: new FormControl(''),
      DireccionEmail: new FormControl('', Validators.required),
      DireccionEmailEsRevision: new FormControl(''),
      DireccionOpcion: new FormControl(''),
      NombreRepresentante: new FormControl('', Validators.required),
      CUIrepresentante: new FormControl(''),
      FechaNombramiento: new FormControl(''),
      FechaVencimiento: new FormControl(''),
      NumeroPasaporte: new FormControl(''),
    });
    //INPUTS DEL SEGUNDO STEPPER
    this.SecondSteper = new FormGroup({
      NITcontador: new FormControl(''),
      CUIcontador: new FormControl(''),
      NombreContador: new FormControl(''),
      FechaNombramiento: new FormControl(''),
    });
    //INPUTS DEL TERCER STEPPER
    this.ThreeSteper = new FormGroup({
      ActividadEconomica: new FormControl({ value: '' }, Validators.required),
      PeriodoInicio: new FormControl('', Validators.required),
      PeriodoFin: new FormControl('', Validators.required),
      Declaracion: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (this.isRevision) {
      this.getRequestInfo();
      this.ThreeSteper.get('ActividadEconomica')?.disable();
    } else {
      this.getDataContribuyente();
      this.ThreeSteper.controls['ActividadEconomica'].setValue('');
    }
  }

  getRequestInfo() {
    this.dataContribuyente = this.creditServices
      .getDataSolicitudFull(this.idSolicitudDetalle)
      .toPromise()
      .then((res: any) => {
        this.dataSolicitud = res;
        this.getDataContribuyente();

        this.ThreeSteper.controls['ActividadEconomica'].setValue(
          this.dataSolicitud.principalProducto
        );
        this.FirstSteper.controls['DireccionEmailEsRevision'].setValue(this.dataSolicitud.correoNotifica);
      });
  }

  getDataContribuyente() {
    this.dataContribuyente = this.creditServices
      .getDataContribuyente(
        this.idSolicitudDetalle ? this.idSolicitudDetalle.toString() : undefined
      )
      .toPromise()
      .then((res: any) => {
        if (res !== undefined) {
          this.dataContribuyente = res.resultadoContribuyente;
          this.FirstSteper.controls['NITcontribuyente'].setValue(
            this.dataContribuyente.nit
          );
          this.FirstSteper.controls['NombreRazonSocial'].setValue(
            this.dataContribuyente.nombre
          );
          this.FirstSteper.controls['DomicilioFiscal'].setValue(
            this.dataContribuyente.calleAvenida +
              ', ' +
              this.dataContribuyente.municipio +
              ', ' +
              this.dataContribuyente.departamento
          );
          this.FirstSteper.controls['DireccionEmail'].setValue(
            this.isRevision
              ? this.dataSolicitud.correoNotifica
              : this.dataContribuyente.email
          );
          if (
            this.dataContribuyente.nitContador !== null &&
            this.dataContribuyente.nitContador !== undefined
          ) {
            this.getDatosContador(
              res.resultadoContador,
              this.dataContribuyente.fechaNombramientoContador
            );
          } else {
            this.dialog.show({
              icon: 'warning',
              title: 'IFI-100',
              text: 'No tiene un contador que este registrado a su persona',
              showCancelButton: false,
              disableClose: false,
            });
          }

          if (this.isRevision) {
            this.getCalculoDeclaraciones();
          } else {
            this.getRepresentantes(res.resultadoRepresentante);
          }
        } else {
          this.dialog.show({
            icon: 'warning',
            title: 'IFI-100',
            text: 'No esta registrado en la base de datos',
            showCancelButton: false,
            disableClose: false,
          });
        }
      });
  }
  getRepresentantes(res: any) {
    this.listaRepresentantes = res;
  }
  getDatosContador(res: any, fechaNombramiento: string) {
    this.dataContador = res;
    this.SecondSteper.controls['NITcontador'].setValue(
      this.dataContador.nitContador
    );
    this.SecondSteper.controls['CUIcontador'].setValue(this.dataContador.cui);
    this.SecondSteper.controls['NombreContador'].setValue(
      this.dataContador.nombreContador
    );
    this.SecondSteper.controls['FechaNombramiento'].setValue(
      moment(fechaNombramiento).format('DD/MM/YYYY')
    );
  }
  llenarDatosRepresentante(item: any) {
    this.FirstSteper.controls['nitRepresentante'].setValue(
      item.nitRepresentante
    );
    this.FirstSteper.controls['CUIrepresentante'].setValue(item.cui);
    this.FirstSteper.controls['FechaNombramiento'].setValue(
      moment(item.fechaNombramiento).format('DD/MM/YYYY')
    );
    this.FirstSteper.controls['NumeroPasaporte'].setValue(item.pasaporte);
  }
  getCalculoDeclaraciones() {
    this.periodoInicio = !this.isRevision
      ? moment(this.ThreeSteper.controls['PeriodoInicio'].value)
          .parseZone()
          .format('DD/MM/YYYY')
      : moment(this.dataSolicitud.periodoInicio, 'YYYY-MM-DD')
          .parseZone()
          .format('DD/MM/YYYY');
    this.periodoFin = !this.isRevision
      ? moment(this.ThreeSteper.controls['PeriodoFin'].value)
          .parseZone()
          .format('DD/MM/YYYY')
      : moment(this.dataSolicitud.periodoFin, 'YYYY-MM-DD')
          .parseZone()
          .format('DD/MM/YYYY');
          console.log("periodo inicio", this.periodoInicio, " periodo fin", this.periodoFin);
          
    this.creditServices
      .getCalculoDeclaraciones(
        this.dataContribuyente.nit,
        this.periodoInicio,
        this.periodoFin
      )
      .toPromise()
      .then((res) => {
        this.calculoDeclaraciones.data = res;
        this.calculoDeclaraciones.data.forEach((element: any) => {
          this.total =
            this.total +
            (element.montoCalculado -
              element.montoSolicitud -
              element.creditoNoSolicitado);
          element.sujetoADevolucion =
            element.montoCalculado -
            element.montoSolicitud -
            element.creditoNoSolicitado;
          var periodoAl = moment(element.periodoAl, 'DD/MM/YYYY hh:mm:ss')
            .parseZone()
            .format('YYYY-MM-DD');
          var fechaAl = periodoAl.split('-', 3).toString();
          element.periodoAl = new Date(fechaAl);
          var periodoDel = moment(element.periodoDel, 'DD/MM/YYYY hh:mm:ss')
            .parseZone()
            .format('YYYY-MM-DD');
          var fechaDel = periodoDel.split('-', 3).toString();
          element.periodoDel = new Date(fechaDel);
          var fechaRecaudo = moment(element.fechaRecaudo, 'DD/MM/YYYY hh:mm:ss')
            .parseZone()
            .format('YYYY-MM-DD');
          var fecha = fechaRecaudo.split('-', 3).toString();
          element.fechaRecaudo = new Date(fecha);
        });
      });
  }

  dataGuardarSolicitud(): DatosSaveSolicitud {
    this.datosSolicitud.usuarioGrabacion = this.dataContribuyente.nit;
    if (this.direccion == 1) {
      this.datosSolicitud.direccionNotificacion =
        this.FirstSteper.controls['DomicilioFiscal'].value;
    } else if (this.direccion == 2) {
      this.datosSolicitud.direccionNotificacion =
        this.FirstSteper.controls['DomicilioOpcional'].value;
    }
    (this.datosSolicitud.nitContribuyente =
      this.FirstSteper.controls['NITcontribuyente'].value),
      (this.datosSolicitud.numeroSolicitud = 10000003613),
      (this.datosSolicitud.montoSolicitud = this.total),
      (this.datosSolicitud.codigoFormulario = '2125'),
      (this.datosSolicitud.productoExportacion =
        this.dataContribuyente.codigoActividad),
      (this.datosSolicitud.anio = '2021'),
      (this.datosSolicitud.nitRepresentante =
        this.FirstSteper.controls['nitRepresentante'].value),
      (this.datosSolicitud.principalProducto =
        this.ThreeSteper.controls['ActividadEconomica'].value);
    if (this.email == 1) {
      this.datosSolicitud.correoNotificacion =
        this.FirstSteper.controls['DireccionEmail'].value;
    } else if (this.email == 2) {
      this.datosSolicitud.correoNotificacion =
        this.FirstSteper.controls['DireccionOpcion'].value;
    }
    var periodoDesde = moment(
      this.ThreeSteper.controls['PeriodoInicio'].value,
      'DD/MM/YYYY hh:mm:ss'
    )
      .parseZone()
      .format('YYYY-MM-DD');
    var fechaDesde = periodoDesde.split('-', 3).toString();
    this.datosSolicitud.periodoDesde = new Date(fechaDesde);
    var periodoHasta = moment(
      this.ThreeSteper.controls['PeriodoFin'].value,
      'DD/MM/YYYY hh:mm:ss'
    )
      .parseZone()
      .format('YYYY-MM-DD');
    var fechaHasta = periodoHasta.split('-', 3).toString();
    this.datosSolicitud.periodoHasta = new Date(fechaHasta);
    return this.datosSolicitud;
  }
  guardarSolicitud() {
    this.dialog
      .show({
        icon: 'question',
        title: 'IFI-100',
        text: '¿Desea congelar la solicitud?',
        showCancelButton: true,
        confirmButtonText: `Si`,
        cancelButtonText: 'No, cancelar',
        disableClose: true,
      })
      .then((resultado) => {
        if (resultado === 'primary') {
          let soli: DatosSaveSolicitud;
          soli = this.dataGuardarSolicitud();
          console.log(soli);
          
          this.creditServices
            .saveSolicitudService(soli, this.calculoDeclaraciones.data)
            .toPromise()
            .then((programaReturn) => {
              console.log("se creo la solicitud?",programaReturn);
              if(programaReturn){
                  this.dialog
                  .show({
                    icon: 'success',
                    title: 'IFI-200',
                    text: 'La solicitud se ha congelado correctamente',
                    showCancelButton: false,
                    disableClose: false,
                  })
                  .then((r) => {
                    this.router.navigate([
                      'det-sel/solicitud/formulario/credito/fiscal',
                    ]);
                  });
              }else{
                this.dialog
                  .show({
                    icon: 'warning',
                    title: 'Solicitud existente',
                    text: 'Ya se encuentra una solicitud en proceso con el periodo elegido',
                    showCancelButton: false,
                    disableClose: false,
                  })
              }
              
              
            });
        }
      });
  }

  next(e: any) {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }
}
