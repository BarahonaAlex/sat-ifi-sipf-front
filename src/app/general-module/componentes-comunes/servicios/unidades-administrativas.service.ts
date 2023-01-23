import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnidadesAdministrativasPadres, UnidadesAdministrativas, AdministrativeUnitFromProsis } from 'src/app/general-module/componentes-comunes/interfaces/unidades-administrativas.inteface';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadesAdministrativasService {

  private API_SPIF: string = environment.API_IFI_SIPF;

  constructor(private generalServices: GeneralService) { }

  /**
     * @description Metodo para obtener las unidades administrativas padres
     * @author Rudy Culajay (ruarcuse)
     * @since 07/01/2022
     * @param state estados de la unidad
     */
  getAdministrativeUnitsFather(state: Param[]): Observable<UnidadesAdministrativasPadres[]> {

    return this.generalServices.getData<UnidadesAdministrativasPadres[]>(`${this.API_SPIF}/administrative/units/fathers`, state);
  }

  /**
     * @description Metodo para obtener las unidades administrativas en base al id del padre
     * @author Rudy Culajay (ruarcuse)
     * @since 07/01/2022
     * @param idFather id de la unidad administrativa padre
     * @param state estados de la unidad
     */
  getAdministrativeUnitsByIdFather(idFather: number, state: Param[]): Observable<UnidadesAdministrativasPadres[]> {
    return this.generalServices.getData<UnidadesAdministrativasPadres[]>(`${this.API_SPIF}/administrative/units/children/father/${idFather}`, state);
  }

  /**
     * @description Metodo para obtener las unidades administrativas en base al id del padre
     * @author Rudy Culajay (ruarcuse)
     * @since 07/01/2022
     * @param idFather id de la unidad administrativa padre
     * @param state estados de la unidad
     */
  getAdministrativeUnitsByIdFatherProsis(idFather: number): Observable<UnidadesAdministrativasPadres[]> {
    return this.generalServices.getData<UnidadesAdministrativasPadres[]>(`${this.API_SPIF}/administrative/units/children/father/prosis/${idFather}`);
  }


  /**
     * @description Metodo para crear una unidad administrativa
     * @author Rudy Culajay (ruarcuse)
     * @since 10 /01/2022
     * @param unit datos de la unidad administrativa
     */
  createAdministrativeUnit(unit: UnidadesAdministrativas): Observable<UnidadesAdministrativas> {
    return this.generalServices.postData<UnidadesAdministrativas, UnidadesAdministrativas>(`${this.API_SPIF}/administrative/units`, unit);
  }


  /**
    * @description Metodo para obtener las unidades administrativas por estado
    * @author Rudy Culajay (ruarcuse)
    * @since 07/01/2022
    * @param state estados de la unidad
    */
  getAllAdministrativeUnits(state: Param[]): Observable<UnidadesAdministrativas[]> {
    return this.generalServices.getData<UnidadesAdministrativas[]>(`${this.API_SPIF}/administrative/units`, state);
  }

  /**
    * @description Metodo para actualizar una unidad administrativa
    * @author Rudy Culajay (ruarcuse)
    * @since 10 /01/2022
    * @param unit datos de la unidad administrativa
    */
  alterAdministrativeUnit(unit: UnidadesAdministrativas, id: number): Observable<UnidadesAdministrativas> {
    return this.generalServices.putData<UnidadesAdministrativas, UnidadesAdministrativas>(`${this.API_SPIF}/administrative/units`, String(id), unit);
  }


  /**
      * @description Metodo para obtener unidades administrativas en base al nit del usuario y a un rol 
      * @author Alex Barahona
      * @since 26/05/2022
      * @param idUnit datos de la unidad administrativa
      */
  getAdministrativeUnitByNitAndRol(pPerfil: number): Observable<UnidadesAdministrativas[]> {
    return this.generalServices.getData<UnidadesAdministrativas[]>(`${this.API_SPIF}/administrative/units/rol/${pPerfil}`);
  }


  getAdministrativeUnitFromProsis(): Observable<boolean> {
    return this.generalServices.getData<boolean>(`${this.API_SPIF}/administrative/units/prosis`);
  }

}
