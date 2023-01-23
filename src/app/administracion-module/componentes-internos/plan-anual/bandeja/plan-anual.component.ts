import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IndicatorDetail, YearlyPlanDetail } from 'src/app/general-module/componentes-comunes/interfaces/plan-anual.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { PlanAnualService } from 'src/app/general-module/componentes-comunes/servicios/plan-anual.service';

@Component({
  selector: 'app-plan-anual',
  templateUrl: './plan-anual.component.html',
  styleUrls: ['./plan-anual.component.scss']
})
export class PlanAnualComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['plan', 'year', 'indicators', 'actions'];
  dataSource = new MatTableDataSource<YearlyPlanDetail>();

  noDataMsg = 'No existe plan anual de fiscalización creado'

  constructor(
    private yearlyPlanService: PlanAnualService,
    private router: Router,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.yearlyPlanService.getYearlyPlans().toPromise().then((data) => {
      this.dataSource.data = data;
    });;
  }

  createYearlyPlan() {
    this.router.navigate(['administracion/plan/anual/fiscalizacion/detalle']);
  }

  updateYearlyPlan(id: number) {
    this.router.navigate(['administracion/plan/anual/fiscalizacion/detalle', id]);
  }

  deleteYearlyPlan(year: number) {
    this.dialog.show({
      title: 'IFI-003',
      text: '¿Está seguro que desea eliminar el plan anual?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result == 'primary') {
        this.yearlyPlanService.deleteYearlyPlan(year).toPromise().then(_ => {
          this.dataSource.data = this.dataSource.data.filter((yearlyPlan) => yearlyPlan.plan !== year);
          this.dialog.show({
            title: 'IFI-200',
            text: 'El plan anual ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }

  parseIndicators(indicators: IndicatorDetail[]) {
    return indicators.map((indicator) => indicator.name).join(', ');
  }

  searchFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
  }
}
