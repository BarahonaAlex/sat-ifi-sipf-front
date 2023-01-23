import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Insumo } from '../interfaces/CasosDTE';
import { InputInterface, InputInterfaceComentario } from '../interfaces/Input.interface';
import { ParametroAsignaCasoDto } from '../interfaces/ParametroAsignaCasoDto';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  BASE_INPUT_URL = `${environment.API_IFI_SIPF}/input`;

  constructor(private generalService: GeneralService) {

  }

  createManualInput(body: Insumo) {
    return this.generalService.postData<void, Insumo>(`${this.BASE_INPUT_URL}`, body);
  }

  getAllInputAuthorizer(pIdStatus: number): Observable<InputInterface[]> {
    return this.generalService.getData<InputInterface[]>(`${this.BASE_INPUT_URL}/authorizer/status/${pIdStatus}`);
  }

  getInputById(pIdStatus: number): Observable<InputInterfaceComentario> {
    return this.generalService.getData<InputInterfaceComentario>(`${this.BASE_INPUT_URL}/${pIdStatus}`);
  }


  getAllInputApprover(pIdStatus: number): Observable<InputInterface[]> {
    return this.generalService.getData<InputInterface[]>(`${this.BASE_INPUT_URL}/approver/status/${pIdStatus}`);
  }

  putInput(idInput: number, put: InputInterface): Observable<InputInterface> {
    return this.generalService.putData(`${this.BASE_INPUT_URL}/assignment/${idInput}`, '', put);
  }

  postAssignment(pAssignmentParam: ParametroAsignaCasoDto, pId: number): Observable<InputInterface> {
    console.log(pAssignmentParam);
    return this.generalService.putData(`${this.BASE_INPUT_URL}/assignment/case/${pId}`, '', pAssignmentParam);
  }

  putSuspend(pDatos: ParametroAsignaCasoDto, pId: number): Observable<InputInterface> {
    return this.generalService.putData(`${this.BASE_INPUT_URL}/suspend`, `${pId}`, pDatos);
  }

  putCorrect(pDatos: ParametroAsignaCasoDto, pId: number): Observable<InputInterface> {
    return this.generalService.putData(`${this.BASE_INPUT_URL}/correct`, `${pId}`, pDatos);
  }


  putRejection(pDatos: ParametroAsignaCasoDto, pId: number): Observable<ParametroAsignaCasoDto> {
    return this.generalService.putData(`${this.BASE_INPUT_URL}/rejection`, `${pId}`, pDatos);
  }

  putDefinitiveRejection(pDatos: ParametroAsignaCasoDto, pId: number): Observable<ParametroAsignaCasoDto> {
    return this.generalService.putData(`${this.BASE_INPUT_URL}/rejection/definitive`, `${pId}`, pDatos);
  }

  createManualInputExterna(file: FormData) {
    return this.generalService.postData<FormData, FormData>(`${environment.API_IFI_SIPF}/input/solicitud/externa`, file);
  }


}
