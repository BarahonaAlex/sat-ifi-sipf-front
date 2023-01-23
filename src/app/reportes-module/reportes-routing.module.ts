import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../general-module/componentes-seguridad/guards/authorization.guard';
import { PlanAnualComponent } from './componentes-internos/plan-anual/plan-anual.component';
import { ReporteGeneralAlcanceComponent } from './componentes-internos/reporte-general-alcance/reporte-general-alcance.component';
const routes: Routes = [
  {
    path: '', canActivateChild: [AuthorizationGuard],
    children:
      [
        { path: 'alcance', component: ReporteGeneralAlcanceComponent },
        { path: 'plan/anual/fiscalizacion', component: PlanAnualComponent },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
