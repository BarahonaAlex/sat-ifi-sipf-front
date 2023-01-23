import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CasosService } from '../../../general-module/componentes-comunes/servicios/casos.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-cartera-casos',
  templateUrl: './cartera-casos.component.html',
  styleUrls: ['./cartera-casos.component.css']
})
export class CarteraCasosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['nitContribuyente', 'nombreInconsistencia', 'nombreEstadoinsumo', 'idOrigenInsumo', 'nombreInsumo', 'nombreImpuesto','acciones'];
  dataSource = new MatTableDataSource();
  listau: any;
  nit: any;
  nitc: any;
  constructor(private router: Router, private micro: CasosService) {
    this.nit = [
      { nitProfesional: "103106901", nombre: "nit1" },
      { nitProfesional: "12390836", nombre: "nit2" },
      { nitProfesional: "10337962", nombre: "nit3" },
      { nitProfesional: "61352322", nombre: "nit4" },
      { nitProfesional: "12345678", nombre: "nit5" },
      { nitProfesional: "87654321", nombre: "nit6" },
      { nitProfesional: "123456790", nombre: "nit7" },
      { nitProfesional: "13546734", nombre: "nit8" },
      {nitProfesional: "9007565", nombre:"nit9"}
    ];

 /*    this.micro.getProfesional().subscribe(data => {
      this.nit = data;
    }) */

  }
  async Mostrar() {

    this.listau= await this.micro.getCartera(this.nitc).toPromise()
    this.dataSource.data=this.listau
  }
  ngOnInit(): void {
  }

  cargaHallazgos(nitContribuyente: string, idCasos: number, tipoHallazgo: string, processId: string, idAsignacion: number) {
    let nitpro = this.nitc
    this.router.navigate(['programacion/Hallazgos'], { queryParams: { id: nitContribuyente, idCasos, tipoHallazgo, idAsignacion, nitpro, processId } })

  }
  CargadeAlcances(idinsumos: number){
    this.router.navigate(['programacion/elaboracion/alcance/', idinsumos])
  }
}
