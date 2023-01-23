import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { GeneralService } from './general.service';
import { PlantillasDocumentosInterface } from 'src/app/general-module/componentes-comunes//interfaces/plantillas-documentos.interface';


@Injectable({
  providedIn: 'root'
})
export class PlantillaDocumentosService {
    API_IFI_SIPF = environment.API_IFI_SIPF;


  constructor(
    private generalService: GeneralService
  ) { }

  getAllTemplates(){
    return this.generalService.getData<any>(`${this.API_IFI_SIPF}/template/documents/findAllTemplates`);
  }

  postPlantilla(post: any): Observable<PlantillasDocumentosInterface.PlantillasDocumentos> {
    return this.generalService.postData(`${this.API_IFI_SIPF}/template/documents/create/template`, post);
  }

  putPlantilla(pIdPlantilla: number, put: PlantillasDocumentosInterface.PlantillasDocumentos): Observable<PlantillasDocumentosInterface.PlantillasDocumentos> {
    return this.generalService.putData(`${this.API_IFI_SIPF}/template/documents/update/template`, String(pIdPlantilla), put);
  }

}
