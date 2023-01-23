import { addProgram, CreateAndModifyMassiveCaseInterface, CreateMassiveScopeInterface, DeleteMassiveCaseInterface, GetMassiveScopeInterface, GetMassiveScopeVersionInterface, ModifyMassiveScopeInterface } from './../interfaces/AlcancesInterface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetMassiveCasesInterface, ScopeProgram } from 'src/app/general-module/componentes-comunes/interfaces/AlcancesInterface';
import { environment } from 'src/environments/environment';
import { ActualizarSeccion, ActualizarSeccionGeneral, AgregarPrograma, alcance, alcanceComentario, desarrolloPrueba, docPdf, ElaboracionAlcance, ElaboracionDatosComplementarios, ElaboracionDatosGenerales, generalalcance, GetSectionCase, ObtenerColaboradores, Programas, SeccionCaso, SeccionPrueba, taxpayer } from '../interfaces/alcances.interface.ts';
import { GeneralService } from './general.service';
import { Param } from '../clases/Params';
import { FiscalProgramInterface } from '../interfaces/FiscalProgram.interface';
import { Catalog } from '../interfaces/Catalog.interface';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { CaseList, CasoComentario } from '../interfaces/casos.interface';

@Injectable({
  providedIn: 'root'
})
export class AlcancesService {
  private API_SPIF: string = environment.API_IFI_SIPF;
  constructor(private generalService: GeneralService) { }

  getCaseMassive(): Observable<GetMassiveCasesInterface[]> {
    return this.generalService.getData<GetMassiveCasesInterface[]>(`${this.API_SPIF}/scope/massive/scope/cases`);
  }

  createScopeSection(SeccionCaso: SeccionCaso): Observable<SeccionCaso> {
    return this.generalService.postData<SeccionCaso, SeccionCaso>(`${this.API_SPIF}/scope/massive/section/case`, SeccionCaso)
  }
  getScopeMassive(): Observable<GetMassiveScopeInterface[]> {
    return this.generalService.getData<GetMassiveScopeInterface[]>(`${this.API_SPIF}/scope/get/scope/massive`);
  }

  getScopeVersionMassive(id: any): Observable<GetMassiveScopeVersionInterface[]> {
    return this.generalService.getData<GetMassiveScopeVersionInterface[]>(`${this.API_SPIF}/scope/get/scope/massive/version/`, id);
  }

  /**
    * @description Servicio para obtener los programas fiscales en base a su idEstado
    * @author alfvillag (Luis Villagran)
    * @since 09/02/2022
    */
  getFiscalPrograms(idStatus: any, idType: any): Observable<ScopeProgram[]> {
    return this.generalService.getData<ScopeProgram[]>(environment.API_IFI_SIPF, `fiscal/program/?idStatus=107`);
  }
  /**
     * @description Servicio para agregar un programa fiscal a la tabla de casos
     * @author alfvillag (Luis Villagran)
     * @since 09/02/2022
     */
  addFiscalProgram(add: addProgram, idCasos: number): Observable<addProgram> {
    return this.generalService.putData<addProgram, addProgram>(environment.API_IFI_SIPF, `cases/${idCasos}`, add)
  }

  disassociateFiscalProgram(diss: addProgram, idCasos: number): Observable<addProgram> {
    return this.generalService.putData<addProgram, addProgram>(environment.API_IFI_SIPF, `cases/program/${idCasos}`, diss)
  }

  getSection(idCaso: number): Observable<any[]> {
    return this.generalService.getData<GetSectionCase[]>(`${this.API_SPIF}/scope/massive/section/${idCaso}`)
  }

  changeStatusSection(idCaso: number, idEstado: number): Observable<SeccionCaso> {
    return this.generalService.putData<SeccionCaso, SeccionCaso>(`${this.API_SPIF}/scope/general/status`, [{ key: 'idCaso', value: idCaso.toString() }, { key: 'idEstado', value: idEstado.toString() }])
  }
  getPrograms(idStatus: number, regional?: number, idProgramType?: number): Observable<FiscalProgramInterface[]> {
    const params: Param[] = [
      { idProgramType: idProgramType?.toString() },
      { idRegional: regional?.toString() },
      { idStatus: idStatus?.toString() }
    ];
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.API_SPIF}/fiscal/program`, params);
  }

  DeleteMassiveScopeToCase(idTipoTransaccion: number, deleteData: DeleteMassiveCaseInterface): Observable<DeleteMassiveCaseInterface> {
    return this.generalService.putData<DeleteMassiveCaseInterface, DeleteMassiveCaseInterface>(`${this.API_SPIF}/scope/massive/scope/assign/modify/delete`, [{ key: 'op', value: idTipoTransaccion.toString() }], deleteData);
  }

  createAndModifyMassiveScopeToCase(idTipoTransaccion: number, putData: CreateAndModifyMassiveCaseInterface): Observable<CreateAndModifyMassiveCaseInterface> {
    return this.generalService.putData<CreateAndModifyMassiveCaseInterface, CreateAndModifyMassiveCaseInterface>(`${this.API_SPIF}/scope/massive/scope/assign/modify/delete`, [{ key: 'op', value: idTipoTransaccion.toString() }], putData);
  }

  modifyMassiveScopeStatus(idMassiveScope: number, idVersion: number): Observable<GetMassiveScopeVersionInterface> {
    return this.generalService.putData<GetMassiveScopeVersionInterface, GetMassiveScopeVersionInterface>(`${this.API_SPIF}/scope/modify/scope/massive/status`, [{ key: 'idMassiveScope', value: idMassiveScope.toString() }, { key: 'ver', value: idVersion.toString() }]);
  }

  modifyMassiveScope(data: ModifyMassiveScopeInterface): Observable<GetMassiveScopeVersionInterface> {
    return this.generalService.postData<GetMassiveScopeVersionInterface, ModifyMassiveScopeInterface>(`${this.API_SPIF}/scope/modify/scope/massive`, data);
  }

  createMassiveScope(data: CreateMassiveScopeInterface): Observable<GetMassiveScopeVersionInterface> {
    return this.generalService.postData<GetMassiveScopeVersionInterface, CreateMassiveScopeInterface>(`${this.API_SPIF}/scope/create/scope/massive`, data);
  }


  obtenerColaborador(id: number): Observable<ObtenerColaboradores> {
    return this.generalService.getData<ObtenerColaboradores>(environment.API_IFI_SIPF, `insumo_datos_complementarios/contribuyente/${id}`);
  }


  EliminarSeccion(id: number): Observable<boolean> {
    return this.generalService.deleteData<boolean>(environment.API_IFI_SIPF, `insumo_datos_complementarios/${id}`);
  }

  EliminarSeccionGenerales(id: number): Observable<boolean> {
    return this.generalService.deleteData<boolean>(environment.API_IFI_SIPF, `insumo_datos_generales/${id}`);
  }

  CrearSeccion(alcancesGenerales: ElaboracionDatosGenerales): Observable<ElaboracionAlcance> {
    return this.generalService.postData<ElaboracionAlcance, ElaboracionDatosGenerales>(`${environment.API_IFI_SIPF}/insumo_datos_generales/datosGenerales`, alcancesGenerales);
  }

  CrearSeccionComplementarios(alcancesComplementarios: ElaboracionDatosComplementarios): Observable<ElaboracionAlcance> {
    return this.generalService.postData<ElaboracionAlcance, ElaboracionDatosComplementarios>(`${environment.API_IFI_SIPF}/insumo_datos_complementarios/`, alcancesComplementarios);
  }
  /*
  autor:jdaldana
  */
  getPath(parametros:object):Observable<acsRoot> {
    return this.generalService.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/RUTA_BASE_CASO`, parametros)
  }
  getAntecedentes(nit:number):Observable<taxpayer>{
    //tax/payer/audit/historial/112
    return this.generalService.getData<taxpayer>(`${environment.API_IFI_SIPF}/tax/payer/audit/historial/${nit}`);
  }
  getDataCase(id:number):Observable<CasoComentario>{
    //tax/payer/audit/historial/112
    return this.generalService.getData(`${environment.API_IFI_SIPF}/cases/${id}`);
  }
  getFindings(id:number):Observable<any>{
    //tax/payer/audit/historial/112
    return this.generalService.getData(`${environment.API_IFI_SIPF}/findings/${id}`);
  }
  generationScope(datos: alcance):Observable<any> {                            //
    return this.generalService.postData(`${environment.API_IFI_SIPF}/scope/massive/general`, datos);
  }
  generationPdf(datos: docPdf):Observable<Blob> {                            //
    return this.generalService.postData<Blob,docPdf>(`${environment.API_IFI_SIPF}/scope/massive/generation/file`, datos, { responseType: 'blob' });
  }
  deletePdf() {                            //
    return this.generalService.deleteData(`${environment.API_IFI_SIPF}/scope/massive/delete/generation/file`);
  }
  authorizerPdf(datos: docPdf):Observable<boolean> {                            //
    return this.generalService.putData<boolean,docPdf>(`${environment.API_IFI_SIPF}/scope/massive/authorizer/file/${datos.idCaso}`,"" ,datos);
  }
  getTemplate(id: number):Observable<any>{
    return this.generalService.getData(`${environment.API_IFI_SIPF}/template/documents/findTemplates/${id}`);
  }
  getProgram(id:number):Observable<any>{
    return this.generalService.getData(`${environment.API_IFI_SIPF}/fiscal/program?idProgramType=87&idStatus=108`);
  }
  getScopePresencias(id:number):Observable<alcanceComentario>{
    return this.generalService.getData(`${environment.API_IFI_SIPF}/scope/massive/scopes/presence/${id}`);
  }
  getScopeSelectiva(id:number):Observable<alcanceComentario>{
    return this.generalService.getData(`${environment.API_IFI_SIPF}/scope/massive/scopes/selectiva/${id}`);
  }
  /**
     * @description Servicio para traer los alcance de gabinete.
     * @author Gabriel Ruano (garuanom)
     * @since 21/09/2022
     */
   getCabinet(idAlcance: number): Observable<generalalcance[]> {
    return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/cabinet/${idAlcance}`)
  }
  
  /**
     * @description Servicio para traer los alcance de presencia.
     * @author Gabriel Ruano (garuanom)
     * @since 21/09/2022
     */
   getPresence(idAlcance: number): Observable<generalalcance[]> {
    return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/presence/${idAlcance}`)
  }
  
  /**
     * @description Servicio para traer los alcance de puntos fijos.
     * @author Gabriel Ruano (garuanom)
     * @since 21/09/2022
     */
   getPoint(idAlcance: number): Observable<generalalcance[]> {
    return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/points/${idAlcance}`)
  }

  /**
     * @description Servicio para autorizar alcance.
     * @author Gabriel Ruano (garuanom)
     * @since 27/09/2022
     */
   ApproveJu(idAlcance: number): Observable<generalalcance> {
    return this.generalService.putData<generalalcance,generalalcance>(environment.API_IFI_SIPF, `scope/massive/autorizar/ju/${idAlcance}`)
  }

  /**
     * @description Servicio para rechazar alcance.
     * @author Gabriel Ruano (garuanom)
     * @since 27/09/2022
     */
   declineJu(idAlcance: number, comentary: string){
    return this.generalService.putData<boolean,string>(`${environment.API_IFI_SIPF}/scope/massive/rechazar/alcance/${idAlcance}`,undefined, comentary)
  }
  
  /**
     * @description Servicio para aprobar alcance.
     * @author Gabriel Ruano (garuanom)
     * @since 27/09/2022
     */
   ApproveJd(idAlcance: number): Observable<generalalcance> {
    return this.generalService.putData<generalalcance,generalalcance>(environment.API_IFI_SIPF, `scope/massive/autorizar/jd/${idAlcance}`)
  }

    /**
     * @description Servicio para traer los alcance de gabinete.
     * @author Gabriel Ruano (garuanom)
     * @since 21/09/2022
     */
     getCabinetJd(idAlcance: number): Observable<generalalcance[]> {
      return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/cabinetjd/${idAlcance}`)
    }
    
    /**
       * @description Servicio para traer los alcance de presencia.
       * @author Gabriel Ruano (garuanom)
       * @since 21/09/2022
       */
     getPresenceJd(idAlcance: number): Observable<generalalcance[]> {
      return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/presencejd/${idAlcance}`)
    }
    
    /**
       * @description Servicio para traer los alcance de puntos fijos.
       * @author Gabriel Ruano (garuanom)
       * @since 21/09/2022
       */
     getPointJd(idAlcance: number): Observable<generalalcance[]> {
      return this.generalService.getData<generalalcance[]>(environment.API_IFI_SIPF, `scope/massive/pointsjd/${idAlcance}`)
    }

    getSelectScope(states : number[]): Observable<CaseList[]>{
      const params: Param[] = [
        { states: states?.toString() }
      ];
      return  this.generalService.getData<CaseList[]>(`${environment.API_IFI_SIPF}/scope/massive/states`, params)
    }
  
}
