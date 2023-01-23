import { Moment } from "moment";

export declare module RetenIsrInterface {

export interface RetenIsrParams {
    pNitAgenteR?: any;
    pPeriodoR?: any;
    pNitSujetoR?: any;
    pTipoConsulta?: any;
    pTipoRetencion?: any;
    pEstado?: any;
}



export interface RetenIsrRcDataInterface {

    fecha_RETENCION?: any;
    codigo_FORMULARIO?: any;
    usuario_INGRESO?: any;
    version_FORMULARIO?: any;
    numero_FORMULARIO?: any;
    descripcion?: any;
    nombre_ESTADO?: any;
    base?: any;
    nit_SUJETO_R?: any;
    tipo_RENTA?: any;
    retencion?: any;
    nit_AGENTE_R?: any;
    nombre?: any;
}

export interface RetenIsrOsDataInterface {

    serie_DOCUMENTO?: any;
    fecha_DOCUMENTO?: any;
    usuario_INGRESO?: any;
    numero_DOCUMENTO?: any;
    codigo_FORMULARIO?: any;
    version_FORMULARIO?: any;
    numero_FORMULARIO?: any;
    fecha_IMPRESION?: any;
    concepto?: any;
    retencion?: any;
    nit_PROVEEDOR?: any;
    nombre_ESTADO?: any;
    base?: any;
    nombre_PROVEEDOR?: any;
    nit_AGENTE_R?: any;
}
}


            