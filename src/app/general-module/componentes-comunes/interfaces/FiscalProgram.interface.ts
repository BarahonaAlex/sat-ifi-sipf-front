export interface FiscalProgramInterface {

    idPrograma?: any;
    idTipoPrograma?: any;
    idDireccionamientoAuditoria?: any;
    nombreDireccionamientoAuditoria?: any;
    idTipoAuditoria?: any;
    idOrigenInsumo?: any;
    idGerencia?: any;
    impuesto?: any;
    anio?: any;
    correlativo?: any;
    periodoInicio?: any;
    periodoFin?: any;
    nombre?: any;
    descripcion?: any;
    idDepartamento?: any;
    idEstado?: any;
    fechaModifica?: any;
    usuarioModifica?: any;
    ipModifica?: any;
    impuestos?: Array<TaxInterface>;
    codificacionPrograma?: string;
    comentarios?: string;
    impuestoNombres?: string;
    usuarioSolicitaCorreccion?: string;
    nombreEstado?:string;
    idEstadoAnterior?:number;




}
export interface TaxInterface {

    idImpuesto?: number;

}
