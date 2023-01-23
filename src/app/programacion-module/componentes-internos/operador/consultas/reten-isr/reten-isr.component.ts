import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RetenIsr } from 'src/app/general-module/componentes-comunes/servicios/reten-isr.service';
import { ReportesService } from 'src/app/general-module/componentes-comunes/servicios/reportes.service';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { RetenIsrInterface} from 'src/app/general-module/componentes-comunes/interfaces/reten-isr.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';

const EXCEL_TYPE = 'aaplication/vn.openxmlfomats-officedocument.spreadsheetml.sheet; charset = UTF-8';
const EXCEL_EXT = '.xlsx';
@Component({
  selector: 'app-reten-isr',
  templateUrl: './reten-isr.component.html',
  styleUrls: ['./reten-isr.component.css']
})

export class RetenIsrComponent implements OnInit {

  @Input('datosContribuyente') datosContribuyentes!: Contribuyente.Attributes;
  nombreContribuyente!: string;

  retenciones = [
    { codigo: "agente", nombre: "Agente Retenedor" },
    { codigo: "sujeto", nombre: "Sujeto de Retención" },
  ];

  tipoReten = [
    { codigo: "os", nombre: "Regimen Opcional Simplificado" },
    { codigo: "rc", nombre: "Rentas de Capital" },
  ];

  estado = [
    { codigo: "Activas", nombre: "Activas" },
    { codigo: "anuladas", nombre: "Anuladas" },
  ];

  meses = [
    { codigo: 1, nombre: "Enero" },
    { codigo: 2, nombre: "Febrero" },
    { codigo: 3, nombre: "Marzo" },
    { codigo: 4, nombre: "Abril" },
    { codigo: 5, nombre: "Mayo" },
    { codigo: 6, nombre: "Junio" },
    { codigo: 7, nombre: "Julio" },
    { codigo: 8, nombre: "Agosto" },
    { codigo: 9, nombre: "Septiembre" },
    { codigo: 10, nombre: "Octubre" },
    { codigo: 11, nombre: "Noviembre" },
    { codigo: 12, nombre: "Diciembre" },
  ];

  showTableRc:boolean = false;
  showTableOs:boolean = false;
  showSearch = true;
  searchFormGroup!: FormGroup;

  dataSource = new MatTableDataSource<any>();
  dataSourceOs = new MatTableDataSource<any>();

  displayedColumns: string[] = [
  'noConstancia', 
  'nitAgenteRetenedor', 
  'nombreRazonSocial',
  'serieDocumento',
  'numeroDocumento',
  'fechaRetencion',
  'conceptoRetencion',
  'baseImponible',
  'retencion',
  'imprimir'];

  displayedColumnsOs: string[] = [
    'noConstancia', 
    'nitAgenteRetenedor', 
    'nombreRazonSocial',
    'serieDocumento',
    'numeroDocumento',
    'fechaRetencion',
    'conceptoRetencion',
    'baseImponible',
    'retencion',
    'imprimir'];

  
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.dataSource.paginator = mp1;
  }

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.dataSourceOs.paginator = mp2;
  }

selectedYear!: number;
years: number[] = [];

constructor(
  private retenIsrService: RetenIsr, 
  private scopeReport: ReportesService, 
  private dialogService: DialogService,
  private taxPayerService: ContribuyenteService) {
  this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 2012; year--) {
      this.years.push(year);
    }

   
}

  
  async ngOnInit(){
    
    const detail = this.datosContribuyentes.datos.contribuyente?.persona ?? this.datosContribuyentes.datos.empresa;
    this.nombreContribuyente = parsearNombre(detail);
    
    this.searchFormGroup = new FormGroup({
      tipoConsulta: new FormControl('', Validators.required),
      mes: new FormControl('', Validators.required),
      tipoRetencion: new FormControl('', Validators.required),
      estadoRetencion: new FormControl('', Validators.required),
      periodoAno: new FormControl('', Validators.required),
      nitAgenteSujeto: new FormControl(this.datosContribuyentes.id, Validators.required),
      nombreAgenteSujeto: new FormControl(this.nombreContribuyente, Validators.required),
      nitRetenedor: new FormControl(''),
    });
  }


  async consultar(): Promise<void> {
    if (!this.searchFormGroup.invalid && this.searchFormGroup.controls.tipoRetencion.value == 'rc') {
      this.dataSource.data = await this.retenIsrService.getRetenIsrRcDetail(
        this.searchFormGroup.controls.nitAgenteSujeto.value,
        this.searchFormGroup.controls.mes.value+''+this.searchFormGroup.controls.periodoAno.value,
        this.searchFormGroup.controls.nitRetenedor.value,
        this.searchFormGroup.controls.tipoConsulta.value,
        this.searchFormGroup.controls.tipoRetencion.value,
        this.searchFormGroup.controls.estadoRetencion.value).toPromise();
        
        if(this.dataSource.data.length == 0){
          this.dialogService.show({
            icon: 'warning',
            title: 'IFI-404',
            text: "No se han encontrado datos para la consulta",
          });
        }else{
          this.showTableRc= true;
          this.showTableOs= false;
        }
    }
    if (!this.searchFormGroup.invalid && this.searchFormGroup.controls.tipoRetencion.value == 'os') {
      this.dataSourceOs.data = await this.retenIsrService.getRetenIsrOsDetail(
        this.searchFormGroup.controls.nitAgenteSujeto.value,
        this.searchFormGroup.controls.mes.value+''+this.searchFormGroup.controls.periodoAno.value,
        this.searchFormGroup.controls.nitRetenedor.value,
        this.searchFormGroup.controls.tipoConsulta.value,
        this.searchFormGroup.controls.tipoRetencion.value,
        this.searchFormGroup.controls.estadoRetencion.value).toPromise();

        if(this.dataSourceOs.data.length == 0){
          this.dialogService.show({
            icon: 'warning',
            title: 'IFI-404',
            text: "No se han encontrado datos para la consulta",
          });
        }else{
          this.showTableOs= true;
          this.showTableRc= false;
        }
    }
    
  }

   /**
   * @description Funcion que genera un reporte de constancias de isr
   */
    getConstanciaIsr(id: string) {
      this.scopeReport.getConstanciaIsr(id, this.searchFormGroup.controls.tipoRetencion.value, this.searchFormGroup.controls.estadoRetencion.value).subscribe(
        (data) => {
          FileUtils.downloadFile(data, 'Reporte Constancia.pdf')
        }
      )
    }

    exportToExcel(json: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'data': worksheet},
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
    exportAsXLSXOS(): void {
      const y:object[]=[];
      y.push({
        encabezado: "Periodo: "+ this.searchFormGroup.controls.mes.value+"-"+this.searchFormGroup.controls.periodoAno.value
      });
      y.push({
        encabezado: "NIT: " + this.searchFormGroup.controls.nitAgenteSujeto.value
      });
      this.dataSourceOs.data.forEach(
        t => {
          const x = {
            num_constancia: t.numero_FORMULARIO,
            nit: t.nit_PROVEEDOR,
            nombre: t.nombre_PROVEEDOR,
            serie: t.serie_DOCUMENTO,
            num_doc: t.numero_DOCUMENTO,
            fecha_retencion: t.fecha_DOCUMENTO,
            concepto: t.concepto,
            base: t.base,
            retencion: t.retencion
          }
          y.push(x);
        }
      )
      this.exportToExcel(y, 'Constancia Retencion ISR OS');
    }
  
    exportAsXLSXRC(): void {
      const y:object[]=[];
      y.push({
        encabezado: "Periodo: "+ this.searchFormGroup.controls.mes.value+"-"+this.searchFormGroup.controls.periodoAno.value
      });
      y.push({
        encabezado: "NIT: " + this.searchFormGroup.controls.nitAgenteSujeto.value
      });
      this.dataSource.data.forEach(
        t => {
          const x = {
            num_constancia: t.numero_FORMULARIO,
            nit: t.nit_SUJETO_R,
            nombre: t.nombreSujeto,
            fecha_retencion: t.fecha_RETENCION,
            concepto: t.descripcion,
            base: t.base,
            retencion: t.retencion
          }
          y.push(x);
        }
      )
      this.exportToExcel(y, 'Constancia Retencion ISR RC');
    }
}
