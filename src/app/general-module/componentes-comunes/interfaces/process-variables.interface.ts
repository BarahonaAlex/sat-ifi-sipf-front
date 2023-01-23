export interface ProcessVariables {
    name: string,
    type: string,
    value: object
}

export interface IniciarProceso {
	id: string;
	key: string;
	name: string;
	variables: ProcessVariables[];
	version: string;
}