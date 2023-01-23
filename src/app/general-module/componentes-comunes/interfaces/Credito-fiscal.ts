import { MatListSubheaderCssMatStyler } from "@angular/material/list";

export interface solicitudes {
    actividadEconomica: string;
    estado: string;
    idSolicitud: number;
    numeroFormulario: string;
    pfin: string;
    pinicio: string;
    periodo: string;
    nit: string;
    numero: number;
    idEstado: number;
}
export interface saveArchivo {
    idSolicitud: number;
    periodo: string;
    archivo: FormData;
}

export interface dataFormularioCf {
  resultadoContribuyente: dataContribuyente;
  resultadoRepresentante: dataRepresentante,
  resultadoContador: dataContador
}

export interface dataContribuyente {
  nit: string;
  cui: string;
  nombre: string;
  calleAvenida: string;
  municipio: string;
  departamento: string;
  tipoPersona: number;
  codigoActividad: string;
  nombreActividad: string;
  status: string;
  clasificacion: string;
}
export interface dataRepresentante {
  nitRepresentado: string;
  nitRepresentante: string;
  nombreRepresentante: string;
  fechaNombramiento: string;
  principal: string;
  direccionInvalida: string;
  tipoPersona: number;
}

export interface dataContador {
  nitContador: string;
  cui: string;
  nombreContador: string;
  tipoPersona: string;
  status: string;
  color: string;
}

export interface dataCalculoDeclaraciones {
  mes: number;
  anio: number;
  version: string;
  codigoFormulario: number;
  numeroDocumento: number;
  solicitudRegimen: string;
  periodoDel: string;
  periodoAl: string;
  numeroMes: number;
  creditos_locales: string;
  creditos_exportacion: string;
  creditoMenosDebito: string;
  multa: string;
  debitos: string;
  montoCalculado: string;
  montoSolicitud: string;
  anioFiscal: number;
  fechaRecaudo: string;
  ivaExcenciones: string;
  remanentes: string;
  facturasEspecialesCF: string;
  totalExportaciones: string;
  creditoNoSolicitado: string;
  retenciones: string;
}

export interface periodoNitParams {
  nit: string;
  periodoDesde: string;
  periodoHasta: string;
}

export interface periodoNitParamsCarga extends periodoNitParams {
  idSolicitud: number
  numero: number
}

export interface Variations {
  tipo: number,
  idRegistro: number,
  noSolicitud: number
}

export interface dataSaveSolicitud {
    anio?: number;
    codFormIvaGen?: string;
    codigoFormulario?: string;
    correoNotificacion?: string;
    desistimiento?: string;
    direccionNotificacion?: string;
    estado?: string;
    expIvaGen?: string;
    fechaBitacora?: string;
    fechaGrabacion?: string;
    fechaImpresion?: string;
    idEstado?: string;
    montoSolicitud?: string;
    nitContribuyente?: string;
    nitRepresentante?: string;
    nitResponsableImpresion?: string;
    noFormIvaGen?: string;
    numeroExpediente?: string;
    numeroSolicitud?: string;
    periodoDesde?: string;
    periodoHasta?: string;
    principalProducto?: string;
    productoExportacion?: string;
    tooltip?: string;
    usuarioGrabacion?: string;
    declaraciones?: dataCalculoDeclaraciones[];
}


export interface SolicitudPost {
datosSolicitud: DatosSaveSolicitud;
datoslistaDeclaracion: DatosSavelistaDeclaracion[];
}

export interface DatosSavelistaDeclaracion {
anio?: number;
anioFiscal?: number;
codigoDeclaracion?: number;
codigoFormulario?: number;
creditoMenosDebito?: number;
creditoNoSolicitado: number;
creditos_exportacion?: number;
creditos_locales?: number;
debitos?: number;
facturasEspecialesCF?: number;
fechaRecaudo?: Date;
ivaExcenciones?: number;
mes?: number;
montoCalculado?: number;
montoSolicitud?: number;
multa?: number;
nombreMes?: string;
numeroDocumento?: number;
numeroFormulario?: string;
numeroMes?: number;
periodoAl?: Date;
periodoDel?: Date;
productoExportacion?: string;
remanentes?: number;
retenciones?: number;
solicitudRegimen?: string;
totalExportaciones?: number;
valor?: number;
valorSolicitar?: number;
version?: string;
}

export interface DatosSaveSolicitud {
anio?: string;
codFormIvaGen?: string;
codigoFormulario?: string;
correoNotificacion?: string;
desistimiento?: string;
direccionNotificacion?: string;
estado?: string;
expIvaGen?: string;
fechaBitacora?: string;
fechaGrabacion?: string;
fechaImpresion?: string;
idEstado?: number;
montoSolicitud?: number;
nitContribuyente?: string;
nitRepresentante?: string;
nitResponsableImpresion?: string;
noFormIvaGen?: number;
numeroExpediente?: string;
numeroSolicitud?: number;
periodoDesde?: Date;
periodoHasta?: Date;
principalProducto?: string;
productoExportacion?: string;
tooltip?: string;
usuarioGrabacion?: string;
}
export interface BandejaCreditoFiscalResponse {
    idEstado?: number;
    estado: string;
    idSolicitud: number;
    nitContribuyente?: string;
    multa: number;
    montoRecaudado: number;
    nombreContribuyente: string;
    numeroFormulario: string;
    profesional?: string;
  }
  
  export interface CreditoFiscalResponse {
      idSolicitud: number;
      numeroFormulario: string;
      nitContribuyente: string;
      periodoInicio: string;
      periodoFin: string;
      actividadEconomica: string;
      principalProducto: string;
      formularioIva: string;
      creditoSujetoDevolucion: string;
      monto: number;
      creditoNoSolicitado: number;
      montoDevolucion: number;
      multa: number;
      total: number;
      asignado: string;
      estado: number;
      usuarioModifica: string;
      fechaModifica: string;
      ipModifica: string;
      documentosRespaldo ?: string;
      idArchivo?: number;
      nombre?: string;
      idEstado?: number;
      periodo?: string;
      comentario?: string;
    }
  
  export interface FindingDetail{
    periodoDesde: string;
    periodoHasta: string;
    nitProveedor: string;
    facturaSerie: string;
    noFactura: number;
    inconsistencia: string;
    tipoRepetida: string;
    repetidaEn: string;
    observacion: string;
  }
  
  export interface DocumentResponse{
    nombre: string;
    estado: string;
  
  }
  
  export interface VariablesPlantilla{
    noTramite: string;
    fecha: string;
    noFormulario: string;
    fechaFormulario: Date;
    representanteLegal: string;
    nitRepresentante: string;
  }
  
  export interface InconsistenciaDoc{
    nombreDoc: string;
    estado: string;
    inconsitencia: string;
  }
  
  export interface CedulaVerificacionParams{
    contribuyente: string;
      nitContribuyente: string;
      periodoInicio: string;
      periodoFin: string;
      marcaFel: string;
      marcaRegimen: string;
      marcaEnvio: string;
      marcaDocs: string;
      marcaLibros: string;
  }
  
  export interface InconsistenciasResponse{
    idInconsistencia: number;
    numeroDeclaracion: number;
    tipoInconsistencia: number;
    descripcion: string;
    fechaGrabacion: Date;
    usuarioGrabacion: string;
    numeroSolicitud: number;
    tipoRepetida: number;
    declaracionRepetida: number;
    facturaProveedor: string;
    facturaSerie?: string;
    facturaNumero?: number;
  }

  export interface RejectApproveDocumentParam {
  comentario: string;
  idArchivo: number;
  idEstado: number;
}

export interface BandejaIncosistenicasResponse {
  declaracionRepetida: number;
  facturaProveedor: string;
  facturaSerie: string;
  idInconsistencia: number;
  noFactura: string;
  observacion: string;
  periodoDesde: string;
  periodoHasta: string;
  tipoInconsistencia: string;
  tipoRepetida: number;
  idEstado: number;
  estado: string;
}

export interface DataExtraResponse{
  idSolicitud: number;
  idEstado: number;
  nitContador: string;
  nitRepresentante: string;
  nombreContador: string;
  nombreRepresentante: string;
  comentario: string;
}

export interface RejectedEmail {
  idSolicitud: number;
  comentario: string;
}

export interface dataSolicitud {
  actividadEconomica: string;
  asignado: string;
  correoNotifica: string;
  creditoNoSolicitado: number;
  creditoSujetoDevolucion: string;
  direccionNotifica: string;
  documentosRespaldo: string;
  estado: number;
  fechaModifica: string;
  formularioIva: string;
  idSolicitud: number;
  ipModifica: string;
  monto: number;
  montoDevolucion: number;
  multa: number;
  nitContribuyente: string;
  numeroFormulario: string;
  numeroSolicitud: number;
  periodoFin: string;
  periodoInicio: string;
  principalProducto: string;
  total: number;
  usuarioModifica: string;
}



