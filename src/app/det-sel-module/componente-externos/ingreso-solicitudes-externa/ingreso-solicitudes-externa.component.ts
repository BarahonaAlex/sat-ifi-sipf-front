import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStep } from '@angular/material/stepper';
import * as moment from 'moment';
import { RequestCase } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Caso } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { professionals } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { InputService } from 'src/app/general-module/componentes-comunes/servicios/input.service';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';


@Component({
  selector: 'app-ingreso-solicitudes-externa',
  templateUrl: './ingreso-solicitudes-externa.component.html',
  styleUrls: ['./ingreso-solicitudes-externa.component.scss']
})
export class IngresoSolicitudesExternaComponent implements OnInit {

  autorizado: boolean = false;
  cargado: boolean = false;
  mostrar: boolean = false;
  minDate: any;
  region: any;
  zonas!: Catalog[];
  folder = '';
  departamento!: number;
  contribuyente!: [];
  jefeUnidad!: professionals[];

  detalleSolicitud: DetalleSolicitud[];
  entidades = [
    { codigo: 1, nombre: "Ministerio Público" },
    { codigo: 2, nombre: "Contraloría General de Cuentas" },
    { codigo: 3, nombre: "Organismo Judicial" },
    { codigo: 4, nombre: "Otros" },
  ];


  generalFormGroup!: FormGroup; /* primer steper */
  tipoFormGroup: FormGroup; /* segundo esteper  */
  periodoFormGroup: FormGroup;

  constructor(
    private taxPayerService: ContribuyenteService,
    private dialog: DialogService,
    private utilidades: UtilidadesService,
    private casosService: InputService,
    private catalogoService: CatalogosService,
    private _formBuilder: FormBuilder,
    private colaborador: ColaboradoresService,
  ) {
    this.tipoFormGroup = new FormGroup({
      tipoSolicitud: new FormControl('', Validators.required),
    });

    this.generalFormGroup = new FormGroup({
      entidad: new FormControl('', Validators.required),
      cargaArchivo: new FormControl('', Validators.required),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl(''),
      /* jefeUnidad: new FormControl('', Validators.required), */
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

    this.detalleSolicitud = [
      { tipoIncidente: 1, id: 'nombreCuenta', form: new FormControl(null, Validators.required) },
      { tipoIncidente: 2, id: 'nit', form: new FormControl(null, Validators.required) },
      { tipoIncidente: 2, id: 'nombre', form: new FormControl({ value: null, disabled: true }, Validators.required) },
      { tipoIncidente: 2, id: 'numeroFactura', form: new FormControl(null, Validators.required) },
      { tipoIncidente: 2, id: 'fechaFactura', form: new FormControl(null, Validators.required) },
      { tipoIncidente: 2, id: 'serie', form: new FormControl(null, Validators.required) },
      { tipoIncidente: 2, id: 'monto', form: new FormControl(null, Validators.required) }
    ];
  }

  ngOnInit(): void {

    this.agregarCorrelativoConsumidos();
    this.catalogoService.getCatalogDataByListIdCatalog(['1', '2']).toPromise()
    //const loginNit = JSON.parse(sessionStorage.getItem('userLogged')!)
    //console.log(loginNit.nit);
    this.colaborador.getColaboratoresBySuperior(3, 4).toPromise().then(resul => {
      console.log(resul)
      this.jefeUnidad = resul;
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
      this.zonas = []
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
        console.log(detalle.codigo_Clasificacion)
        console.log(ubicacion?.departamento)
        console.log(data.data.attributes.datos.contribuyente.persona.municipio_Nacimiento);
        console.log(data.data.attributes.datos.contribuyente.persona.municipio_Nacimiento_Desc);
        this.catalogoService.getCatalogDataByIdCatalog(48).toPromise().then(res => {
          this.zonas = res;
        })
        this.obtenerIdContribuyente.at(id).get('zona')?.disable()
        if (data.data.attributes.datos.contribuyente.persona.municipio_Nacimiento == 8) {
          this.obtenerIdContribuyente.at(id).get('zona')?.enable()
        }



        this.obtenerIdContribuyente.at(id).get('nit')?.setValue(nitConsulta)
        this.obtenerIdContribuyente.at(id).get('nombre')?.setValue(contribuyente.nombre, Validators.required)
        this.obtenerIdContribuyente.at(id).get('nombre')?.disable()
        this.obtenerIdContribuyente.at(id).get('domicilio')?.setValue(contribuyente.domicilio, Validators.required)
        this.obtenerIdContribuyente.at(id).get('domicilio')?.disable()
        this.obtenerIdContribuyente.at(id).get('clasificacion')?.setValue(contribuyente.clasificacion, Validators.required)
        this.obtenerIdContribuyente.at(id).get('clasificacion')?.disable()
        this.obtenerIdContribuyente.at(id).get('municipio')?.setValue(data.data.attributes.datos.contribuyente.persona.municipio_Nacimiento_Desc, Validators.required)
        this.obtenerIdContribuyente.at(id).get('municipio')?.disable()
        this.obtenerIdContribuyente.at(id).get('municipioid')?.setValue(data.data.attributes.datos.contribuyente.persona.municipio_Nacimiento)

        this.taxPayerService.getGerencyTaxpayerInformation(detalle.codigo_Clasificacion, this.departamento).toPromise().then(resul => {
          console.log(resul);
          this.obtenerIdContribuyente.at(id).get('gerencia')?.setValue(resul.nombre, Validators.required)
          this.obtenerIdContribuyente.at(id).get('gerencia')?.disable()
          this.region = resul.codigo
        })

        this.cargado = true;
        this.autorizado = true;
      }
      ).catch(error => {
        console.log(error);

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
    this.detalleSolicitud.forEach(element => {
      if (element.tipoIncidente == codigo) {
        this.tipoFormGroup.addControl(element.id, element.form);
      } else {
        this.tipoFormGroup.removeControl(element.id);
      }
    });

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
    console.log("esto es el plazo de entrega *********")
    console.log(moment(periodoValue.plazoEntrega).format('YYYY-MM-DD'));

    const formData = new FormData();

    formData.append('file', this.generalFormGroup.controls['cargaArchivo'].value);
    //formData.append('file2', this.generalFormGroup.controls['cargaArchivo'].value);
    //formData.append('data', this.generalFormGroup.controls ['cargaArchivo'].value);
    const prueba = entidadValue.arrayGeneral.map((t: any) => {
      //console.log(t);
      
      const contribuyentes   = {
        nitContribuyente: t.nit,
        nombreContribuyente: t.nombre,
        domicilio: t.domicilio,
        clasificacion: t.clasificacion,
        entidad: t.entidad,
        periodoRevisionInicio: t.fechaDesde,
        periodoRevisionFin: t.fechaHasta,
        gerencia: this.region,
        municipio: t.municipio,
        municipioid: t.municipioid,
        zona: t.zona,
        entidadSolicitante: entidadValue.entidad,
        jefeUnidad: '109089294'/* entidadValue.jefeUnidad */,
        fechaSolicitud: moment(periodoValue.fechaSolicitud).format('YYYY-MM-DD'),
        fechaDocumento: moment(periodoValue.fechaDocumento).format('YYYY-MM-DD'),
        numeroDocumento: periodoValue.numeroDocumento,
        plazoEntrega: moment(periodoValue.plazoEntrega).format('YYYY-MM-DD'),
        nombreContacto: periodoValue.nombreContacto,
        correoContacto: periodoValue.correo,
        telefonoContacto: periodoValue.telContacto,
        tipoAlcance: 118,
        nitColaborador: '103106901',
        detalleEntidadSolicitante: entidadValue.otros,
        proceso: 0
      }
      return contribuyentes;
    })
    const data = {
      casos:prueba
    }
    console.log(prueba);
    console.log(JSON.stringify(prueba));
    

    
    formData.append('data', JSON.stringify(data));
    console.log(this.periodoFormGroup.getRawValue());
  
    this.casosService.createManualInputExterna(formData).toPromise().then(res => {
      console.log(res);
      this.dialog.show({
        icon: 'success',
        title: 'IFI-200',
        text: 'Solicitud guardada correctamente',
        showCloseButton: true,
      }).then(() => {
        /* this.cancelar(); */
      });
    }).catch(error => {
      console.log(error);
      throw error;

    });
  }

  cancelar() {
    this.utilidades.forcedNavigate(['/programacion/solicitudes']);
  }

  /* Metodo para subir el Documento */
  stateChange(state: FileChange): void {
    if (state.state == 'uploading') {
      console.log('uploading');
    }
    if (state.state == 'uploaded') {
      console.log('se cargo el archivo')
      let id = this.generalFormGroup.controls['cargaArchivo'].value


    }

    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
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
      gerencia: new FormControl({ value: null, disabled: true }, Validators.required),
      municipio: new FormControl({ value: null, disabled: true }, Validators.required),
      municipioid: new FormControl({ value: null, disabled: true }, Validators.required),
      zona: new FormControl({ value: null, disabled: true }, Validators.required),

    })

    // console.log(contribuyentes);
    this.arraycontribuyentes.push(contribuyentes);

  }


  get arraycontribuyentes() {
    //console.log(this.generalFormGroup.get('arrayGeneral')?.value)
    return this.generalFormGroup.get('arrayGeneral') as FormArray;

  }

  /*  Metodo para quitar un contribuyente */
  public eliminarContribuyente(indice: number) {

    this.arraycontribuyentes.removeAt(indice);
    if ((this.generalFormGroup.get('arrayGeneral')?.value).toString() == '') {
      console.log('entra');
      this.mostrar = false
    }

  }

  /*  Metodo  get para obtener contribuyentes */
  get obtenerIdContribuyente() {

    return this.generalFormGroup.get('arrayGeneral') as FormArray;

  }

}

export interface DetalleSolicitud {
  tipoIncidente: number;
  id: string;
  form: FormControl;
}