import { Byte } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';


@Component({
  selector: 'app-consulta-efa',
  templateUrl: './consulta-efa.component.html',
  styleUrls: ['./consulta-efa.component.css'],
})
export class ConsultaEfaComponent implements OnInit {

  @ViewChild('MatPaginator') set matPaginator2(mp: MatPaginator) {
    this.datosTabla.paginator = mp;
  }

  docFirmado: any[] = [
    { value: "S", viewValue: 'Si' },
    { value: "N", viewValue: 'No' }
  ];

  displayedColumns: string[] = [
    'periodos', 
    'fechaPresentacion', 
    'fechaActualizacion', 
    'tipoObligado', 
    'nombreArchivo',
    'descargar'
  ];

  /* variables para permitir solo numero en un input*/
  key: any;
  teclado: any;
  numero: any;
  especiales: any;
  teclado_especial!: boolean;

  generalFormGroup!: FormGroup;
  datosTabla= new MatTableDataSource();
  dateActual = new Date();
  dateActual2 = new Date();
  mostrarConsulta: boolean = true;
  date = new FormControl(moment());
  inputYear: number = 0;
  currentDate = new Date();
  minDate = new Date(2010, 0, 1);



  constructor(private efaService: ContribuyenteService,
    private dialogService: DialogService) {

      this.generalFormGroup = new FormGroup({
        periodoDesde: new FormControl('',Validators.required),
        periodoHasta: new FormControl(''),
        docFirmado: new FormControl('', Validators.required),        
      })
      
     }

  ngOnInit(): void {
  }

  getConsulta(){
    const entidadValue = this.generalFormGroup.getRawValue();
    
      const dataParams: Contribuyente.EfaParams ={
        pDocFirmado:this.generalFormGroup.get('docFirmado')?.value,
        pNit: "904945",
        pPeriodoDesde:  "01/01/"+entidadValue.periodoDesde,
        pPeriodoHasta:  "31/12/"+entidadValue.periodoDesde
      }
      console.log(dataParams)

      this.efaService.getEfa(dataParams).toPromise().then(res=>{
        console.log(res);
        if(res.length == 0){
          this.dialogService.show({
            title: 'Registro no encontrado',
              text: `No existen registros para la consulta realizada`,
              icon: 'warning',
              showCancelButton: false,
              disableClose: true,
              showCloseButton: false
          })
        }else{
          this.mostrarConsulta = false
          this.datosTabla.data = res
        }
        


      }).catch(err=>{
        console.log(err)
      })
    
  }

  getDocument(archivo: String, nombreArchivo: string){
    console.log(archivo);
    console.log(nombreArchivo);
    
    var link = document.createElement('a');
    link.href = `data:application/pdf;base64,${archivo}`;
    link.download = nombreArchivo; 
    link.click();
    
  }

  public soloNumeros(e: any) {

    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '8';
    this.numero = '0123456789';
    this.teclado_especial = false;
    for (const i in this.especiales) {
      if (this.key === this.especiales[i]) {
        this.teclado_especial = true;
      }
    }

    if (this.numero.indexOf(this.teclado) === -1 && !this.teclado_especial) {
      return false;
    }
    return true;
  }

}
