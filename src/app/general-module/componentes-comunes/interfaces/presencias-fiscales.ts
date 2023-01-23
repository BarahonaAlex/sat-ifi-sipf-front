import { alcanceDetalle } from "./alcances.interface.ts";

export interface PresenciasFiscales { 
    idPresencia?:number ;
    idFormulario?:number ;
    fechaInicio: Date ;
    fechaFin: Date ;
    lugarDepartamental: string ;
    idPrograma?: number ;
    meta: number ;
    idProceso?: string ;
    idEstado?:number ;
    usuarioModifica?: string ;
    fechaModifica?:Date ;
    usuarioCreacion?:string ;
    nombreEstado?:string;
    idTipoAlcance?:number;
    secciones?: alcanceDetalle[];
    idAlcance?:number;
    idGerencia?:number;
    lugarEjecucion?:string;
}
