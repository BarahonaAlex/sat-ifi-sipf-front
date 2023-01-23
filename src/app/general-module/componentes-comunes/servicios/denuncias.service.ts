import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GeneralService } from './general.service';
import { AlcanceDenuncia, CabinetComplaints, CatalogComplaints, ComplaintsForProcess, DenunciaAP, DenunciaNAP, editComplaints, Gerencias, GetDenuncias, GetDetailDenuncias, ProcesosMasivos, Prueba, Scope, StatusDenuncia, StatusDenunciaNAP } from '../interfaces/denuncias.interface';
import { Param } from '../clases/Params';
import { alcance } from '../interfaces/alcances.interface.ts';
import { IniciarProceso } from '../interfaces/process-variables.interface';
import { acsRoot } from '../interfaces/AcsRoot.interface';

@Injectable({
  providedIn: 'root'
})
export class DenunciasService {
  private API_SPIF: string = environment.API_IFI_SIPF;
  constructor(private desService: GeneralService) { }

  getComplaints(): Observable<GetDenuncias[]> {
    return this.desService.getData<GetDenuncias[]>(`${this.API_SPIF}/complaint/complaints`);
  }
  getDetailComplaints(id: string): Observable<GetDetailDenuncias[]> {
    return this.desService.getData<GetDetailDenuncias[]>(`${this.API_SPIF}/complaint/detail/complaints/${id}`)
  }
  getManagaments(): Observable<Gerencias[]> {
    return this.desService.getData<Gerencias[]>(`${this.API_SPIF}/complaint/managements`)
  }
  getApprovedComplaints(): Observable<DenunciaAP[]> {
    return this.desService.getData<DenunciaAP[]>(`${this.API_SPIF}/complaint/approved/complaints`)
  }
  getRejectedComplaints(): Observable<DenunciaNAP[]> {
    return this.desService.getData<DenunciaAP[]>(`${this.API_SPIF}/complaint/rejected/complaints`)
  }
  putApplyManagementsComplaints(body: StatusDenuncia, id: string): Observable<StatusDenuncia> {
    return this.desService.putData<StatusDenuncia, StatusDenuncia>(`${this.API_SPIF}/complaint/apply/managements/complaints`, id, body)
  }
  putRejectedManagementsComplaints(body: StatusDenunciaNAP, id: string): Observable<StatusDenunciaNAP> {
    return this.desService.putData<StatusDenunciaNAP, StatusDenunciaNAP>(`${this.API_SPIF}/complaint/rejected/managements/complaints`, id, body)
  }
  getRejectedComplaintsForDate(fecha: string, fechaFin: string): Observable<DenunciaNAP[]> {
    const params: Param[] = [
      { fecha: fecha },
      { fechaFin: fechaFin }
    ]
    return this.desService.getData<DenunciaNAP[]>(`${this.API_SPIF}/complaint/date`, params)
  }
  getProcessMasive(): Observable<ProcesosMasivos[]> {
    return this.desService.getData<ProcesosMasivos[]>(`${this.API_SPIF}/complaint/process/scope`)
  }

  getProces(): Observable<ProcesosMasivos[]> {
    return this.desService.getData<ProcesosMasivos[]>(`${this.API_SPIF}/complaint/process`)
  }

  getStateComplaints(): Observable<ProcesosMasivos[]> {
    return this.desService.getData<ProcesosMasivos[]>(`${this.API_SPIF}/complaint/state`)
  }
  putEditStateComplaints(body: object, id: string): Observable<editComplaints> {
    return this.desService.putData<editComplaints, object>(`${this.API_SPIF}/complaint/edit/complaints`, id, body)
  }
  getComplaintsForScope(idR: number, idP: number): Observable<any[]> {
    const params: Param[] = [
      { idP: idP },
      { idR: idR }
    ]
    return this.desService.getData<any[]>(`${this.API_SPIF}/complaint/approved/complaints/scope`, params)
  }
  getComplaintCabinet(idR: number): Observable<any[]> {
    const params: Param[] = [
      { idR: idR }
    ]
    return this.desService.getData<any[]>(`${this.API_SPIF}/complaint/approved/complaints/scope/cabinet`, params)
  }
  getCatalogProcessComplaint(idCatalogo: number): Observable<CatalogComplaints[]> {
    return this.desService.getData<CatalogComplaints[]>(`${this.API_SPIF}/complaint/catalog/process/complaint/${idCatalogo}`)
  }
  getCabinetComplains(): Observable<CabinetComplaints[]> {
    return this.desService.getData<CabinetComplaints[]>(`${this.API_SPIF}/complaint/cabinet`)
  }
  createStartProcessDenuncias(formulario: FormData): Observable<any> {
    return this.desService.postData(`${environment.API_IFI_SIPF}/complaint/start/process`, formulario)
  }
  getScope(): Observable<Scope[]> {
    return this.desService.getData<Scope[]>(`${environment.API_IFI_SIPF}/complaint/scope`)
  }
  getPath(parametros: object): Observable<acsRoot> {
    return this.desService.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/ALCANCEMASIVO`, parametros)
  }
  getAlcances(idAlcance:number): Observable<any> {
    return this.desService.getData(`${environment.API_IFI_SIPF}/scope/massive/presencias/puntosFijos/${idAlcance}`)
  }
  putProcessDenuncias(formulario: FormData,id:number): Observable<any> {
    return this.desService.putData(`${environment.API_IFI_SIPF}/complaint/edit/process/${id}`,'',formulario)
  }
}
