import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { DetalleAprobacionPrograma } from '../interfaces/Aprobacion-Programa';
import { FiscalProgramInterface } from '../interfaces/FiscalProgram.interface';
import { walletPrograma } from '../interfaces/ProgramaFiscales.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramasFiscalesService {
  BASE_PROGRAMA_URL = `${environment.API_IFI_SIPF}/fiscal/program`;


  constructor(
    private generalService: GeneralService
  ) { }

  getFiscalProgram(): Observable<FiscalProgramInterface[]> {
    return this.generalService.getData<any>(this.BASE_PROGRAMA_URL);
  }

  getFiscalProgramByStatus(pIdStatu: Number): Observable<FiscalProgramInterface[]> {
    let params: Param[] = [];
    params.push({ idStatus: String(pIdStatu) });
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}`, params);
  }

  getFiscalProgramByStatusAndRegional(pIdStatus?: Number, pIdRegional?: Number): Observable<FiscalProgramInterface[]> {

    let params: Param[] = [];

    if (pIdStatus) {
      params.push({ idStatus: String(pIdStatus) });
    }
    if (pIdRegional) {

      params.push({ idRegional: String(pIdRegional) });
    }

    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}`, params);
  }

  getFiscalProgramByStatusAndRangeOfDates(pIdStatus: Number, pIdRegional: Number, pDateFrom: Date, pDateTo: Date): Observable<FiscalProgramInterface[]> {
    let params: Param[] = [
      { idRegional: String(pIdRegional) },
      { idStatus: String(pIdStatus) },
      { dateTo: String(pDateTo) },
      { dateFrom: String(pDateFrom) }
    ];

    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/date/range`, params);
  }
  getFiscalProgramByLocked(pDateFrom: Date, pDateTo: Date): Observable<FiscalProgramInterface[]> {
    let params: Param[] = [
      { dateTo: String(pDateTo) },
      { dateFrom: String(pDateFrom) }
    ];

    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/locked`, params);
  }

  getFiscalProgramByUserAndStatus(): Observable<FiscalProgramInterface[]> {
   
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/user`);
  }

  getFiscalProgramByStatusProgram(pIdStatus: Number): Observable<FiscalProgramInterface[]> {
    let params: Param[] = [
      { idStatus: String(pIdStatus) }
    ];

    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/status`, params);
  }//fiscal/program/authorized
  getFiscalProgramAuthorized(): Observable<FiscalProgramInterface[]> {
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/authorized/status`);
  }
  getFiscalProgramApproval(): Observable<FiscalProgramInterface[]> {
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/approval/status`);
  }
  getFiscalProgramRevision(): Observable<FiscalProgramInterface[]> {
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/revision/status`);
  }
  getFiscalProgramById(idPrograma: Number): Observable<FiscalProgramInterface> {
    return this.generalService.getData<FiscalProgramInterface>(`${this.BASE_PROGRAMA_URL}/${idPrograma}`);
  }

  postFiscalPrograma(post: any): Observable<FiscalProgramInterface> {
    return this.generalService.postData(this.BASE_PROGRAMA_URL, post);
  }


  putFiscalPrograma(pIdPrograma: number, put: FiscalProgramInterface): Observable<FiscalProgramInterface> {
    return this.generalService.putData(this.BASE_PROGRAMA_URL, String(pIdPrograma), put);
  }

  getCartera(): Observable<walletPrograma[]> {
    return this.generalService.getData(`${this.BASE_PROGRAMA_URL}/wallet/approve/program`)
  }
  getDetalleCartera(idGerencia: number): Observable<DetalleAprobacionPrograma[]> {
    return this.generalService.getData(`${this.BASE_PROGRAMA_URL}/wallet/approve/management?idGerencia=${idGerencia}`)
  }
  aprobarProgramas(casos: any): Observable<walletPrograma> {
    return this.generalService.putData(`${this.BASE_PROGRAMA_URL}/approve`, "", casos);
  }

  getFiscalProgramByStatusAndCurrentYear(idStatusProgram: number): Observable<FiscalProgramInterface[]> {
    return this.generalService.getData<FiscalProgramInterface[]>(`${this.BASE_PROGRAMA_URL}/current/year/${idStatusProgram}`);
  }

  assignFiscalProgram(idProgram: number, idCaso: number): Observable<FiscalProgramInterface> {
    return this.generalService.putData(`${this.BASE_PROGRAMA_URL}/assign/${idProgram}`, "", idCaso);
  }
}
