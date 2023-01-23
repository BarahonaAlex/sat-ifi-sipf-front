import { GeneralService } from './../../../../general-module/componentes-comunes/servicios/general.service';
import { UtilidadesService } from './../../../../general-module/componentes-comunes/servicios/utilidades.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: number;
  position: number;
  weight:string;
  symbol: string;
  date: string;
  cantidad:number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name:91223465, weight:'Raúl Ulizar', symbol: 'He', date:'21/12/2021', cantidad:2 },
  {position: 2, name:53423124, weight:'Gabrie Ruano', symbol: 'He',  date:'15/12/2021', cantidad:1},
  {position: 3, name:67546345, weight:'Jamier Batz', symbol: 'Li', date:'16/12/2021', cantidad:3},
  {position: 4, name:89097688, weight:'Sergio Cano', symbol: 'Li', date:'17/12/2021', cantidad:1},
  {position: 5, name:77663004, weight:'Luis Sipaque', symbol: 'Li', date:'18/12/2021', cantidad:1},

];

@Component({
  selector: 'app-dialogo-list-profesionales',
  templateUrl: './dialogo-list-profesionales.component.html',
  styleUrls: ['./dialogo-list-profesionales.component.css']
})
export class DialogoListProfesionalesComponent implements OnInit {

  constructor( private utilidades: UtilidadesService,
    public dialogRef: MatDialogRef<DialogoListProfesionalesComponent>,
    private generalservice: GeneralService
  ) { }

  ngOnInit(): void {
  }

  
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol','date','cantidad', 'boton'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  cancelar() {
    this.dialogRef.close();
    this.utilidades.forcedNavigate(['programacion/desasignacion-casos'])
  }



}
