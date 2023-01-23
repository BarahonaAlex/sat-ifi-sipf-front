import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Authorizer, ColaboradorFromProsis, ColaboratorDto, collaboratorHistory, CollaboratorResponse, createCollaborator, getCases, Operator, professionals, reAsign, Supervisor, updateCollaborator, UpdateJobPositionColaborador } from '../interfaces/Colaborador.interface';
import { Professional } from '../interfaces/desasignacion-casos';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresService {

  private API_SPIF: string = environment.API_IFI_SIPF;

  constructor(private generalService: GeneralService) { }


  /**
* @description Método para traer todos los colaboradores
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
  getCollaborators(): Observable<CollaboratorResponse[]> {
    return this.generalService.getData<CollaboratorResponse[]>(environment.API_IFI_SIPF, 'collaborators');
  }

  /**
* @description Método para traer un colaborador por medio de `NIT` 
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param NIT indentificador tributario del colaborador
*/
  getCollaborator(id: string): Observable<CollaboratorResponse> {
    return this.generalService.getData<CollaboratorResponse>(environment.API_IFI_SIPF, `collaborators/${id}`);
  }

  /**
* @description Método para crear un colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
  createCollaborator(collaborator: createCollaborator): Observable<CollaboratorResponse> {
    return this.generalService.postData<CollaboratorResponse, createCollaborator>(`${environment.API_IFI_SIPF}/collaborators`, collaborator);
  }

  /**
* @description Método para guardar el historial de creacion, actulizacion y eliminacion de un colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
  createHistoryCollarator(history: collaboratorHistory): Observable<CollaboratorResponse> {
    return this.generalService.postData<CollaboratorResponse, collaboratorHistory>(`${environment.API_IFI_SIPF}/collaborators/history`, history);
  }

  /**
* @description Método para actualizar  un colaboradora por medio de su `NIT` 
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param NIT indentificador tributario del colaborador
*/
  updateCollaborator(id: string, collaborator: updateCollaborator): Observable<CollaboratorResponse> {
    return this.generalService.putData<CollaboratorResponse, updateCollaborator>(`${environment.API_IFI_SIPF}/collaborators`, id, collaborator);
  }

  updateCollaboratorMultipar(pBody: FormData): Observable<updateCollaborator> {

    return this.generalService.postData<updateCollaborator, FormData>(`${environment.API_IFI_SIPF}/collaborators/multipart/modify`, pBody);
  }

  /**
* @description Método para eliminar un colborador por medio de su `NIT` 
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param NIT indentificador tributario del colaborador
*/
  deleteCollaborator(id: string): Observable<boolean> {
    return this.generalService.deleteData<boolean>(`${environment.API_IFI_SIPF}/collaborators/delete/${id}`);
  }

  /**
* @description Método para obtener todo los colaboradores por medio de su gerencia
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param idGerencia indentificador unico de gerencia
*/
  getManagementCollaborator(id: string): Observable<CollaboratorResponse[]> {
    return this.generalService.getData<CollaboratorResponse[]>(environment.API_IFI_SIPF, ['collaborators/management', id]);
  }

  /**
 * @description Método para obtener los casos que tiene un colaborador asignador por medio de su `NIT` 
 * @author agaruanom (Gabriel Ruano)
 * @since 17/02/2022
 * @param NIT indentificador tributario del colaborador
 */
  getCases(id: string): Observable<getCases[]> {
    return this.generalService.getData<getCases[]>(environment.API_IFI_SIPF, `collaborators/assignedcase/${id}`);
  }

  /**
* @description Método para obtener el grupo donde pertenece el colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param NIT indentificador tributario del colaborador
*/
  getProfessional(id: string): Observable<professionals[]> {
    return this.generalService.getData<professionals[]>(environment.API_IFI_SIPF, `collaborators/groupscollaborator/${id}`);
  }

  /**
* @description Método para reasignar el caso a otro colaborador
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
* @param NIT indentificador tributario del colaborador
*/
  reassignCase(id: number, cases: reAsign): Observable<getCases> {
    return this.generalService.putData<getCases, reAsign>(`${environment.API_IFI_SIPF}/collaborators/reasignacion`, id.toString(), cases)
  }


  /**
* @description Método para obtener todo los supervisores con estado activo
* @author abaestrad (Alex - Debora)
* @since 03/03/2022
*/
  getListSupervisor(): Observable<Supervisor[]> {
    return this.generalService.getData<Supervisor[]>(environment.API_IFI_SIPF, `collaborators/supervisor`);
  }

  /**
* @description Método los colaboradores de un supuerior 
* @author alex barahona  
* @since 26/05/2022
*/
  getColaboratoresBySuperior(pPerfilJefe: number, pPerfil: number): Observable<professionals[]> {
    return this.generalService.getData<professionals[]>(environment.API_IFI_SIPF, `collaborators/superior/${pPerfilJefe}/${pPerfil}`);
  }

  /**
* @description Método para obtener grupos de trabajo de un operador 
* @author ajsbatzmo (Jamier Batz) 
* @since edited 21/06/2022
*/
  getTeamsByNitOperator(nit: string): Observable<Operator[]> {
    return this.generalService.getData<Operator[]>(`${this.API_SPIF}/collaborators/operator/${nit}`);
  }

  /**
 * @description Método para obtener grupos de trabajo y unidades de un autorizador 
 * @author ajsbatzmo (Jamier Batz) 
 * @since edited 21/06/2022
 */
  getTeamsUntisByNitAuthorizer(nit: string): Observable<Authorizer[]> {
    return this.generalService.getData<Authorizer[]>(`${this.API_SPIF}/collaborators/authorizer/${nit}`);
  }

  /**
* @description Método para obtener los datos de colaborador desde prosis 
* @author adftopv (Débora Top) 
* @since edited 11/07/2022
*/
  getCollaboradorInfoByNit(pNit: string): Observable<ColaboradorFromProsis> {
    return this.generalService.getData<ColaboradorFromProsis>(environment.API_IFI_SIPF, `collaborators/informacion/prosis/${pNit}`);
  }

  /**
* @description Método para obtener los datos de colaborador desde prosis 
* @author adftopv (Débora Top) 
* @since edited 11/07/2022
*/
  updateJobPosition(pNit: string): Observable<UpdateJobPositionColaborador> {
    return this.generalService.getData<UpdateJobPositionColaborador>(environment.API_IFI_SIPF, `collaborators/jobPosition/${pNit}`);
  }




  /**
* @description Método para obtener los datos de colaborador desde prosis 
* @author adftopv (Débora Top) 
* @since edited 11/07/2022
*/
  getSubcolaboratoresByLevel(pLevel: number): Observable<ColaboratorDto[]> {
    return this.generalService.getData<ColaboratorDto[]>(environment.API_IFI_SIPF, `collaborators/subcolaboratores/${pLevel}`);
  }



}
