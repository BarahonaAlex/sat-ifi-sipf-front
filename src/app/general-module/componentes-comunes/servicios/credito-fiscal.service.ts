import { DataExtraResponse, dataFormularioCf, RejectedEmail } from './../interfaces/Credito-fiscal';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

import { BandejaCreditoFiscalResponse, BandejaIncosistenicasResponse, CreditoFiscalResponse, dataCalculoDeclaraciones, dataContador, dataContribuyente, dataRepresentante, dataSolicitud, DatosSavelistaDeclaracion, DatosSaveSolicitud, InconsistenciasResponse, periodoNitParams, RejectApproveDocumentParam, saveArchivo, solicitudes, SolicitudPost, Variations } from '../interfaces/Credito-fiscal';
import { environment } from 'src/environments/environment';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { Param } from '../clases/Params';
import { Catalog } from '../interfaces/Catalog.interface';

@Injectable({
  providedIn: 'root'
})
export class CreditoFiscal {

  BASE_PROGRAMA_URL = `${environment.API_IFI_SIPF}/fiscal/credit`;

constructor(private servicioGeneral: GeneralService) { }
getSolicitudesCreditoFiscal():Observable<solicitudes[]>{
  return this.servicioGeneral.getData<solicitudes[]>(`${environment.API_IFI_SIPF}/fiscal/credit/solicitudes/contribuyente`)
}
saveLibros(file: FormData): Observable<saveArchivo>{
  return this.servicioGeneral.postData<saveArchivo, FormData>(`${environment.API_IFI_SIPF}/fiscal/credit/save/libros`, file)
}
getDataContribuyente(idSolicitud?: string):Observable<dataFormularioCf[]>{
  const params: Param[] = [
    {idSolicitud: idSolicitud}
 ]
  return this.servicioGeneral.getData<dataFormularioCf[]>(`${environment.API_IFI_SIPF}/fiscal/credit/findDatosContribuyente`,params)
}
getRepresentantes(nitContribuyente: string):Observable<dataRepresentante[]>{
  return this.servicioGeneral.getData<dataRepresentante[]>(`${environment.API_IFI_SIPF}/fiscal/credit/ObtenerRepresentantes/${nitContribuyente}`)
}
getContador(nitContador: string):Observable<dataContador[]>{
  return this.servicioGeneral.getData<dataContador[]>(`${environment.API_IFI_SIPF}/fiscal/credit/obtenerDatosCondador/${nitContador}`)
}
getCalculoDeclaraciones(nitContribuyente: string, periodoDesde: string, periodoHasta: string){
  const data: periodoNitParams = {
      nit: nitContribuyente,
      periodoDesde: periodoDesde,
      periodoHasta: periodoHasta
  }
  return this.servicioGeneral.postData<DatosSavelistaDeclaracion[], Object>(`${environment.API_IFI_SIPF}/fiscal/credit/obtenerDeclaracionesPost`, data)
}
saveSolicitudService(solicitud: DatosSaveSolicitud, declaraciones: DatosSavelistaDeclaracion[]): Observable<Boolean>{
  const data: SolicitudPost = {
    datosSolicitud: solicitud,
    datoslistaDeclaracion: declaraciones,
}
  return this.servicioGeneral.postData<Boolean, SolicitudPost>(`${environment.API_IFI_SIPF}/fiscal/credit/saveSolicitud`, data);
}

getPath(parametros: object): Observable<acsRoot> {
  return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/ARCHIVOS_RESPALDO_CREDITO_FISCAL`, parametros)
}

getCreditoFiscalDocumentoById(id: number, estado: number): Observable<CreditoFiscalResponse[]>{

  return this.servicioGeneral.getData(`${this.BASE_PROGRAMA_URL}/file/information/${id}/${estado}`);
}

putNewDocument(texto: any, id: number): Observable<any>{

  return this.servicioGeneral.putData(`${this.BASE_PROGRAMA_URL}/update/status/documents/${id}`,'',texto);

}

getCreditFiscalById(id: number): Observable<CreditoFiscalResponse>{
  return this.servicioGeneral.getData<CreditoFiscalResponse>(`${this.BASE_PROGRAMA_URL}/findFiscalCreditRequests/${id}`);
}

getAllFiscalCreditByStatusAndProfetional(): Observable<BandejaCreditoFiscalResponse[]>{
  
  return this.servicioGeneral.getData<BandejaCreditoFiscalResponse[]>(`${this.BASE_PROGRAMA_URL}/find/profetional/request`);
}

updateStatusByProfetional(form: FormData): Observable<Boolean>{
   return this.servicioGeneral.postData<Boolean,FormData>(`${this.BASE_PROGRAMA_URL}/update/status`, form);
}


generationCedula(data: String):Observable<Blob>{
return this.servicioGeneral.postData<Blob, String>(`${this.BASE_PROGRAMA_URL}/generation/cedula`, data, { responseType: 'blob' });
}

deletePdf() {                            
return this.servicioGeneral.deleteData(`${this.BASE_PROGRAMA_URL}/delete/generation/cedula`);
}

getInconsistencyByRequest(idSolicitud: number):Observable<BandejaIncosistenicasResponse[]>{
return this.servicioGeneral.getData<BandejaIncosistenicasResponse[]>(`${this.BASE_PROGRAMA_URL}/inconsistency/${idSolicitud}`);
}

uploadBackFiles(form: FormData):Observable<Boolean>{
  return this.servicioGeneral.postData<Boolean, FormData>(`${this.BASE_PROGRAMA_URL}/upload/file/period`, form);
}

rejectApproveFiscalDocument(comment: string, idDocument: number, idStatus: number):Observable<CreditoFiscalResponse>{
  const parametros: RejectApproveDocumentParam ={
    comentario: comment,
    idArchivo: idDocument,
    idEstado: idStatus
  }

  return this.servicioGeneral.postData<CreditoFiscalResponse, RejectApproveDocumentParam>(`${this.BASE_PROGRAMA_URL}/reject/approve/file`,parametros);
}
hasVariations(tipo: number, idRegistro: number, noSolicitud: number):Observable<Variations>{
  const params: Param[] = [
    {docType: tipo},
    {idDoc: idRegistro}
  ]
  console.log(params);
  return this.servicioGeneral.getData<Variations>(`${environment.API_IFI_SIPF}/fiscal/credit/has/variations/${noSolicitud}`,params)
}

getDeclaracionesUploadFiles(nitContribuyente: string, periodoDesde: string, periodoHasta: string){
  const data: periodoNitParams = {
      nit: nitContribuyente,
      periodoDesde: periodoDesde,
      periodoHasta: periodoHasta
  }
  return this.servicioGeneral.postData<dataCalculoDeclaraciones[], Object>(`${environment.API_IFI_SIPF}/fiscal/credit/obtenerDeclaracionesPost`, data)
}
getRequestAdmitedService():Observable<solicitudes[]>{
  return this.servicioGeneral.getData<solicitudes[]>(`${environment.API_IFI_SIPF}/fiscal/credit/solicitudes/admited`)
}

assignSolicitud(idSolicitud: number, nit: String): Observable<CreditoFiscalResponse>{
  const params: Param[] = [
      {id: idSolicitud},
      {nit: nit}
   ]
  return this.servicioGeneral.putData<CreditoFiscalResponse,any>(`${this.BASE_PROGRAMA_URL}/assing/solicitud`, params);
}

getDataSolicitudFull(idSolicitud: number):Observable<dataSolicitud>{
  return this.servicioGeneral.getData<dataSolicitud>(`${this.BASE_PROGRAMA_URL}/findFiscalCreditRequests/${idSolicitud}`);
  }

  getExtraDataRequest(id: number): Observable<DataExtraResponse>{

    return this.servicioGeneral.getData(`${this.BASE_PROGRAMA_URL}/extra/data/${id}`);
  }

  updateInconsistency(idSolicitud: number, idEstado: number):Observable<Boolean>{
    const params: Param[]=[
      {id: idSolicitud},
      {status: idEstado}
    ]
    return this.servicioGeneral.putData(`${this.BASE_PROGRAMA_URL}/update/inconsistency`, params)
  }

putSendEmailRejected(detalleRechazo: RejectedEmail):Observable<RejectedEmail>{
  return this.servicioGeneral.putData<RejectedEmail, RejectedEmail>(`${this.BASE_PROGRAMA_URL}/email/rejected`, '' , detalleRechazo)
} 

putSendEmailAccept(idSolicitud: number):Observable<Object>{
  return this.servicioGeneral.putData<Object, Object>(`${this.BASE_PROGRAMA_URL}/email/accept/${idSolicitud}`)
} 

getFileNames(period: string, status: number[]): Observable<Catalog[]>{
  const params: Param[]=[
    {periodo: period},
    {status: status}
  ]
  return this.servicioGeneral.getData<Catalog[]>(`${this.BASE_PROGRAMA_URL}/filenames`, params)
}
}
