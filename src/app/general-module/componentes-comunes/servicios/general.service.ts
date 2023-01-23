import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Param } from '../clases/Params';
import { UrlUtils } from '../util/url-utils';


@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(protected html: HttpClient) { }

  /**
   * Realiza una petición GET en base a la url y los parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param params Parámetros de la petición.
   * @param options Opciones de la petición.
   * @template R Tipo de dato de la respuesta.
   * @returns Observable de la petición.
   */
  getData<R>(
    baseUrl: string,
    params?: string | string[] | Param[],
    options?: {}
  ) {
    
    return this.html.get<R>(this.createUrl(baseUrl, params), options);
  }

  /**
   * Realiza una petición POST en base a la url y los parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param body Cuerpo de la petición.
   * @param options opciones de la petición.
   * @template R Tipo de dato de la respuesta.
   * @template B Tipo de dato del cuerpo de la petición.
   * @returns Observable de la petición.
   */
  postData<R, B>(baseUrl: string, body?: B, options?: {}) {
    return this.html.post<R>(baseUrl, body, options);
  }

  /**
   * Realiza una petición PUT en base a la url y los parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param params Parámetros de la petición.
   * @param body Cuerpo de la petición.
   * @param options opciones de la petición.
   * @template R Tipo de dato de la respuesta.
   * @template B Tipo de dato del cuerpo de la petición.
   * @returns Observable de la petición.
   */
  putData<R, B>(
    baseUrl: string,
    params?: string | string[] | Param[],
    body?: B,
    options?: {}
  ) {
    return this.html.put<R>(this.createUrl(baseUrl, params), body, options);
  }

  /**
   * Realiza una petición PATCH en base a la url y los parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param params Parámetros de la petición.
   * @param body Cuerpo de la petición.
   * @param options opciones de la petición.
   * @template R Tipo de dato de la respuesta.
   * @template B Tipo de dato del cuerpo de la petición.
   * @returns Observable de la petición.
   */
  patchData<R, B>(
    baseUrl: string,
    params?: string | string[] | Param[],
    body?: B,
    options?: {}
  ) {
    return this.html.patch<R>(this.createUrl(baseUrl, params), body, options);
  }

  /**
   * Realiza una petición DELETE en base a la url y los parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param params Parámetros de la petición.
   * @param options opciones de la petición.
   * @template R Tipo de dato de la respuesta.
   * @returns Observable de la petición.
   */
  deleteData<R>(
    baseUrl: string,
    params?: string | string[] | Param[],
    options?: {}
  ) {
    return this.html.delete<R>(this.createUrl(baseUrl, params), options);
  }

  /**
   * Crea una url a partir de una ruta base y de una lista de parámetros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param baseUrl Ruta base de la petición.
   * @param params Parámetros de la petición.
   * @returns Url compuesta de la ruta base y los parámetros.
   */
  createUrl(baseUrl: string, params?: string | string[] | Param[]): string {
    if (!params) return baseUrl;
    if (typeof params == 'string')
      return `${baseUrl}/${params}`;
    if (params instanceof Array && typeof params[0] == 'string')
      return `${baseUrl}/${params.join('/')}`;
    else return `${baseUrl}${UrlUtils.toQueryParams(params as Param[])}`;
  }
}
