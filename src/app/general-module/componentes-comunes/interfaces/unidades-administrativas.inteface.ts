export interface UnidadesAdministrativas {
    id?: number;
    idPadre: number | null;
    nombre: string;
    descripcion: string;
    idEstado: number;
    nombreEstado?: String;
    idUnidadProsis?: number;
    idTipoProgramacion?: number;
}

export interface EquiposUnidadesAdministrativas {
    ///RECORDAR COLOCAR EL SIGNO DE INTERROGACION """?""" EN id?:number;
    id: number;
    idPadre: number | null;
    nombre: string;
    descripcion: string;
    idEstado: number;
    nombreEstado?: String;
}

export interface UnidadesAdministrativasPadres extends UnidadesAdministrativas {
    hijos: string
    hijosActivos: string;
    hijosInactivos: string;
    idGrupo: number;

    fechaCreacion: Date;
}

export interface AdministrativeUnitFromProsis {
    idPadre: number;
    idUnitOrg: number;
    shortUnitName: string;
    unitName: string;
}


