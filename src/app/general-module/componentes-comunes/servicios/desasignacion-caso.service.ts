import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { casosCantidad, Professional, ProfessionalDesasignar, ProfessionalGeneral, ProfessionalReasignar, UnassignAndReassign } from '../interfaces/desasignacion-casos';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class DesasignacionCasosService {
  private API_SPIF: string = environment.API_IFI_SIPF;
constructor(private desService : GeneralService) { }



/**
   * @description servicio que trae los supervisores de la bd
   * @author lfvillag (Luis Villagrán)
   * @since 15/06/2022
   */
getProfetionals(): Observable<Professional[]> {
  return this.desService.getData<Professional[]>(`${this.API_SPIF}/collaborators/groupscollaborator`)
}

getProfessionalGeneral(nit: string): Observable<ProfessionalGeneral[]>{
  return this.desService.getData<ProfessionalGeneral[]>(`${this.API_SPIF}/collaborators/professional/${nit}`)
}

getProfessionalUnassign(nit : string): Observable<ProfessionalDesasignar[]>{
  return this.desService.getData<ProfessionalDesasignar[]>(`${this.API_SPIF}/collaborators/professional/unassign`, nit)
}
/* obtener profesionales */
getProfessionalReasign(nit : string, params?: Param[]): Observable<ProfessionalReasignar[]>{
  return this.desService.getData<ProfessionalReasignar[]>(`${this.API_SPIF}/collaborators/profetional/reasign/${nit}`, params)
}

getPrueba(nit:string): Observable<casosCantidad[]>{
  return this.desService.getData<casosCantidad[]>(`${this.API_SPIF}/cases/unassign/`, nit)
}

getCasoReasignar(nit: string):Observable<casosCantidad[]>{
  return this.desService.getData<casosCantidad[]>(`${this.API_SPIF}/cases/reassign/`, nit)
}

UnassignColaborator(idCaso: Param[], Unassign: UnassignAndReassign):Observable<UnassignAndReassign>{
  return this.desService.putData<UnassignAndReassign, UnassignAndReassign>(`${this.API_SPIF}/cases/unassign`, idCaso, Unassign);
}

ReassignColaborator(idCaso: Param[], Reassign: UnassignAndReassign[]):Observable<UnassignAndReassign[]>{
  return this.desService.putData<UnassignAndReassign[], UnassignAndReassign[]>(`${this.API_SPIF}/collaborators/reasignacion`, idCaso, Reassign);
}
    /**
* @description Método para traer todos los colaboradores
* @author agaruanom (Gabriel Ruano)
* @since 17/02/2022
*/
getMaster(): Observable<Professional[]> {
  return this.desService.getData<Professional[]>(environment.API_IFI_SIPF, 'collaborators/getMembers');
}
}