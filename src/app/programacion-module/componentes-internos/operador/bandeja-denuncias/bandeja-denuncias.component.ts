import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DenunciaAP, DenunciaNAP, GetDenuncias } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { MatDialog } from '@angular/material/dialog';
import { DetalleBandejaDenunciaComponent } from './detalle-bandeja-denuncia/detalle-bandeja-denuncia.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Overlay } from '@angular/cdk/overlay';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Button, Dropdown, FormStructure } from 'mat-dynamic-form';
import { Input as InputDos } from 'mat-dynamic-form';
import { ApplyRejectedDenunciaComponent } from './apply-rejected-denuncia/apply-rejected-denuncia.component';

@Component({
  selector: 'app-bandeja-denuncias',
  templateUrl: './bandeja-denuncias.component.html',
  styleUrls: ['./bandeja-denuncias.component.scss']
})
export class BandejaDenunciasComponent implements OnInit {
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Decorador que envia el no. Correlativo de una denuncia por el metodo openModal
   */
  @Input('envio') correlativo!: number;
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Asignación de variables para obtener las denuncias de un operador en base a su NIT.
   */
  getComplaints: string[] = ['correlativo', 'nombre', 'producto', 'compra', 'Accion'];
  Complaints = new MatTableDataSource<GetDenuncias>()
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Asignación de variables para obtener las denuncias que NO APLICAN de un operador en base a su NIT.
   */
  getRejectedComplaints: string[] = ['correlativo', 'producto', 'compra', 'Accion'];
  rejectedComplaints = new MatTableDataSource<DenunciaNAP>()
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Asiganción de variables para obtener las denuncias que APLICAN de un operador en base a su NIT.
   */
  getApplyComplaints: string[] = ['correlativo', 'producto', 'compra', 'Accion'];
  applyComplaints = new MatTableDataSource<DenunciaAP>()
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Variable global que almacenara la selección que haga el usuario con el CheckBox.
   */
  selectionComplaints = new SelectionModel<GetDenuncias>(true, []);
  editSelectionComplaints = new SelectionModel<DenunciaAP>(true, []);
  editSelectionComplaintsNAP = new SelectionModel<DenunciaNAP>(true, []);
  date: boolean = false
  complaints = new MatTableDataSource<object>()
  applycomplaints = new MatTableDataSource<object>()
  rejectcomplaints = new MatTableDataSource<object>()
  fecha: string = "2019/03/12"
  fechaFin: string = "2022/10/12"
  complaintsDate!: FormGroup;
  NIT!: string
  estructura!: FormStructure
  editCorrelativo!: string
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.Complaints.paginator = mp1;
  }
  @ViewChild('MatPaginator2') set matPaginator1(mp2: MatPaginator) {
    this.applyComplaints.paginator = mp2;
  }
  @ViewChild('MatPaginator3') set matPaginator2(mp3: MatPaginator) {
    this.rejectedComplaints.paginator = mp3;
  }
  constructor(
    private dialogo: DialogService,
    private services: DenunciasService,
    private router: Router,
    public dialog: MatDialog,
    private overlay: Overlay) {
    this.complaintsDate = new FormGroup({
      fechaInicio: new FormControl(''),
      fechaFin: new FormControl('')
    })
  }
  ngOnInit(): void {
    this.gComplaints()
    //this.rComplaints()
    this.aComplaints()
    this.procesos()
  }



  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que obtiene las denuncias asignadas a un operador en base a su NIT con estado INICIADO
   */

  ///hacer este cambio desde el backend, para que obtenga en nit con el UserLogged (desde el controlador)
  gComplaints() {
    this.services.getComplaints().toPromise().then(res => {
      console.log(res)
      this.Complaints.data = res

    })
  }

  procesos() {
    this.services.getProcessMasive().toPromise().then(res => {
      console.log(res)
    })
  }
    
  getRejectedComplaintsForDate() {
    if (this.date == true) {
      const periodoValue = this.complaintsDate.getRawValue();
    console.log(  periodoValue.fechaInicio);
      this.fecha = moment(periodoValue.fechaInicio).format('YYYY/MM/DD')
      console.log(this.fecha)
      this.fechaFin = moment(periodoValue.fechaFin).format('YYYY/MM/DD')
      console.log(this.fechaFin)
      if( this.fechaFin < this.fecha){
        this.dialogo.show({
          icon: 'warning',
          title: 'Verificar',
          text: "Rango de fecha fin es menor a la de la fecha inicio.",
          disableClose: true,
          showConfirmButton: true
        });
      }else{
        this.services.getRejectedComplaintsForDate(this.fecha, this.fechaFin).toPromise().then(res => {
          console.log(res)
          this.rejectedComplaints.data = res
        })
      }
    }
  }

  /**
 * @author lfvillag (Luis Villagrán)
 * @description Metodo que optiene toda la selección de un check box utilizando la data de Complaints
 * @returns 
 */
  isAllSelectedComplaints() {
    const numSelected = this.selectionComplaints.selected.length;
    const numRows = this.Complaints.data?.length;
    return numSelected === numRows;
  }

  isEditAllSelectedComplaints() {
    const numSelected = this.editSelectionComplaints.selected.length;
    const numRows = this.applyComplaints.data?.length;
    return numSelected === numRows;
  }

  isEditAllSelectedComplaintsNAP() {
    const numSelected = this.editSelectionComplaintsNAP.selected.length;
    const numRows = this.rejectedComplaints.data?.length;
    return numSelected === numRows;
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que hace una selección completa de todos los checbox utilinado la data de Complaints.
   */
  masterToggleComplaints() {
    this.isAllSelectedComplaints()
      ? this.selectionComplaints.clear()
      : this.Complaints.data?.forEach((row) =>
        this.selectionComplaints.select(row)
      );
  }

  masterEditToggleComplaints() {
    this.isEditAllSelectedComplaints()
      ? this.editSelectionComplaints.clear()
      : this.applyComplaints.data?.forEach((row) =>
        this.editSelectionComplaints.select(row)
      );
  }
  masterEditToggleComplaintsNAP() {
    this.isEditAllSelectedComplaints()
      ? this.editSelectionComplaintsNAP.clear()
      : this.rejectedComplaints.data?.forEach((row) =>
        this.editSelectionComplaintsNAP.select(row)
      );
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que obtiene las denuncias que estan en estado NO APLICA
   */ /* este es el que hay que editar y poner la fechas */
  rComplaints() {
    this.date = false
    if (this.date == false) {
      this.services.getRejectedComplaints().toPromise().then(res => {
        console.log(res)
        this.rejectedComplaints.data = res
      })
    }
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que obtiene las denuncias con estado APLICA 
   */
  aComplaints() {
    this.services.getApprovedComplaints().toPromise().then(res => {
      console.log(res)
      this.applyComplaints.data = res
    })
  }
  /**
   * @author lfvillag (Luis Villagrá)
   * @description Metodo que direcciona al componente de Generar Alcance Denuncia.
   */
  openModalScope(/* item: number */) {
    this.router.navigate(['/programacion/elaboracion/alcances/denuncias'/* , item */])
  }

  openModalCabinet() {
    this.router.navigate(['/programacion/cartera/denuncia/gabinete'/* , item */])
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que abrira el modal donde se mostrara los detalles de una denuncia.
   */
  openModal(e: any) {
    console.log(e.correlativo);
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    this.dialog.open(DetalleBandejaDenunciaComponent, {
      width: "auto",
      height: "700px",
      data: e,
      scrollStrategy,
      disableClose: true
    }).afterClosed().toPromise().then(res => {
      
      this.gComplaints();
      this.aComplaints();
      console.log("entro a la promesa de la primera tabla");
    })
  }

  onEvent(id: string, value: any): void {
    if (id == 'programa') {
      console.log(this.estructura.getControlById('programa')?.value)
    }
  }

  onClick(actionId: string): void {
    if (actionId == 'guardarEdit') {
    }

  }

  editarModal(e: any) {
    /*     this.editSelectionComplaints.selected.forEach(Unassign => {
          this.editCorrelativo = Unassign.correlativo
        }) */
    this.dialog.open(ApplyRejectedDenunciaComponent, {
      width: "10000px",
      height: "700px",
      data: e.correlativo,
      disableClose: true
    }).afterClosed().toPromise().then(res => {
      
      this.aComplaints();
      console.log("entro a la promesa");
    })
  }

  editarModalNAP(e: any) {
    /*     console.log(this.editSelectionComplaintsNAP.selected)
        this.editSelectionComplaintsNAP.selected.forEach(Unassign => {
          this.editCorrelativo = Unassign.correlativo
        }) */
    this.dialog.open(ApplyRejectedDenunciaComponent, {
      width: "10000px",
      height: "700px",
      data: e.correlativo,
      disableClose: true
    }).afterClosed().toPromise().then(res => {
      this.aComplaints();
      this.rComplaints();
      console.log("entro a la promesa");
    })
  }
}

