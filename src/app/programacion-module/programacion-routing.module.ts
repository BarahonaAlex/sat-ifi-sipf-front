import { BandejaConsultaGabineteComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/bandeja-consulta-gabinete/bandeja-consulta-gabinete.component';
import { DeclaracionConsolidadoComponent } from './componentes-internos/operador/consultas/consulta-declaraciones/declaracion-consolidado/declaracion-consolidado.component';
import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../general-module/componentes-seguridad/guards/authorization.guard';
import { CarteraProgramasFiscalesComponent } from './componentes-internos/cartera-programas-fiscales/cartera-programas-fiscales.component';
import { CarteraCasosComponent } from './componentes-internos/cartera-casos/cartera-casos.component';
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
import { BandejaConsultaComponent } from './componentes-internos/operador/bandeja-consulta/bandeja-consulta.component';
import { CarteraInsumoAprobadorComponent } from './componentes-internos/cartera-insumo-aprobador/cartera-insumo-aprobador.component';
import { CarteraInsumoAutorizadorComponent } from './componentes-internos/cartera-insumo-autorizador/cartera-insumo-autorizador.component';
import { HistoricoAuditoriasComponent } from './componentes-internos/operador/consultas/historico-auditorias/historico-auditorias.component';
import { ConvenioPagoComponent } from './componentes-internos/operador/consultas/convenio-pago/convenio-pago.component';
import { ConsultaVehiculoComponent } from './componentes-internos/operador/consultas/consulta-vehiculo/consulta-vehiculo.component';
import { CarteraCasosAutorizadorGerencialComponent } from './componentes-internos/cartera-casos-autorizador-gerencial/cartera-casos-autoriazador-gerencial.component';
import { RetenIVAComponent } from './componentes-internos/operador/consultas/reten-iva/reten-iva.component';
import { AsisteLibrosComponent } from './componentes-internos/operador/consultas/asiste-libros/asiste-libros.component';
import { BandejaCasosAprobadorComponent } from './componentes-internos/bandeja-casos-aprobador/bandeja-casos-aprobador/bandeja-casos-aprobador.component';
import { RevisionAlcanceAprobadorComponent } from './componentes-internos/bandeja-casos-aprobador/revision-alcance-aprobador/revision-alcance-aprobador.component';
import { BandejaCasosAutorizadorComponent } from './componentes-internos/bandeja-casos-autorizador/bandeja-casos-autorizador.component';
import { ConsultaImportacionExportacionComponent } from './componentes-internos/operador/consultas/consulta-importacion-exportacion/consulta-importacion-exportacion.component';
import { RetenIsrComponent } from './componentes-internos/operador/consultas/reten-isr/reten-isr.component';
import { ConsultaFelComponent } from './componentes-internos/operador/consultas/consulta-fel/consulta-fel.component';
import { BandejaDenunciasComponent } from './componentes-internos/operador/bandeja-denuncias/bandeja-denuncias.component';
import { AlcancesMasivoComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcances-masivo/alcances-masivo.component';
import { DetalleBandejaDenunciaComponent } from './componentes-internos/operador/bandeja-denuncias/detalle-bandeja-denuncia/detalle-bandeja-denuncia.component';
import { CartelaDenunciaAprobadoComponent } from './componentes-internos/cartela-denuncia-aprobado/cartela-denuncia-aprobado.component';
import { ElaboracionAlcanceDenunciasComponent } from './componentes-internos/administracion-alcances/elaboracion-alcance-denuncias/elaboracion-alcance-denuncias.component';
import { BandejaPresenciasComponent } from './componentes-internos/operador/bandeja-presencias/bandeja-presencias.component';
import { ConsultaDuasDucasComponent } from './componentes-internos/operador/consultas/consulta-duas-ducas/consulta-duas-ducas.component';
import { BandejaCreditoFiscalComponent } from './componentes-internos/operador/bandeja-credito-fiscal/bandeja-credito-fiscal.component';
import { ConsultaEfaComponent } from './componentes-internos/operador/consultas/consulta-efa/consulta-efa.component';
import { BandejaJefeDepartamentoComponent } from './componentes-internos/bandeja-jefe-departamento/bandeja-jefe-departamento.component';
import { BandejaJefeUnidadComponent } from './componentes-internos/bandeja-jefe-unidad/bandeja-jefe-unidad.component';
import { DenunciasGabineteComponent } from './componentes-internos/operador/bandeja-denuncias/denuncias-gabinete/denuncias-gabinete.component';
import { BandejaGabinetePfComponent } from './componentes-internos/bandeja-gabinete-pf/bandeja-gabinete-pf.component';
import { BandejaCasoRechazoAprobadorComponent } from './componentes-internos/bandeja-caso-rechazo-aprobador/bandeja-caso-rechazo-aprobador.component';
import { BandejaAlcanceMasivoComponent } from './componentes-internos/operador/bandeja-alcance-masivo/bandeja-alcance-masivo.component';
import { AlcancePuntosFijosComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-puntos-fijos/alcance-puntos-fijos.component';
import { AlcanceGabineteComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-gabinete/alcance-gabinete.component';
import { AlcanceCasoGabineteComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-caso-gabinete/alcance-caso-gabinete.component';
import { BandejaConsultaMasivoComponent } from './componentes-internos/operador/bandeja-alcance-masivo/bandeja-consulta-masivo/bandeja-consulta-masivo.component';
import { AlcanceDenunciaComponent } from './componentes-internos/administracion-alcances/administracion-alcance/alcance-denuncia/alcance-denuncia.component';
import { BandejaCreditoFiscalJefeComponent } from './componentes-internos/bandeja-credito-fiscal-jefe/bandeja-credito-fiscal-jefe.component';
import { BandejaCreditoFiscalConsultaComponent } from './componentes-internos/operador/bandeja-credito-fiscal/bandeja-credito-fiscal-consulta/bandeja-credito-fiscal-consulta.component';
import { HallazgosComponent } from './componentes-internos/operador/hallazgos/bandeja/hallazgos.component';
import { HallazgoNewTabComponent } from './componentes-internos/operador/hallazgo-new-tab/hallazgo-new-tab.component';

const routes: Routes = [
  {
    path: '', canActivateChild: [AuthorizationGuard],
    children:
      [
        { path: 'programa/cartera', component: CarteraProgramasFiscalesComponent },
        { path: 'revision/:type', component: RevisionAlcancesComponent },
        { path: 'revision/:type/:id/:state', component: RevisionComponent },
        { path: 'reasignacion/casos', component: ReasignacionCasosComponent },
        { path: 'elaboracion/alcance', component: ElaboracionAlcanceComponent },
        { path: 'elaboracion/alcance/:idCasos', component: ElaboracionAlcanceComponent },
        { path: 'elaboracion/alcance/:tipo/:id', component: RevisionComponent },
        { path: 'cartera/insumos', component: CarteraCasosComponent },
        { path: 'programa/cartera/jefe', component: CarteraProgramasFiscalesComponent },
        { path: 'programa/cartera/supervisor', component: CarteraProgramasFiscalesComponent },
        { path: 'aprobacion/programa', component: CarteraAprobacionProgramaComponent },
        { path: 'detalle/aprobacion/programa', component: DetalleAprobacionComponent },
        { path: 'elaboracion/masiva/alcance', component: ElaboracionAlcancesMasivosComponent },
        { path: 'casos/masivos', component: CasosMasivosComponent },
        { path: 'gestion/alcances/masivos', component: GestionAlcancesMasivosComponent },
        { path: 'desasignacion/casos', component: DesasignacionCasosComponent },
        { path: 'operador/cartera/casos', component: BandejaCasosComponent },
        { path: 'operador/cartera/casos/:id', component: BandejaConsultaComponent },
        { path: 'cartera/insumo/aprobador', component: CarteraInsumoAprobadorComponent },
        { path: 'cartera/insumo/autorizador', component: CarteraInsumoAutorizadorComponent },
        { path: 'cartera/gerencial', component: CarteraCasosAutorizadorGerencialComponent },
        { path: 'consulta/asiste/libros', component: AsisteLibrosComponent },
        { path: 'consulta/reten/IVA', component: RetenIVAComponent },
        { path: 'aprobador/bandeja/casos', component: BandejaCasosAprobadorComponent },
        { path: 'aprobador/revision/alcance/:id', component: RevisionAlcanceAprobadorComponent },
        { path: 'consulta/convenio/pago', component: ConvenioPagoComponent },
        { path: 'consulta/importacion/exportacion', component: ConsultaImportacionExportacionComponent },
        { path: 'bandeja/autorizador', component: BandejaCasosAutorizadorComponent },
        { path: 'consulta/vehiculos', component: ConsultaVehiculoComponent },
        { path: 'consulta/reten/ISR', component: RetenIsrComponent },
        { path: 'consulta/fel', component: ConsultaFelComponent },
        { path: 'consulta/declaraciones/consolidado', component: DeclaracionConsolidadoComponent },
        { path: 'elaboracion/alcances/denuncias', component: ElaboracionAlcanceDenunciasComponent },
        { path: 'cartera/alcance/denuncias', component: BandejaDenunciasComponent },
        { path: 'alcance/masivo/:id', component: AlcancesMasivoComponent },
        { path: 'bandeja/denuncia/aprobador', component: CartelaDenunciaAprobadoComponent },
        { path: 'consulta/dua/duca', component: ConsultaDuasDucasComponent },
        { path: 'alcances/masivos/:id', component: AlcancesMasivoComponent },
        { path: 'bandeja/jefe/unidad', component: BandejaJefeUnidadComponent },
        { path: 'bandeja/jefe/departamento', component: BandejaJefeDepartamentoComponent },
        { path: 'cartera/denuncia/gabinete', component: DenunciasGabineteComponent },
        { path: 'operador/cartera/presencias', component: BandejaPresenciasComponent },
        { path: 'consulta/efa', component: ConsultaEfaComponent },
        { path: 'bandeja/gabinete/puntosfijos', component: BandejaGabinetePfComponent },        
        { path: 'elaboracion/alcances/denuncias', component: ElaboracionAlcanceDenunciasComponent},
        { path: 'cartera/alcance/denuncias', component: BandejaDenunciasComponent},
        { path: 'alcance/masivo/:id', component:  AlcancesMasivoComponent},
        { path: 'detalle/cartera/alcance/denuncias', component: DetalleBandejaDenunciaComponent},
        { path: 'operador/bandeja/credito/fiscal', component: BandejaCreditoFiscalComponent},
        { path: 'operador/bandeja/credito/fiscal/:id', component: BandejaCreditoFiscalConsultaComponent},
        { path: 'alcance/denuncia/gabinete', component: DenunciasGabineteComponent},
        { path: 'bandeja/caso/rechazo/aprobador', component: BandejaCasoRechazoAprobadorComponent},
        { path: 'operador/bandeja/alcance/masivos' , component: BandejaAlcanceMasivoComponent},
        { path: 'operador/alcance/fixed/point/:idCaso', component: AlcancePuntosFijosComponent},
        { path: 'operador/alcance/cabinet/:idCaso', component: BandejaConsultaMasivoComponent},
        { path: 'operador/alcance/presencias/puntosFijos/:id', component: AlcanceDenunciaComponent},
        { path: 'operador/alcance/gabinete', component: AlcanceGabineteComponent},
        { path: 'denuncias/bandeja/gabinete/consultas/:correlativo', component: BandejaConsultaGabineteComponent},
        { path: 'bandeja/credito/fiscal/jefe', component: BandejaCreditoFiscalJefeComponent},
        { path: 'operador/bandeja/hallazgos/:id', component: HallazgoNewTabComponent},
        
      ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramacionRoutingModule { }
  