import { Operator } from "./Perfil.interface";

export interface Integrante {
	nit: string;
	profile: number;
	rol: number;
}

export interface EquipoTrabajo {
	descripcion: string;
	estado: number;
	idUnidadAdministrativa: number;
	integrantes: Integrante[];
	nombre: string;
}

export interface EquipoTrabajoRespuesta {
	id: number;
	integrantes: string;
	nombre: string;
	superiorInmediato: string;
	unidadAdministrativa: string;
	idEstado: number;
	casosActivos: number;
}

export interface ColaboratiorProfile {
	profile: number;
	nit: string;
}

export interface EquipoTrabajoDetalle {
	id: number;
	nombre: string;
	unidadAdministrativa: string;
	superiorInmediato: string;
	unidad: number;
	descripcion: string;
	estado: string;
	integrantes: number;
	perfil: number;
}

export interface IntegranteDetalle extends Operator {
	rol: number;
	perfil: number;
}

export interface EquipoUnidad {
	id: number;
	nombre: string;
}

export interface EquipoTrabajoRespuestaDetalle {
	equipoTrabajo: EquipoTrabajoDetalle;
	integrantes: IntegranteDetalle[];
	unidades: EquipoUnidad[];
}

/**
 * @description Interfaz para guardar solicitud de traslado de operador
 * @author ajsbatzmo (Jamier Batz)
 * @since edited 21/06/2022 
 */
export interface SaveTransferRequest {
	fechaEfectivaTraslado: string;
	fechaNotificacionTraslado: string;
	idAprobadorAcepta: string;
	idAprobadorSolicitante: string;
	idGrupoAnterior: number;
	idGrupoNuevo: number;
	motivo: string;
	nitColaborador: string;
	idTipoTraslado?: number;
	fechaEfectivaRetorno?: Date;
}

/**
 * @description Interfaz para obtener solicitud de traslado de operador
 * @author ajsbatzmo (Jamier Batz)
 * @since edited 21/06/2022 
 */
export interface TransferRequest {
	estado: string;
	idGrupoNuevo: number;
	idSolicitud: number;
	motivo: string;
	nitColaborador: string;
	nitSolicitante: string;
	nombreAprobador: string;
	nombreColaborador: string;
	nombreGrupoNuevo: string;
	nombreUnidadAdmin: string;
	tipoTraslado?: string;
}

/**
 * @description Interfaz para aprobar solicitud de traslado de operador
 * @author ajsbatzmo (Jamier Batz)
 * @since edited 21/06/2022 
 */
export interface ApproveTransferRequest {
	idGrupoT: number;
	nit: string;
	profile: number;
	rol: number;
	idSolicitud: number;
}

/**
 * @description Interfaz para aprobar solicitud de traslado de operador
 * @author ajsbatzmo (Jamier Batz)
 * @since edited 21/06/2022 
 */
export interface MemberOperator {
	nit: string;
	rol: number;
	unidad: number;
}
