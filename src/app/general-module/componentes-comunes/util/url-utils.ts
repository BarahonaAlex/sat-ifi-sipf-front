import { HttpHeaders } from "@angular/common/http";
import { Param } from "../clases/Params";


export class UrlUtils {
  /**
   * Crea query params en base a un array de parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param params Parametros de consulta de la url.
   * @returns Cuerpo de la url.
   */
  static toQueryParams(params: Param[]): string {
    return `?${params.filter(param => param[Object.keys(param)[0]]).map((param) => `${Object.keys(param)[0]}=${param[Object.keys(param)[0]]}`).join("&")}`;
  }

  /**
   * Crea headers en base a un array de parametros.
   * 
   * @author Carlos Ramos (crramosl)
   * @param params Header de la petición.
   * @returns Objeto de tipo HttpHeaders.
   */
  static toHeaders(params?: Param[]): HttpHeaders {
    var headers = new HttpHeaders();
    params?.forEach((param) => {
      headers = headers.append(param.key, param.value);
    });
    return headers;
  }
}
