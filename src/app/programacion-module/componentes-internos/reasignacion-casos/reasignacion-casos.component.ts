import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
//import { ReasignacionCasos } from '../../componentes-comunes/servicios/ReasignacionCasos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Button, Dropdown, FormListener, FormStructure, OptionChild } from 'mat-dynamic-form';
//import {  Profecionales, Reasignacion } from '../../componentes-comunes/interfaces/reasignacionCasos';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';
import { Profecionales, Reasignacion } from 'src/app/general-module/componentes-comunes/interfaces/reasignacion.interface';
import { ReasignacionService } from 'src/app/general-module/componentes-comunes/servicios/reasignacion.service';

@Component({
  selector: 'app-reasignacion-casos',
  templateUrl: './reasignacion-casos.component.html',
  styleUrls: ['./reasignacion-casos.component.css']
})


export class ReasignacionCasosComponent implements OnInit, FormListener {

  mostrar: boolean = true
  @Input('nit') ejemplo!: FormGroup;
  profesionales!: Profecionales[]
  idInsumo!: number
  estructura!: FormStructure

  constructor(private registro: FormBuilder,
    public dialog: DialogService,
    private utilidades: UtilidadesService,
    private reasignacionservice: ReasignacionService) {
    this.ejemplo = this.registro.group({
      Nit: ["", Validators.required],
    })
  }




  ngOnInit(): void {
  }



  displayedColumns: string[] = ['Nombre', 'NIT', 'Estado', 'Origen', 'Acciones'];
  dataSource = new MatTableDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  /**
 * @description Método para traer los insumos que tiene asignado al profecional
 * @author agaruanom (Gabriel Ruano)
 * @since 26/01/2022
 * @param nit  indentificador tributario del colaborador
 */
  buscar(nit: string) {

    this.reasignacionservice.obtenerCasos(nit).subscribe(res => {
      this.dataSource.data = res;
      console.log(res)

      this.reasignacionservice.obtenerProfecional('103106901').subscribe(to => {
        this.profesionales = to
        console.log(to)
      })

    })

  }

  /**
* @description Dialogo que muestra los profecionales asignado al mismo grupo
* @author agaruanom (Gabriel Ruano)
* @since 26/01/2022
* @param nit  indentificador tributario del colaborador
* @param id  identificador de insumo
*/
  openDialog(id: number) {
    this.idInsumo = id
    this.estructura = new FormStructure().apply({
      title: 'Seleccione un Profesional',
      appearance: 'standard',
      globalValidators: Validators.required,
      nodes: [
        new Dropdown('nit', 'Profesional',
          this.profesionales.map(res => new OptionChild(res.nombreprofecional, res.nit))
        ).apply({
          singleLine: true
        })
      ], validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.dialog.show({
      title: 'Reasignación',
      formStructure: this.estructura,
      showConfirmButton: false
    });
  }

  onEvent(id: string, value: any): void {
    console.log('Guardar')

  }

  /**
* @description Metodo que reasigna el insumo a otro profesional
* @author agaruanom (Gabriel Ruano)
* @since 26/01/2022
* @param reasignar  objeto de tipo interface 'Reasignacion'
*/
  onClick(actionId: string): void {
    if (actionId == 'save') {
      console.log(actionId)
      const reasignar: Reasignacion = {
        id: this.idInsumo,
        nit: this.estructura.getValue<Reasignacion>().nit
      }
      this.dialog.close();
      this.reasignacionservice.reasignar(reasignar).subscribe(res => {
        this.utilidades.forcedNavigate(['programacion/reasignacion-casos'])
        console.log(reasignar)
        this.dialog.show({
          icon: 'success',
          title: 'Se actulizo con exito',
          showConfirmButton: true
        })
        
      })

    } else {
      console.log('cancelar')
      this.dialog.close();
    }

  }

}
