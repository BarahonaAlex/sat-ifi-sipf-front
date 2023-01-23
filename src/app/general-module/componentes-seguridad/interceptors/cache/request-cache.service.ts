import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  /**
   * Listado de URLs que se guardaran en cache
   */
  urlServiceCache: string[] = [
    /*'/api/contexto/path/5/parametros?sort=id,asc',
    '/api/contexto/parametros/10'*/
  ];

  /**
   * Tiempo de expiración en milisegundos
   * -1 Nunca expira
   */
  expiry: number = -1;

  /**
   * Valida si existe la variable accessToken en sesion
   * true = valida, false = no valida
   */
  validAccessToken: boolean = environment.seguridad;

  /**
   * Respuesta en cache
   */
  cache = new Map();

  constructor() { }

  /**
   * Retorna nulo cuando no se tiene en cache
   * @param url URL del servicio origen
   */
  get(url: string, headers: HttpHeaders) {
    let result = this.cache.get(url);
    if (result)
    {
      let response = result.response;
      /**
       * Si el resultado esta en cache pero ya expiro o la sesion del token esta vacia
       * o si se solicita resetear el cache por medio del header cache-response entonces se borra
       */
      if (this.isExpired(result.date)
        || (headers.get("cache-response") && headers.get("cache-response")==='false')
        || (this.validAccessToken && !sessionStorage.getItem("accessToken")))
      {
        return this.delete(url)
      }
      /**
       * Retorna el valor en cache
       */
      return response;
    }
    /**
     * Si no hay valor en cache retorna nulo
     */
    return null;
  }

  /**
   * Determina si ya expiro el tiempo de cache, valor -1 nunca expira
   * @param setDate Fecha que se guarda desde el primer registro en cache
   */
  isExpired(setDate: Date)
  {
    if (this.expiry===-1)
    {
      return false;
    }
    return Date.now() - setDate.getTime() > this.expiry;
  }

  /**
   * Guarda en cache el resultado del servicio
   * @param url URL del servicio origen
   * @param response Respuesta del servicio
   * @param date Fecha hora de la primer peticion
   */
  set(url: string, response: any, date: any) {
    this.cache.set(url, { response: response, date: date });
  }

  /**
   * Limpia cache
   * @param url URL del servicio a limpiar cache
   */
  delete(url: string) {
    this.cache.delete(url);
    return null;
  }

  /**
   * Buscar la ruta en el arreglo para determinar si debe guardar en cache
   * @param serviceUri Arreglo de URL en cache
   */
  existUrlServiceCache(serviceUri: string) {
        return this.urlServiceCache.indexOf(serviceUri) > -1;
  }

  /**
   * Valida si es un metodo GET y si esta registrada la ruta para guardarse en cache
   * o se solicita por medio del header cache-response
   * @param req Peticion origen
   */
  isCacheable(req: HttpRequest<any>) {
    let pathUrl=this.getPathUrl(req.urlWithParams);
    if (req.method === 'GET'
      && ((req.headers.get("cache-response")
        && (req.headers.get("cache-response")==='true' || req.headers.get("cache-response")==='false'))
        || this.existUrlServiceCache(pathUrl))
        )
    {
      return true;
    }
    return false;
  }

  /**
   * Remueve del path el dominio o host de la petición origen
   * @param url Contexto y path del request
   */
  getPathUrl(url: string)
  {
    return url.replace(/http(s)?:\/\/[\w:\/\/](([\w][\w]*[\w]|[\w])\.)*[\w][\w]{1,61}[\w]\.[\w]{2,}/,"");
  }

}
