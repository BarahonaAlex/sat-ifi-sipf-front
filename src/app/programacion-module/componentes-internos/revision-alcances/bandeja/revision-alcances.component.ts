import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-revision-cases',
  templateUrl: './revision-alcances.component.html',
  styleUrls: ['./revision-alcances.component.scss']
})
export class RevisionAlcancesComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns!: string[];
  dataSource = new MatTableDataSource<CaseList>();

  type!: string;
  loaded: boolean = false;
  authorized: boolean = false;
  cases!: CaseList[];

  constructor(
    private router: Router,
    private casesService: CasosService,
    private route: ActivatedRoute,
    private dialog: DialogService
  ) {
    this.route.paramMap.subscribe(data => {
      const type = data.get('type') ?? '';
      if (!['alcances', 'hallazgos'].includes(type)) {
        this.dialog.show({
          icon: 'error',
          title: 'IFI-404',
          text: 'Ruta ingresada no encontrada',
          disableClose: true,
          confirmButtonText: 'Regresar'
        }).then(() => {
          this.router.navigate(['/programacion']);
        });
      } else {
        if (type == 'alcances') {
          this.columns = ['id', 'colaborador', 'nit', 'contribuyente', 'noPrograma', 'acciones']
        } else if ('hallazgos') {
          this.columns = ['id', 'profesional', 'insumo', 'descripcion', 'acciones']
        }

        this.casesService.getCasesByCollaborator('103106901').toPromise().then(data => {
          this.dataSource.data = data;
          this.type = type;
          this.loaded = true;
          this.authorized = true;
        }).catch(err => {
          console.log(err);
          throw err;
        });
      }
    });
  }

  ngOnInit() {
  }

  filtroBusqueda(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();;
  }

  verDetalle(cases: CaseList) {
    this.router.navigate(['/programacion/revision', this.type, cases.idCaso, this.type == 'hallazgos' ? '16' : '16']);
  }
}
