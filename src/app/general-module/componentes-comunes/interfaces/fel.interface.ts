export declare module Fel {
    interface queryParameters {
        anio: string,
        clavePaginaSiguiente: String | null,
        mes: string,
        nit: string,
        tipoOperacion: string
    }


    interface DET {
        totalPagina: number,
        clavePaginaSiguiente: String,
        data: DetailDTE[]
    }

    interface DetailDTE {
        nitEmisor: string,
        sello: string,
        nomEmisor: string,
        numeroAutorizacion: string,
        serie: string,
        numeroDocumento: string,
        tipo: string,
        fechaEmision: string,
        fechaCertificacion: string,
        nitReceptor: string,
        nomReceptor: string,
        total: string,
        establecimiento: string,
        estado: string,
        moneda: string,
        mun: string,
        cem: string,
        tab: string,
        ith: string,
        tap: string,
        itp: string,
        ifb: string,
        idb: string,
        idp: string,
        ibn: string,
        tdp: string,
        tipoCambio?: string
    }


}

