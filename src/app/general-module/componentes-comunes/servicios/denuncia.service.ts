import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AsignacionDenunciaParam } from '../interfaces/AsignacionDenunciaParam';
import { DenunciaGrabada } from '../interfaces/DenunciaGrabada';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {

  BASE_COMPLAINTS_URL = `${environment.API_IFI_SIPF}/complaint`;

  constructor(private generalService: GeneralService) {

  }

  getComplaintsByDateRange(pParams: DenunciaGrabada) {
    return this.generalService.postData<DenunciaGrabada[], DenunciaGrabada>(`${this.BASE_COMPLAINTS_URL}/onpremise`, pParams);
  }


  postAssignment(pBody: AsignacionDenunciaParam) {


    return this.generalService.postData(`${this.BASE_COMPLAINTS_URL}/assignment`, pBody);

  }

  postPrueba(pBody: FormData): Observable<DenunciaGrabada> {
    console.log("este es el pbody")
    console.log(pBody)
    return this.generalService.postData<DenunciaGrabada, FormData>(`${this.BASE_COMPLAINTS_URL}`, pBody);
  }

}
