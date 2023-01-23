import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';

@Component({
  selector: 'app-bandeja-caso-rechazo-aprobador',
  templateUrl: './bandeja-caso-rechazo-aprobador.component.html',
  styleUrls: ['./bandeja-caso-rechazo-aprobador.component.scss']
})
export class BandejaCasoRechazoAprobadorComponent implements OnInit {

   /*  para mostrar las columnas y los comapos de la tabla 2 de vehiculos */
   displayedColumns2: string[] = ['id', 'nombre', 'nit', 'monto', 'estado', 'acciones'];
   bandejacasos = new MatTableDataSource();
 
   @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
     this.bandejacasos.paginator = mp2;
   }
   
  constructor(
    private dialogo: DialogService,
    private caseService: CasosService,
    private gestorService: GestorService
  ) { }

  ngOnInit(): void {
    let state: Param[] = [{ pStates: '16' }]
    this.caseService.getCasesByStates(state).toPromise().then(res => {
      this.bandejacasos.data = res
    })
  }

 

}
