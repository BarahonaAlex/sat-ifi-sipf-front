export interface BandejaCreditoFiscalResponse {
  total: number;
  idEstado: number;
  estado: string;
  idSolicitud: number;
  periodoFin: string;
  periodoInicio: string;
  creditoNoSolicitado: number;
  montoDevolucion: number;
  actividadEconomica: string;
  creditoSujetoDevolucion: string;
  principalProducto: string;
  nitContribuyente: string;
  formularioIva: string;
  multa: number;
  monto: number;
  nombreContribuyente: string;
  noFormulario: string;
  profesional: string;
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