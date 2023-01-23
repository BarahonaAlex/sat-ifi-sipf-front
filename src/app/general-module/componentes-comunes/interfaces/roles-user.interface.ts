export interface Operacion {
	listaRolesOID: string[];
	login: string;
}

export interface RolesUser {
	codigo: number;
	mensaje: string;
	operacion: Operacion;
	poseeRol: boolean;
	tipo: string;
}