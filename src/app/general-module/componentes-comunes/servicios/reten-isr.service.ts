import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { RetenIsrInterface} from 'src/app/general-module/componentes-comunes/interfaces/reten-isr.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class RetenIsr {
    API_IFI_SIPF = environment.API_IFI_SIPF;


  constructor(
    private generalService: GeneralService
  ) { }

getRetenIsrRcDetail(pNitAgenteR: string, pPeriodoR: string, pNitSujetoR: string, pTipoConsulta: string, pTipoRetencion: string, pEstado: string){
    const data: RetenIsrInterface.RetenIsrParams = {
        pNitAgenteR: pNitAgenteR,
        pPeriodoR: pPeriodoR,
        pNitSujetoR: pNitSujetoR,
        pTipoConsulta: pTipoConsulta,
        pTipoRetencion: pTipoRetencion,
        pEstado: pEstado
    }
    return this.generalService.postData<RetenIsrInterface.RetenIsrRcDataInterface[], Object>(`${this.API_IFI_SIPF}/tax/payer/reten/isr/rc`, data)
}

getRetenIsrOsDetail(pNitAgenteR: string, pPeriodoR: string, pNitSujetoR: string, pTipoConsulta: string, pTipoRetencion: string, pEstado: string){
  const data: RetenIsrInterface.RetenIsrParams = {
      pNitAgenteR: pNitAgenteR,
      pPeriodoR: pPeriodoR,
      pNitSujetoR: pNitSujetoR,
      pTipoConsulta: pTipoConsulta,
      pTipoRetencion: pTipoRetencion,
      pEstado: pEstado
  }
  return this.generalService.postData<RetenIsrInterface.RetenIsrOsDataInterface[], Object>(`${this.API_IFI_SIPF}/tax/payer/reten/isr/os`, data)
}

}
