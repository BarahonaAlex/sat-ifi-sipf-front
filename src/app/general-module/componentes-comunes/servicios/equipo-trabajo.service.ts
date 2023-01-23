import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipoTrabajoRespuesta, EquipoTrabajoRespuestaDetalle, TransferRequest, SaveTransferRequest, ApproveTransferRequest, MemberOperator, EquipoTrabajo } from 'src/app/general-module/componentes-comunes/interfaces/equipo-trabajo.class';
import { environment } from 'src/environments/environment';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class EquipoTrabajoService {
  private API_SPIF: string = environment.API_IFI_SIPF;
  constructor(private generalService: GeneralService) { }

  getWorkGroups(includeDeleted: boolean = false): Observable<EquipoTrabajoRespuesta[]> {
    return this.generalService.getData<EquipoTrabajoRespuesta[]>(`${environment.API_IFI_SIPF}/workgroups`, [{ includeDeleted }]);
  }

  getWorkGroup(id: number): Observable<EquipoTrabajoRespuestaDetalle> {
    return this.generalService.getData<EquipoTrabajoRespuestaDetalle>(environment.API_IFI_SIPF, `workgroups/${id}`);
  }

  createWorkGroup(equipoTrabajo: EquipoTrabajo): Observable<EquipoTrabajoRespuesta> {
    return this.generalService.postData<EquipoTrabajoRespuesta, EquipoTrabajo>(`${environment.API_IFI_SIPF}/workgroups`, equipoTrabajo);
  }

  updateWorkGroup(id: number, equipoTrabajo: EquipoTrabajo): Observable<EquipoTrabajoRespuesta> {
    return this.generalService.putData<EquipoTrabajoRespuesta, EquipoTrabajo>(`${environment.API_IFI_SIPF}/workgroups`, id.toString(), equipoTrabajo);
  }

  deleteWorkGroup(id: number): Observable<boolean> {
    return this.generalService.deleteData<boolean>(`${environment.API_IFI_SIPF}/workgroups`, id.toString());
  }

  /**
   * @description Método para guardar soicitud de traslado de colaborador 
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 21/06/2022
   */
  SaveTransferRequest(SaveRequestTransfer: SaveTransferRequest): Observable<SaveTransferRequest> {
    return this.generalService.postData<SaveTransferRequest, SaveTransferRequest>(`${this.API_SPIF}/workgroups/transfer/request`, SaveRequestTransfer)
  }

  saveTransferRequestMultipart(pBody: FormData): Observable<SaveTransferRequest> {
  
    return this.generalService.postData<SaveTransferRequest, FormData>(`${this.API_SPIF}/workgroups/multipart/transfer/request`, pBody);
  }

  /**
   * @description Método para obtener solicitudes de aprobador en base a login
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 21/06/2022
   */
  getTransferRequest(): Observable<TransferRequest[]> {
    return this.generalService.getData<TransferRequest[]>(`${this.API_SPIF}/workgroups/transfer/request/member`)
  }

  /**
   * @description Método para obtener solicitud en base a id de solicitud
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 21/06/2022
   */
  getTransferRequestById(idSolicitud: number): Observable<TransferRequest[]> {
    return this.generalService.getData<TransferRequest[]>(`${environment.API_IFI_SIPF}/workgroups/transfer/request`, idSolicitud.toString())
  }

  /**
   * @description Método para aprobar solicitud en pase a id de solicitud
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 21/06/2022
   */
  saveApproveTransferRequest(id: number): Observable<ApproveTransferRequest> {
    return this.generalService.putData<ApproveTransferRequest, ApproveTransferRequest>(`${this.API_SPIF}/workgroups/approve/transfer/request`, id.toString())
  }

   /**
   * @description Método para rechazar solicitud en pase a id de solicitud
   * @author aalsuruyq (Anderson Suruy) 
   * @since edited 21/06/2022
   */
   saveDeclineTransferRequest(id: number, comentary: string): Observable<boolean> {
    return this.generalService.putData<boolean, String>(`${environment.API_IFI_SIPF}/workgroups/decline/transfer/request`, id.toString(), comentary);
  }
  /**
   * @description Método para optener equipos y unidaes de un integrante de grupo (operador) en base a su nit
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 23/06/2022
   */
  getMemberOperator(nit: string): Observable<MemberOperator[]> {
    return this.generalService.getData<MemberOperator[]>(`${environment.API_IFI_SIPF}/workgroups/member/operator`, nit)
  }

  /**
   * @description Método para obtener solicitudes de aprobador en base a nit
   * @author ajsbatzmo (Jamier Batz) 
   * @since edited 21/06/2022
   */
  getTransferRequestByNitAuthorizer(nit: string): Observable<TransferRequest[]> {
    return this.generalService.getData<TransferRequest[]>(`${this.API_SPIF}/workgroups/transfer/request/member/authorizer`, nit)
  }
  /**
   * @description Método para verificar si un operador cuenta con solicitudes activas
   * @author aalsuruyq (Anderson Suruy) 
   */
  validateRequestOperator(nit: string): Observable<TransferRequest[]> {
    return this.generalService.getData<TransferRequest[]>(`${this.API_SPIF}/workgroups/transfer/request/exists`, nit)
  }
}
