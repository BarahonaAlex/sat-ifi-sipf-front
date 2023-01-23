import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tablePeque } from 'src/app/general-module/componentes-comunes/interfaces/Contribuyente';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';


@Component({
  selector: 'app-consulta-vehiculo',
  templateUrl: './consulta-vehiculo.component.html',
  styleUrls: ['./consulta-vehiculo.component.scss']
})

export class ConsultaVehiculoComponent implements OnInit {

  @Input('nit') nit!: string;//VARIABLE NIT QUE SE RECIBE DEL COMPONENTE PADRE
  arraylist: tablePeque[] = [];
  hpTotal!: number;
  apTotal!: number;
  total!: number;


  /* Para mostrar las columnas y los campos de la tabla 1 de vehiculos */
  displayedColumns1: string[] = ['anio', 'hp', 'pa', 'total'];
  resumenAutomovil = new MatTableDataSource();

  /*  para mostrar las columnas y los comapos de la tabla 2 de vehiculos */
  displayedColumns2: string[] = ['nit', 'pa', 'anio', 'nombre', 'prefijoPA', 'placa', 'descripcion', 'estatus', 'exento', 'fechaTraspaso', 'modelo', 'marca',
    'color', 'combustible', 'poliza', 'fechaPoliza', 'motor', 'chasis'];
  resumenAutomovilCompleto = new MatTableDataSource();

  constructor(
    private contribuyenteService: ContribuyenteService
  ) { }


  ngOnInit() {
    this.vehicle(this.nit);
    this.resumenAutomovilCompleto.filterPredicate = (data: any, filter: string) => {
      return data.anio == filter;
    };
  }

  //2141736

  /**
     * @description Método para consulta de vehiculo en base a un nit
     * @author agaruanom (Gabriel Ruano)
     * @since 02/07/2022
     * @param nit indentificador tributario del colaborador
     */
  vehicle(nit: string) {
    this.contribuyenteService.getVehiclesConsultation(nit).toPromise().then(res => {
      this.resumenAutomovilCompleto.data = res;
      new Set(res.map(t => t.anio)).forEach(anio => {
        // res.filter(g =>  g.ultimo_propietario == 'PA' && g.anio == anio).length
        this.arraylist.push({
          anio: anio,
          pa: res.filter(g => g.ultimo_propietario.match("PA") && g.anio === anio).length,
          hp: res.filter(g => g.ultimo_propietario.match("HP") && g.anio === anio).length,
          total: res.filter(g => g.ultimo_propietario && g.anio === anio).length
        })
      })
      this.apTotal = res.filter(g => g.ultimo_propietario.match("PA")).length
      this.hpTotal = res.filter(g => g.ultimo_propietario.match("HP")).length
      this.total = res.filter(g => g.ultimo_propietario).length
      this.resumenAutomovil.data = this.arraylist;
    })
  }

  /* Paginador para la tabla de  vehiculos */
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.resumenAutomovilCompleto.paginator = mp1;
  }

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.resumenAutomovil.paginator = mp2;
  }

  /*Filtro de años para la tabla de resumen de vehiculos completo*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.resumenAutomovilCompleto.filter = filterValue.trim().toLowerCase();
  }

}
