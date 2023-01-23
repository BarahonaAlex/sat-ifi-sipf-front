import { FormControl, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';

const EXCEL_TYPE = 'aaplication/vn.openxmlfomats-officedocument.spreadsheetml.sheet; charset = UTF-8';
const EXCEL_EXT = '.xlsx';
@Component({
  selector: 'app-consulta-importacion-exportacion',
  templateUrl: './consulta-importacion-exportacion.component.html',
  styleUrls: ['./consulta-importacion-exportacion.component.css']
})
export class ConsultaImportacionExportacionComponent implements OnInit {
  //@Input('nit') nit!: string;
  nit: string = "7522355"
  prueba!: any
  detalleSivepa: boolean = false
  consulta: boolean = false
  consultaSIVEPAform!: FormGroup;
  tableConsulta: boolean = false
  bodyConsulta!: Contribuyente.ImportacionSIVEPA
  minDate: any;
  consultaSIVEPAdetalle = new MatTableDataSource<object>()
  consultaSIVEPA = new MatTableDataSource<object>()
  consultaSIVEPAcolumns: string[] = ['descripcion', 'identificador_DECLARACION', 'fecha_DECLARACION', 'nit_CONTRIBUYENTE', 'aduana', 'regimen', 'valor_CIF', 'valor_DAI', 'correlativo_ENC',]
  consultaSIVEPAdetalleColumns: string[] = ['aduana', 'cantidad_FRACCION', 'codigo_UNIDAD_MEDIDA', 'consignatraoi_EXPORTADOR', 'descripcion', 'fecha_DECLARACION', 'identificador_DECLARACION', 'inciso_ARRENCELARIO', 'pais_ORIGNE', 'peso_DECLARACION', 'proveedor_DESTINATARIO', 'regimne', 'resultado_SELECTIVO', 'tasa_DAI', 'tipo_CAMBIO_DOLRA', 'valor_FOB', 'valro_CIF', 'vaolr_DAI']
  constructor(private contribuyenteService: ContribuyenteService) {
    this.consultaSIVEPAform = new FormGroup({
      nit: new FormControl(''),
      fechaInicio: new FormControl(''),
      fechaFin: new FormControl('')
    })
  }

  ngOnInit(): void {
    // this.getImportacion()
    

  }

  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.consultaSIVEPA.paginator = mp1;
  }
  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.consultaSIVEPAdetalle.paginator = mp2;
  }

  setValor(){
    this.consultaSIVEPAform.get('nit')?.setValue(this.nit);
  }
  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    //llamar al metodo bufer y ile name  
    this.saveAsExcel(excelBuffer, excelFileName)
  }
  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, fileName + '.xlsx')
  }

  exportAsXLSX(): void {
    this.exportToExcel(this.consultaSIVEPA.data, 'Detalle Importación y Exportación');
  }

  exportAsXLSXTwo(): void {
    this.exportToExcel(this.consultaSIVEPAdetalle.data, 'Detalle Importación y Exportación');
  }

  getImportacion() {
    const periodoValue = this.consultaSIVEPAform.getRawValue();
    this.tableConsulta = true;
    const BODY = {
      "nit": this.consultaSIVEPAform.value.nit,
      "fecha": moment(periodoValue.fechaInicio).format('YYYY/MM/DD'),
      "fechaDos": moment(periodoValue.fechaFin).format('YYYY/MM/DD')
    }
    console.log(BODY)
    this.contribuyenteService.getImportacion(BODY).toPromise().then(res => {
      console.log(res)
      this.consultaSIVEPA.data = res
    })
  }

  getImportacionDetalle() {
    this.detalleSivepa = true
    this.tableConsulta = false
    const periodoValue = this.consultaSIVEPAform.getRawValue();
    const BODY = {
      "nit": this.nit,
      "fecha": moment(periodoValue.fechaInicio).format('YYYY/MM/DD'),
      "fechaDos": moment(periodoValue.fechaFin).format('YYYY/MM/DD')
    }
    this.contribuyenteService.getImportacionDetalle(BODY).toPromise().then(res => {
      console.log(res)
      this.consultaSIVEPAdetalle.data = res
    })
  }

  regresar() {
    this.detalleSivepa = false
    this.tableConsulta = true
  }
}
