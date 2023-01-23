export interface DesasignacionCasos {
}

/**
   * @description Interfaz para obtener listado de supervidores con estado activo
   * @author lfvillag (Luis Villagrán)
   * @since 08/06/2022
   */
  export interface Professional {
	nombreContribuyente: string;
	idRol: number;
	nitContribuyente: string;
  nombreEstado: string;
  nombre?: string;
  nit?: string;
}

//interfaz nueva
export interface casosCantidad {
  idCaso: number;
  idEstado: number;
  nit: string;
  nombreCaso: string;
  cantidadCaso: string;
  estado: string;
}

export interface Subordinados {
	correlativo: number;
	idGrupoTrabajo: number;
	nit: string;
	estado: string;
	usuarioCreacion: string;
	fechaCreacion: string;
	usuarioModifica: string;
	fechaModifica: string;
}

export interface InfoCasoDetalle {
	
}

export interface ProfessionalDesasignar {
  idCaso: number;
  nitContribuyente: string;
  nombreEstado: string;
  nit: string;
}

export interface ProfessionalGeneral {
  cantidadCasos: number;
  descripcionCaso: string;
  fecha: string;
  nombreEstado: string;
  nitProfesional: string;
  nombreInsumo: string;
  nombreProfesional: string;
}

export interface ProfessionalReasignar {
  idCaso: number;
  impuesto: string;
  nitContribuyente: string;
  nombreImpuesto?: string;
  nitProfesional?: string;
}

export interface UnassignAndReassign{
nit: string;
nitAnterior: string;
idCaso?: number;
}
