import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { walletPrograma } from 'src/app/general-module/componentes-comunes/interfaces/ProgramaFiscales.interface';
import { AprobacionPrograma } from '../../../general-module/componentes-comunes/interfaces/Aprobacion-Programa';
import { ProgramasFiscalesService } from '../../../general-module/componentes-comunes/servicios/programas-fiscales.service';

@Component({
  selector: 'app-Cartera-Aprobacion-Programa',
  templateUrl: './Cartera-Aprobacion-Programa.component.html',
  styleUrls: ['./Cartera-Aprobacion-Programa.component.css']
})
export class CarteraAprobacionProgramaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['id','gerencia', 'cantidadCasos','acciones'];
  dataSource = new MatTableDataSource<walletPrograma>();
  listau!:AprobacionPrograma
  constructor(private router: Router,private micro: ProgramasFiscalesService) { 
    this.CargaDatos();
  }

  ngOnInit(){

  }
  async CargaDatos() {
  this.dataSource.data= await this.micro.getCartera().toPromise();
  }
  DetalleCarstera(idGerencia: number){
    this.router.navigate(['programacion/Detalle-Aprobacion-Programa'], { queryParams: { id: idGerencia} })
  }

}
