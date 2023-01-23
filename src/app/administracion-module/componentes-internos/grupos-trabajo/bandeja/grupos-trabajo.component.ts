import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EquipoTrabajo, EquipoTrabajoRespuesta, EquipoTrabajoRespuestaDetalle } from 'src/app/general-module/componentes-comunes/interfaces/equipo-trabajo.class';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { EquipoTrabajoService } from 'src/app/general-module/componentes-comunes/servicios/equipo-trabajo.service';

@Component({
  selector: 'app-grupos-trabajo',
  templateUrl: './grupos-trabajo.component.html',
  styleUrls: ['./grupos-trabajo.component.scss']
})
export class GruposTrabajoComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  @ViewChild('deleted') deleted!: MatCheckbox

  columns = ['id', 'nombre', 'unidadAdministrativa', 'superiorInmediato', 'integrantes', 'acciones'];
  dataSource = new MatTableDataSource<EquipoTrabajoRespuesta>();
  viewing = true;
  group?: EquipoTrabajoRespuestaDetalle;

  constructor(
    private teamworkService: EquipoTrabajoService,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.getTeamworks();
  }

  createTeam() {
    this.viewing = false;
  }

  updateTeam(id: number) {
    this.teamworkService.getWorkGroup(id).toPromise().then(data => {
      this.group = data;
      this.viewing = false;
    });
  }

  searchFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  deleteTeam(item: EquipoTrabajoRespuesta) {

    if(item.casosActivos>0){
      this.dialog.showSnackBar({
        title: 'IFI-200',
        text: `Los operadores tienen casos asignados,no se puede eliminar el grupo, favor validar.`,
        icon: 'warning',
        duration: 3000
      })
      return;
    }
    
    this.dialog.show({
      icon: 'question',
      title: 'Confirmación',
      text: '¿Está seguro de eliminar el grupo de trabajo?',
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: 'warn',
      cancelButtonColor: 'primary',
      cancelButtonText: 'No, cancelar',
      showCancelButton: true,
    }).then(result => {
      if (result == 'primary') {
        this.teamworkService.deleteWorkGroup(item.id).toPromise().then(_ => {
          this.getTeamworks(this.deleted.checked);
          this.dialog.show({
            icon: 'success',
            title: 'IFI-200',
            text: 'Grupo de trabajo eliminado con éxito',
          })
        });
      }
    });
  }

  getTeamworks(includeDeleted: boolean = false) {
    this.teamworkService.getWorkGroups(includeDeleted).toPromise().then(data => {
      this.dataSource.data = data;
      console.log(data);
      
    });
  }

  cancel() {
    this.dataSource.data = [];
    this.viewing = true;
    this.group = undefined;
    this.ngOnInit();
  }

  save(group: EquipoTrabajo) {



    this.teamworkService.createWorkGroup(group).toPromise().then(_ => {
      this.dialog.show({
        icon: 'success',
        title: 'IFI-200',
        text: 'Grupo de trabajo creado con éxito',
      })
      this.getTeamworks();
      this.viewing = true;
    });
  }

  update(group: EquipoTrabajo) {


    this.teamworkService.updateWorkGroup(this.group!.equipoTrabajo.id, group).toPromise().then(_ => {
      this.dialog.show({
        icon: 'success',
        title: 'IFI-200',
        text: 'Grupo de trabajo actualizado con éxito',
      })
      this.getTeamworks();
      this.viewing = true;
    });
  }
}
