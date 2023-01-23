import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Button, Dropdown, FormListener, FormStructure, Input, OptionChild } from 'mat-dynamic-form';
import * as moment from 'moment';
import { CreateMassiveScopeInterface, ModifyMassiveScopeInterface } from 'src/app/general-module/componentes-comunes/interfaces/AlcancesInterface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-gestion-alcances-masivos',
  templateUrl: './gestion-alcances-masivos.component.html',
  styleUrls: ['./gestion-alcances-masivos.component.css']
})
export class GestionAlcancesMasivosComponent implements OnInit, FormListener {
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones']
  dataSource = new MatTableDataSource();
  getVersions!: any[];
  formStructure!: FormStructure;
  status!: any;
  idMassiveScope!: number;
  constructor(private alcancesService: AlcancesService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.getMassiveScope()
  }

  getMassiveScope() {
    this.alcancesService.getScopeMassive().subscribe(res => {
      this.dataSource.data = res;
      console.log(this.dataSource.data)
    })
  }

  onEvent(id: string, value: any): void {
    if (id == 'versiones') {
      this.getVersions.forEach((data: any) => {
        if (data.id.version == this.formStructure.getControlById('versiones')?.value) {
          this.status = data.idEstado;
          this.formStructure.getControlById('actividad')?.setValue(data.actividad);
          this.formStructure.getControlById('justificacion')?.setValue(data.justificacion);
          this.formStructure.getControlById('objetivo')?.setValue(data.objetivo);
          this.formStructure.getControlById('procedimientosEspecificos')?.setValue(data.procedimientosEspecificos);
        }
      })
    }

    if (id == 'nombreAlcance') {
      this.formStructure.getControlById('descripcionAlcance')?.enable();
    }

    if (id == 'descripcionAlcance') {
      this.formStructure.getControlById('actividad')?.enable();
      this.formStructure.getControlById('justificacion')?.enable();
      this.formStructure.getControlById('objetivo')?.enable();
      this.formStructure.getControlById('procedimientosEspecificos')?.enable();
    }
  }
  onClick(actionId: string): void {
    if (actionId == 'back') {
      this.dialog.closeAll();
    }

    if (actionId == 'cancelar') {
      this.dialog.closeAll();
    }

    if (actionId == 'saveScope') {
      const newScope: CreateMassiveScopeInterface = {
        actividad: this.formStructure.getControlById('actividad')?.value,
        descripcionAlcance: this.formStructure.getControlById('descripcionAlcance')?.value,
        justificacion: this.formStructure.getControlById('justificacion')?.value,
        nombreAlcance: this.formStructure.getControlById('nombreAlcance')?.value,
        objetivo: this.formStructure.getControlById('objetivo')?.value,
        procedimientosEspecificos: this.formStructure.getControlById('procedimientosEspecificos')?.value,
      }
      this.dialog.show({
        title: 'Confirmacion',
          text: "¿Está seguro que desea agregar el alcance: " + this.formStructure.getControlById('nombreAlcance')?.value + " ?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'primary',
          cancelButtonColor: 'warn',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          disableClose: true
      }).then( (result) => {
        if(result == 'primary'){
          this.alcancesService.createMassiveScope(newScope).subscribe(res => {
            console.log(res)
            this.dialog.show({
              title: 'Alcance',
              text: "Se ha almacenado el alcance: " + this.formStructure.getControlById('nombreAlcance')?.value +" con la version No. "+ res.id.version,
              icon: 'success',
              showConfirmButton: true
            }).then((result) => {
              this.getMassiveScope()
              this.dialog.closeAll()
            })
          });
        }
      })
    }

    if (actionId == 'modificar') {
      this.formStructure.getControlById('actividad')?.enable();
      this.formStructure.getControlById('justificacion')?.enable();
      this.formStructure.getControlById('objetivo')?.enable();
      this.formStructure.getControlById('procedimientosEspecificos')?.enable();
      this.formStructure.validateActions = [
        new Button('save', 'Guardar', { callback: this, style: 'primary' }).apply({
          icon: 'save',
          validateForm: true
        }),
        new Button('cancelar', 'cancelar', { callback: this, style: 'warn' }).apply({
          icon: 'cancel'
        }),
      ]
    }

    if (actionId == 'save') {
      const newVersion: ModifyMassiveScopeInterface = {
        actividad: this.formStructure.getControlById('actividad')?.value,
        idEstado: 1,
        idTipoAlcanceMasivo: this.idMassiveScope,
        justificacion: this.formStructure.getControlById('justificacion')?.value,
        objetivo: this.formStructure.getControlById('objetivo')?.value,
        procedimientosEspecificos: this.formStructure.getControlById('procedimientosEspecificos')?.value,
        version: 1,
      }
      this.alcancesService.modifyMassiveScope(newVersion).subscribe(res => {
        this.dialog.show({
          title: 'Alcance',
          text: "Se ha almacenado el alcance con la versión No. " + res.id.version,
          icon: 'success',
          showConfirmButton: true
        }).then((result) => {
          this.getMassiveScope()
          this.dialog.closeAll()
        })
      })

    }

    if (actionId == 'cambioEstado') {
      console.log(this.status)
      if (this.status == 1) {
        this.dialog.show({
          title: 'Confirmacion',
          text: "¿Está seguro de cambiar del estado activo al estado inactivo?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'primary',
          cancelButtonColor: 'warn',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          disableClose: true
        }).then(
          (result) => {
            if (result == 'primary') {
              try {
                this.alcancesService.modifyMassiveScopeStatus(this.idMassiveScope, this.formStructure.getControlById('versiones')?.value).subscribe(
                  res => {
                    this.dialog.show({
                      title: 'Estado',
                      text: "El estado ha sido modificado exitosamente",
                      icon: 'success',
                      showConfirmButton: true
                    }).then((result) => {
                      if (result == 'primary') {
                        this.getMassiveScope()
                        this.dialog.closeAll()
                      }
                    })
                  }
                )
              }
              catch (error) {
                console.log(error)
              }
            }
          }
        )
      }
      if (this.status == 2) {
        this.dialog.show({
          title: 'Confirmacion',
          text: "¿Está seguro de cambiar del estado inactivo al estado activo?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'primary',
          cancelButtonColor: 'warn',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          disableClose: true
        }).then(
          (result) => {
            if (result == 'primary') {
              try {
                this.alcancesService.modifyMassiveScopeStatus(this.idMassiveScope, this.formStructure.getControlById('versiones')?.value).subscribe(
                  res => {
                    this.dialog.show({
                      title: 'Estado',
                      text: "El estado ha sido modificado exitosamente",
                      icon: 'success',
                      showConfirmButton: true
                    }).then((result) => {
                      if (result == 'primary') {
                        this.getMassiveScope()
                        this.dialog.closeAll()
                      }
                    })
                  }
                )
              }
              catch (error) {
                console.log(error)
              }
            }
          }
        )
      }
    }
  }

  verDetalle(data: any) {
    this.alcancesService.getScopeVersionMassive(data).subscribe(res => {
      this.idMassiveScope = data;
      this.getVersions = res;
      this.formStructure = new FormStructure()
      this.formStructure.globalValidators = Validators.required;
      this.formStructure.title = 'Ver Detalle';
      this.formStructure.appearance = 'standard';
      this.formStructure.nodes = [
        new Dropdown('versiones', 'Versiones del Alcance', res.map(
          (Versiones: any) =>
            new OptionChild(Versiones.id.version, Versiones.id.version)
        )).apply({
          action: { callback: this, type: 'change' },
          singleLine: true
        }),
        new Input('actividad', 'actividad').apply({
          disabled: true
        }),
        new Input('justificacion', 'justificacion').apply({
          disabled: true
        }),
        new Input('objetivo', 'objetivo').apply({
          disabled: true
        }),
        new Input('procedimientosEspecificos', 'procedimientos especificos').apply({
          disabled: true
        }),
      ]
      this.formStructure.validateActions = [
        new Button('cambioEstado', 'Habilitar/Deshabilitar', { callback: this, style: 'primary' }).apply({
          icon: 'mode_edit',
          validateForm: true
        }),
        new Button('modificar', 'Modificar', { callback: this, style: 'primary' }).apply({
          icon: 'mode',
          validateForm: true
        }),
        new Button('back', 'Regresar', { callback: this, style: 'primary' }).apply({
          icon: 'arrow_back'
        }),
      ]
      this.dialog.show({
        showConfirmButton: false,
        formStructure: this.formStructure
      })
    })
  }

  newScope() {
    this.formStructure = new FormStructure()
    this.formStructure.globalValidators = Validators.required;
    this.formStructure.title = 'Nuevo Alcance';
    this.formStructure.nodes = [
      new Input('nombreAlcance', 'nombre del alcance').apply({
        action: { callback: this, type: 'change' },
      }),
      new Input('descripcionAlcance', 'descripcion del alcance').apply({
        action: { callback: this, type: 'change' },
        disabled: true,
      }),
      new Input('actividad', 'actividad').apply({
        disabled: true
      }),
      new Input('justificacion', 'justificacion').apply({
        disabled: true
      }),
      new Input('objetivo', 'objetivo').apply({
        disabled: true
      }),
      new Input('procedimientosEspecificos', 'procedimientos especificos').apply({
        disabled: true
      }),
    ]
    this.formStructure.validateActions = [
      new Button('saveScope', 'Guardar', { callback: this, style: 'primary' }).apply({
        icon: 'save',
        validateForm: true
      }),
      new Button('cancelar', 'cancelar', { callback: this, style: 'warn' }).apply({
        icon: 'cancel'
      }),
    ]

    this.dialog.show({
      showConfirmButton: false,
      formStructure: this.formStructure
    })
  }

}
