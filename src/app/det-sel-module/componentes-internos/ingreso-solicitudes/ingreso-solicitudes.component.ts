import { element } from 'protractor';
import { PerfilService } from './../../../general-module/componentes-comunes/servicios/perfil.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { RequestCase } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { professionals } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { OperatorGrups } from 'src/app/general-module/componentes-comunes/interfaces/Perfil.interface';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';

@Component({
  selector: 'app-ingreso-solicitudes',
  templateUrl: './ingreso-solicitudes.component.html',
  styleUrls: ['./ingreso-solicitudes.component.scss']
})
export class IngresoSolicitudesComponent implements OnInit {

  autorizado: boolean = false;
  cargado: boolean = false;
  mostrar: boolean = false;
  minDate: any;
  region: any;
  folder = '';
  departamento!: number;
  contribuyente!: [];
  jefeUnidad!: OperatorGrups[];
  enitdad!: Catalog[];
  @ViewChild('stepper') stepper!: MatStepper;
  /* detalleSolicitud: DetalleSolicitud[]; */

  generalFormGroup!: FormGroup; /* primer steper */
  tipoFormGroup: FormGroup; /* segundo esteper  */
  periodoFormGroup: FormGroup;
  lastIndex!: number;

  constructor(
    private taxPayerService: ContribuyenteService,
    private dialog: DialogService,
    private utilidades: UtilidadesService,
    private casosService: CasosService,
    private catalogoService: CatalogosService,
    private _formBuilder: FormBuilder,
    private colaborador: ColaboradoresService,
    private perfilService: PerfilService,
    private userService: UserService,
  ) {
    this.tipoFormGroup = new FormGroup({
      tipoSolicitud: new FormControl('', Validators.required),
    });

    this.generalFormGroup = new FormGroup({
      entidad: new FormControl('', Validators.required),
      cargaArchivo: new FormControl('', Validators.required),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl(''),
      jefeUnidad: new FormControl('', Validators.required),
      arrayGeneral: this._formBuilder.array([]),
    });

    this.periodoFormGroup = new FormGroup({
      fechaSolicitud: new FormControl('', Validators.required),
      fechaDocumento: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', Validators.required),
      plazoEntrega: new FormControl('', Validators.required),
      nombreContacto: new FormControl(''),
      correo: new FormControl(''),
      telContacto: new FormControl(''),
    });
  }

  ngOnInit() {
    this.agregarCorrelativoConsumidos();
    this.catalogoService.getCatalogDataByListIdCatalog(['1', '2']).toPromise()
    this.catalogoService.getCatalogDataByListIdCatalog(['31', '1']).toPromise().then(res => {
      /* console.log(res); */

      this.enitdad = res.filter(t => t.codigo == 148 || t.codigo == 149 || t.codigo == 150 || t.codigo == 151)
      /* console.log(this.enitdad); */
    })


    this.perfilService.getOperatorGrups().toPromise().then(res => {
      /* console.log(res); */
      this.jefeUnidad = res;
    })
  }


  /**
  * @description Método para buscar un colaborador 
  * @author agaruanom (Gabriel Ruano)
  * @since 13/07/2022
  *  @param nit indentificador tributario del colaborador
  */
  obtenercontribuyente(nit: any, id: any) {
    const nitConsulta = nit.target.value;
   /*  if (isNaN(nitConsulta)) {
      this.dialog.show({
        icon: 'warning',
        title: 'IFI-500',
        text: 'Introduzca un NIT Valido',
        showCloseButton: true,
      })
    } */ if (nitConsulta == '' || nitConsulta == undefined || nitConsulta == null || RegExp(/^\s+$/).test(nitConsulta)) {
      this.dialog.show({
        icon: 'warning',
        title: 'Verificar NIT',
        text: 'Introduzca un NIT',
        showCloseButton: true,
      })
    }
    else {
      this.taxPayerService.getGeneralTaxpayerInformation(nitConsulta).toPromise().then(async data => {
        const datos = data.data.attributes.datos;
        const detalle = datos.contribuyente?.persona ?? datos.empresa;
        const ubicacion = datos.ubicacion.ubicaciones?.pop();
        this.departamento = data.data.attributes.datos.contribuyente.persona.departamento_Nacimiento;

        const contribuyente = {
          nombre: this.parsearNombre(detalle),
          domicilio: ubicacion?.vistaPrevia,
          clasificacion: detalle.codigo_Clasificacion_Desc
        }
        /* console.log(detalle.codigo_Clasificacion)
        console.log(ubicacion?.departamento)
        console.log(data); */


        this.obtenerIdContribuyente.at(id).get('nit')?.setValue(nitConsulta)
        this.obtenerIdContribuyente.at(id).get('nombre')?.setValue(contribuyente.nombre, Validators.required)
        this.obtenerIdContribuyente.at(id).get('nombre')?.disable()
        this.obtenerIdContribuyente.at(id).get('domicilio')?.setValue(contribuyente.domicilio, Validators.required)
        this.obtenerIdContribuyente.at(id).get('domicilio')?.disable()
        this.obtenerIdContribuyente.at(id).get('clasificacion')?.setValue(contribuyente.clasificacion, Validators.required)
        this.obtenerIdContribuyente.at(id).get('clasificacion')?.disable()

        this.taxPayerService.getGerencyTaxpayerInformation(detalle.codigo_Clasificacion, this.departamento).toPromise().then(resul => {
          console.log(resul);
          this.obtenerIdContribuyente.at(id).get('gerencia')?.setValue(resul.nombre, Validators.required)
          this.obtenerIdContribuyente.at(id).get('gerencia')?.disable()
          this.obtenerIdContribuyente.at(id).get('idgerencia')?.setValue(resul.codigo)
          this.region = resul.codigo

        })

        this.cargado = true;
        this.autorizado = true;
      }
      ).catch(error => {
        /*  console.log(error); */

        this.cargado = true;
        if ([401, 403].includes(error.status)) {
          this.autorizado = false;
        }
        throw error;
      });
    }
  }

  /* Validacion depediento de la entidad ingresada si es  MP 3 campos no sera requerido*/
  otros(codigo: any) {
    if (codigo == 4) {
      this.generalFormGroup.addControl('otros', new FormControl('', Validators.required));
    } else if (codigo == 1) {
      this.periodoFormGroup.get('nombreContacto')?.setValidators(Validators.required);
      this.periodoFormGroup.get('correo')?.setValidators(Validators.required);
      this.periodoFormGroup.get('telContacto')?.setValidators(Validators.required);
      this.periodoFormGroup.get('nombreContacto')?.updateValueAndValidity();
      this.periodoFormGroup.get('correo')?.updateValueAndValidity();
      this.periodoFormGroup.get('telContacto')?.updateValueAndValidity();
    }
    else {
      this.generalFormGroup.removeControl('otros');
      this.periodoFormGroup.get('nombreContacto')?.setValidators(null);
      this.periodoFormGroup.get('correo')?.setValidators(null);
      this.periodoFormGroup.get('telContacto')?.setValidators(null);
      this.periodoFormGroup.get('nombreContacto')?.updateValueAndValidity();
      this.periodoFormGroup.get('correo')?.updateValueAndValidity();
      this.periodoFormGroup.get('telContacto')?.updateValueAndValidity();
    }
  }

  tipoSolicitud(codigo: any, step: MatStep) {
    step.reset();
    this.tipoFormGroup.controls.tipoSolicitud.setValue(codigo);
    /* this.detalleSolicitud.forEach(element => {
      if (element.tipoIncidente == codigo) {
        this.tipoFormGroup.addControl(element.id, element.form);
      } else {
        this.tipoFormGroup.removeControl(element.id);
      }
    }); */

  }

  /* metodo para seterar la fecha actual si viene null */
  fechaDesdeChange() {
    this.generalFormGroup.controls.fechaHasta.setValue(null);
    this.minDate = moment(this.generalFormGroup.controls.fechaDesde.value);
  }

  /*   metodo para parsear el nombre del colaborador */
  parsearNombre(detalle: any) {
    return detalle.razonSocial ?? `${detalle.primer_Nombre ?? ''} ${detalle.segundo_Nombre ?? ''} ${detalle.primer_Apellido ?? ''} ${detalle.segundo_Apellido ?? ''}`.replace(/\s+/g, ' ').trim();
  }

  /**
  * @description Método para guardar solicitud externa 
  * @author agaruanom (Gabriel Ruano)
  * @since 13/07/2022
  */
  guardarSolicitud() {
    const entidadValue = this.generalFormGroup.getRawValue();
    const tipoValue = this.tipoFormGroup.getRawValue();
    const periodoValue = this.periodoFormGroup.getRawValue();

    const formData = new FormData();

    formData.append('file', this.generalFormGroup.controls['cargaArchivo'].value);
    const validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/
    let emailValid = false
    if (periodoValue.correo.match(validEmail)) {
      emailValid = true
    }

    const solicitud: RequestCase = {
      arrayGeneral: entidadValue.arrayGeneral,
      entidadSolicitante: entidadValue.entidad,
      jefeUnidad: entidadValue.jefeUnidad,
      gerencia: this.region,
      fechaSolicitud: moment(periodoValue.fechaSolicitud).format('YYYY-MM-DD'),
      fechaDocumento: moment(periodoValue.fechaDocumento).format('YYYY-MM-DD'),
      numeroDocumento: periodoValue.numeroDocumento,
      plazoEntrega: moment(periodoValue.plazoEntrega).format('YYYY-MM-DD'),
      nombreContacto: periodoValue.nombreContacto,
      correoContacto: periodoValue.correo,
      telefonoContacto: periodoValue.telContacto,
      tipoAlcance: 118,
      detalleEntidadSolicitante: entidadValue.otros,
      proceso: 0
    }
    console.log(solicitud)
    formData.append('data', JSON.stringify(solicitud));
    if (emailValid) {
      this.casosService.createCase2(formData).toPromise().then(res => {
        /* console.log(res); */
        this.dialog.show({
          icon: 'success',
          title: 'IFI-200',
          text: 'Solicitud guardada correctamente',
          showCloseButton: true,
        }).then(() => {
          this.cancelar();
        });
      }).catch(error => {
        /* console.log(error); */
        throw error;
      });
    } else {
      this.dialog.show({
        icon: 'error',
        title: 'IFI-500',
        text: 'Correo ingresado no valido',
        showCloseButton: true,
      })
    }
    /*  console.log(this.periodoFormGroup.getRawValue()); */
  }

  cancelar() {
    this.generalFormGroup.reset();
    this.tipoFormGroup.reset();

    for (let index = this.arraycontribuyentes.length - 1; index >= 1; index--) {
      this.arraycontribuyentes.removeAt(index);
    }

    if (this.stepper.selectedIndex == 1) {
      this.stepper.reset();
      this.generalFormGroup.markAsUntouched();
      this.generalFormGroup.updateValueAndValidity();
    }
  }

  /* Metodo para subir el Documento */
  stateChange(state: FileChange): void {
    if (state.state == 'uploading') {
    }
    if (state.state == 'uploaded') {
      let id = this.generalFormGroup.controls['cargaArchivo'].value


    }

    if (['uploaded', 'error'].includes(state.state)) {
      /* console.log(state); */
    }

  }

  /* Metodo para agregar un Contribuyente */
  public agregarCorrelativoConsumidos() {
    this.mostrar = true;
    const contribuyentes = new FormGroup({

      nit: new FormControl({ value: null, disabled: false }, Validators.required),
      nombre: new FormControl({ value: null, disabled: true }, Validators.required),
      domicilio: new FormControl({ value: null, disabled: true }, Validators.required),
      clasificacion: new FormControl({ value: null, disabled: true }, Validators.required),
      entidad: new FormControl(''),
      fechaDesde: new FormControl('', Validators.required),
      fechaHasta: new FormControl('', Validators.required),
      gerencia: new FormControl({ value: '', disabled: true }, Validators.required),
      idgerencia: new FormControl({ value: null, disabled: true }, Validators.required),

    })

    /* console.log(contribuyentes.value); */
    this.arraycontribuyentes.push(contribuyentes);

  }


  get arraycontribuyentes() {
    //console.log(this.generalFormGroup.get('arrayGeneral')?.value)
    return this.generalFormGroup.get('arrayGeneral') as FormArray;

  }

  /*  Metodo para quitar un contribuyente */
  public eliminarContribuyente(indice: number) {
    this.lastIndex = indice
    this.arraycontribuyentes.removeAt(indice);
    if ((this.generalFormGroup.get('arrayGeneral')?.value).toString() == '') {
      this.mostrar = false
    }

  }

  /*  Metodo  get para obtener contribuyentes */
  get obtenerIdContribuyente() {

    return this.generalFormGroup.get('arrayGeneral') as FormArray;

  }
  verificar() {
    let arrayGeneral = this.generalFormGroup.get('arrayGeneral')?.value
    let arrayNit: string[] = []
    arrayGeneral.forEach((element: any) => {
      if (moment(element.fechaDesde).format('DD/MM/YYYY') > moment(element.fechaHasta).format('DD/MM/YYYY')) {
        arrayNit.push(element.nit)
        console.log(element.nit)
      }
    })
    console.log(arrayNit.length)
    if (arrayNit.length >= 1) {
      this.dialog.show({
        icon: 'error',
        title: 'IFI-500',
        text: 'Fechas no validas en el NIT:' + arrayNit,
        showCloseButton: true,
      })
      arrayNit = []
      console.log(arrayNit.length)
    } else {
      this.stepper.next();
    }

  }

}


export interface DetalleSolicitud {
  tipoIncidente: number;
  id: string;
  form: FormControl;
}


