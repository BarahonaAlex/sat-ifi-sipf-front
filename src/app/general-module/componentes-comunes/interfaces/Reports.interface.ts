export interface AnnualAuditPlan {
	anio: number;
    mes: number;
	idDepartamento: number;
	idGerencia: number;
    meta: number;
    indicadorAsertividad: number;
}

export interface AnnualGeneralPlanResponse {
	indicador?: number;
	anio?: number;
    mes?: number;
    id?: number;
    gerencia: string;
    selectivo: number;
    masivo: number;
	comex: number;
	fiscaInter: number;
	totalGerencia?: number
}

export interface AnnualManagmentPlanResponse {
	anio: number;
    mes: number;
    idGerencia: number;
	gerencia: string;
	meta: number;
	trabajadas: number;
	porcentajeGerencia: number;
}

export interface AnnualAuditPlanResponse {
	anio: number;
    mes: number;
    idAuditoria: number;
	auditoria: string;
	metas: number;
	trabajadas: number;
	porcentajeAuditoria: number;
}

export interface YearPlan {
	indicador?: number;
	anio: number;
}
	
	
	