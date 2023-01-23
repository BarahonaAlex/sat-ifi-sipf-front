import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { MaterialModule } from '../material.module';
import { ReporteGeneralAlcanceComponent } from './componentes-internos/reporte-general-alcance/reporte-general-alcance.component';
import { PlanAnualFiscalizacionComponent } from './componentes-internos/plan-anual-fiscalizacion/plan-anual-fiscalizacion.component';
import { PlanAnualComponent } from './componentes-internos/plan-anual/plan-anual.component';
import { GeneralModule } from '../general-module/general.module';
import { AdministracionModuleModule } from '../administracion-module/administracion.module';

@NgModule({
  declarations: [
    ReporteGeneralAlcanceComponent,
    PlanAnualFiscalizacionComponent,
    PlanAnualComponent,
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    MaterialModule,
    AdministracionModuleModule,
    GeneralModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportesModule { }
