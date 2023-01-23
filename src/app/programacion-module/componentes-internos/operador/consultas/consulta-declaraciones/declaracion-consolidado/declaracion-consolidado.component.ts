import { DatePicker } from 'mat-dynamic-form';
import { CaseDetail } from './../../../../../../general-module/componentes-comunes/interfaces/casos.interface';
import { MatTableDataSource } from '@angular/material/table';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicDataTable, DynamicHeaderTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { MatDatepicker } from '@angular/material/datepicker';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Moment } from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { Key } from 'protractor';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

const EXCEL_TYPE = 'aaplication/vn.openxmlfomats-officedocument.spreadsheetml.sheet; charset = UTF-8';
const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-declaracion-consolidado',
  templateUrl: './declaracion-consolidado.component.html',
  styleUrls: ['./declaracion-consolidado.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
  ]
})
export class DeclaracionConsolidadoComponent implements OnInit {
  mergeByMonth: {}[] = []
  enumData: Object[] = []
  b: boolean = false;
  data: DynamicDataTable<any> = {
    header: [],
    data: [],
    noColum: []
  }
  a: boolean = false
  dataB: DynamicDataTable<any> = {
    header: [],
    data: [],
    noColum: []
  }
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = []
  @ViewChild("table") table!: TablaDinamicaComponent<any>
  @ViewChild("resumenDecla") resumenDecla!: TablaDinamicaComponent<any>
  @Input('nit') nit: string = "2291";
  @Input('taxPayerCase') taxPayerCase!: CaseDetail
  years: number[] = [];
  listTaxGroups!: Catalog[];
  /*  @Input('IYear') IYear: number = 2015;
   @Input('FYear') FYear: number = 2011; */
  currentYear!: number;
  date = new FormControl(moment());
  currentDate = new Date();
  /* minDate = new Date(2010, 0, 1); */
  inputYear: number = 2022;
  array = new Array

  constructor(private contribuyenteService: ContribuyenteService,
    private catalogService: CatalogosService,
    private dialogo: DialogService) {
  }

  ngOnInit() {
    console.log(this.taxPayerCase ?? {});
    console.log(moment(this.taxPayerCase.periodoRevisionFin).year());
    this.years.push(moment(this.taxPayerCase.periodoRevisionFin).year());
    this.catalogService.getCatalogDataByIdCatalog(202).toPromise().then(
      result => {
        this.listTaxGroups = result;
        this.declaracionResumen();
      }
    );


  }

  declaracionConsolidada(op: boolean, t: Contribuyente.DeclarationResume) {
    //por el total de años
    this.currentYear = -1;
    if (op) {//booleano para comprobar si es por anio (true) o si es el consolidado (false)
      this.dataSource.data = []
      const years: number[] = []
      for (let index = 0; index < 5; index++) {
        years.push(this.years[0] - index)
      }
      console.log(years);
      console.log(t);


      //
      this.contribuyenteService.getDeclarationConsolidate(this.nit, years, t.formularios.split(",").map(t => parseInt(t))).toPromise().then(res => {
        console.log(res.sort((a, b) => parseInt(a.mes) - parseInt(b.mes)).sort((a, b) => parseInt(a.anio) - parseInt(b.anio)))

        const x = res.reduce((a, c) => {
          console.log(c.valor);
          a[c.numero_CASILLA + c.descripcion_CONCEPTO] = a[c.numero_CASILLA + c.descripcion_CONCEPTO] ?? {};
          a[c.numero_CASILLA + c.descripcion_CONCEPTO][c.anio] = parseInt(a[c.numero_CASILLA + c.descripcion_CONCEPTO][c.anio] ?? 0) + parseInt(c.valor)
          a[c.numero_CASILLA + c.descripcion_CONCEPTO].descripcion = c.descripcion_CONCEPTO;
          a[c.numero_CASILLA + c.descripcion_CONCEPTO].no = c.numero_CASILLA;

          return a
        }, Object.create(Object))
        console.log(x);

        console.log(Object.keys(x).map((key) => ({ ...x[key] })));

        this.mergeByMonth = Object.keys(x).map((key) => ({ ...x[key] })).map(t => {
          const h: { [key: string]: number } = { ...t }
          years.filter(year => !Object.keys(t).includes(year.toString())).forEach((k) => {
            h[k] = 0;
          })
          return h;
        })

        console.log(this.mergeByMonth)
        //
        Object.keys(this.mergeByMonth[0]).reverse().forEach(element => {
          const g = { id: element, nameColum: element.toUpperCase() }
          this.dataB.header.push(g)
          this.displayedColumns.push(element)
        })
        this.dataB.data = this.mergeByMonth
        this.dataB.noColum = [10, 30, 50]/* [this.mergeByMonth.length] */
        console.log(this.dataB)
        //
        this.dataB.data = this.mergeByMonth
        this.dataB.noColum = [10, 30, 50]/* [this.mergeByMonth.length] */
        //
        this.a = true
        this.b = false
      })
    }
    //


    else {

      console.log(parseInt(t.selectedYear!));
      this.currentYear = parseInt(t.selectedYear!);
      console.log(t.formularios.split(",").map(t => parseInt(t)));
      //por el año elegido
      this.dataSource.data = []
      this.contribuyenteService.getDeclarationConsolidate(this.nit, [parseInt(t.selectedYear!)], t.formularios.split(",").map(t => parseInt(t))).toPromise().then(res => {
        console.log(res);

        console.log(res.sort((a, b) => parseInt(a.mes) - parseInt(b.mes)).sort((a, b) => parseInt(a.anio) - parseInt(b.anio)))

        const x = res.reduce((a, c) => {
          a[c.anio + c.numero_CASILLA] = a[c.anio + c.numero_CASILLA] ?? {};
          a[c.anio + c.numero_CASILLA].mes = "1";
          a[c.anio + c.numero_CASILLA].no = c.numero_CASILLA;
          a[c.anio + c.numero_CASILLA].descripcion = c.descripcion_CONCEPTO;
          a[c.anio + c.numero_CASILLA][c.mes_DESDE] = c.valor;
          a[c.anio + c.numero_CASILLA].total = parseInt(a[c.anio + c.numero_CASILLA].total ?? 0) + parseInt(c.valor)
          if (parseInt(a[c.anio + c.numero_CASILLA].mes) < parseInt(c.mes)) {
            console.log(c.mes);
            const y = a[c.anio + c.numero_CASILLA].total
            delete a[c.anio + c.numero_CASILLA].total
            a[c.anio + c.numero_CASILLA].total = y
          }
          a[c.anio + c.numero_CASILLA].mes = c.mes;
          return a
        }, Object.create(Object))
        console.log(x);


        this.mergeByMonth = Object.keys(x).map((key) => ({ ...x[key] }))
        this.mergeByMonth = [...new Set(this.mergeByMonth.map((t: any) => t))]

        console.log(Object.keys(this.mergeByMonth))
        //
        Object.keys(this.mergeByMonth[0]).filter(t => !t.match("mes")).forEach(element => {
          const g = { id: element, nameColum: element.toUpperCase() }
          this.dataB.header.push(g)
          this.displayedColumns.push(element)
        })
        this.dataB.data = this.mergeByMonth
        this.dataB.noColum = [10, 30, 50]/* [this.mergeByMonth.length] */
        console.log(this.data)
        //
        this.dataB.data = this.mergeByMonth
        this.dataB.noColum = [10, 30, 50] /* [this.mergeByMonth.length] */
        //
        this.a = true
        this.b = false
      })
    }
  }


  declaracionResumen() {
    this.dataSource.data = []
    this.contribuyenteService.getDeclarationResume(this.nit, this.years).toPromise().then(res => {

      console.log(res)

      const y =
        res.filter(t => t.idresumen).length != 0 ?
          //
          res.reduce((a, c) => {
            a[c.idresumen] = a[c.idresumen] ?? {}
            a[c.idresumen].posicion = c.posicion
            a[c.idresumen].tipoimpuesto = c.tipoimpuesto
            a[c.idresumen].impuesto = this.listTaxGroups.filter(item => item.codigoIngresado === c.formularios)[0].nombre
            a[c.idresumen][c.anio] = parseInt(c.declaraciones) > 12 ? "12" : c.declaraciones
            a[c.idresumen].formularios = c.formularios
            if (!c.idresumen) {
              delete a[c.idresumen]
            }
            return a;
          }, Object.create(Object))
          :
          //
          res.reduce((a, c) => {
            a[c.impuesto] = a[c.impuesto] ?? {}
            a[c.impuesto].posicion = c.posicion
            a[c.impuesto].tipoimpuesto = c.tipoimpuesto
            a[c.impuesto].impuesto = this.listTaxGroups.filter(item => item.codigoIngresado === c.formularios)[0].nombre
            a[c.impuesto][c.anio] = 0
            a[c.impuesto].formularios = c.formularios
            return a;
          }, Object.create(Object))



      console.log(y);


      //
      const years: number[] = []
      var a = this.years.sort((a, b) => b - a)[0]
      var b: number = 0
      for (let index = 0; index < 5; index++) {
        b = index == 0 ? a : b - 1;
        console.log(b);
        years[index] = b
      }
      //


      this.mergeByMonth = Object.keys(y).map((key) => ({ ...y[key] })).map(t => {
        const h: { [key: string]: number } = { ...t }

        years.filter(year => !Object.keys(t).includes(year.toString())).forEach((k) => {
          h[k] = 0;
        })
        return h;
      })



      Object.keys(this.mergeByMonth[0]).filter(t => !t.includes('formularios')).filter(g => !g.includes('posicion')).sort().reverse().forEach(key => {
        const g: DynamicHeaderTable<any> = { id: key, nameColum: key.includes("tipoimpuesto") ? "TIPO IMPUESTO" : key.toUpperCase() }
        if (!["tipoimpuesto", "impuesto"].includes(key)) {

          g.child = {
            type: 'linkedColumn',
            onClick: item => {
              if (item[1][key] == 0) return;
              item[1].selectedYear = item[0]
              this.declaracionConsolidada(false, item[1])
            }
            /* this.declaracionConsolidada(false, item) */// por un anio
          }
        }
        this.data.header.push(g)
        this.displayedColumns.push(key)
      })

      this.data.header.push({
        id: "consolidado",
        nameColum: "Consolidado",
        actions: [
          {
            btnName: "Ver Consolidado",
            btnKey: "consolidate",
            btnIcon: "visibility",
            onClick: item => {
              this.array = []
              for (const [key, value] of Object.entries(item)) {
                console.log(`${key}: ${value}`);
                console.log(value);
                this.array.push(value);
              }
              console.log(this.array);
              if (this.array[0] == '0' && this.array[1] == '0' && this.array[2] == '0' && this.array[3] == '0' && this.array[4] == '0') {
                console.log("entro al if");
                this.dialogo.show({
                  icon: 'warning',
                  title: 'IFI-404',
                  text: "Consolidado no tiene datos",
                });
              } else {
                console.log(this.array[0]);
                this.declaracionConsolidada(true, item)//por un rango de anios
              }
            }
            //this.declaracionConsolidada(true, item)//por un rango de anios
          }
        ]
      })
      this.data.data = this.mergeByMonth.sort((a: any, b: any) => a.posicion.localeCompare(b.posicion))
      this.data.noColum = [6, 12]/* [this.mergeByMonth.length] */
      console.log(this.data)
      this.b = true

    })
  }

  back() {
    this.table.dataSource.data = []
    this.table.displayedColumns = []
    this.dataB = {
      header: [],
      data: [],
      noColum: []
    }
    this.b = true
    this.a = false
  }

  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, excelFileName + '.xlsx')
  }

  exportConsolidado() {
    this.exportToExcel(this.mergeByMonth.map((t: any) => {
      delete t.mes
      return t
    }), this.currentYear == -1 ? "Consolidado de Declaraciones" : `Declaraciones año: ${this.currentYear}`)
  }

  findByYear() {
    console.log(this.inputYear);
    this.b = false
    this.years = [this.inputYear]
    this.resumenDecla.dataSource.data = []
    this.resumenDecla.displayedColumns = []
    this.data = {
      header: [],
      data: [],
      noColum: []
    }
    this.declaracionResumen()
  }

  selectedYear(date: Moment, datePicker: MatDatepicker<Moment>) {
    this.date.value
    const ctrlValue = this.date.value!;
    this.inputYear = date.year();
    ctrlValue.year(date.year());
    this.date.setValue(ctrlValue)
    console.log(date.year());
    datePicker.close()
  }
}
