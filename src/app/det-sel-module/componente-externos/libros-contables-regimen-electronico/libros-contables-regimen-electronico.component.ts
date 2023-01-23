import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';

import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';

@Component({
  selector: 'app-libros-contables-regimen-electronico',
  templateUrl: './libros-contables-regimen-electronico.component.html',
  styleUrls: ['./libros-contables-regimen-electronico.component.css']
})
export class LibrosContablesRegimenElectronicoComponent implements OnInit {

  idSolicitud: number = 1;

  mesPeriodo: any[] = [];
  tipoPeriodo: Catalog[] = [];
  archivos!: Catalog[];
  folder!: string;
  generalFormGroup!: FormGroup;
  selectedYear!: number;
  years: number[] = [];
  month!: number;
  year!: number;
  periodoInicio!: string;
  periodoFin!: string;
  showPeriod: Boolean = false;
  uploadFile: Boolean = false;
  nombreArchivo!: string;
  tipoDoc!: string;
  idArchivoRespaldo!: string;
  fileSelected: string | undefined;
  monthBoolean: Boolean = false;
  arreglo: Catalog[] = []
  tipoPeriodoSelected!: number;
  codigoPerido!: string;
  documentoValido: Boolean = false;


  constructor(private catalogoService: CatalogosService, 
    private creditoFiscalService: CreditoFiscal,
    private dialogService: DialogService) {
    this.generalFormGroup = new FormGroup({
      mesPeriodo: new FormControl('', Validators.required ),
      anioPeriodo: new FormControl('', Validators.required),
      periodo: new FormControl(null),
      tipoArchivo:  new FormControl('', Validators.required),
      archivoRespaldo: new FormControl('', Validators.required),
      tipoPeriodo: new FormControl('', Validators.required),
      periodoSelected: new FormControl('', Validators.required)

    }) 
    this.selectedYear = new Date().getFullYear();
      for (let year = this.selectedYear; year >= 2003; year--) {
        this.years.push(year);
      }

   }

  ngOnInit(): void {
    this.catalogoService.getCatalogDataByIdCatalog(108, 1).toPromise().then(res =>{
      this.tipoPeriodo = res
    })
        
  }

  monthSelected(e: number){
    this.uploadFile = false
    this.generalFormGroup.get('tipoArchivo')?.reset()
    switch (this.tipoPeriodoSelected) {
      case 1071:
        this.codigoPerido = "0"+ e.toString() + `${(e + 5) < 10 ? "0" :""}`  + (e + 5).toString();
        
      break;
      case 1072:
        this.codigoPerido = "0" + e.toString() + `${(e + 2) < 10 ? "0" : ""}` + (e+2).toString();

        break;
      case 1073:
        this.codigoPerido = `${e < 10 ? "0" : ""}` + e.toString() + `${(e + 1) < 10 ? "0" : ""}` + e.toString();

      break;
      default:
        this.codigoPerido = `${e < 10 ? "0" : ""}`+ e.toString();
    }

     this.getFilenames()
  }

  yearSelected(e: number){
    
    this.uploadFile= false
    this.generalFormGroup.get('tipoArchivo')?.reset()
    this.year = e
    this.periodoInicio = moment(new Date(this.year,this.month-1,1 )).format('DD/MM/YYYY')
    this.periodoFin = moment(new Date(this.year,this.month,0)).format('DD/MM/YYYY')    
    
    this.showPeriod = true
    this.generalFormGroup.get('periodo')?.setValue(this.periodoInicio + "  AL  "+ this.periodoFin) 
    this.getFilenames()
  }

  async typeSelected(e: Catalog){
    console.log(e.descripcion);    
    this.nombreArchivo = e.nombre
    this.idArchivoRespaldo = e.descripcion
    
    if(e.descripcion.includes(".xlsx")){
      this.tipoDoc="xlsx"   
    }else{
      this.tipoDoc = "pdf"
    }
    
    this.uploadFile = true

  }


  stateChangePayment(state: FileChange): void {
    console.log(state);
    
    this.documentoValido = true;
    if (state.state === 'valid') {
      console.log(' the file is valid');
      
    }
    if (state.state === 'uploading') {
      console.log('uploading');
    }
    if (state.state === 'uploaded') {
      console.log('se cargo el archivo');
    }

    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
    }

  }

   save(){
    const formData = new FormData();
    const archivo =  FileUtils.changeFileName(this.generalFormGroup.controls['archivoRespaldo'].value, this.nombreArchivo);
    formData.append('file', archivo);
    formData.append('data',  this.codigoPerido + "-" + this.year)
    console.log(this.codigoPerido + "-" + this.year);
    
    this.creditoFiscalService.uploadBackFiles(formData).toPromise().then(res=>{
      console.log(res)
      if(res){

        this.dialogService.show({
          title: 'Archivo Guardado',
          text: `El archivo se guardo correctamente`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        }).then(() =>{
          this.uploadFile = false
          this.generalFormGroup.get('tipoArchivo')?.reset()
          this.getFilenames()
        }) 
      }

      
    })
  }

  typePeriodSelected(e: Catalog){
    this.uploadFile = false
    this.tipoPeriodoSelected = e.codigo   
    this.generalFormGroup.get('tipoArchivo')?.reset()
    
    switch (e.codigo) {
      case 1071:
        this.mesPeriodo = Constantes.MONTHS_MAP.filter(x => x.codigo < 8)
        break;
      case 1072:
        this.mesPeriodo = Constantes.MONTHS_MAP.filter(x => x.codigo < 11)
        break;
      case 1073:
        this.mesPeriodo = Constantes.MONTHS_MAP.filter(x => x.codigo < 12)
        break;
      default:
        this.mesPeriodo = Constantes.MONTHS_MAP
        break;
    }
    
  }

  getFilenames(){
    if(this.year && this.codigoPerido){
      let periodo = this.codigoPerido + "-" + this.year
      let status = [1053,1054]

      this.creditoFiscalService.getFileNames(periodo, status).toPromise().then(res=>{
        this.archivos = res
      })
    }
    
  }
}
