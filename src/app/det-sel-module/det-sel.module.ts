import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetSelRoutingModule } from './det-sel-routing.module';
import { MaterialModule } from '../material.module';
import { CarteraCasosDteComponent } from './componentes-internos/cartera-casos-DTE/cartera-casos-DTE.component';
import { CarteraInsumosDteComponent } from './componentes-internos/cartera-insumos-DTE/cartera-insumos-DTE.component';
import { GeneralModule } from '../general-module/general.module';
import { IngresoSolicitudesComponent } from './componentes-internos/ingreso-solicitudes/ingreso-solicitudes.component';
import { CorreccionDTEComponent } from './componentes-internos/correccion-DTE/correccion-DTE.component';
import { DetalleCasoDTEComponent } from './componentes-internos/detalle-caso-DTE/detalle-caso-DTE.component';
import { CatalogoDetalleComponent } from './componentes-internos/catalogo-detalle/catalogo-detalle.component';
import { IngresoInsumosComponent } from './componentes-internos/ingreso-insumos/masiva/ingreso-insumos.component';
import { IngresoInsumoManualComponent } from './componentes-internos/ingreso-insumos/manual/ingreso-insumo-manual.component';
import { IngresoSolicitudesExternaComponent } from './componente-externos/ingreso-solicitudes-externa/ingreso-solicitudes-externa.component';
import { AuditoriaPosterioriAduanasComponent } from './componentes-internos/auditoria-posteriori-aduanas/auditoria-posteriori-aduanas.component';
import { FormularioDenunciaPortalComponent } from './componente-externos/formulario-denuncia-portal/formulario-denuncia-portal.component';
import { BandejaSolicitudesComponent } from './componentes-internos/bandeja-solicitudes/bandeja-solicitudes.component';
import { SolicitudDevolucionCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/solicitud-devolucion-credito-fiscal.component';
import { NewSolicitudCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/new-solicitud-credito-fiscal/new-solicitud-credito-fiscal.component';
import { CargaArchivoCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/carga-archivo-credito-fiscal/carga-archivo-credito-fiscal.component';
import { LibrosContablesRegimenElectronicoComponent } from './componente-externos/libros-contables-regimen-electronico/libros-contables-regimen-electronico.component';
import { SolicitudCreditoFiscalComponent } from './componentes-internos/credito-fiscal/solicitud-credito-fiscal/solicitud-credito-fiscal.component';
import { CreditoFiscalComponent } from './componentes-internos/credito-fiscal/credito-fiscal.component';

@NgModule({
  declarations: [
    CarteraInsumosDteComponent,
    CarteraCasosDteComponent,
    IngresoInsumosComponent,
    IngresoInsumoManualComponent,
    IngresoSolicitudesComponent,
    CorreccionDTEComponent,
    DetalleCasoDTEComponent,
    CatalogoDetalleComponent,
    IngresoSolicitudesExternaComponent,
    AuditoriaPosterioriAduanasComponent,
    FormularioDenunciaPortalComponent,
    BandejaSolicitudesComponent,
    CreditoFiscalComponent,
    SolicitudCreditoFiscalComponent,
    SolicitudDevolucionCreditoFiscalComponent,
    CargaArchivoCreditoFiscalComponent,
    LibrosContablesRegimenElectronicoComponent,
    NewSolicitudCreditoFiscalComponent
  ],
  imports: [
    CommonModule,
    DetSelRoutingModule,
    MaterialModule,
    GeneralModule
  ],
  exports: [
    NewSolicitudCreditoFiscalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetSelModule { }
