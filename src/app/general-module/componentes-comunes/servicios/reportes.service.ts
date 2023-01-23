import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/general-module/componentes-comunes/servicios/general.service';
import { environment } from 'src/environments/environment';
import { MassScopeInterface, ScopeInterface } from '../interfaces/AlcancesInterface';
import { AnnualAuditPlan, AnnualAuditPlanResponse, AnnualGeneralPlanResponse, AnnualManagmentPlanResponse, YearPlan } from '../interfaces/Reports.interface';

/**
   * @description Servicios que traen todos los tipos de reportes en base al alcance
   * @author ajsbatzmo (Jamier Batz)
   * @since 17/02/2022
   */

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  constructor(
    private generalService: GeneralService
  ) { }

  getScope(id: string): Observable<ScopeInterface[]> {
    return this.generalService.getData<ScopeInterface[]>(environment.API_IFI_SIPF, `reports/scopes/${id}`);
  }

  getMassScope(id: number): Observable<MassScopeInterface[]> {
    return this.generalService.getData<MassScopeInterface[]>(environment.API_IFI_SIPF, `reports/scopes/massive/${id}`);
  }

  getScopeReport(id: string, tipo: number) {
    return this.generalService.getData<Blob>(environment.API_IFI_SIPF, `reports/documentos/${id}/${tipo}`, { responseType: 'blob' });
  }

  getMassScopeReport(id: number, tipo: number) {
    return this.generalService.getData<Blob>(environment.API_IFI_SIPF, `reports/documentos/masivos/${id}/${tipo}`, { responseType: 'blob' });
  }

  getConstanciaIsr(id: string, tipo: string, estado: string) {
    return this.generalService.getData<Blob>(environment.API_IFI_SIPF, `reports/constancia/isr/${id}/${tipo}/${estado}`, { responseType: 'blob' });
  }

  /**
 * @description M�todo para crear plan anual de fiscalizacion
 * @author ajsbatzmo (Jamier Batz)
 * @since 03/08/2022
 * @param plan indentificador Plan anual de fiscalizacion
 */
  createAnnualAuditPlan(plan: AnnualAuditPlan[]) {
    return this.generalService.postData<boolean, AnnualAuditPlan[]>(`${environment.API_IFI_SIPF}/reports/plan/anual/fiscalizacion`, plan);
  }

  /**
 * @description M�todo para obtener el plan anual fiscalizacion
 * @author ajsbatzmo (Jamier Batz)
 * @since 11/08/2022
 * @param mes indentificador mes del plan actual
 * @param anio indentificador año del plan actual
 */
  getAnnualGeneralPlan(mes: number, anio: number) {
    return this.generalService.getData<AnnualGeneralPlanResponse[]>(`${environment.API_IFI_SIPF}/reports/plan/anual/general`, [{ mes: Number(mes) }, { anio: Number(anio) }]);
  }

  /**
 * @description M�todo para obtener el plan anual fiscalizacion por gerencia
 * @author ajsbatzmo (Jamier Batz)
 * @since 11/08/2022
 * @param mes indentificador mes del plan actual
 * @param anio indentificador año del plan actual
 */
  getAnnualManagmentPlan(mes: number, anio: number) {
    return this.generalService.getData<AnnualManagmentPlanResponse[]>(`${environment.API_IFI_SIPF}/reports/plan/anual/gerencia`, [{ mes: Number(mes) }, { anio: Number(anio) }]);
  }

  /**
 * @description M�todo para obtener el plan anual fiscalizacion por auditoria
 * @author ajsbatzmo (Jamier Batz)
 * @since 11/08/2022
 * @param mes indentificador mes del plan actual
 * @param anio indentificador año del plan actual
 */
  getAnnualAuditPlan(mes: number, anio: number) {
    return this.generalService.getData<AnnualAuditPlanResponse[]>(`${environment.API_IFI_SIPF}/reports/plan/anual/auditoria`, [{ mes: Number(mes) }, { anio: Number(anio) }]);
  }

  /**
 * @description M�todo para obtener años creados en planes anuales de fiscalizacion
 * @author ajsbatzmo (Jamier Batz)
 * @since 12/08/2022
 */
  getYearPlan() {
    return this.generalService.getData<YearPlan[]>(`${environment.API_IFI_SIPF}/reports/year/plan`);
  }

  /**
* @description M�todo para obtener años creados en planes anuales de fiscalizacion
* @author ajsbatzmo (Jamier Batz)
* @since 12/08/2022
*/
  getPlanByYear(anio: number) {
    return this.generalService.getData<YearPlan>(`${environment.API_IFI_SIPF}/reports/year/plan/indicator`, anio.toString());
  }

  /**
* @description M�todo para obtener años creados en planes anuales de fiscalizacion
* @author ajsbatzmo (Jamier Batz)
* @since 12/08/2022
*/
  updatePlan(mes: number, anio: number, indicador: number, plan: AnnualAuditPlan[]) {
    return this.generalService.putData<boolean, AnnualAuditPlan[]>(`${environment.API_IFI_SIPF}/reports/year/plan`, [{ mes: Number(mes) }, { anio: Number(anio) }, { indicador: Number(indicador) }], plan);
  }

  getCedulaVerificacion(id: number) {
    return this.generalService.getData<Blob>(environment.API_IFI_SIPF, `reports/cedula/verificacion/${id}`, { responseType: 'blob' });
  }

}
