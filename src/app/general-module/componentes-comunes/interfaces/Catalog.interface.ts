import * as internal from "stream";

export interface Catalog {
  codigo?: any;
  codigoCatalogo?: any;
  codigoDatoPadre?: any;
  codigoIngresado?: any;
  nombre?: any;
  descripcion?: any;
  estado?: any;
  usuarioAgrega?: any;
  fechaAgrega?: any;
  usuarioModifica?: any;
  fechaModifica?: any;
  descripcionEstado?: any;
  descripcionDatoPadre?: any;
  valor?: string;
}

/**
* @description interface para mostrar catalogos padres administrables
* @author ajsbatzmo (Jamier Batz)
* @since 15/06/2022
*/
export interface ManageableCatalog {
  descripcion: string;
  id: number;
  nombre: string;
}

/**
* @description interface para mostrar catalogos hijos
* @author ajsbatzmo (Jamier Batz)
* @since 15/06/2022
*/
export interface Item {
  codigo: number;
  descripcion: string;
  estado: string;
  nombre: string;
  codigoIngresado?: string;
  nombrePadre?: string;
}
export interface ItemTwo {
  codigo: number;
  descripcion: string;
  estado: string;
  nombre: string;
  codigoIngresado: string;
  nombrePadre?: string;
}
/**
* @description interface para guardar catalogos hijos
* @author ajsbatzmo (Jamier Batz)
* @since 15/06/2022
*/
export interface CreateItem {
  codigoCatalogo: number;
  descripcion: string;
  nombre: string;
}

/**
* @description interface para actualizar catalogos hijos
* @author ajsbatzmo (Jamier Batz)
* @since 15/06/2022
*/
export interface EditItem {
  descripcion: string;
  nombre: string;
  isChangeState?: boolean;
}
