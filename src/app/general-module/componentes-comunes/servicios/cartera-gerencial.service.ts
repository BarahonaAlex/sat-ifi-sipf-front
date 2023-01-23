import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { acsRoot } from '../interfaces/AcsRoot.interface';
import { walletPrograma } from '../interfaces/ProgramaFiscales.interface';
import { approvedAll, declineCase, DetailWallet, WalletAppointments } from '../interfaces/WalletAppointments';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class CarteraGerencialService {

  constructor(private servicioGeneral: GeneralService) { }

  getWallet(): Observable<WalletAppointments> {
    return this.servicioGeneral.getData(`${environment.API_IFI_SIPF}/cases/wallet/appointments`)
  }
  //DetailWallet
  ApproveAllCases(): Observable<approvedAll> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/fiscal/program/approve/all`, "", {})
  }
  aprobarProgramas(casos: any): Observable<walletPrograma> {
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/fiscal/program/approve`, "", casos);
  }

  getRuta(tipo:string ,parametros:any):Observable<acsRoot> {
    return this.servicioGeneral.postData(`${environment.API_IFI_SIPF}/content/base/root/encrypted/${tipo}`, parametros)
  }
  declineCase(parametros:declineCase[]):Observable<declineCase>{
    return this.servicioGeneral.putData(`${environment.API_IFI_SIPF}/fiscal/program/decline/case`, "", parametros);

  }

}
