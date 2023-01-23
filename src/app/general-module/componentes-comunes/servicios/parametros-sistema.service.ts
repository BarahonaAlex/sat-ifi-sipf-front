import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Option } from '../interfaces/parametrizacion.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosSistemaService {

  constructor(
    private generalService: GeneralService
  ) { }

  getSystemParameters() {
    return this.generalService.getData<Option[]>(environment.API_IFI_SIPF, 'system/params');
  }

  updateSystemParameter(option: Option) {
    return this.generalService.putData<void, string>(environment.API_IFI_SIPF, ['system/params', option.id.toString()], option.value);
  }
} 
