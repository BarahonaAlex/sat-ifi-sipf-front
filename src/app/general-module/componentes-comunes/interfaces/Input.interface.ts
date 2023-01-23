import { Comentario } from "./casos.interface";

export interface InputInterface {
    idInsumo: number;
    nombreInsumo: string;
    cantidadCasos: number;
    idGerencia: number;
    nitEncargado: string;
    idEstado: number;
    idEstadoAnterior: number;
    montoRecaudo: number;
    idDepartamento: number;
    idImpuesto: number;
    casosAasignar: number;
    idUnidadAdministrativa: number;
    descripcion: string;
    nombreDepartamento: string;
    /* impuestos?: InputInterfaceTaxes[]; */
    nombreImpuesto: string;
    fechaPublicacion: Date;
    nombreEstado: string;
    nombreGerencia: string;

    comentarioSuspender:string;
    usuarioPublica: string;
    fechaPublica: Date;
}

export interface InputInterfaceComentario {
    insumo: InputInterface;
    comentario: Comentario;
}



