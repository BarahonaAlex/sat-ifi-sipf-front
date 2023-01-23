export interface Insumo {
    nombreInsumo: string;
    idGerencia: number;
    idTipoCaso?: number;
    idTipoInsumo?: number;
    idDepartamento: number;
    idEstado?: number;
    descripcion: string;
    casos?: Caso[];
}

export interface Caso {
    nitContribuyente: string;
    impuestos: number[];
    periodoRevisionInicio: Date;
    periodoRevisionFin: Date;
    montoRecaudado: number;
    requiereDocumentacion: string;
    nombreContribuyente?: string;
    periodoRevisionInicioStr: string;
    periodoRevisionFinStr: string;
    loginProfesional?: string;
    nombreProfesional?: string;
}

export interface input {
    idEstado?: number;
    idImpuesto?: number;
    idInsumo?: number;
    idGerencia?: number;
    descripcion?: string;
    cantidadCasos?: number;
    montoRecaudo?: number;
    nitEncargado?: null;
    nombreInsumo?: string;
    nombreGerencia?: string;
    idDepartamento?: number;
    nombreDepartamento?: string;
    nombreImpuesto?: string;
    fichaTecnica?: string;
    impuesto?: CaseTaxesInterface[];
    comentario?: string;
}

export interface CaseTaxesInterface {
    nombreimpuesto: string;
    idimpuesto: number
}

export interface inputStatus {
    nombreEstado: string;
    idEstado: number;
    idCaso: number;
    idGerencia: number;
    idImpuesto: number;
    idTipoAlcance: number;
    nombreCaso: string;
    nombreImpuesto: string;
    nitContribuyente: string;
    nombreGerencia: string;
    periodoRevisionInicio: Date;
    nombreDepartamento: string;
    idFichaTecnica: string;
    periodoRevisionFin: Date
}
export interface listDocument {
    nombre: string;
    nodeId: string;
    icon?: string;
    createdAt?: string;
}

export interface ParamsDucas {//interfaz para enviar parametros
    numeroOrden: string;
}

export interface DataDucas {//interfaz data de las ducas
    numeroOrden: string;
    numeroDuca: string;
    fechaAceptacion: string;
    regimen: string;
    selectivo: string;
    paisProveedor: string;
    capituloDeclarado: string;
    partidaDeclarada: string;
    incisoDeclarado: string;
    tasaDAI: number;
    tributo: string;
    valorTributo: number;
    unidadMedida: string;
    cantidadUnidades: number;
    valorUnitario: number;
    tratoArancelarioPrefe1: string;
    ptratoArracelarioPrefe2: string;
}

export interface DucasResponse {//interfaz general de las ducas
    message: string;
    code: number;
    type: string;
    data: DataDucas[];//interfaz data de las ducas
}
export interface CarteraAllCases {
    idAlcance: number;
    tipoAlcance: number;
    nombreTipoAlcance: string;
    estado: number;
    nombreEstado: string;
    idCaso: number;
    idFormulario: number;
    idDenuncia: string;
}
export interface ResponsableCases {
    idAlcance: number;
    idCaso: number;
    idEstado: number;
    nitColaborador: string;
    nombreColaborador: string;
    nombreUsuarioModifica: string;
    usuarioModifica: string;

}