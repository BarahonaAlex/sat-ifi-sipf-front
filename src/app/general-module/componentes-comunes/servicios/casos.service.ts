import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';
import { environment } from 'src/environments/environment';
import { Case, CaseDetail, CaseList, CasesAlcance, CasesFixedPoint, CasoComentario, IngresoInsumos, MassiveAssignParams, RtuDatos, SolicitudAduanas } from '../interfaces/casos.interface';
import { Param } from '../clases/Params';
import { AuditInteface } from '../interfaces/Audit.inteface';
import { AuditCommentInterface } from '../interfaces/AuditComment.interface';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { solicitudesAduanas } from '../interfaces/solicitudes.interface.ts';
import { MassiveResumeDto } from '../interfaces/MassiveResumeDto';
import { IniciarProceso } from '../interfaces/process-variables.interface';
import { ProcesosMasivos } from '../interfaces/denuncias.interface';
import { CarteraAllCases, ResponsableCases } from '../interfaces/CasosDTE';

@Injectable({
  providedIn: 'root'
})
export class CasosService {

  constructor(private servicioGeneral: GeneralService) { }


  /**
   * @description funcion para crear Casos 
   * @author ajsbatzmo (Jamier Batz)
   * @since 25/02/2022
   */
  createCase(cases: Case): Observable<Case> {//ruta ya no existe en los micros nose cambia porque afecta las solicitudes que no se han definido 
    return this.servicioGeneral.postData<Case, Case>(`${environment.API_IFI_SIPF}/cases/solicitudes/externas`, cases);
  }

  getCasesByCollaborator(nit?: string): Observable<CaseList[]> {
    return this.servicioGeneral.getData<CaseList[]>(`${environment.API_IFI_SIPF}`, ['cases/wallet', nit ?? 'def']);
  }

  getCaseById(id: number): Observable<CasoComentario> {
    return this.servicioGeneral.getData<CasoComentario>(`${environment.API_IFI_SIPF}`, ['cases', id.toString()]);
  }

  createCase2(file: FormData): Observable<IngresoInsumos> {
    return this.servicioGeneral.postData<IngresoInsumos, FormData>(`${environment.API_IFI_SIPF}/cases/data/file`, file);
  }

  getCartera(nitprofesional: number): Observable<Case> {

    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/wallet/${nitprofesional}`)
  }
  getRuta(): Observable<acsRoot> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/CARGA_MASIVAS`, {})
  }

  massiveLoad(parametros: FormData): Observable<FormData> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/cases/massive`, parametros)
  }

  

  getAuditHistorialByNit(nit: string): Observable<AuditInteface[]> {
    return this.servicioGeneral.getData<AuditInteface[]>(`${environment.API_IFI_SIPF}`, ['tax/payer/audit/historial', nit]);
  }

  createOrModifyAuditComment(pAuditComment: AuditCommentInterface): Observable<AuditCommentInterface> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/cases/audit/comment`, pAuditComment);
  }

  deleteAuditComment(pAuditComment: AuditCommentInterface): Observable<AuditCommentInterface> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/cases/audit/comment/delete`, pAuditComment);
  }
  /*
    * @description Metodo para obtener los caso en base a una serie de estados
    * @author Rudy Culajay (ruarcuse)
    * @since 23/07/2022
    * @param states estados del caso
    */
  getCasesByStates(states: Param[]): Observable<CaseList[]> {
    return this.servicioGeneral.getData<CaseList[]>(`${environment.API_IFI_SIPF}/cases/states`, states);
  }

  /**
    * @description Metodo para aprobar el alcance de un caso
    * @author Rudy Culajay (ruarcuse)
    * @since 23/07/2022
    * @param id indentificador del caso
    */
  approveScopeCases(id: number): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, unknown>(`${environment.API_IFI_SIPF}/cases/scope/approve/${id}`);
  }

  /**
   * @description Metodo para rechazo del caso por el aprobador
   * @author Rudy Culajay (ruarcuse)
   * @since 23/07/2022
   * @param id indentificador del caso
   * @param comentary comentario del usuario
   */
  approverDeclineCases(id: number, comentary: string): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/approver/decline`, String(id), comentary);
  }

  /**
  * @description Metodo para solicitud de correciones por el aprobador
  * @author Rudy Culajay (ruarcuse)
  * @since 23/07/2022
  * @param id indentificador del caso
  * @param comentary comentario del usuario
  */
  approverRequestFixesCases(id: number, comentary: string): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/approver/request/fixes`, String(id), comentary);
  }

  /**
  * @description Metodo para aprobar el alcance de un caso
  * @author Gabriel Ruano (ruarcuse)
  * @since 23/07/2022
  * @param id indentificador del caso
  */
  authorizerScopeCases(id: number): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, unknown>(`${environment.API_IFI_SIPF}/cases/scope/authorizer/${id}`);
  }

  /**
   * @description Metodo para rechazo del caso por el aprobador
   * @author Gabriel Ruano(ruarcuse)
   * @since 23/07/2022
   * @param id indentificador del caso
   * @param comentary comentario del usuario
   */
  authorizerDeclineCases(id: number, comentary: string): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/authorizer/decline`, String(id), comentary);
  }

  /**
  * @description Metodo para solicitud de correciones por el aprobador
  * @author Gabriel Ruano (garuanom)
  * @since 23/07/2022
  * @param id indentificador del caso
  * @param comentary comentario del usuario
  */
  authorizerRequestFixesCases(id: number, comentary: string): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/authorizer/request/fixes`, String(id), comentary);
  }

  getCaseByIdInputStatus(idInput: number, idStatus: number): Observable<CaseDetail[]> {
    return this.servicioGeneral.getData<CaseDetail[]>(`${environment.API_IFI_SIPF}`, ['cases/input/status', idInput.toString(), idStatus.toString()]);
  }

  getCaseByIdInput(idInput: number): Observable<CaseDetail[]> {
    return this.servicioGeneral.getData<CaseDetail[]>(`${environment.API_IFI_SIPF}`, ['cases/input', idInput.toString()]);
  }

  /**
  * @description Metodo para crear solicitudes de aduanas 
  * @author Gabriel Ruano (garuanom)
  * @since 07/09/2022
  * @param file FromData que contiene la solicitudes y lo documentos
  */
  createCustomsRequest(file: FormData): Observable<solicitudesAduanas> {
    return this.servicioGeneral.postData<solicitudesAduanas, FormData>(`${environment.API_IFI_SIPF}/cases/subsequent/requests`, file);
  }


  /**
  * @description Metodo obtener el resumen de casos por tipo de caso agrupado por gerencia
  * @author rabaraho
  * @since 23/09/2022
  * @param  pIdTipoCaso tipo de caso para consultar
  */

  getResumeMassive(pIdTipoCaso: number): Observable<MassiveResumeDto[]> {

    return this.servicioGeneral.getData<MassiveResumeDto[]>(`${environment.API_IFI_SIPF}/cases/massive/resume`, [{ pIdTipoCaso: pIdTipoCaso }]);
  }


  /*
  http://aepn09gin0072:8081/sat_ifi_sipf/cases/massive/assign
  */


  /**
    * @description Metodo para aprobar el alcance de un caso
    * @author rabaraho
    * @since 28/09/2022
    * @param pParams parametros para la asignacion de casos masivos de puntos fijos y de gabinete
    */
  putMassiveAssign(pParams: MassiveAssignParams): Observable<boolean> {
    return this.servicioGeneral.putData<boolean, unknown>(`${environment.API_IFI_SIPF}/cases/massive/assign`, '', pParams);
  }

  putDeclineApprover(idCaso: number) {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/decline/${idCaso}`);
  }

  putDeclineOperator(idCaso: number, comentary: string) {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/operator/decline/${idCaso}`,undefined, comentary);
  }


  putNotAprover(idCaso: number) {
    return this.servicioGeneral.putData<boolean, String>(`${environment.API_IFI_SIPF}/cases/not/approver/${idCaso}`);
  }

  /**
* @description Método para traer todos los colaboradores
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
  getSolicitudAduanas() {
    return this.servicioGeneral.getData<SolicitudAduanas[]>(environment.API_IFI_SIPF, 'cases/customs/request/posterior');
  }

  getCasesFixedPoint():Observable<CasesFixedPoint[]>{
    return this.servicioGeneral.getData<CasesFixedPoint[]>(environment.API_IFI_SIPF, 'cases/scope/fixed/point')
  }
  getCasesFiscal():Observable<CasesFixedPoint[]>{
    return this.servicioGeneral.getData<CasesFixedPoint[]>(environment.API_IFI_SIPF, 'cases/scope/fiscal')
  }
  createStartProcessCases(formulario:CasesAlcance): Observable<IniciarProceso> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/cases/start/process/masive`,formulario)
  }
  createStartProcessCasesFixedPoint(formulario:CasesAlcance): Observable<IniciarProceso> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/start/process/masive/pointer/fixed`,formulario)
  }
  getProcesMasiveCatalog():Observable<ProcesosMasivos[]> {
    return this.servicioGeneral.getData<ProcesosMasivos[]>(`${environment.API_IFI_SIPF}/cases/proces`)
  }
  getAllCasesManager():Observable<CarteraAllCases[]> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/wallet/management`)
  }
  getResponsibleCase(idCase:number):Observable<ResponsableCases[]>{
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/responsible/data/${idCase}`)
  }
}