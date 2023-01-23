import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { stringify } from 'querystring';
import { CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { PresenciasFiscales } from 'src/app/general-module/componentes-comunes/interfaces/presencias-fiscales';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';

@Component({
  selector: 'app-bandeja-presencias',
  templateUrl: './bandeja-presencias.component.html',
  styleUrls: ['./bandeja-presencias.component.scss']
})
export class BandejaPresenciasComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['idFormulario', 'lugarDepartamental', 'meta', 'estado', 'fechaInicio', 'acciones'];
  dataSource = new MatTableDataSource<PresenciasFiscales>();
  constructor(private micro: PresenciasFiscalesService,
    private router: Router) {

  }

  ngOnInit() {
    this.cargarDatos();
  } 
  cargarDatos() {
    this.micro.getPresences().toPromise().then((data) => {
      console.log(data);
      this.dataSource.data = data;
      this.dataSource.data.forEach((element) => {
        element.lugarDepartamental = this.convertirString(element.lugarDepartamental);
      })
    })
  }
  convertirString(datos: string): string {
    let data: [{ departamento: string, municipio: string }] = JSON.parse(datos);
    let cadena: [{ departamento: string, municipio: string[] }] = [{ departamento: "", municipio: [] }];
    let texto = "";
    data.forEach((element) => {
      let index = cadena.findIndex((item) => item.departamento == element.departamento);
      if (index == -1) {
        let muni=""
          data.filter((e) => e.departamento == element.departamento).forEach((e) => {
            muni+=e.municipio+", "
          })

          cadena.push({departamento: element.departamento, municipio : [muni]});
      } else {
        if (data.filter((e) => e.departamento == element.departamento) && element.departamento != cadena[index].departamento) {
        
          cadena[index].departamento = element.departamento;
          data.filter((e) => e.departamento == element.departamento).forEach((e) => {
            cadena[index].municipio.push(e.municipio);
          })
        }
      } 
    });
    
    cadena.splice(0, 1);  
    cadena.forEach((element) => {
      texto +=element.departamento + ":" + element.municipio+"  ";
    });
    return texto
  }
  showAnalityc(idCaso: number) {
    this.router.navigate(['programacion/alcances/masivos/', idCaso]);
  }
  getColor(idEstado: number): string {
    let vColor = ""
    switch (idEstado) {
      case 181:
        vColor = 'red'
        break
     
      default:
        vColor = 'black'
    }
    return vColor
  }
}
