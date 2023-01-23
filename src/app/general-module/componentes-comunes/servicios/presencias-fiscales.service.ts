import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { alcance } from '../interfaces/alcances.interface.ts';
import { PresenciasFiscales } from '../interfaces/presencias-fiscales';
import { IniciarProceso } from '../interfaces/process-variables.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PresenciasFiscalesService {

  constructor(private servicioGeneral: GeneralService) { }

  getPresences(): Observable<PresenciasFiscales[]> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/tax/presences`)
  }
  createPresences(formulario: PresenciasFiscales): Observable<PresenciasFiscales> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/tax/presences`, formulario)
  }

  getPresencesById(id: number): Observable<PresenciasFiscales> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/tax/presences/${id}`)
  }///
  createStartProcessPresences(formulario: FormData) {
    return this.servicioGeneral.postData<FormData,FormData>(`${environment.API_IFI_SIPF}/tax/presences/start/process`, formulario)
  }
  getPath(parametros: object): Observable<acsRoot> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/ALCANCEMASIVO`, parametros)
  }
  updatePresencia(formulario: PresenciasFiscales):Observable<any>{
    return this.servicioGeneral.putData(environment.API_IFI_SIPF, `tax/presences/${formulario.idFormulario}`,formulario)
  }
  updatePresenciaProceso(formulario: FormData,idAlcance:number):Observable<any>{
    return this.servicioGeneral.putData(environment.API_IFI_SIPF, `tax/presences/process/${idAlcance}`,formulario)
  }
}
