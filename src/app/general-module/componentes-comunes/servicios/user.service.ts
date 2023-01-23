import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmpleadoProsis } from '../interfaces/empleado-prosis.interce';
import { RolesUser } from '../interfaces/roles-user.interface';
import { UserLogged } from '../interfaces/user.interface';
import { deleteNullProperties } from '../util/general-utils';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private itemValue = new BehaviorSubject<UserLogged | undefined>(undefined);

  /* API_GENERAL = environment.API_GENERAL; */
  /* API_RTU = environment.API_RTU; */
  /* API_RUF = environment.API_RUF; */
  API_SIPF = environment.API_IFI_SIPF;

  constructor(private generalServices: GeneralService) { }

  /**
   * @description Metodo para obtener la informacion general del empleado en base su `login`
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param login id del usuario que inicio sesion
   * @returns informacion general del empleado en Prosis
   */
  obtenerInfoGeneralByLogin(login: string): Observable<EmpleadoProsis> {
    return this.generalServices.getData<EmpleadoProsis>(`${this.API_SIPF}/collaborators/prosis/login`, login);
  }

  getUserLogged(): Observable<UserLogged> {
    if (sessionStorage.getItem('userLogged')) {
      return of(JSON.parse(sessionStorage.getItem('userLogged')!));
    }
    return this.generalServices.getData<UserLogged>(`${this.API_SIPF}/users/logged`).pipe(
      map(user => {
        user = deleteNullProperties(user);
        this.itemValue.next(user);
        sessionStorage.setItem('userLogged', JSON.stringify(user));
        return user;
      })
    )
  }

  getUserLoggedValue(): BehaviorSubject<UserLogged | undefined> {
    return this.itemValue;
  }

  getUserImageUrl(): Observable<string> {
    return this.generalServices.getData<Blob>(`${this.API_SIPF}/users/logged`, 'image', { responseType: 'blob' }).pipe(
      map(image => {
        return URL.createObjectURL(image);
      })
    );
  }
}
