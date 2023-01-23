export interface WalletAppointments {
    gerencia: string,
    idCaso: number,
    idGerencia: number,
    nombreInsumo: string,
    nitContribuyente: string,
    idPrograma: number,
    periodo:number,
    nombreImpuesto:number,
    estado:number,
    idAlcance:number,
    tipoAlcance:number,
    idFormulario:number,
    idDenuncia:string,
  
}
export interface DetailWallet{
    nombreGerencia: string,
    nitContribuyente: string,
    idProceso: string,
    montoRecaudado: number,
    idPrograma: number,
    idCaso: number,
    idGerencia: number
}
export interface approvedAll{
    IdCaso:number;
    IdGerencia:number;
    IdEstado: number;
    Siglas:string;
    Periodo:number;
}
export interface declineCase{
    idCaso?:number;
    comentario:string;
    tipoCaso:number;
    idEstado:number;
    idAlcance:number;
    idDenuncia?:string;
    tipo?:number;
}
