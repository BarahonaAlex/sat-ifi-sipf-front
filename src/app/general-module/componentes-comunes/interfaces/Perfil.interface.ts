export interface PerfilInterface {
	nombre: string;
	idPerfil: number;
}

export interface crearPerfil {
	estado: number;
	idPerfil: number;
	nit: string;
}

export interface ProfileDetail {
	user: Operator;
	profiles: PerfilInterface[];
}

export interface Operator {
	estado: string;
	nit: string;
	nombre: string;
	puesto: string;
}

export interface OperatorGrups{

	puesto_trabajo: string;
    nombres: string;
    login: string;
    nombreEstado: string;
    id_gerencia: number;
    id_estado: number;
    correo: string;
    nit: string;
}