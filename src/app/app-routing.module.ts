import { AuthorizationGuard } from './general-module/componentes-seguridad/guards/authorization.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackOauth2Component } from './general-module/componentes-seguridad/callback-oauth2/callback-oauth2.component';
import { HomeComponent } from './general-module/componentes-comunes/home/home.component';

const routes: Routes = [

  /**
    * Carga el modulo de administracion en modo peresozo, es decir hasta que se invoca la ruta
    */
  {
    path: 'administracion',
    canActivate: [AuthorizationGuard],
    children:
      [
        {
          path: '',
          loadChildren: () => import('./administracion-module/administracion.module').then(m => m.AdministracionModuleModule)
        },
      ]
  },

  /**
    * Carga el modulo de detension y seleccion en modo peresozo, es decir hasta que se invoca la ruta
    */
  {
    path: 'det-sel',
    children:
      [
        {
          path: '',
          loadChildren: () => import('./det-sel-module/det-sel.module').then(m => m.DetSelModule)
        },
      ]
  },

  /**
   * Carga el modulo de programacion en modo peresozo, es decir hasta que se invoca la ruta
   */
  {
    path: 'programacion',
    canActivate: [AuthorizationGuard],
    children:
      [
        {
          path: '',
          loadChildren: () => import('./programacion-module/programacion.module').then(m => m.ProgramacionModule)
        },
      ]
  },

  /**
    * Carga el modulo de ejecucion en modo peresozo, es decir hasta que se invoca la ruta
    */
  {
    path: 'ejecucion',
    canActivate: [AuthorizationGuard],
    children:
      [
        {
          path: '',
          loadChildren: () => import('./ejecucion-module/ejecucion.module').then(m => m.EjecucionModule)
        },
      ]
  },

  /**
  * Carga el modulo de resportes en modo peresozo, es decir hasta que se invoca la ruta
  */
  {
    path: 'reportes',
    canActivate: [AuthorizationGuard],
    children:
      [
        {
          path: '',
          loadChildren: () => import('./reportes-module/reportes.module').then(m => m.ReportesModule)
        },
      ]
  },

  /**
   * Componente de retorno una vez se tenga respuesta del servidor de autorización
   */
  {
    path: 'callback',
    component: CallbackOauth2Component
  },
  /**
   * Rutas que no coincidan o sin ruta se redirige a la ruta raíz
   */
   {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [AuthorizationGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'inicio',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
