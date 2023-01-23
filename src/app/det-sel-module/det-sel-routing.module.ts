import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorizationGuard} from '../general-module/componentes-seguridad/guards/authorization.guard';
import {
  FormularioDenunciaPortalComponent
} from './componente-externos/formulario-denuncia-portal/formulario-denuncia-portal.component';
import {
  IngresoSolicitudesExternaComponent
} from './componente-externos/ingreso-solicitudes-externa/ingreso-solicitudes-externa.component';
import {
  AuditoriaPosterioriAduanasComponent
} from './componentes-internos/auditoria-posteriori-aduanas/auditoria-posteriori-aduanas.component';
import {BandejaSolicitudesComponent} from './componentes-internos/bandeja-solicitudes/bandeja-solicitudes.component';
import {CarteraCasosDteComponent} from './componentes-internos/cartera-casos-DTE/cartera-casos-DTE.component';
import {CarteraInsumosDteComponent} from './componentes-internos/cartera-insumos-DTE/cartera-insumos-DTE.component';
import {CorreccionDTEComponent} from './componentes-internos/correccion-DTE/correccion-DTE.component';
import {DetalleCasoDTEComponent} from './componentes-internos/detalle-caso-DTE/detalle-caso-DTE.component';
import {IngresoSolicitudesComponent} from './componentes-internos/ingreso-solicitudes/ingreso-solicitudes.component';
import {HcaptchaGuard} from "../general-module/componentes-seguridad/guards/hcaptcha.guard";
import { LibrosContablesRegimenElectronicoComponent } from './componente-externos/libros-contables-regimen-electronico/libros-contables-regimen-electronico.component';
import { CargaArchivoCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/carga-archivo-credito-fiscal/carga-archivo-credito-fiscal.component';
import { NewSolicitudCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/new-solicitud-credito-fiscal/new-solicitud-credito-fiscal.component';
import { SolicitudDevolucionCreditoFiscalComponent } from './componente-externos/solicitud-devolucion-credito-fiscal/solicitud-devolucion-credito-fiscal.component';
import { SolicitudCreditoFiscalComponent } from './componentes-internos/credito-fiscal/solicitud-credito-fiscal/solicitud-credito-fiscal.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {path: 'cartera/insumos/dte', component: CarteraInsumosDteComponent, canActivate: [AuthorizationGuard]},
        {path: 'cartera/casos/dte', component: CarteraCasosDteComponent, canActivate: [AuthorizationGuard]},
        {path: 'solicitudes', component: IngresoSolicitudesComponent, canActivate: [AuthorizationGuard]},
        {path: 'detalle/caso/dte/:idCase/:idInsumo', component: DetalleCasoDTEComponent, canActivate: [AuthorizationGuard]},
        {path: 'corregir/insumo/:idInsumo', component: CorreccionDTEComponent, canActivate: [AuthorizationGuard]},
        {path: 'solicitudes/externas', component: IngresoSolicitudesExternaComponent, canActivate: [AuthorizationGuard]},
        {path: 'solicitudes/posteriori/aduanas', component: AuditoriaPosterioriAduanasComponent, canActivate: [AuthorizationGuard]},
        {path: 'formulario/denuncia', component: FormularioDenunciaPortalComponent, canActivate: [HcaptchaGuard]},
        {path: 'bandeja/solicitudes', component: BandejaSolicitudesComponent, canActivate: [AuthorizationGuard]},
        { path: 'solicitud/devolucion/credito/fiscal', component: SolicitudCreditoFiscalComponent, canActivate: [AuthorizationGuard]},
        { path: 'solicitud/formulario/credito/fiscal', component: SolicitudDevolucionCreditoFiscalComponent, canActivate: [AuthorizationGuard]},
        { path: 'solicitud/formulario', component: NewSolicitudCreditoFiscalComponent, canActivate: [AuthorizationGuard]},
        { path: 'carga/credito/fiscal/:fecha1/:fecha2/:nit/:id/:numero', component: CargaArchivoCreditoFiscalComponent, canActivate: [AuthorizationGuard]},
        { path: 'libros/contables/regimen/electronico', component: LibrosContablesRegimenElectronicoComponent, canActivate: [AuthorizationGuard]},
        
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetSelRoutingModule {
}
