import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/general-module/componentes-comunes/servicios/general.service';
import { environment } from 'src/environments/environment';
import { obtenerCasos, Profecionales, Reasignacion } from '../interfaces/reasignacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ReasignacionService {

constructor(private generalService: GeneralService) { }

obtenerCasos(id: string): Observable<obtenerCasos[]> {
  return this.generalService.getData<obtenerCasos[]>(environment.API_IFI_SIPF, `reasignacion/${id}`);
}

obtenerProfecional(id: string): Observable<Profecionales[]> {
  return this.generalService.getData<Profecionales[]>(environment.API_IFI_SIPF, `reasignacion/profesional/${id}`);
}

reasignar(reasignar: Reasignacion ): Observable<Reasignacion> {
  return this.generalService.putData<Reasignacion, Reasignacion>(environment.API_IFI_SIPF, 'reasignacion/reasignacion/', reasignar);
}


}
