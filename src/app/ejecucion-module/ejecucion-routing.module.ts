import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../general-module/componentes-seguridad/guards/authorization.guard';
const routes: Routes = [
  {
    path: '', canActivateChild: [AuthorizationGuard],
    children:
      [
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjecucionRoutingModule { }
