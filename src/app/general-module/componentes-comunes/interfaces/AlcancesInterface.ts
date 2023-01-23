export interface AlcancesInterface {
}

export interface GetMassiveScopeInterface {
    descripcionAlcance: string;
    idAlcanceMasivo: number;
    nombreAlcance: string;
  }
  
  export interface GetMassiveScopeVersionInterface {
    actividad: string;
    fechaModifica: string;
    id: MassiveVersionIdInterface;
    idEstado: number;
    ipModifica: string;
    justificacion: string;
    objetivo: string;
    procedimientosEspecificos: string;
    usuarioModifica: string;
  }
  
  export interface MassiveVersionIdInterface {
    idTipoAlcanceMasivo: number;
    version: number;
  }
  
  export interface GetMassiveCasesInterface {
    idCaso: number;
    idEstado: number;
    idGerencia: number;
    idAlcance: number;
    idVersion: number;
    idPrograma: number;
    nombreEstado: string;
    nombrePrograma: string;
    nombreGerencia: string;
    nombreColaborador: String;
    correoColaborador: String;
    objetivo: string;
    periodoFin: string;
    periodoInicio: string;
    territorio: string;
    comentariosSup: string;
    comentariosJefe: string;
  }
  
  export interface CreateMassiveScopeInterface {
    actividad: string;
    descripcionAlcance: string;
    justificacion: string;
    nombreAlcance: string;
    objetivo: string;
    procedimientosEspecificos: string;
  }
  
  export interface ModifyMassiveScopeInterface {
    actividad: string;
    idEstado: number;
    idTipoAlcanceMasivo: number;
    justificacion: string;
    objetivo: string;
    procedimientosEspecificos: string;
    version: number;
  }
  
  export interface DeleteMassiveCaseInterface {
    fechaModifica: string;
    idCaso: number;
    ipModifica: string;
    usuarioModifica: string;
  }
  
  export interface CreateAndModifyMassiveCaseInterface {
    idCaso: number;
    idEstado: number;
    idPrograma: number;
    idTipoAlcance: number;
    idVersionAlcance: number;
    periodoRevisionFin: string;
    periodoRevisionInicio: string;
    territorioMasivo: string;
    nombrePrograma: string;
    nombreAlcance: string;
    nombreGerencia: string;
    nombreColaborador: string;
    correoColaborador: string;
  }

/**
   * @description Interfaz que trae los programas en base al idEstado
   * @author alfvillag (Luis Villagran)
   * @since 09/02/2022
   */
  export interface ScopeProgram {
  anio: number;
  codificacionPrograma: string;
  correlativo: number;
  descripcion: string;
  fechaModifica: string;
  idDepartamento: number;
  idDireccionamientoAuditoria: number;
  idEstado: number;
  idGerencia: number;
  idOrigenInsumo: number;
  idPrograma: number;
  idTipoAuditoria: number;
  idTipoPrograma: number;
  impuesto: string;
  impuestoNombres: string;
  ipModifica: string;
  nombre: string;
  periodoFin: string;
  periodoInicio: string;
  usuarioModifica: string;
}
/**
   * @description Interfaz que sirve para agregar un programa a casos
   * @author alfvillag (Luis Villagran)
   * @since 09/02/2022
   */
export interface addProgram{
  idCaso: number;
  idPrograma: number;
}

/**
   * @description Interfaz para obtener alcance tipo solicitud y selectivo
   * @author ajsbatzmo (Jamier Batz)
   * @since 17/02/2022
   */
export interface ScopeInterface {
	nit: string;
	periodoAl: string;
	periodoDel: string;
	contribuyente: string;
	programa: string;
	tipoAlcance: number;
}

/**
   * @description Interfaz para obtener alcance tipo masivo
   * @author ajsbatzmo (Jamier Batz)
   * @since 17/02/2022
   */
export interface MassScopeInterface {

	idCaso: number;
	actividad: string;
	plazoAl: string;
	plazoDel: string;
	programa: string;
	tipoAlcance: number;
}