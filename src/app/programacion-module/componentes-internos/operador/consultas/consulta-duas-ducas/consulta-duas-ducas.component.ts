import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { MatRadioGroup } from '@angular/material/radio';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'aaplication/vn.openxmlfomats-officedocument.spreadsheetml.sheet; charset = UTF-8';
const EXCEL_EXT = '.xlsx';

const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-consulta-duas-ducas',
  templateUrl: './consulta-duas-ducas.component.html',
  styleUrls: ['./consulta-duas-ducas.component.scss'],
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

export class ConsultaDuasDucasComponent implements OnInit {

  @Input('nit') nit!: string;
  data!: DynamicDataTable<Contribuyente.DataDuasDucas>
  //@ViewChild('table') table!: TablaDinamicaComponent<any>
  //en current date se tiene el menos uno para restarle un año al año actual con el fin de
  //que la consulta no truene debido a problemas de informacion actualizada
  currentDate = new Date(new Date().getFullYear() - 1, 11, 31);
  minDate = new Date(2000, 0, 1);
  showDownload = false;
  generalFormGroup!: FormGroup;
  dataDuasDucas!: Contribuyente.DataDuasDucas[];
  date = new FormControl(moment());
  showTable = false;

  constructor(private servicesContribuyente: ContribuyenteService,
    private dialogService: DialogService) {
    this.nit = "334944"
  }

  ngOnInit(): void {
    this.generalFormGroup = new FormGroup({
      btnRadio: new FormControl('', Validators.required)
    });
  }

  /**
   * @description Metodo para que solo se seleccione el mes y año en el datepicker
   * @author Jamier Batz (ajsbatzmo)
   * @since 08/09/2022
   */
  selectedMonth(date: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(date.month());
    ctrlValue.year(date.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  /**
  * @description Metodo para consultar DUAS o DUCAS segun fecha y opcion seleccionada
  * @author Jamier Batz (ajsbatzmo)
  * @since 08/09/2022
  */
  findByMonth() {
    let fecha = this.date.value.format('YYYY/MM')
    let option = this.generalFormGroup.get('btnRadio')?.value
    let codigo!: string

    if (option == 1) {
      codigo = 'N' //DUAS
    } else if (option == 2) {
      codigo = 'S' //DUCAS
    }

    const params = {//constante de parametros que se envian al servicio
      nit: this.nit,
      fecha: fecha,
      codigo: codigo
    }

    this.servicesContribuyente.getDuasDucas(params).toPromise().then(res => {
      if (res.data.length == 0) {
        this.showTable = false
        this.showDownload = false;
        this.dialogService.show({
          title: 'Registro no encontrado',
          text: `No se encontraron registros para la consulta realizada.`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: false,
          showCloseButton: false
        })
      } else {
        this.dataDuasDucas = res.data//DATASOURCE QUE SE MANDA COMMO DATA AL DYNAMICTABLE
        console.log(this.dataDuasDucas)
        this.data = {//TABLA DINAMICA
          header: [
            { id: 'numeroOrden', nameColum: `No. Orden` },
            { id: 'numeroDua', nameColum: `Numero DUA` },
            { id: 'fechaAceptacion', nameColum: `Fecha de Audiencia` },
            { id: 'docImpoExpo', nameColum: `Documento Importación-Exportación` },
            { id: 'razonSocialImpoExpo', nameColum: `Razon Social` },
            { id: 'tipoCambio', nameColum: `Tipo de Cambio` },
            { id: 'razonSocialAgente', nameColum: `Razon Social Agente` },
            { id: 'regimenModalidad', nameColum: `Regimen Modalidad` },
            { id: 'paisProceDestino', nameColum: `Pais Procedencia Destino` },
            { id: 'fleteDolares', nameColum: `Flete Dolares` },
            { id: 'seguroDolares', nameColum: `Seguro Dolares` },
            { id: 'numeroBultos', nameColum: `Numero Bultos` },
            { id: 'pesoNeto', nameColum: `Peso Neto` },
            { id: 'unidadesFisicas', nameColum: 'Unidades Fisicas' },
          ],
          data: this.dataDuasDucas,//DATA QUE SE NECESITA PARA SETEAR MOSTRAR LOS DATOS EN LA DYNAMICTABLE
          noColum: [5, 10, 15]
        }
        this.showTable = true
        this.showDownload = true;
      }
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
    })
  }

  /**
  * @description Metodos necesarios para generar excel
  * @author Jamier Batz (ajsbatzmo)
  * @since 08/09/2022
  */
  async exportToExcel(json: any[], excelFileName: string){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    //llamar al metodo bufer y file name  
    this.saveAsExcel(excelBuffer, excelFileName)
  }
  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, fileName + '.xlsx')
  }

  /**
  * @description Metodo para descargar excel
  * @author Jamier Batz (ajsbatzmo)
  * @since 08/09/2022
  */
 downloadExcel() {
    let numRegistros = this.dataDuasDucas.length
    this.dialogService.show({
      title: 'Confirmación',
      text: `¿Esta seguro que desea generar el reporte de ${numRegistros} registros?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: false
    }).then(async result => {
      if (result !== 'primary') return;
      await this.exportToExcel(this.dataDuasDucas, 'Reporte DUAS y DUCAS')
      this.dialogService.showSnackBar({
        title: 'IFI-200',
        text: `Reporte generado correctamente.`,
        icon: 'success',
        duration: 3000
      })
    })
  }

}
