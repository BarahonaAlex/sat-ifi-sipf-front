import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BandejaIncosistenicasResponse, InconsistenciasResponse } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-inconsistencias',
  templateUrl: './inconsistencias.component.html',
  styleUrls: ['./inconsistencias.component.css']
})
export class InconsistenciasComponent implements OnInit {

  @Input('idSolicitud') idSolicitud!: number;
  
  @Input('idEstadoSolicitud') idEstadoSolicitud!: number;

  @Output() agregarInconsistenciaEvent = new EventEmitter<BandejaIncosistenicasResponse[]>();

  @ViewChild('MatPaginator') set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = [ 'checkbox',
              'periodoDesde',
              'periodoHasta',
              'nitProveedor', 
              'facturaSerie',
              'noFactura', 
              'inconsistencia', 
              'tipoRepetida',
              'repetidaEn',
              'observacion'
  ];

 
  inconsistenciasSelected = new SelectionModel<BandejaIncosistenicasResponse>(true, []);
  sinInconsistenicas: BandejaIncosistenicasResponse[] = []
  btnSinInconistenicas!: Boolean;
  btnDisabledIn!: number;
  inconsistenciasActualizadas!: Boolean;
  ngIfSinInconsitencias!: Boolean;


  dataSource = new MatTableDataSource<BandejaIncosistenicasResponse>();
  
  constructor(private inconsitenciasService: CreditoFiscal,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    console.log(this.idEstadoSolicitud);
    
    this.inconsitenciasService.getInconsistencyByRequest(this.idSolicitud).toPromise().then(res=>{
     
      this.dataSource.data = res

      res.filter(k=> k.idEstado === 1078).map( x =>{
        this.inconsistenciasSelected.select(x)
      });
          

      if(res.length == 0){
        this.agregarInconsistenciaEvent.emit(this.sinInconsistenicas)
        this.btnDisabledIn = 0
        this.ngIfSinInconsitencias = false;
        this.btnSinInconistenicas = false;
      }else{
        this.btnDisabledIn = res.length
        this.ngIfSinInconsitencias = true;
      }
    })
    if(this.idEstadoSolicitud == 1077){
      this.btnSinInconistenicas = true;
      console.log(this.idEstadoSolicitud);
      
    }else{

      this.btnSinInconistenicas = false;
      console.log("entra aca", this.idEstadoSolicitud);
      
    }
    
  }


  agregarInconsitencias(){
    this.dialogService.show({
      title: 'Agregar Inconsistencias',
      text: `¿Esta seguro de agregar las inconsistencias seleccionadas a la Cédula de No Admisión?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: false
    }).then(res=>{
      console.log(res)
      if(res == "primary"){
        this.inconsistenciasSelected.selected.forEach(item =>{
          
          this.inconsitenciasService.updateInconsistency(item.idInconsistencia, 1078).toPromise().then(res =>{
           
            this.inconsistenciasActualizadas = res;
            
          })
        })

          this.agregarInconsistenciaEvent.emit(this.inconsistenciasSelected.selected)
          this.dialogService.show({
            title: 'Agregar Inconsistencias',
            text: `Se agregarón las inconsistencias`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          }).then(result=>{
            this.ngOnInit()
          })
        

        
      }
    })    


  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.inconsistenciasSelected.clear();
      return;
    }

    this.inconsistenciasSelected.select(...this.dataSource.data);
  }

  isAllSelected() {

    const numSelected = this.inconsistenciasSelected.selected.length;
    const numRows = this.dataSource.data?.length;
    return numSelected === numRows;

  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.inconsistenciasSelected.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  sinAgregarInconsitencias(){
    this.dialogService.show({
          title: 'Sin Agregar Inconsistencias',
          text: `No se agregará ninguna inconsistenica a la cédula de respuesta, ¿Esta seguro?`,
          icon: 'warning',
          showCancelButton: true,
          disableClose: false,
          showCloseButton: false
    }).then(res =>{
      if(res == 'primary'){
        this.agregarInconsistenciaEvent.emit(this.sinInconsistenicas)
        
        this.dialogService.show({
          title: 'Sin Inconsistencias',
          text: `No se agregó ninguna inconsistenica a la cédula de respuesta`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      }
    })
  }

  /* predeterminado(){
    this.dataSource.data.forEach(element =>{
      if(element.idEstado == 1078){
        const inconsistencia = element
        this.inconsistenciasSelected.selected.findIndex(e => e.idInconsistencia === inconsistencia.idInconsistencia)

        console.log("determinar el valor",this.inconsistenciasSelected.selected);
        
      }
    })
  } */
}
