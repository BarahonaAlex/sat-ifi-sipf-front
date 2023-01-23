import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InputInterface, InputInterfaceComentario } from '../interfaces/Input.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class InsumosDTEService {

  constructor(private servicioGeneral: GeneralService) { }

  getCartera(...status: number[]): Observable<InputInterface> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/input/status/${status}`)
  }

  rejectionInsumo(idInsumo: number, parametros: any): Observable<InputInterface> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/input/definitive/rejection/${idInsumo}`, "", parametros)
  }
  modificarInsumo(idInsumo: number, parametros: any): Observable<InputInterface> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/input/${idInsumo}`, "", parametros)
  }
  correctInsumo(idInsumo: number, parametros: any): Observable<InputInterface> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/input/fix/${idInsumo}`, "", parametros)
  }
  deleteInput(idInsumo: number, parametros: any): Observable<InputInterface> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/input/delete/${idInsumo}`, "", parametros)
  }
  publishInput(idInsumo: number, parametros: any): Observable<InputInterface> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/input/publish/${idInsumo}`, "", parametros)
  }
  getCarteraCorreccion(idInsumo: number): Observable<InputInterfaceComentario> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/input/${idInsumo}`)
  }
}
