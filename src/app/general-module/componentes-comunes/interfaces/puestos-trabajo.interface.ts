export interface PuestosTrabajo {
	id?: number;
	idPadre: number | null;
	idUnidadAdministrativa: number;
	nombre: string;
	descripcion: string;
	idEstado: number;
}

export interface PuestosTrabajoPadres extends PuestosTrabajo {
	hijos: string
}




