import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { CreditoFiscalResponse } from '../interfaces/CreditoFiscal.interface';
import { GeneralService } from './general.service';
//import {CreditoFiscalService} from ''

@Injectable({
  providedIn: 'root'
})
export class CreditoFiscalDocumentoService {

  BASE_PROGRAMA_URL = `${environment.API_IFI_SIPF}/fiscal/credit`;

constructor(private servicioGeneral: GeneralService) { }

getPath(parametros: object): Observable<acsRoot> {
  return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/CEDULA_CREDITO`, parametros)
}

getCreditoFiscalDocumentoById(id: number): Observable<CreditoFiscalResponse>{

  return this.servicioGeneral.getData(`${this.BASE_PROGRAMA_URL}/findFiscalDocument/${id}`);
}

putNewDocument(texto: any, id: number): Observable<any>{

  return this.servicioGeneral.putData(`${this.BASE_PROGRAMA_URL}/update/status/documents/${id}`,'',texto);

}

}
