import { Param } from './../clases/Params';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FindingDetail, FindingInsert } from '../interfaces/hallazgos.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class HallazgosService {

  constructor(
    private generalService: GeneralService
  ) { }

  getFindingsDetail(id: number, correlativoDenuncia?: string): Observable<FindingDetail[]> {
    let params: Param[] = [
      { correlativo: correlativoDenuncia?.toString() }
    ]
    return this.generalService.getData<FindingDetail[]>(`${environment.API_IFI_SIPF}/findings/${id}`, params);
  }

  createFinding(data: FindingInsert): Observable<void> {
    return this.generalService.postData<void, FindingInsert>(`${environment.API_IFI_SIPF}/findings`, data);
  }

  updateFinding(id: number, data: FindingInsert): Observable<void> {
    return this.generalService.putData<void, FindingInsert>(`${environment.API_IFI_SIPF}/findings/${id}`, "", data);
  }

  deleteFinding(id: number, isGabinet?: boolean): Observable<void> {
    let params: Param[] = [
      { isGabinet: isGabinet?.toString() }
    ]
    return this.generalService.deleteData<void>(`${environment.API_IFI_SIPF}/findings/${id}`, params);
  }

  getComplaintFindingsDetail(correlativo: String): Observable<FindingDetail[]> {
    return this.generalService.getData<FindingDetail[]>(`${environment.API_IFI_SIPF}/findings/${correlativo}`);
  }
}
