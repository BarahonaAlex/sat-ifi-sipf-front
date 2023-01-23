import { ReasignacionCasosComponent } from './../reasignacion-casos.component';
import { UtilidadesService } from './../../../../general-module/componentes-comunes/servicios/utilidades.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/general-module/componentes-comunes/servicios/general.service';
import { anexo2 } from 'src/app/programacion-module/componentes-comunes/clases/Reasignacion-Anexo1.class';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';


@Component({
  selector: 'app-dialog-profesionales',
  templateUrl: './dialog-profesionales.component.html',
  styleUrls: ['./dialog-profesionales.component.css']
})
export class DialogProfesionalesComponent implements OnInit {


  nombre!: any;
  @ViewChild('nit') nit!: ReasignacionCasosComponent;


  constructor(public dialog: MatDialog, private utilidades: UtilidadesService, private generalservice: GeneralService,
    private alert: DialogService) { }

  ngOnInit(): void {
    this.reasigna();
    console.log(this.nit)
  }

  Cancelar(): void {
    this.dialog.closeAll();
    this.utilidades.forcedNavigate(['programacion/reasignacion-casos'])
  }

  Guardar() {
    this.alert.show({
      title: 'Reasignar',
      text: '“Desea reasginar al profecional: xxxx el caso?”',
      icon: 'question',
      showConfirmButton: true
    }).then((result) => {
      if (result == 'primary') {
        this.alert.close
        this.Cancelar();
        this.utilidades.forcedNavigate(['programacion/reasignacion-casos'])
      }
    });
  }


  reasigna() {
   /*  this.generalservice.getData<anexo2[]>(`http://10.123.0.105:8080/grupoTrabjaoReasignacion/123456`).toPromise().then(lista => {
      this.nombre = lista;
      console.log(this.nombre)
    }); */
  }

}
