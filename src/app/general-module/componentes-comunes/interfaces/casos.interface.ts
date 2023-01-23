import { Data } from "@angular/router";
import { alcanceDetalle } from "./alcances.interface.ts";
import { CaseTaxesInterface } from "./CasosDTE";
import { Colaborador } from "./Colaborador.interface";

/**
 * @description Interfaz para obtener una solicitud masiva
 * @author ajsbatzmo (Jamier Batz)
 * @since 18/02/2022
 */
export interface SolicitudMasivaInterface {

	profesional: Colaborador;
	peticion: SolicitudMasiva;
}

export interface TableScope {
	nombre: string;
	tecnicos: number
	presencias: number
	total: number
}


/**
 * @description Interfaz para obtener una solicitud masiva
 * @author ajsbatzmo (Jamier Batz)
 * @since 18/02/2022
 */
export interface SolicitudMasiva {
	gerenciaSolicitud: number;
	nitProfesional: string;
	nombreSolicitud: string;
	objetivoSolicitud: string;
}

export interface CasesFixedPoint {
	idCaso: number;
	nitContribuyente: string;
	nombreGerencia: string;
	nombreEstado: string;
}

export interface Case {
	idCaso?: number;
	origen?: number;
	gerencia?: number;
	proceso?: number;
	montoRecaudado?: number;
	tipoInsumo?: number;
	programa?: number;
	impuesto?: number;
	tipoAlcance?: number;
	correlativoAprobacion?: string;
	nombreCaso?: string;
	cargaMasica?: number;
	periodoRevisionInicio?: string;
	periodoRevisionFin?: string;
	nitContribuyente?: string;
	nitColaborador?: string;
	descripcion?: string;
	estado?: number;
	impuestos?: number[];
	comentario?: string;
}

export interface IngresoInsumos {
	estado: number;
	origen: number;
	gerencia: number;
	montoRecaudado: number;
	tipoInsumo: number;
	impuesto: number;
	tipoAlcance: number;
	usuarioModifica: string;
	fechaModifica: string;
	ipModifica: string;
	nombreCaso: string;
	cargaMasiva: string;
	periodoRevisionInicio: string;
	periodoRevisionFin: string;
	nitContribuyente: string;
	descripcion: string;
	proceso: string;//para mientras
	periodo: string;//para mientras
}

export interface RequestCase extends Case {
	entidadSolicitante?: number;
	detalleEntidadSolicitante?: string;
	tipoSolicitud?: number;
	nombreCuentaAuditar?: string;
	nitContribuyenteCruce?: string;
	numeroFacturaCruce?: string;
	fechaFacturaCruce?: string;
	serieFacturaCruce?: string;
	montoFacturaCruce?: number;
	fechaSolicitud?: string;
	fechaDocumento?: string;
	numeroDocumento?: number;
	plazoEntrega?: string;
	nombreContacto?: string;
	correoContacto?: string;
	telefonoContacto?: string;
	arrayGeneral?: string[];
	jefeUnidad?: String;
}

export interface MassiveCase extends Case {
	objetivoCasoMasiva: string;
	correoContacto: string;
}

export interface CaseList {
	idInsumo: number;
	idCaso: number;
	idEstado: number;
	impuestos?: CaseTaxesInterface[]
	idOrigen: number;
	idTipoInsumo: number;
	montoRecaudado: number;
	nitContribuyente: string;
	nitProfesionalResponsable: string;
	nombreCaso: string;
	nombreEstado: string;
	nombreImpuesto: string;
	nombreOrigen: string;
	nombreTipoCaso: string;
	periodoFin: string;
	periodoInicio: string;
	processId: number;
	noPrograma?: number;
	nombreContribuyente?: string;
	estadoAlcance?: number;
}

export interface CaseDetail {
	correlativoAprobacion: string;
	correoContacto: string;
	detalleEntIdadSolicitante: string;
	fechaDocumento: string;
	fechaFacturaCruce: string;
	fechaModifica: string;
	fechaSolicitud: string;
	idCargaMasiva: number;
	idCaso: number;
	idEntIdadSolicitante: number;
	idEstado: number;
	idGerencia: number;
	idImpuesto: number;
	idOrigen: number;
	idProceso: number;
	idPrograma: number;
	idTipoAlcance: number;
	idTipoInsumo: number;
	idTipoSolicitud: number;
	idAlcance: number;
	ipModifica: string;
	montoFacturaCruce: number;
	montoRecaudado: number;
	nitColaborador: string;
	nitContribuyente: string;
	nitContribuyenteCruce: string;
	nombreCaso: string;
	nombreColaborador: string;
	nombreContacto: string;
	nombreContribuyente: string;
	nombreCuentaAuditar: string;
	numeroDocumento: number;
	numeroFacturaCruce: string;
	objetivoCasoMasiva: string;
	periodoRevisionFin: string;
	periodoRevisionInicio: string;
	plazoEntrega: string;
	serieFacturaCruce: string;
	telefonoContacto: string;
	territorioMasivo: string;
	usuarioModifica: string;
	nombreDepartamento: string;
	nombreEstado: string;
	nombreGerencia: string;
	nombreImpuesto: string;
	nombrePrograma: string;
	descripcion: string;
	impuestos?: string;
	requiereDocumentacion?: boolean;
	loginProfesional?: string;
}



export interface RtuDatos {
	nit: string,
	codigo_tipo: number,
	primerNombre: string,
	segundoNombre: string,
	tercerNombre: string,
	primerApellido: string,
	segundoApellido: string,
	apellidoCasada: string,
	razonSocial: string,
	cui: string,
	cedulaRegistro: string,
	descRegistro: string,
	cedulaMunicipio: string,
	descCedMunicipio: string,
	cedulaNumero: string,
	pasaporte: string,
	codPais: string,
	descripcionPais: string,
	codNacionalidad: string,
	descNacionalidad: string,
	genero: string,
	codGenero: string,
	codActividadEconomica: string,
	descActividadEconomica: string,
	correoElectronicoPrincipal: string,
	correoElectronicoNoticacion: string,
	correoElectronicoAdicional: string,
	telefonoLineaFija: string,
	telefonoCelular: string,
	domicilioFiscal: string,
	fechaFallecimiento: string,
	fechaNacimiento: string
}
export interface Comentario {
	comentarios: string
	idHistorialComentario: number
	idRegistro: string
	idTipoComentario: number
}
export interface CasoComentario {
	caso: CaseDetail,
	comentario: Comentario
}
export interface MassiveAssignParams {

	pcantidadCasos?: number;
	pidGerencia?: number;
	pnitResponsable?: string;
	ptipoCaso?: number;
}

export interface SolicitudAduanas {
	IdSolicitud: number;
	Nit: string;
	Nombre: string;
	Estado: string;
	Solicitud: number
}
//Interfaz para crear alcance
export interface CasesAlcance {
	idCaso: number;
	idTipoAlcance: number;
	secciones: alcanceDetalle[];
	idTipoCaso: number;
}