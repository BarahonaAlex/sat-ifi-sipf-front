export interface SeccionCaso {
  idCaso: number;
  jsonSeccion: string;
}

export interface GetSectionCase {
  comentario: string;
  comentarioTipo: string;
  jsonSection: string;
  registro: string;
}
export interface SeccionPrueba {
  fechaModifica: string;
  idCaso: number;
  ipModifica: string;
  jsonSeccion: string;
  usuarioModifica: string;
}

export interface ElaboracionAlcance {
  cambioJefe: string;
  cambioSupervisor: string;
  descripcionSeccion: string;
  seccionNombre: string;
  estadoGeneral: string;
}

export interface ElaboracionDatosGenerales {
  idInsumo: number;
  nit: string;
  nombre: string;
  peridoDel: string;
  periodoAl: string;
  regimen: string;
  idPrograma: number;
  nombrePrograma: string;
  periodo: number;
  informacionEspecial: string;
  estructuraAccionaria: string;
  participacionContribuyente: string;
  descripcionNarrativa: string;
  informacionRelevante: string;
  enteSolicitante: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
  cambioSupervisor: string;
  cambioJefe: string;
  seccionNombre: string;
  descripcionSeccion: string;
  estadoGeneral: string;
}

export interface ElaboracionDatosComplementarios {
  antecedentes: string;
  cambioJefe: string;
  cambioSupervisor: string;
  descripcionSeccion: string;
  fechaCreacion: string;
  fechaModificacion: string;
  hallazgosProgramacion: string;
  idInsumo: number;
  inconsistencias: string;
  justificacion: string;
  objetivo: string;
  procedimientosEspecificos: string;
  resultadosAuditorias: string;
  rubrosFiscalizar: string;
  seccionNombre: string;
  territorio: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  estadoGeneral: string;
}

export interface ObtenerColaboradores {
  nit: string;
  contribuyente: string;
  periodoDel: string;
  periodoAl: string;
}

export interface ActualizarSeccion {
  estado: string;
}

export interface ActualizarSeccionGeneral {
  estado: string;
}

export interface desarrolloPrueba {
  idInsumo: number;
  antecedentes: string;
  resultadosAuditorias: string;
  objetivo: string;
  inconsistencias: string;
  hallazgosProgramacion: string;
  rubrosFiscalizar: string;
  justificacion: string;
  procedimientosEspecificos: string;
  territorio: string;
  fechaCreacion: string;
  fechaModificacion: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  cambioSupervisor: string;
  cambioJefe: string;
  seccionNombre: string;
  descripcionSeccion: string;
  estado: string;
}

export interface Programas {
  idPrograma: number;
  nombre: string;
}

export interface AgregarPrograma {
  idInsumo: number;
  idPrograma: number;
}

export interface listaAlcances {
  nombre: string;
  listItem: string[];
  completed: boolean;
  id?: number;
}
export interface taxpayer {
  ajuste: number;
  comentario: string;
  estadoExpediente: string;
  estadoNombramiento: string;
  fechaPeriodoAl: string;
  fechaPeriodoDel: string;
  multa: number;
  nombramiento: string;
  nombrePlan: string;
  numeroExpediente: string;
  ubicacion: string;
}
export interface docPdf {
  datos: string;
  idCaso?: number;
  idEstado?: number;
  idTipoAlcance?: number;
  secciones?: alcanceDetalle[];
  cambios?: number;
}
export interface metaAlcanceMasivo {
  dias: number;
  horarioInicio: string;
  horarioFin: string;
  fecha: string;
  lugar: string;
}
export interface listaGeneral {
  caso: string;
}
export interface alcance {
  idAlcance?: number;
  idTipoAlcance: number;
  idEstado?: number;
  secciones: alcanceDetalle[];
  idSeccion?: number;
  detalle?: string;
}
export interface alcanceComentario{
  comentario: comentario;
  masivo:alcance[];
}

export interface alcanceDetalle {
  idSeccion: number;
  detalle: string;
}

export interface generalalcance {
  Tipo: String;
  Estado: String;
  IdAlcance: number;
  idAlcance: number;
  Presencia: number;
  comentary: string;
}
export interface comentario {
  comentarios: string;
idHistorialComentario: number;
idRegistro: number;
idTipoComentario:number;

}