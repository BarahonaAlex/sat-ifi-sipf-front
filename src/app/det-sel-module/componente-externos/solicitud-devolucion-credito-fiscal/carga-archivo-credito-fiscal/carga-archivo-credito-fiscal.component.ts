import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import {
  dataCalculoDeclaraciones,
  periodoNitParamsCarga,
} from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';
/**
 * @description Constante que almacena los meses del año.
 */
const MESES_AÑO: any[] = [
  'MESES DEL AÑO : "Meses del Año" ',
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];
@Component({
  selector: 'app-carga-archivo-credito-fiscal',
  templateUrl: './carga-archivo-credito-fiscal.component.html',
  styleUrls: ['./carga-archivo-credito-fiscal.component.css'],
})
export class CargaArchivoCreditoFiscalComponent implements OnInit {
  generalFormGroup!: FormGroup;
  checkFormGroup!: FormGroup;
  folder = '';
  isChecked!: boolean;
  contador!: number;
  fileValue!: any;
  datosSolicitud: periodoNitParamsCarga = {} as periodoNitParamsCarga;
  checkCreditoFiscal = new FormControl(false);
  checkVentaFiscal = new FormControl(false);
  meses: dataCalculoDeclaraciones[] = [];
  checkedBoolean: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private creditServices: CreditoFiscal,
    private route: ActivatedRoute
  ) {
    this.generalFormGroup = new FormGroup({
      creditoFiscal: new FormControl(''),
      ventaFiscal: new FormControl(''),
      arrayGeneral: this._formBuilder.array([]),
    });
    this.route.paramMap.subscribe((params) => {

      this.datosSolicitud = {
        periodoDesde: params.get('fecha1') as string,
        periodoHasta: params.get('fecha2') as string,
        nit: params.get('nit') as string,
        idSolicitud: parseInt(params.get('id') as string),
        numero: parseInt(params.get('numero') as string),
      };
    });
  }
  ngOnInit(): void {
    this.creditServices
      .getDeclaracionesUploadFiles(
        this.datosSolicitud.nit,
        moment(this.datosSolicitud.periodoDesde).format('DD/MM/YYYY'),
        moment(this.datosSolicitud.periodoHasta).format('DD/MM/YYYY')
      )
      .toPromise()
      .then((res) => {
        this.generateFieldLoad(res);
        this.meses = res;
      });
  }
  file(state: FileChange): void {
    this.fileValue = state;
    console.log(state);



    if (
      state.state=='none'
    ) {
      this.checkedBoolean = true;
    } else if (

    this.isFiles()

    ) {

      this.checkedBoolean = false;
    }
    if (state.state == 'uploading') {
    }
    if (state.state == 'uploaded') {
      let id = this.generalFormGroup.controls['creditoFiscal'].value;
    }
    if (['uploaded', 'error'].includes(state.state)) {
    }
  }
  public generateFieldLoad(meses: dataCalculoDeclaraciones[]) {
    //la variable 'cantidadMeses', almacena un número que permitira saber cuantas filas
    //se haran para la carga de libros, tomando en cuenta la fecha inicio y fin de un periodo.
    //el periodo puede ser "un mes", "trimestre" o "semestre"*/
    this.contador = meses.length;
    for (let i = 0; i < this.contador; i++) {
      let contadorCarga = new FormGroup({
        creditoFiscal: new FormControl(''),
        ventaFiscal: new FormControl(''),
      });
      this.counter.push(contadorCarga);
    }
  }
  get counter() {
    return this.generalFormGroup.get('arrayGeneral') as FormArray;
  }
  getMonth(mes: dataCalculoDeclaraciones) {
    return `${MESES_AÑO[parseInt(mes.periodoDel.split('/')[1])]} : ${
      mes.periodoDel.split(' ')[0]
    } - ${mes.periodoAl.split(' ')[0]} `;
  }
  guardarArchivo() {
    const formData = new FormData();
    const detalle = {
      idSolicitud: this.datosSolicitud.idSolicitud,
      periodoDesde: this.datosSolicitud.periodoDesde,
      periodoHasta: this.datosSolicitud.periodoHasta,
      idDocs: {},
    };
    this.meses.forEach((carga, index) => {
      const nameBuy = `SAT_${carga.periodoAl.split('/')[1]}${
        carga.anioFiscal
      }_COMPRAS`;
      const nameSales = `SAT_${carga.periodoAl.split('/')[1]}${
        carga.anioFiscal
      }_VENTAS`;

      const Compras = FileUtils.changeFileName(
        this.counter.controls[index].value.creditoFiscal,
        nameBuy
      );
      const Ventas = FileUtils.changeFileName(
        this.counter.controls[index].value.ventaFiscal,
        nameSales
      );
      (detalle.idDocs as any)[nameBuy] = this.meses[index].numeroDocumento;
      (detalle.idDocs as any)[nameSales] = this.meses[index].numeroDocumento;
      formData.append('file', Compras);
      formData.append('file', Ventas);
    });
    formData.append('data', JSON.stringify(detalle));
    this.creditServices
      .saveLibros(formData)
      .toPromise()
      .then((res) => {
      });
  }

  validarDeclaracion(
    meses: dataCalculoDeclaraciones,
    tipo: number,
    event: any
  ) {
    let idRegistro = parseInt(meses.numeroDocumento.toString());
    let noSolicitud = parseInt(this.datosSolicitud.numero.toString());
    //event tiene el valor de estado del check al momento de habilitarlo o inhabilitarlo.

    if (event.checked == true && this.isFiles(true)) {
      this.checkedBoolean = false;
      this.creditServices
        .hasVariations(tipo, idRegistro, noSolicitud)
        .toPromise()
        .then((res) => {
        });

    }
     else if (this.isCheck()==true) {
      this.checkedBoolean = false;
    }
    else {
      this.checkedBoolean = true;
    }
  }


  isFiles (b?:boolean):boolean{

    let fileValidate = false

    this.meses.forEach((a, index) =>{

fileValidate= this.counter.controls[index].value.creditoFiscal && this.counter.controls[index].value.ventaFiscal ?true:false
if(b)fileValidate= this.counter.controls[index].value.creditoFiscal || this.counter.controls[index].value.ventaFiscal ?true:false
  })
  //this.checkCreditoFiscal.value
//this.checkVentaFiscal.value
return fileValidate

  }


isCheck(){

  let fileValidate = false

  this.meses.forEach((a, index) =>{

console.log(this.checkCreditoFiscal.value);

fileValidate= this.checkCreditoFiscal.value && this.checkVentaFiscal.value ?true:false
})
//this.checkCreditoFiscal.value
//this.checkVentaFiscal.value
return fileValidate

}

}
