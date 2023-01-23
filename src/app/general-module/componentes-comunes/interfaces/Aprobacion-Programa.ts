export interface AprobacionPrograma {
    idGerencia: number,
    nombreGerencia: string,
    casos: number
}
export interface DetalleAprobacionPrograma {
    idGerencia: number,
    idPrograma: number,
    cantidad: number,
    periodo:number
}