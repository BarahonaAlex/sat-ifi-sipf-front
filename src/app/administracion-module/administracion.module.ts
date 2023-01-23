
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { MaterialModule } from '../material.module';
import { AdminitracionDocumentosComponent } from './componentes-internos/administracion-documentos/adminitracion-documentos.component';
import { GeneralModule } from '../general-module/general.module';
import { UnidadesAdministrativasComponent } from './componentes-internos/unidades-administrativas/unidades-administrativas.component';
import { AdministracionColaboradoresComponent } from './componentes-internos/administracion-colaboradores/administracion-colaboradores.component';
import { AsignarPerfilComponent } from './componentes-internos/asignar-perfil/asignar-perfil.component';
import { TrasladoIntegrantesComponent } from './componentes-internos/traslado-integrantes/traslado-integrantes.component';
import { AdministracionCatalogosComponent } from './componentes-internos/administracion-catalogos/administracion-catalogos.component';
import { GruposTrabajoComponent } from './componentes-internos/grupos-trabajo/bandeja/grupos-trabajo.component';
import { GrupoDetalleComponent } from './componentes-internos/grupos-trabajo/grupo-detalle/grupo-detalle.component';
import { ParametrizacionComponent } from './componentes-internos/parametrizacion/parametrizacion.component';
import { PlanAnualComponent } from './componentes-internos/plan-anual/bandeja/plan-anual.component';
import { PlanDetalleComponent } from './componentes-internos/plan-anual/plan-detalle/plan-detalle.component';
import { AdministracionPlantillasComponent } from './componentes-internos/administracion-documentos/administracion-plantillas/administracion-plantillas.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AdminitracionDocumentosComponent,
    UnidadesAdministrativasComponent,
    AdministracionColaboradoresComponent,
    GruposTrabajoComponent,
    GrupoDetalleComponent,
    AsignarPerfilComponent,
    TrasladoIntegrantesComponent,
    AdministracionCatalogosComponent,
    ParametrizacionComponent,
    PlanAnualComponent,
    PlanDetalleComponent,
    AdministracionPlantillasComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    GeneralModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministracionModuleModule { }