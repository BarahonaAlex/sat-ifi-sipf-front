import { NgModule } from '@angular/core';
import { AuthorizationGuard } from '../general-module/componentes-seguridad/guards/authorization.guard';
import { RouterModule, Routes } from '@angular/router';
import { AdminitracionDocumentosComponent } from './componentes-internos/administracion-documentos/adminitracion-documentos.component';
import { UnidadesAdministrativasComponent } from './componentes-internos/unidades-administrativas/unidades-administrativas.component';
import { AdministracionColaboradoresComponent } from './componentes-internos/administracion-colaboradores/administracion-colaboradores.component';
import { AsignarPerfilComponent } from './componentes-internos/asignar-perfil/asignar-perfil.component';
import { TrasladoIntegrantesComponent } from './componentes-internos/traslado-integrantes/traslado-integrantes.component';
import { AdministracionCatalogosComponent } from './componentes-internos/administracion-catalogos/administracion-catalogos.component';
import { GruposTrabajoComponent } from './componentes-internos/grupos-trabajo/bandeja/grupos-trabajo.component';
import { ParametrizacionComponent } from './componentes-internos/parametrizacion/parametrizacion.component';
import { PlanAnualComponent } from './componentes-internos/plan-anual/bandeja/plan-anual.component';
import { PlanDetalleComponent } from './componentes-internos/plan-anual/plan-detalle/plan-detalle.component';
import { AdministracionPlantillasComponent } from './componentes-internos/administracion-documentos/administracion-plantillas/administracion-plantillas.component';


const routes: Routes = [
  {
    path: '', canActivateChild: [AuthorizationGuard],
    children:
      [
        { path: 'documentos', component: AdminitracionDocumentosComponent },
        { path: 'unidades/administrativas', component: UnidadesAdministrativasComponent },
        { path: 'colaboradores', component: AdministracionColaboradoresComponent },
        { path: 'grupos', component: GruposTrabajoComponent },
        { path: 'asignar/perfil', component: AsignarPerfilComponent },
        { path: 'traslado/integrante', component: TrasladoIntegrantesComponent },
        { path: 'catalogos', component: AdministracionCatalogosComponent },
        { path: 'plan/anual/fiscalizacion', component: PlanAnualComponent },
        { path: 'plan/anual/fiscalizacion/detalle', component: PlanDetalleComponent },
        { path: 'plan/anual/fiscalizacion/detalle/:id', component: PlanDetalleComponent },
        { path: 'parametrizacion', component: ParametrizacionComponent },
        { path: 'documentos/plantillas', component: AdministracionPlantillasComponent }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }