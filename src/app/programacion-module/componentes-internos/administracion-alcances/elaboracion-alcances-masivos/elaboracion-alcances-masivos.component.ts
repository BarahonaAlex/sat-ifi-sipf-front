import { MassiveVersionIdInterface, GetMassiveScopeVersionInterface, GetMassiveScopeInterface, DeleteMassiveCaseInterface, CreateAndModifyMassiveCaseInterface } from './../../../../general-module/componentes-comunes/interfaces/AlcancesInterface';
import { map } from 'rxjs/operators';
import { AlcancesService } from './../../../../general-module/componentes-comunes/servicios/alcances.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormStructure, Dropdown, FormListener, OptionChild, Button, Input, DatePicker } from 'mat-dynamic-form';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-elaboracion-alcances-masivos',
  templateUrl: './elaboracion-alcances-masivos.component.html',
  styleUrls: ['./elaboracion-alcances-masivos.component.scss']
})
export class ElaboracionAlcancesMasivosComponent implements OnInit, FormListener {
  displayedColumns: string[] = ['idCaso', 'objetivo', 'nombrePrograma', 'periodoInicio', 'solicitudCambiosSup', 'solicitudCambiosJefe', 'nombreEstado', 'accion'];
  dataSource = new MatTableDataSource();
  formStructure!: FormStructure;
  idCaso!: number;
  nombreGerencia!: string;
  scopeVersion!: GetMassiveScopeVersionInterface[];
  scopes!: GetMassiveScopeInterface[];
  nombreColaborador!: string;
  correoColaborador!: string;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private alcancesService: AlcancesService, private dialog: DialogService) {
    this.alcancesService.getScopeMassive().subscribe(data => {
      this.scopes = data
      this.formStructure = new FormStructure();
      this.formStructure.globalValidators = Validators.required;
      this.formStructure.title = 'Asignar Alcance Masivo'
      this.formStructure.nodes = [
        new Dropdown('alcances', 'Alcances Masivos', data.map(
          (alcances: any) =>
            new OptionChild(alcances.nombreAlcanceMasivo,JSON.stringify(alcances))
        )).apply({
          action: { callback: this, type: 'change' },
          singleLine: true
        }),
        new Dropdown('versiones', 'Version').apply({
          action: { callback: this, type: 'change' },
          singleLine: true,
          disabled: true
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
        new Input('procedimientos especificos', 'procedimientos especificos').apply({
          disabled: true
        }),
        new Dropdown('programas', 'Programas Fiscales').apply({
          action: { callback: this, type: 'change' },
          singleLine: true
        }),
        new DatePicker('periodoInicio', 'Fecha inicial del plazo').apply({
          disabled: true
        }),
        new DatePicker('periodoFin', 'Fecha final del plazo').apply({
          disabled: true
        }),
        new Input('territorio', 'territorio').apply({
          disabled: true,
          singleLine: true
        })
      ]
      this.formStructure.validateActions = [
        new Button('guardar', 'Guardar', { callback: this, style: 'primary' }).apply({
          icon: 'save',
          validateForm: true
        }),
        new Button('cancelar', 'cancelar', { callback: this, style: 'warn' }).apply({
          icon: 'cancel'
        }),
      ]
    })

  }

  ngOnInit(): void {
    this.alcancesService.getCaseMassive().subscribe(res => {
      this.dataSource.data = res
    })

  }

  setVersionDetails() {
    this.scopeVersion?.forEach((data: any) => {
      if (data.id.version == this.formStructure.getControlById('versiones')?.value) {
        this.formStructure.getControlById('actividad')?.setValue(data.actividad);
        this.formStructure.getControlById('justificacion')?.setValue(data.justificacion);
        this.formStructure.getControlById('objetivo')?.setValue(data.objetivo);
        this.formStructure.getControlById('procedimientos especificos')?.setValue(data.procedimientosEspecificos);
      }
    })
  }

  onEvent(id: string, value: any): void {
    if (id == 'alcances') {
      const alcances = JSON.parse(this.formStructure.getControlById('alcances')?.value)
      this.alcancesService.getScopeVersionMassive(alcances.idAlcanceMasivo).toPromise().then(data => {
        this.scopeVersion = data;
        this.formStructure.getNodeById('versiones').value = data.map(
          (versiones: any) =>
            new OptionChild(versiones.id.version, versiones.id.version)
        )

        this.setVersionDetails();
        this.formStructure.getControlById('versiones')?.enable()
      })
    }

    if (id == 'versiones') {
      this.setVersionDetails()
    }

    if (id == 'programas') {
      this.formStructure.getControlById('periodoInicio')?.enable();
      this.formStructure.getControlById('periodoFin')?.enable();
      this.formStructure.getControlById('territorio')?.enable();
    }

  }
  onClick(actionId: string): void {
    if (actionId == 'cancelar') {
      this.dialog.closeAll();
    }

    if (actionId == 'guardar') {
      this.dialog.show({
        title: 'Confirmacion',
        text: "¿Está seguro que desea asignar el alcance?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'primary',
        cancelButtonColor: 'warn',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        disableClose: true
      }).then((result) => {
        if (result == 'primary') {
            const alcances = JSON.parse(this.formStructure.getControlById('alcances')?.value)
            const save: CreateAndModifyMassiveCaseInterface = {
            idCaso: this.idCaso,
            idEstado: 1,
            idPrograma: this.formStructure.getControlById('programas')?.value,
            idTipoAlcance: alcances.idAlcanceMasivo,
            idVersionAlcance: this.formStructure.getControlById('versiones')?.value,
            periodoRevisionFin: this.formStructure.getControlById('periodoFin')?.value,
            periodoRevisionInicio: this.formStructure.getControlById('periodoInicio')?.value,
            territorioMasivo: this.formStructure.getControlById('territorio')?.value,
            nombrePrograma: 'prueba',
            nombreAlcance: alcances.nombreAlcanceMasivo,
            nombreGerencia: this.nombreGerencia,
            nombreColaborador: this.nombreColaborador,
            correoColaborador: this.correoColaborador
          }

          this.alcancesService.createAndModifyMassiveScopeToCase(1, save).subscribe(res => {
            this.dialog.show({
              title: 'Asignacion',
              text: 'La asignacion del alcance masivo, ha sido almacenada exitosamente',
              icon: 'info',
            }).then( (result) => {
              if(result == 'primary'){
                this.alcancesService.getCaseMassive().subscribe(res => {
                  this.dataSource.data = res
                })
                this.dialog.closeAll();
              }
            })
          })
        }
      })
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async assign(data: any) {
    await this.alcancesService.getPrograms(107, 40/* data.idGerencia */, 84).toPromise().then(res => {
      this.formStructure.getNodeById('programas').value = res.map(
        (programas: any) =>
          new OptionChild(programas.nombre, programas.idPrograma)
      )
    })
    this.idCaso = data.idCaso
    this.nombreGerencia = data.nombreGerencia
    this.nombreColaborador = data.nombreColaborador
    this.correoColaborador = data.correoColaborador
    this.dialog.show({
      showConfirmButton: false,
      formStructure: this.formStructure,
      disableClose: true,
    })
  }

  async modify(data: any) {
    this.idCaso = data.idCaso
    this.nombreGerencia = data.nombreGerencia
    await this.alcancesService.getPrograms(107, 40/* data.idGerencia */, 84).toPromise().then(res => {
      this.formStructure.getNodeById('programas').value = res.map(
        (programas: any) =>
          new OptionChild(programas.nombre, programas.idPrograma)
      )
    })
    this.formStructure.title = 'Modificar Alcance'
    this.dialog.show({
      showConfirmButton: false,
      formStructure: this.formStructure,
      disableClose: true,
    })

    setTimeout(() => {
      this.scopes.forEach( element => {
        if(element.idAlcanceMasivo == data.idAlcance){
          this.formStructure.getControlById('alcances')?.setValue(JSON.stringify(element))
        }
      })
      this.formStructure.getControlById('versiones')?.setValue(data.idVersion);
      this.formStructure.getControlById('programas')?.setValue(data.idPrograma);
      this.formStructure.getControlById('periodoInicio')?.setValue(data.periodoInicio);
      this.formStructure.getControlById('periodoFin')?.setValue(data.periodoFin);
      this.formStructure.getControlById('territorio')?.setValue(data.territorio);
    });
  }

  delete(data: any) {
    this.dialog.show({
      title: 'Eliminar Alcance Masivo',
      text: "La asignación será borrada, ¿Desea continuar?",
      icon: 'error',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'warn',
      closeButtonColor: 'warn',
      confirmButtonText: 'Si, eliminar',
      disableClose: true
    }).then((result) => {
      if (result == 'primary') {
        const deleteData: DeleteMassiveCaseInterface = {
          fechaModifica: moment().format('YYYY-MM-DD'),
          idCaso: data.idCaso,
          ipModifica: '190.180.1.2',
          usuarioModifica: 'asatesting',
        }
        this.alcancesService.DeleteMassiveScopeToCase(2, deleteData).subscribe(
          res => {
            this.dialog.showSnackBar({
              title: 'Eliminacion',
              text: 'La asignacion del alcance masivo, ha sido elimanda exitosamente',
              icon: 'info',
              duration: 3000
            })
            this.alcancesService.getCaseMassive().subscribe(res => {
              this.dataSource.data = res
            })
          }
        )
      }
    })
  }

}
