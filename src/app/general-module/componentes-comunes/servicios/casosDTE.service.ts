import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InputInterface } from '../interfaces/Input.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})

export class casosDTEService {

  constructor( private servicioGeneral: GeneralService) { }

  getCartera(stado: number, idInsumo:number): Observable<InputInterface> {

    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/input/status/${idInsumo}/${stado}`)
  }

}
