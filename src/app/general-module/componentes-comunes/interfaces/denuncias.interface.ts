import { alcanceDetalle } from "./alcances.interface.ts";

export interface GetDenuncias {

  compra: number
  correlativo: string;
  nit: string;
  nombre: string;
  producto: string;
  tipo: number
}

export interface Prueba {
  departamento: number;
  direccion: string;
  email: string;
  establecimiento: string;
  fechaPago: string;
  formaPago: string;
  municipio: number;
  nitDenunciado: string;
  nitDenunciante: string;
  nombreDenunciado: string;
  nombreDenunciante: string;
  observaciones: string;
  telDenunciante: string;
  valor: number;
}

export interface GetDetailDenuncias {
  region: number;
  estado: number;
  direccion: string;
  motivo: number;
  email: string;
  motivoNombre: string;
  nombreEstado: string;
  nitDenunciado: string;
  observaciones: string;
  formaPago: string;
  departamento: number;
  municipio: number;
  nitDenunciante: string;
  nombreDenunciante: string;
  nombreDenunciado: string;
  establecimiento: string;
  telDenunciante: string;
  nombreRegion: string;
  fechaPago: string;
  valor: number;
  departamentoNombre: string;
  nombre: string;
  compra: Date;
  idMotivo: number;
  nit: string;
  telefono: string;
  direDenunciado: string;
  nregion: string;
  tipo: number;
  idEstado: number;
 /*  compra: Date;
  departamento: string;
  direDenunciado: string;
  direccion: string;
  establecimiento: string;
  estado: string;
  formaPago: string;
  idMotivo: number;
  motivo: string;
  municipio: string;
  nit: string;
  nombre: string;
  nregion: string;
  region: number;
  telefono: string;
  valor: number; */
}

export interface Gerencias {
  nombre: string;
  codigo: number;
}

export interface DenunciaAP {
  correlativo: string;
  estado: string;
  nitDenunciado: string;
  nitDenunciante: string;
  insumo: number;
  nombreEstado: string;
}

export interface ComplaintsForProcess {
  correlativo: string;
  estado: number;
  insumo: number;
  nit: string;
  nitDenunciado: string;
  nitDenunciante: string;
}
export interface DenunciaNAP {
  correlativo: string;
  estado: string;
  nitDenunciado: string;
  nitDenunciante: string;
  insumo: number;
}

export interface ProcesosMasivos {
  nombre: string;
  codigo: number;
}

export interface CatalogComplaints {
  codigo: number;
  codigoIngresado: number;
  descripcion: string;
  nomre: string;
}
export interface AlcanceDenuncia {
  correlativo?: string;
  idTipoAlcance: number;
  secciones: alcanceDetalle[];
  correlativos?: string[];
}
export interface StatusDenuncia {
  direccion: string,
  estado: number,
  idproceso: number
  idregion: number
}

export interface editComplaints {
  estado: number,
  idProceso: number,
  idregion: number
}

export interface CabinetComplaints {
  nitDenunciado: string;
  nitDenunciante: string;
  nombreDenunciante: string;
  nombreDenunciado: string;
  nit?: any;
  correlativo: string;
  insumo: number;
  estado: number;
  telDenunciante: string;
  estadoNombre?: any;
}
export interface StatusDenunciaNAP {
  estado: number,
  idProceso: number,
  idregion: number
}

export interface Scope {
  idAlcance: number;
  nombreEstado: string;
  nombreTipo: string;
  estado: number;
}