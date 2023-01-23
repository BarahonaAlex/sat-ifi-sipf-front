
export interface Reasignacion {	
	id: number;
	nit: string;
}


export interface obtenerCasos {
	estado: string;
	nit: string;
	nombre: string;
	origen: string;
	idInsumo: number;
}

export interface Profecionales {
	nit: string;
	nombreprofecional: string;
}