import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { crearPerfil, OperatorGrups, PerfilInterface, ProfileDetail } from '../interfaces/Perfil.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private generalService: GeneralService) { }

  getPerfilXRol(id: string): Observable<PerfilInterface[]> {
    return this.generalService.getData<PerfilInterface[]>(environment.API_IFI_SIPF, ['perfil', id]);
  }

  getPerfilXNitCollaborator(id: string): Observable<PerfilInterface[]> {
    return this.generalService.getData<PerfilInterface[]>(environment.API_IFI_SIPF, ['perfil/nit', id]);
  }

  getPerfilLoggedUser(): Observable<PerfilInterface[]> {
    return this.generalService.getData<PerfilInterface[]>(environment.API_IFI_SIPF, ['perfil/logged/user']);
  }

  postCrearPerfil(crearPerfil: crearPerfil): Observable<crearPerfil> {
    return this.generalService.postData<crearPerfil, crearPerfil>(`${environment.API_IFI_SIPF}/perfil/colaborador`, crearPerfil);
  }

  deletePerfil(crearPerfil: crearPerfil): Observable<crearPerfil> {
    return this.generalService.putData<crearPerfil, crearPerfil>(`${environment.API_IFI_SIPF}/perfil/colaborador`, undefined, crearPerfil);
  }


  getPerfilxRol(rol: string): Observable<PerfilInterface[]> {
    return this.generalService.getData<PerfilInterface[]>(environment.API_IFI_SIPF, ['perfil/role', rol])
  }

  getProfileByRolLogin(role: string, login: string): Observable<PerfilInterface[]> {
    let datos: Param[] = [{ login: String(login) }, { role: String(role) }];
    return this.generalService.getData<PerfilInterface[]>(`${environment.API_IFI_SIPF}/perfil/login/role`, datos)
  }

  getProfileByRolLoginDetail(role: string, login: string, operator: boolean = false): Observable<ProfileDetail> {
    const datos: Param[] = [{ login: String(login) }, { role: String(role) }, { operator }];
    return this.generalService.getData<ProfileDetail>(`${environment.API_IFI_SIPF}/perfil/login/role/detail`, datos)
  }

  getOperatorGrups(): Observable<OperatorGrups[]> {
    return this.generalService.getData<OperatorGrups[]>(`${environment.API_IFI_SIPF}/collaborators/subcolaboratoresgrups`);
  }

  getTransferRequestExist(nit: string){
    return this.generalService.getData(`${environment.API_IFI_SIPF}/workgroups/transfer/request/exists/${nit}`)
  }
}
