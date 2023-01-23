import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramacionRoutingModule } from './programacion-routing.module';
import { MaterialModule } from '../material.module';
import { GeneralModule } from '../general-module/general.module';
import { CarteraCasosComponent } from './componentes-internos/cartera-casos/cartera-casos.component';
import { CarteraProgramasFiscalesComponent } from './componentes-internos/cartera-programas-fiscales/cartera-programas-fiscales.component';
import { RevisionAlcancesComponent } from './componentes-internos/revision-alcances/bandeja/revision-alcances.component';
import { RevisionComponent } from './componentes-internos/revision-alcances/revision/revision.component';
import { CarteraAprobacionProgramaComponent } from './componentes-internos/cartera-aprobacion-programa-fiscales/Cartera-Aprobacion-Programa.component';
import { DetalleAprobacionComponent } from './componentes-internos/cartera-aprobacion-programa-fiscales/Detalle-Aprobacion/Detalle-Aprobacion.component';
import { ElaboracionAlcancesMasivosComponent } from './componentes-internos/administracion-alcances/elaboracion-alcances-masivos/elaboracion-alcances-masivos.component';
import { ElaboracionAlcanceComponent } from './componentes-internos/administracion-alcances/elaboracion-alcance/elaboracion-alcance.component';
import { CasosMasivosComponent } from './componentes-internos/ingreso-casos/casos-masivos/casos-masivos.component';
import { ReasignacionCasosComponent } from './componentes-internos/administracion-casos/reasignacion-casos/reasignacion-casos.component';
import { GestionAlcancesMasivosComponent } from './componentes-internos/administracion-alcances/gestion-alcances-masivos/gestion-alcances-masivos.component';
import { DesasignacionCasosComponent } from './componentes-internos/administracion-casos/desasignacion-casos/desasignacion-casos.component';
import { BandejaCasosComponent } from './componentes-internos/operador/bandeja-casos/bandeja-casos.component';
import { ConsultaRtuComponent } from './componentes-internos/operador/consultas/consulta-rtu/consulta-rtu.component';
import { BandejaConsultaComponent } from './componentes-internos/operador/bandeja-consulta/bandeja-consulta.component';
import { HallazgosComponent } from './componentes-internos/operador/hallazgos/bandeja/hallazgos.component';
import { OpcionesConsultaComponent } from './componentes-internos/operador/opciones-consulta/opciones-consulta.component';
import { OpcionDetalleComponent } from './componentes-internos/operador/opcion-detalle/opcion-detalle.component';
import { CarteraInsumoAprobadorComponent } from './componentes-internos/cartera-insumo-aprobador/cartera-insumo-aprobador.component';
import { CarteraInsumoAutorizadorComponent } from './componentes-internos/cartera-insumo-autorizador/cartera-insumo-autorizador.component';
import { HistoricoAuditoriasComponent } from './componentes-internos/operador/consultas/historico-auditorias/historico-auditorias.component';
import { DetalleComponent } from './componentes-internos/operador/hallazgos/detalle/detalle.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ConvenioPagoComponent } from './componentes-internos/operador/consultas/convenio-pago/convenio-pago.component';
import { ConsultaVehiculoComponent } from './componentes-internos/operador/consultas/consulta-vehiculo/consulta-vehiculo.component';
import { CarteraCasosAutorizadorGerencialComponent } from './componentes-internos/cartera-casos-autorizador-gerencial/cartera-casos-autoriazador-gerencial.component';
import { RetenIVAComponent } from './componentes-internos/operador/consultas/reten-iva/reten-iva.component';
import { DeclaracionConsolidadoComponent } from './componentes-internos/operador/consultas/consulta-declaraciones/declaracion-consolidado/declaracion-consolidado.component';
import { AsisteLibrosComponent } from './componentes-internos/operador/consultas/asiste-libros/asiste-libros.component';
import { AdministracionAlcanceComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcances-precios-tranferencias/administracion-alcance.component';
import { AlcanceSelectivoComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcances-selectiva/alcance-selectivo/alcance-selectivo.component';
import { BandejaCasosAprobadorComponent } from './componentes-internos/bandeja-casos-aprobador/bandeja-casos-aprobador/bandeja-casos-aprobador.component';
import { RevisionAlcanceAprobadorComponent } from './componentes-internos/bandeja-casos-aprobador/revision-alcance-aprobador/revision-alcance-aprobador.component';
import { BandejaCasosAutorizadorComponent } from './componentes-internos/bandeja-casos-autorizador/bandeja-casos-autorizador.component';
import { ConsultaImportacionExportacionComponent } from './componentes-internos/operador/consultas/consulta-importacion-exportacion/consulta-importacion-exportacion.component';
import { RetenIsrComponent } from './componentes-internos/operador/consultas/reten-isr/reten-isr.component';
import { ConsultaFelComponent } from './componentes-internos/operador/consultas/consulta-fel/consulta-fel.component';
import { ElaboracionAlcanceDenunciasComponent } from './componentes-internos/administracion-alcances/elaboracion-alcance-denuncias/elaboracion-alcance-denuncias.component';
import { BandejaDenunciasComponent } from './componentes-internos/operador/bandeja-denuncias/bandeja-denuncias.component';
import { AlcancesMasivoComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcances-masivo/alcances-masivo.component';
import { AlcanceDenunciaComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-denuncia/alcance-denuncia.component';
import { CartelaDenunciaAprobadoComponent } from './componentes-internos/cartela-denuncia-aprobado/cartela-denuncia-aprobado.component';
import { DetalleBandejaDenunciaComponent } from './componentes-internos/operador/bandeja-denuncias/detalle-bandeja-denuncia/detalle-bandeja-denuncia.component';
import { ApplyRejectedDenunciaComponent } from './componentes-internos/operador/bandeja-denuncias/apply-rejected-denuncia/apply-rejected-denuncia.component';
import { BandejaPresenciasComponent } from './componentes-internos/operador/bandeja-presencias/bandeja-presencias.component'; import { ConsultaDuasDucasComponent } from './componentes-internos/operador/consultas/consulta-duas-ducas/consulta-duas-ducas.component';
import { DenunciasGabineteComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/denuncias-gabinete.component';
import { ConsultaEfaComponent } from './componentes-internos/operador/consultas/consulta-efa/consulta-efa.component';
import { BandejaJefeUnidadComponent } from './componentes-internos/bandeja-jefe-unidad/bandeja-jefe-unidad.component';
import { BandejaJefeDepartamentoComponent } from './componentes-internos/bandeja-jefe-departamento/bandeja-jefe-departamento.component';
import { BandejaGabinetePfComponent } from './componentes-internos/bandeja-gabinete-pf/bandeja-gabinete-pf.component';
import { BandejaCreditoFiscalComponent } from './componentes-internos/operador/bandeja-credito-fiscal/bandeja-credito-fiscal.component';
import { AlcanceGabineteComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-gabinete/alcance-gabinete.component';
import { BandejaCasoRechazoAprobadorComponent } from './componentes-internos/bandeja-caso-rechazo-aprobador/bandeja-caso-rechazo-aprobador.component';
import { BandejaAlcanceMasivoComponent } from './componentes-internos/operador/bandeja-alcance-masivo/bandeja-alcance-masivo.component';
import { AlcancePuntosFijosComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-puntos-fijos/alcance-puntos-fijos.component';
import { AlcanceCasoGabineteComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-caso-gabinete/alcance-caso-gabinete.component';
import { BandejaConsultaMasivoComponent } from './componentes-internos/operador/bandeja-alcance-masivo/bandeja-consulta-masivo/bandeja-consulta-masivo.component';
import { DialogEstablecimientos, DialogImpuestosHistorico, DialogUbicacion, DialogUbicacionHistorico } from './componentes-internos/operador/consultas/consulta-rtu/dialog-contribuyente.component';
import { BandejaConsultaGabineteComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/bandeja-consulta-gabinete.component';
import { FindingsGabinetComplaintComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/findings-gabinet-complaint/findings-gabinet-complaint.component';
import { DetailFindingsGabinetComplaintComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/findings-gabinet-complaint/detail-findings-gabinet-complaint/detail-findings-gabinet-complaint.component';
import { ComplaintGabinetOptionDetailComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/complaint-gabinet-option-detail/complaint-gabinet-option-detail.component';
import { ComplaintGabinetOptionQueryComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/complaint-gabinet-option-query/complaint-gabinet-option-query.component';
import { BandejaCreditoFiscalJefeComponent } from './componentes-internos/bandeja-credito-fiscal-jefe/bandeja-credito-fiscal-jefe.component';
import { DetSelModule } from '../det-sel-module/det-sel.module';
import { BandejaCreditoFiscalConsultaComponent } from './componentes-internos/operador/bandeja-credito-fiscal/bandeja-credito-fiscal-consulta/bandeja-credito-fiscal-consulta.component';
import { InconsistenciasComponent } from './componentes-internos/operador/bandeja-credito-fiscal/inconsistencias/inconsistencias.component';
import { GeneracionCedulaComponent } from './componentes-internos/operador/bandeja-credito-fiscal/generacion-cedula/generacion-cedula.component';
import { BandejaCreditoFiscalDocumentoComponent } from './componentes-internos/operador/bandeja-credito-fiscal/bandeja-credito-fiscal-documento/bandeja-credito-fiscal-documento.component';
import { OpcionesConsultaCreditoFiscalComponent } from './componentes-internos/operador/bandeja-credito-fiscal/opciones-consulta-credito-fiscal/opciones-consulta-credito-fiscal.component';
import { HallazgoNewTabComponent } from './componentes-internos/operador/hallazgo-new-tab/hallazgo-new-tab.component';

@NgModule({
  declarations: [
    RevisionAlcancesComponent,
    CarteraProgramasFiscalesComponent,
    ReasignacionCasosComponent,
    CarteraCasosComponent,
    RevisionComponent,
    CarteraAprobacionProgramaComponent,
    DetalleAprobacionComponent,
    GestionAlcancesMasivosComponent,
    ElaboracionAlcancesMasivosComponent,
    ElaboracionAlcanceComponent,
    CasosMasivosComponent,
    DesasignacionCasosComponent,
    BandejaCasosComponent,
    ConsultaRtuComponent,
    BandejaConsultaComponent,
    HallazgosComponent,
    OpcionesConsultaComponent,
    OpcionDetalleComponent,
    CarteraInsumoAprobadorComponent,
    CarteraInsumoAutorizadorComponent,
    HistoricoAuditoriasComponent,
    DetalleComponent,
    ConvenioPagoComponent,
    ConsultaVehiculoComponent,
    RetenIVAComponent,
    CarteraCasosAutorizadorGerencialComponent,
    AsisteLibrosComponent,
    AdministracionAlcanceComponent,
    AlcanceSelectivoComponent,
    BandejaCasosAprobadorComponent,
    RevisionAlcanceAprobadorComponent,
    BandejaCasosAutorizadorComponent,
    ConsultaImportacionExportacionComponent,
    ConsultaFelComponent,
    RetenIsrComponent,
    DeclaracionConsolidadoComponent,
    ElaboracionAlcanceDenunciasComponent,
    BandejaDenunciasComponent,
    AlcancesMasivoComponent,
    AlcanceDenunciaComponent,
    CartelaDenunciaAprobadoComponent,
    DetalleBandejaDenunciaComponent,
    ApplyRejectedDenunciaComponent,
    ConsultaDuasDucasComponent,
    BandejaPresenciasComponent,
    DenunciasGabineteComponent,
    ConsultaEfaComponent,
    BandejaJefeUnidadComponent,
    BandejaJefeDepartamentoComponent,
    BandejaPresenciasComponent,
    ConsultaEfaComponent,
    BandejaGabinetePfComponent,
    BandejaCreditoFiscalComponent,
    BandejaCreditoFiscalConsultaComponent,
    InconsistenciasComponent,
    GeneracionCedulaComponent,
    AlcanceGabineteComponent,
    BandejaCreditoFiscalDocumentoComponent,
    BandejaCasoRechazoAprobadorComponent,
    BandejaAlcanceMasivoComponent,
    AlcancePuntosFijosComponent,
    AlcanceCasoGabineteComponent,
    BandejaConsultaMasivoComponent,
    DialogImpuestosHistorico,
    DialogEstablecimientos,
    DialogUbicacionHistorico,
    DialogUbicacion,
    BandejaConsultaGabineteComponent,
    FindingsGabinetComplaintComponent,
    DetailFindingsGabinetComplaintComponent,
    ComplaintGabinetOptionDetailComponent,
    ComplaintGabinetOptionQueryComponent,
    BandejaCreditoFiscalJefeComponent,
    OpcionesConsultaCreditoFiscalComponent,
    HallazgoNewTabComponent
  ],
  imports: [
    DetSelModule,
    CommonModule,
    ProgramacionRoutingModule,
    MaterialModule,
    GeneralModule,
    EditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgramacionModule { }


