/**
* @description interface colaborador respuesta
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface CollaboratorResponse {
  nit: string;
  login: string;
  nombres: string;
  id_puesto_trabajo: string;
  usuario: string;
  fecha: string;
  ip: string;
  id_estado: number;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion: string;
  puesto_trabajo: string;
  nombreEstado: String;
  nombrePuesto: String;
  id_gerencia: number;
  correo: string;
  nombreUnidadAdministrativa: string;
  nombreTipoProgramacion: string;
  idTipoProgramacion: number;

}

/**
* @description interface para crear colaborador que extiende de actulizar colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface createCollaborator extends updateCollaborator {
  idColaborador: string;
}

/**
* @description interface para actulizar colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface updateCollaborator {
  correo: string;
  fechaModifica?: string;
  idColaborador: string;
  idEstado: number;
  idGerencia: number;
  idPuestoTrabajo?: string;
  ipModifica?: string;
  loginColaborador: string;
  nombresColaborador: string;
  usuarioModifica?: string;
  fechaFin?: Date;
  fechaInicio?: Date;
  puestoTrabajo?: string;
}

/**
* @description interface  para historial de colaborador 
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface collaboratorHistory {
  fechaCrea?: string;
  fechaFin: string;
  fechaInicio: string;
  idEstado: number;
  ipCrea?: string;
  nitColaborador: string;
  usuarioCrea?: string;
}

/**
* @description interface para casos que tiene asignado un colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface getCases {
  nombreEstado: string;
  nitContribuyente: string;
  nombreOrigen: string;
  id_caso: number;
}

/**
* @description interface para grupo de colaboradores
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface professionals {
  nit: string;
  nombres: string;
}

/**
* @description interface para reasignar caso a colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
export interface reAsign {
  nit: string;
  nitAnterior: string;
}

/**
   * @description Interfaz para obtener un colaborador
   * @author ajsbatzmo (Jamier Batz)
   * @since 18/02/2022
   */
export interface Colaborador {

  email: string;
  estado: number;
  idGerencia: number;
  nitProfesional: string;
  nombre: string;
  rol: string;
}

/**
   * @description Interfaz para obtener listado de supervidores con estado activo
   * @author abaestrad (Alex - Debora)
   * @since 03/03/2022
   */
export interface Supervisor {

  nit: string;
  nombres: string;
}

/**
   * @description Interfaz para obtener grupos de un operador
   * @author ajsbatzmo (Jamier Batz)
   * @since edited 21/06/2022 
   */
export interface Operator {
  estado: string;
  grupo: number;
  idUnidadAdmin: number;
  nitAprobador: string;
  nitColaborador: string;
  nombreAprobador: string;
  nombreColaborador: string;
  nombreGrupo: string;
  unidadAdmin: string;
  idPerfil: number;
  idRol: number;
  estadoGrupo: number;
  estadoColaboradorGrupo: number;
}

/**
   * @description Interfaz para obtener equipos y unidades de autorizador
   * @author ajsbatzmo (Jamier Batz)
   * @since edited 21/06/2022 
   */
export interface Authorizer {
  estado: string;
  idGrupo: number;
  idUnidad: number;
  nitAprobador: string;
  nombreGrupo: string;
  nombreUnidad: string;
}


export interface ColaboradorCadena {
  correo: string;
  id_estado: number;
  id_gerencia: number;
  login: string;
  nit: string;
  nombreEstado: string;
  nombres: string;
  puesto_trabajo: string;
}

export interface ColaboradorFromProsis {
  codigoGerencia: number;
  codigoUnidad: number;
  correo: string;
  estado: string;
  login: string;
  nit: string;
  nombre: string;
  nombreGerencia: string;
  nombrePuesto: string;
  nombreUnidad: string;
  renglon: string;
}

export interface UpdateJobPositionColaborador {
  correo: string;
  fechaModifica: string;
  idEstado: number;
  idGerencia: number;
  ipModifica: string;
  login: string;
  nit: string;
  nombres: string;
  puestoTrabajo: string;
  usuarioModifica: string;
}
export interface ColaboratorDto {
  nit: string
  nombres: string
  idPerfil: number
  nombrePerfil: string
} 