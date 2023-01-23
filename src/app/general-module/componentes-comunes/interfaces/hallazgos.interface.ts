export interface ReviewFindings {
	arrayDocs: number;
	descripcionHallazgo: string;
	fechaCreacion: string;
	fechaFin: string;
	fechaInicio: string;
	fechaModificacion: string;
	idAsignacionInsumos: number;
	idEstado: number;
	idEstadosFinancieros: number;
	idFormulario: number;
	idFuente: number;
	idHallazgos: number;
	idImpuesto: number;
	idInsumo: number;
	idPrograma: string;
	idRubro: string;
	idTipoHallazgo: number;
	nitProfesional: string;
	nombreEstado: string;
	nombreEstadoFinancieros: string;
	nombreFormulario: string;
	nombreFuente: string;
	nombreImpuesto: string;
	nombreRubro: string;
	periodo: string;
	periodoEstadosFinancieros: string;
	solicitudcambios: string;
	usuarioCreacion: string;
	usuarioModificacion: string;
	reviewed: boolean;
	state: string;
	typeFinding: string;
	comment: string;
}

export interface Hallazgos {
	idTipoHallazgo?: number;
	descripcionHallazgo?: string;
	idRubro?: number;
	idEstado?: number;
	idCaso?: number;
	idImpuesto?: number;
	idFormulario?: number;
	periodo?: string;
	fechaInicio?: string;
	fechaFin?: string;
	periodoEstadosFinancieros?: string;
	idEstadosFinancieros?: number;
	idFuente?: number;
	usuarioModifica?: string;
	ipModifica?: string;
	fechaModifica?: string;
}

export interface Topic {
    id: number;
    impuesto: string;
    seccion: string;
    subseccion: string;
    rubro: string;
}

export interface FindingDetail {
	id: number;
	descripcion: string;
	nombre: string;
	rubros: Topic[];
}

export interface FindingInsert {
	descripcion: string;
	caso?: number;
	rubros: number[];
	nombre: string;
	correlativo?: String;
}
