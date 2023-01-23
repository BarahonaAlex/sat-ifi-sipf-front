import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { Case, CaseDetail, CasoComentario } from '../interfaces/casos.interface';
import { DucasResponse, input, ParamsDucas } from '../interfaces/CasosDTE';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})

export class CasosDTEService {

  constructor(private servicioGeneral: GeneralService) { }

  getWallet(idInsumo: number): Observable<input> {
    if (idInsumo == null) {
      idInsumo = 0
    }
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/input/${idInsumo}`)
  }
  getWalletWithOutDocuments(idInsumo: number): Observable<input> {
    if (idInsumo == null) {
      idInsumo = 0
    }
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/input/status/documents/${idInsumo}`)
  }
  getPath(parametros: object): Observable<acsRoot> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/CASOS`, parametros)
  }
  UpdateCase(idCase: number, parametros: Case): Observable<Case> {

    return this.servicioGeneral.putData<Case, Case>(`${environment.API_IFI_SIPF}/cases/${idCase}`, "", parametros);
  } 
  finalRejection(idCase: number, parametros: Case): Observable<Case> {

    return this.servicioGeneral.putData<Case, Case>(`${environment.API_IFI_SIPF}/cases/final/rejection/${idCase}`, "", parametros);
  }


  UpdateCaseMultipar(idCase: number, parametros: FormData): Observable<Case> {
    return this.servicioGeneral.putData<Case, FormData>(`${environment.API_IFI_SIPF}/cases/multipart/${idCase}`, "", parametros);
  }


  updateDocumentsCase(idCase: number, parametros: FormData): Observable<Case> {
    return this.servicioGeneral.putData<Case, FormData>(`${environment.API_IFI_SIPF}/cases/file/${idCase}`, "", parametros);
  }
  detailCase(idCase: number): Observable<CasoComentario> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/${idCase}`)
  }

  /**
* @description Metodo para obtener los duas y ducas´
* @author Gabriel Ruano (garuanom)
* @since 13/09/2022
* @param queryParameters paramentros de consulta
*/
  getDucasData(queryParameters: ParamsDucas): Observable<DucasResponse> {
    return this.servicioGeneral.postData<DucasResponse, ParamsDucas>(`${environment.API_IFI_SIPF}/tax/payer/request/ducas`, queryParameters);
  }

}
