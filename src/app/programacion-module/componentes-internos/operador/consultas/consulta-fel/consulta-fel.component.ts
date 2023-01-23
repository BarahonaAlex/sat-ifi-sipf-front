import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Moment } from 'moment';
import { logging } from 'protractor';
import { Fel } from 'src/app/general-module/componentes-comunes/interfaces/fel.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';

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
}
@Component({
  selector: 'app-consulta-fel',
  templateUrl: './consulta-fel.component.html',
  styleUrls: ['./consulta-fel.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ConsultaFelComponent {
  @Input('nit') NIT!: string;
  queryParameters!: FormGroup;
  catOperationsType: { key: string, value: string }[] = [];
  displayedColumns: string[] = ['numeroAutorizacion', 'serie', 'fechaEmision', 'fechaCertificacion', 'nitReceptor', 'nomReceptor', 'total'];
  data = new MatTableDataSource();
  listFel = new Array;
  indice: number = 0;
  felDet!: Fel.DET;
  numeroPagina: number = 0;
  totalPaginas: number = 0;
  totalFacturas: number = 0;
  dateActual = new Date();
  disable: boolean = true;
  disable1: boolean = true;
  step: number = 0;


  constructor(
    private contribuyenteService: ContribuyenteService
  ) {
    this.queryParameters = new FormGroup({
      operationType: new FormControl('E'),
      rangeDate: new FormControl(moment())
    });
    this.catOperationsType.push({ key: 'E', value: 'Emisor' }, { key: 'R', value: 'Receptor' });
  }

  ngOnInit() {
    console.log(this.dateActual);
    this.disable;
    this.disable1;

  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.queryParameters.get('rangeDate')?.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    datepicker.close();
    this.queryParameters.get('rangeDate')?.setValue(ctrlValue);
  }

  setStep(index: number) {
    this.step = index;
  }

  /**
* @description Método que trae los 50 registro de la factura electronica FEL
* @author agaruanom (Gabriel Ruano)
* @since 02/08/2022
*/
  async getDET() {
    
    this.listFel = []
    const queryParameters: Fel.queryParameters = {

      anio: moment(this.queryParameters.get('rangeDate')?.value).format('yyyy'),
      clavePaginaSiguiente: null,
      mes: moment(this.queryParameters.get('rangeDate')?.value).format('MM'),
      nit: '904945' /* this.NIT */,
      tipoOperacion: this.queryParameters.get('operationType')?.value
    }
    console.log(queryParameters);

    this.contribuyenteService.getDETFELByTaxPayer(queryParameters).subscribe(res => {
      console.log(res);
      if (res.data.length == 0) return;
      this.data.data = res.data;
      this.listFel.push(this.data.data)
      this.indice = this.listFel.length - 1
      console.log(this.listFel);
      console.log(this.indice);
      this.felDet = res;
      this.numeroPagina = 1;
      this.totalPaginas = this.listFel.length
      this.totalFacturas = this.felDet.totalPagina
      this.disable = false;
      this.disable1 = false;
    });
    this.step--;
  }

  /**
* @description Método para limpiar todo los datos de la consulta 
* @author agaruanom (Gabriel Ruano)
* @since 02/08/2022
*/
  cleanQueryParameters() {
    this.disable = true;
    this.disable1 = true;
    this.totalFacturas = 0;
    this.numeroPagina = 0;
    this.totalPaginas = 0;
    this.listFel = [];
    this.data.data = [];
    this.queryParameters.get('operationType')?.setValue('E');
    this.queryParameters.get('rangeDate')?.setValue(moment());
  }


  /**
* @description Metodo para setear el indice 0 a la tabla
* @author agaruanom (Gabriel Ruano)
* @since 02/08/2022
*/
  firstFel() {
    this.indice = 0;
    this.data.data = this.listFel[this.indice]
    this.numeroPagina = 1;
    console.log(this.indice);
    this.disable1 = false;
  }

  /**
* @description Método para  regresar una pagina anterior 
* @author agaruanom (Gabriel Ruano)
* @since 03/08/2022
*/
  //Pagina atra 
  previousRetentions() {
    this.indice = this.indice - 1
    if (this.indice <= -1) {
      this.indice = 0;
      console.log('entre a mi primer if');
    }
    console.log(this.indice);
    if (this.indice == 0) {
      this.numeroPagina = 1;
    } else {
      this.numeroPagina--
    }
    this.data.data = this.listFel[this.indice]
    this.disable1 = false;
  }

  /**
* @description Método para pasar a la pagina siguiente de los datos consultados 
* @author agaruanom (Gabriel Ruano)
* @since 03/08/2022
*/
  nextRetention() {
    if (this.indice != (this.listFel.length - 1)) {
      console.log('ebtre al primer if');
      this.indice = this.indice + 1
      this.numeroPagina++
      this.data.data = this.listFel[this.indice]
      console.log(this.indice);
    } else {
      console.log('entre al else');
      this.getNewFel();
      this.indice = this.listFel.length - 1
      this.data.data = this.listFel[this.indice]
      console.log(this.indice);
    }
  }

  /**
  * @description Método para traer el ultimo registros consultados  
  * @author agaruanom (Gabriel Ruano)
  * @since 03/08/2022
  */
  lastRetention() {
    this.indice = this.listFel.length - 1
    this.data.data = this.listFel[this.indice]
    this.numeroPagina = this.listFel.length
    console.log(this.indice);
    this.disable1 = false;
  }

  /**
  * @description Método para traer resgristro de la factura electrónicas FEL
  * @author agaruanom (Gabriel Ruano)
  * @since 03/08/2022
  */
  getNewFel() {
    const queryParameters: Fel.queryParameters = {
      anio: moment(this.queryParameters.get('rangeDate')?.value).format('yyyy'),
      clavePaginaSiguiente: this.felDet.clavePaginaSiguiente,
      mes: moment(this.queryParameters.get('rangeDate')?.value).format('MM'),
      nit: '904945'/* this.NIT */,
      tipoOperacion: this.queryParameters.get('operationType')?.value
    }
    this.contribuyenteService.getDETFELByTaxPayer(queryParameters).subscribe(res => {
      console.log(res);
      if (res.data.length == 0) return;
      if (res.clavePaginaSiguiente == null) {
        console.log('no hace nada')
        this.disable1 = true;
      } else {
        this.data.data = res.data;
        this.listFel.push(this.data.data)
        this.indice = this.listFel.length - 1
        this.felDet = res;
        this.totalPaginas = this.listFel.length
        this.numeroPagina++
        this.totalFacturas = this.felDet.totalPagina
        console.log(this.listFel);
      }
    });
  }

}
