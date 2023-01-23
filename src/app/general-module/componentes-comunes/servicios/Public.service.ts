import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { docPdf } from '../interfaces/alcances.interface.ts';
import { Catalog } from '../interfaces/Catalog.interface';
import { Contribuyente } from '../interfaces/contribuyente.interface';
import { DenunciaGrabada } from '../interfaces/DenunciaGrabada';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(
    private generalService: GeneralService
  ) { }


  getCatalogs(): Observable<Catalog[]> {
    return this.generalService.getData<Catalog[]>(`${environment.API_IFI_SIPF}/public/complaint/catalog`);
  }


  postComplaint(pBody: FormData): Observable<DenunciaGrabada> {
  
    return this.generalService.postData<DenunciaGrabada, FormData>(`${environment.API_IFI_SIPF}/public/complaint`, pBody);
  }


  getGeneralTaxpayerInformation(nit: string): Observable<Contribuyente.Respuesta> {
    return this.generalService.getData<Contribuyente.Respuesta>(`${environment.API_IFI_SIPF}/public/tax/payer/${nit}`);
  }

  getTemplate(id: number):Observable<any>{
    return this.generalService.getData(`${environment.API_IFI_SIPF}/public/template/documents/findTemplates/${id}`);
  }

  generationPdf(datos: docPdf):Observable<Blob> {                            
    return this.generalService.postData<Blob,docPdf>(`${environment.API_IFI_SIPF}/public/generation/file`, datos, { responseType: 'blob' });
  }

  deletePdf() {                            //
    return this.generalService.deleteData(`${environment.API_IFI_SIPF}/public/delete/generation/file`);
  }


}
