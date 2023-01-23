import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Month, YearlyPlan, YearlyPlanDetail } from '../interfaces/plan-anual.interface';
import { Constantes } from '../util/constantes';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PlanAnualService {

  constructor(private generalService: GeneralService) { }

  getYearlyPlans() {
    return this.generalService.getData<YearlyPlanDetail[]>(environment.API_IFI_SIPF, 'yearly/plan');
  }

  getYearlyPlan(year: number) {
    return this.generalService.getData<YearlyPlanDetail>(environment.API_IFI_SIPF, ['yearly/plan', year.toString()]).pipe(
      map((data: YearlyPlanDetail) => {
        return { ...data, months: data.months?.map(item => ({ ...item, monthName: Constantes.MONTHS_MAP[item.month! - 1]?.nombre })) }
      })
    );
  }

  createYearlyPlan(yearlyPlan: YearlyPlan) {
    return this.generalService.postData<number, YearlyPlan>(`${environment.API_IFI_SIPF}/yearly/plan`, yearlyPlan);
  }

  createYearlyPlanMonth(month: Month) {
    return this.generalService.postData<void, Month>(`${environment.API_IFI_SIPF}/yearly/plan/month`, month);
  }

  updateYearlyPlan(year: number, yearlyPlan: YearlyPlan) {
    return this.generalService.putData<void, YearlyPlan>(environment.API_IFI_SIPF, ['yearly/plan', year.toString()], yearlyPlan);
  }

  updateYearlyPlanMonth(month: Month) {
    return this.generalService.putData<void, Month>(environment.API_IFI_SIPF, ['yearly/plan/month', month.month!.toString()], month);
  }

  deleteYearlyPlan(year: number) {
    return this.generalService.deleteData(environment.API_IFI_SIPF, ['yearly/plan', year.toString()]);
  }

  deleteMonthYearlyPlan(plan: number, month: number, type: number) {
    return this.generalService.deleteData(`${environment.API_IFI_SIPF}/yearly/plan/month/${plan}`, [{ month }, { type }]);
  }
}
