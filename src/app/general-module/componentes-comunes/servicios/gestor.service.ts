import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EntryNodoAcs, EntryProperties, ListaNodosAcs } from '../interfaces/nodos-ACS.interface';
import { Metadata } from '../interfaces/Metadata.interface';
import { ProcessVariables } from '../interfaces/process-variables.interface';
import { TaskFields, TaskNext } from '../interfaces/task-APS.interface';
import { ReponseUploadDoc, ResponseUploadS3 } from '../interfaces/file-ACS.interface';
import { GeneralService } from './general.service';
import { HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';

type TipoRuta = 'RUTA_BASE' | 'CASOS' | 'ADMINISTRACION_COLABORADOR' | 'ADMINISTRACION_DOCUMENTOS' | 'CARGA_MASIVAS' | 'RUTA_BASE_CASO'|'PRESENCIAS' |'ALCANCE_DENUNCIA' |'GABINETE'| 'POSTERIORI' | 'PUNTO_FIJO' | 'ALCANCEMASIVO' | 'CEDULA_CREDITO';

@Injectable({
  providedIn: 'root'
})
export class GestorService {
  private API_SPIF: string = environment.API_IFI_SIPF;
  constructor(private generalServices: GeneralService) { }

  /** 
   * @description Metodo para obtener archivo de ACS en base a su ID
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado del nodo (archivo)
   */
  contentSitesFileById(id: string): Observable<Blob> {
    return this.generalServices.getData<Blob>(`${this.API_SPIF}/content/sites/files`, id, { responseType: 'blob' });
  }

  /** 
   * @description Metodo para obtener informacion de las versiones de un archivo en base a su ID
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado del nodo (archivo)
   */
  contentSitesFileByIdVersions(id: string, includes?: string): Observable<ListaNodosAcs> {
    return this.generalServices.getData<ListaNodosAcs>(`${this.API_SPIF}/content/sites/files/${id}/versions`, includes ? [{ key: 'include', value: includes }] : undefined);
  }

  /** 
   * @description Metodo para obtener los nodos hijos de un carpeta en base a su ID
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado del nodo (carpeta)
   */
  contentSitesFolderByIdNodesChildren(id: string, includes?: string): Observable<ListaNodosAcs> {
    return this.generalServices.getData<ListaNodosAcs>(`${this.API_SPIF}/content/nodes/${id}/nodes-children`, includes ? [{ key: 'include', value: includes }] : undefined);
  }

  /** 
   * @description Metodo para obtener la informacion de un nodo en base a su ID
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado del nodo
   */
  contentSitesNodeById(id: string): Observable<EntryNodoAcs> {
    return this.generalServices.getData<EntryNodoAcs>(`${this.API_SPIF}/content/sites/nodes`, id);
  }

  /** 
   * @description Metodo para actulizar archivo en base a su ID
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado del nodo
   */
  contentSitesNodeByIdUpdate(id: string, content: FormData): Observable<ReponseUploadDoc> {
    return this.generalServices.putData<ReponseUploadDoc, FormData>(`${this.API_SPIF}/content/sites/files`, id, content);
  }

  /** 
   * @description Metodo para cargar un archivo a un carpeta
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param idCarpeta Id encriptado de la carpeta
   */
  contentSitesFoldersByNodeIdfiles(idCarpeta: string, content: FormData): Observable<ReponseUploadDoc> {
    return this.generalServices.postData<ReponseUploadDoc, FormData>(`${this.API_SPIF}/content/upload/multiple/file/${idCarpeta}`, content);
  }

  /** 
   * @description Metodo para renombrar una carpeta en base a su `id`
   * @author Rudy Culajay (ruarcuse)
   * @since 26/11/2021
   * @param id Id encriptado de la carpeta
   */
  contentSitesFoldersSetNameByIdUpdate(id: string, newName: string, content?: Metadata): Observable<unknown> {
    let param: Params[] = [
      {newName: newName }
    ]
    return this.generalServices.putData<unknown, Metadata>(`${this.API_SPIF}/content/sites/folders/${id}`, param, content);
  }

  /** 
   * @description Metodo para obtener la ruta base en un sitio de ACS en base a parametros
   * @author Rudy Culajay (ruarcuse)
   * @since 6/12/2021
   * @param tipoConsulta tipo de la consulta a realizar
   * @param jsonConsulta modelo de datos para consulta en base a `tipoConsulta`
   */
  contentSitesBasePathByParams(tipo: TipoRuta, body?: object): Observable<EntryNodoAcs> {
    return this.generalServices.postData<EntryNodoAcs, object>(`${this.API_SPIF}/content/base/root/encrypted/${tipo}`, body, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  /** 
   * @description Metodo para crear una carpeta en un nodo padre
   * @author Rudy Culajay (ruarcuse)
   * @since 6/12/2021
   * @param nodeId nodo padre
   * @param name nombre de la carpeta
   * @param propiedades propiedades de la carpeta
   */
  contentFolderCreateByNodeId(nodeId: string, name: string, propiedades?: EntryProperties | []): Observable<EntryNodoAcs> {
    return this.generalServices.postData<EntryNodoAcs, EntryProperties | []>(`${this.API_SPIF}/content/create/folder/${nodeId}?name=${name}`, propiedades ?? []);
  }

  uploadToS3(filename: string, file: Blob): Observable<ResponseUploadS3> {
    const formData = new FormData();
    formData.append('file', file);
    return this.generalServices.postData<ResponseUploadS3, FormData>(`${this.API_SPIF}/content/s3?filename=${filename}`, formData);
  }
}
