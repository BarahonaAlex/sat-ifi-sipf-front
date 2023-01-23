import { Component, Input, OnInit, ViewChild,Pipe, PipeTransform} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';

const EXCEL_TYPE = 'aaplication/vn.openxmlfomats-officedocument.spreadsheetml.sheet; charset = UTF-8';
const EXCEL_EXT = '.xlsx'; 
@Component({
  selector: 'app-asiste-libros',
  templateUrl: './asiste-libros.component.html',
  styleUrls: ['./asiste-libros.component.css']
})
export class AsisteLibrosComponent implements OnInit {

  @Input('dataTaxPayer') dataTaxPayer!: Contribuyente.Attributes;//VARIABLE DATA QUE SE RECIBE DEL COMPONENTE PADRE
  
  @ViewChild('MatPaginator') set matPaginator2(mp: MatPaginator) {
    this.reporte.paginator = mp;
  }

  mesConsulta: any[] = [
    { value: "01", viewValue: 'Enero' },
    { value: "02", viewValue: 'Febrero' },
    { value: "03", viewValue: 'Marzo' },
    { value: "04", viewValue: 'Abril' },
    { value: "05", viewValue: 'Mayo' },
    { value: "06", viewValue: 'Junio' },
    { value: "07", viewValue: 'Julio' },
    { value: "08", viewValue: 'Agosto' },
    { value: "09", viewValue: 'Septiembre' },
    { value: "10", viewValue: 'Octubre' },
    { value: "11", viewValue: 'Noviembre' },
    { value: "12", viewValue: 'Diciembre' }
  ];

  tipoConsulta: any[] = [
    { value: 1, viewValue: 'Compras' },
    { value: 2, viewValue: 'Ventas' }
  ];

  generalFormGrup!: FormGroup;
  datosContribuyente!: FormGroup;
  mostrarReporte: boolean = true;
  mostrarDatosContribuyente: boolean = true;
  botonConsulta: boolean = true;
  reporte = new MatTableDataSource();
  name!: string;
  selectedYear!: number;
  years: number[] = [];
  nombreContribuyente!: string;
  dataExcel!: string[];

  displayedColumns1: string[] = [
    'tipoDoc', 
    'estado', 
    'iva', 
    'cantidadDoc', 
    'valorTotalDoc'];


  constructor(private asisteLibrosService: ContribuyenteService,
     private dialogService: DialogService) { 

      this.datosContribuyente = new FormGroup({
        nit: new FormControl({value: null, disable: true}),
        nombre: new FormControl({value: null, disable: true})
      }) 

      this.generalFormGrup = new FormGroup({
        mesConsulta: new FormControl('', Validators.required ),
        anioConsulta: new FormControl('', Validators.required),
        tipoConsulta: new FormControl('', Validators.required),
        nit: new FormControl(null),
        fecha: new FormControl(null),
        periodo: new FormControl(null),
        sumaCantDoc: new FormControl(null),
        sumaIVA: new FormControl(null),
        sumaValorDoc: new FormControl(null)    
      })

      this.selectedYear = new Date().getFullYear();
      for (let year = this.selectedYear; year >= 2015; year--) {
        this.years.push(year);
      }
    }

  ngOnInit(): void {
    this.botonConsulta = true;
    const detail = this.dataTaxPayer.datos.contribuyente?.persona ?? this.dataTaxPayer.datos.empresa;
    this.nombreContribuyente = parsearNombre(detail);
    this.datosContribuyente.get('nit')?.setValue(this.dataTaxPayer.id)
    this.datosContribuyente.get('nombre')?.setValue(this.nombreContribuyente.toLocaleUpperCase())
  } 


    getReporte(){
      if(!this.botonConsulta){
        this.mostrarReporte = true
      }
      console.log(this.generalFormGrup.get('tipoConsulta')?.value)
      
      if(this.generalFormGrup.get('tipoConsulta')?.value == 1){
        const reporteCompras: Contribuyente.AsisteLibrosComprasParams = {
          anio: this.generalFormGrup.get('anioConsulta')?.value,
          establecimiento:  "T" ,
          estado: "T",
          mes: this.generalFormGrup.get('mesConsulta')?.value,
          nitReceptor: this.dataTaxPayer.id,
          tipoDocumento: "T",
          tipo: "E"
        }
        this.asisteLibrosService.getReporteCompras(reporteCompras).toPromise().then(res =>{
          if(res.compras.length == 0){
            this.dialogService.show({
              title: 'Registro no encontrado',
              text: `No existen registros para la consulta realizada`,
              icon: 'warning',
              showCancelButton: false,
              disableClose: true,
              showCloseButton: false
            })            
          }else {          
          this.mostrarReporte = false
          this.botonConsulta = false
          if(this.botonConsulta){
            this.generalFormGrup.valid.valueOf()
          }
          
          console.log(res)
          this.reporte.data = res.compras
          this.generalFormGrup.get('nit')?.setValue(res.nitReceptor)
          this.generalFormGrup.get('periodo')?.setValue(reporteCompras.mes + " - " + reporteCompras.anio)
          this.generalFormGrup.get('fecha')?.setValue(res.habilitacionFEL)
          this.generalFormGrup.get('sumaCantDoc')?.setValue(res.sumaCantDoc)
          this.generalFormGrup.get('sumaIVA')?.setValue(res.sumaIVA)
          this.generalFormGrup.get('sumaValorDoc')?.setValue(res.sumaValorDoc)
          }
        }) 
        
    }else{
      const reporteVentas: Contribuyente.AsisteLibrosVentasParams ={
        anio: this.generalFormGrup.get('anioConsulta')?.value,
        establecimiento: "T",
        estado: "T",
        mes: this.generalFormGrup.get('mesConsulta')?.value,
        nitEmisor: this.dataTaxPayer.id,
        tipoDocumento: "T",
        tipo: "E"
      }
      this.asisteLibrosService.getReporteVentas(reporteVentas).toPromise().then(res =>{
        this.generalFormGrup.disable
        if(res.ventasI.length == 0){
          this.dialogService.show({
            title: 'Registro no encontrado',
            text: `No existen registros para la consulta realizada`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          })            
        }else {
        this.mostrarReporte = false
        this.botonConsulta = false
        console.log(res)
        this.reporte.data = res.ventasV
        this.generalFormGrup.get('nit')?.setValue(res.nitEmisor)
        this.generalFormGrup.get('periodo')?.setValue(reporteVentas.mes + " - " + reporteVentas.anio)
        this.generalFormGrup.get('fecha')?.setValue(res.habilitacionFEL)
        this.generalFormGrup.get('sumaCantDoc')?.setValue(res.sumaCantDoc)
        this.generalFormGrup.get('sumaIVA')?.setValue(res.sumaIVA)
        this.generalFormGrup.get('sumaValorDoc')?.setValue(res.sumaValorDoc)
        }
      }) 
    }
    }

    getExcelReporte(){
      
      if(this.generalFormGrup.get('tipoConsulta')?.value == 1){
        
        const reporteCompras: Contribuyente.AsisteLibrosComprasParams = {
          anio: this.generalFormGrup.get('anioConsulta')?.value,
          establecimiento: "T",
          estado: "T",
          mes: this.generalFormGrup.get('mesConsulta')?.value,
          nitReceptor:this.dataTaxPayer.id,
          tipoDocumento: "T",
          tipo: "E"
        }
        
        this.asisteLibrosService.getExcelReporteCompras(reporteCompras).toPromise().then(
          (res) => {
            
            this.exportToExcel(res, "Reporte Compras")
          }
        ).catch(err=>{
          console.log(err)
        })
                
    }else{
      
      const reporteVentas: Contribuyente.AsisteLibrosVentasParams ={
        anio: this.generalFormGrup.get('anioConsulta')?.value,
        establecimiento: "T",
        estado: "T",
        mes: this.generalFormGrup.get('mesConsulta')?.value,
        nitEmisor: this.dataTaxPayer.id,
        tipoDocumento: "T",
        tipo: "E"
      }

      this.asisteLibrosService.getExcelReporteVentas(reporteVentas).toPromise().then(res=>{
        this.exportToExcel(res, "Reporte Ventas")
      }).catch(err => {
        console.log(err);
        this.dialogService.show({
          title: 'Archivo no encontrado',
          text: `El archivo ReporteVentas.xlsx no se pudo descargar`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      })
      
  }
  }

 
  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    //llamar al metodo bufer y ile name  
    this.saveAsExcel(excelBuffer, excelFileName)
  }
  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, fileName + '.xlsx')
  } 

}
  


