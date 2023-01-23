export interface MassiveResumeDto {

    idGerencia: number;

    nombreGerencia: string;

    idTipoCaso: number;

    nombreTipoCaso: string;
    
    cantidad: number;
    
}

export interface MassiveAssignationParams{
    idGerencia: number;
    idTipoCaso: number;
    cantidadAsignar: number;
    idProfesional: string;
}
