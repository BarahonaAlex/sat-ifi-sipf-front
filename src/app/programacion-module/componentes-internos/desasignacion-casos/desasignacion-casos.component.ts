import { SupervisorService } from './../../componentes-comunes/servicios/supervisor.service';
import { GeneralService } from './../../../general-module/componentes-comunes/servicios/general.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogoListProfesionalesComponent } from './dialogo-list-profesionales/dialogo-list-profesionales.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Supervisor } from '../../componentes-comunes/interfaces/Supervisor';



@Component({
  selector: 'app-desasignacion-casos',
  templateUrl: './desasignacion-casos.component.html',
  styleUrls: ['./desasignacion-casos.component.css']
})
export class DesasignacionCasosComponent implements OnInit {

  supervisores!: Supervisor[];
  supervisoresDataSource = new MatTableDataSource(this.supervisores);
  public displayedColumns = ['Nombre','Nit', 'Estado', 'boton'];


  constructor(private dialog: MatDialog,  private generalService: GeneralService) {
  }

  ngOnInit(): void {
    this.generalService.getData<Supervisor[]>(environment.API_IFI_SIPF, ['obtenerInformacionCasos', '123456'])
      .toPromise().then(supervisores => {

        this.supervisores = supervisores;
        this.supervisoresDataSource.data = this.supervisores;
        console.log(this.supervisores);

      }).catch(error => {
        console.log(error);
        this.supervisores = [];
      })
  }


  verDetalle() {
    console.log()
    const abrirDialogo = this.dialog.open(DialogoListProfesionalesComponent, {
      height: '600px',
      width: '1000px',
      disableClose: true,
      // data: {    datos:item.idSolicitud, }
    })

    abrirDialogo.afterClosed().subscribe(result => {

      abrirDialogo.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

    });
  }


  /*  getSupervisores(){
  
    return this.servicio.supervisores ?? [];
    
  } */

}
