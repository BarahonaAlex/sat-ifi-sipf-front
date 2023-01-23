import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CabinetComplaints, GetDenuncias } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { AlcanceDenunciaComponent } from '../../../administracion-alcances/administracion-alcance/alcance-denuncia/alcance-denuncia.component';
import { AlcanceGabineteComponent } from '../../../administracion-alcances/administracion-alcance/alcance-gabinete/alcance-gabinete.component';
import { ApplyRejectedDenunciaComponent } from '../apply-rejected-denuncia/apply-rejected-denuncia.component';
@Component({
  selector: 'app-denuncias-gabinete',
  templateUrl: './denuncias-gabinete.component.html',
  styleUrls: ['./denuncias-gabinete.component.css']
})
export class DenunciasGabineteComponent implements OnInit {
  getComplaints: string[] = ['correlativo', 'nitDenunciado', 'nitDenunciante', 'nombreDenunciado', 'accion'];
  Complaints = new MatTableDataSource<CabinetComplaints>()
  selectionComplaints = new SelectionModel<CabinetComplaints>(true, []);
  editCorrelativo: any;
  constructor(private router: Router, private services: DenunciasService, public dialog: MatDialog) { }
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.Complaints.paginator = mp1;
  }
  ngOnInit(): void {
    this.getCabinetComplaint()
  }

  openModalScope(/* item: number */) {
    this.router.navigate(['/programacion/elaboracion/alcances/denuncias'/* , item */])
  }

  openModalCabinet() {
    this.router.navigate(['/programacion/cartera/denuncia/gabinete'/* , item */])
  }

  openModalComplaint() {
    this.router.navigate(['/programacion/cartera/alcance/denuncias'/* , item */])
  }

  getCabinetComplaint() {
    this.services.getCabinetComplains().toPromise().then(res => {
      console.log(res);
      
      this.Complaints.data = res
    })
  }

  editarModal() {
/*     this.selectionComplaints.selected.forEach(Unassign => {
      this.editCorrelativo = Unassign.correlativo
    })
    this.dialog.open(ApplyRejectedDenunciaComponent, {
      width: "10000px",
      height: "700px",
      data: this.editCorrelativo,
      disableClose: false
    }) */
  }
  masterToggleComplaints() {
    this.isAllSelectedComplaints()
      ? this.selectionComplaints.clear()
      : this.Complaints.data?.forEach((row) =>
        this.selectionComplaints.select(row)
      );
  }   

  abrirAlcance() {
    this.router.navigate(['/programacion/operador/alcance/gabinete'/* , item */])
  }
  isAllSelectedComplaints() {
    const numSelected = this.selectionComplaints.selected.length;
    const numRows = this.Complaints.data?.length;
    return numSelected === numRows;
  }

  showAnalitycs(correlativo: string) {
    this.router.navigate([`/programacion/denuncias/bandeja/gabinete/consultas/${correlativo}`])
  }
}
