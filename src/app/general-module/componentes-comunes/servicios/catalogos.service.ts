import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { Catalog, CreateItem, EditItem, Item, ManageableCatalog } from '../interfaces/Catalog.interface';
import { Topic } from '../interfaces/hallazgos.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(
    private generalService: GeneralService
  ) { }

  getCatalogDataByListIdCatalog(codigo: Array<string>, state: number = 1): Observable<Catalog[]> {

    let params: Param[] = [{ idStatus: String(state) }, ...codigo.map(item => ({ listIdCatalog: String(item) }))];

    return this.generalService.getData<Catalog[]>(`${environment.API_IFI_SIPF}/catalog/data`, params);
  }

  getCatalogDataByIdCatalog(codigo: number, state: number = 1): Observable<Catalog[]> {
    return this.generalService.getData<Catalog[]>(`${environment.API_IFI_SIPF}/catalog/data`, [{ idCatalog: String(codigo) }, { idStatus: String(state) }]);
  }

  getDataById(pIdDato: number): Observable<Catalog> {
    return this.generalService.getData<Catalog>(`${environment.API_IFI_SIPF}/catalog/data/item`, [{ idDato: String(pIdDato) }]);
  }

  /**
   * @description Método para obtener catalogos padres administrables
   * @author ajsbatzmo(Jamier Batz)
   * @since 15/06/2022
   */
  getManageableCatalog(): Observable<ManageableCatalog[]> {
    return this.generalService.getData<ManageableCatalog[]>(`${environment.API_IFI_SIPF}/catalog/manageable`);
  }


  /**
   * @description Método para obtener items en base a id padre
   * @author ajsbatzmo(Jamier Batz)
   * @since 15/06/2022
   * @param id indentificador codigo catalogo del padre
   */
    getCatSonAdmin(id: number): Observable<Item[]> {
    return this.generalService.getData<Item[]>(`${environment.API_IFI_SIPF}/catalog/item`, id.toString());
  }

  /**
   * @description Método para guardar items
   * @author ajsbatzmo(Jamier Batz)
   * @since 15/06/2022
   * @param item indentificador cuerpo del catalogo
   */
  saveCatalogSon(item: CreateItem): Observable<CreateItem> {
    return this.generalService.postData<CreateItem, CreateItem>(`${environment.API_IFI_SIPF}/catalog/item`, item)
  }

  /**
   * @description Método para remover item
   * @author ajsbatzmo(Jamier Batz)
   * @since 15/06/2022
   * @param id indentificador codigo catalogo hijo a modificar estado
   */
  updateStatusCatalogSon(id: number): Observable<EditItem> {
    return this.generalService.putData<any, any>(`${environment.API_IFI_SIPF}/catalog/item`, id.toString());
  }

  /**
   * @description Método para editar items
   * @author ajsbatzmo(Jamier Batz)
   * @since 15/06/2022
   * @param id indentificador codigo catalogo hijo a modificar 
   * @param item indentificador cuerpo del catalogo
   */
  updateCatalogSon(id: number, item: EditItem): Observable<EditItem> {
    return this.generalService.putData<EditItem, EditItem>(`${environment.API_IFI_SIPF}/catalog/item/description`, id.toString(), item);
  }

  getFindingsItems() {
    return this.generalService.getData<Topic[]>(`${environment.API_IFI_SIPF}/catalog/findings/items`);
  }

  getCatalogDataByIdCatalogStatusSpecialConditionName(codigo: number, pname: string, state: number = 1): Observable<Catalog[]> {
    return this.generalService.getData<Catalog[]>(`${environment.API_IFI_SIPF}/catalog/data`, [{ idCatalog: String(codigo) }, { idStatus: String(state) }, { nombre: pname }]);
  }
}