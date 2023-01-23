import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button, Dropdown, FormStructure, OptionChild } from 'mat-dynamic-form';
import { professionals, reAsign } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';

@Component({
  selector: 'app-reasignacion-casos',
  templateUrl: './reasignacion-casos.component.html',
  styleUrls: ['./reasignacion-casos.component.css']
})
export class ReasignacionCasosComponent implements OnInit {

  profecional!: FormGroup;
  professionals!: professionals[]
  estructura!: FormStructure
  idcasos!: number
  nitAntes!: string

  constructor(private registro: FormBuilder,
    public dialog: DialogService,
    private admonColaboradoresService: ColaboradoresService,
    private utilidades: UtilidadesService) {
    this.profecional = this.registro.group({
      Nit: ["", Validators.required],
    })
  }

  ngOnInit(): void {
  }

  /**
   * @description Método para traer los insumos que tiene asignado al profecional
   * @author agaruanom (Gabriel Ruano)
   * @since 26/01/2022
   * @param nit  indentificador tributario del colaborador
   */
  searchCases(nit: string) {
    this.nitAntes = nit
    this.admonColaboradoresService.getCases(nit).subscribe(res => {
      this.dataSource.data = res;
      console.log(res)

      this.admonColaboradoresService.getProfessional('110501624').subscribe(profe => {
        this.professionals = profe
        console.log(profe)
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
    this.idcasos = id
    this.estructura = new FormStructure().apply({
      title: 'Selecione un Profesional',
      appearance: 'standard',
      globalValidators: Validators.required,
      nodes: [
        new Dropdown('nit', 'Profesional',
          this.professionals.map(res => new OptionChild(res.nombres, res.nit))
        ).apply({
          singleLine: true
        })
      ], validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn',
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
      title: 'Reasignacion',
      formStructure: this.estructura,
      showConfirmButton: false
    });
  }

  onEvent(id: string, value: any): void {
    console.log('Guardar')
  }

  /**
  * @description Método para reasignar el caso a otro colaborador
  * @author agaruanom (Gabriel Ruano)
  * @since 26/01/2022
  * @param nit  indentificador tributario del colaborador
  */
  onClick(actionId: string): void {
    if (actionId == 'save') {
      console.log(actionId)
      const reassign: reAsign = {
        nit: this.estructura.getValue<reAsign>().nit,
        nitAnterior: this.nitAntes
      }
      this.dialog.close();
      console.log(reassign)
      this.admonColaboradoresService.reassignCase(this.idcasos, reassign).subscribe(res => {
        console.log(reassign)
        console.log(res)
        console.log(this.nitAntes)
        this.dialog.show({
          icon: 'success',
          title: 'Se reasigno con exito',
          showConfirmButton: true
        })
        this.searchCases(this.nitAntes);
      })
    } else {
      this.dialog.close();
    }

  }

  /* hace referencia a la columnas de la tabla  */
  displayedColumns: string[] = ['Nombre', 'NIT', 'Estado', 'Origen', 'Acciones'];
  dataSource = new MatTableDataSource;

  /*  para el paginador de la tabla */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
