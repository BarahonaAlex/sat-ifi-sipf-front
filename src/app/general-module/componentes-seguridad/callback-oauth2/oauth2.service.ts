import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralService } from '../../componentes-comunes/servicios/general.service';
import { TokenOauth2 } from './token-oauth2';

const ENDPOINT: string = environment.API_URL_SEC + '/tokens';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Service {

  constructor(private generalService: GeneralService) { }

  /**
   * Obtener el token en base a los parametros redireccionados por el modulo de seguridad
   */
  getToken(code: string, redirect_uri: string, scope: string): Observable<TokenOauth2> {
    let API_URL = `${ENDPOINT}/${code}/${scope}?uri=${redirect_uri}`;
    return this.generalService.getData<TokenOauth2>(`${API_URL}`);
  }

  getNewToken(refreshToken: string): Observable<TokenOauth2> {
    let API_URL = `${ENDPOINT}/new/${refreshToken}`;
    return this.generalService.getData<TokenOauth2>(`${API_URL}`);
  }

  getTokenHcaptcha(captcha: string): Observable<any> {
    return this.generalService.getData(`${ENDPOINT}/hc`, captcha);
  }

  /**
   * Valida si emisión del token ha expirado con una holgura de 30 segundos
   */
   isTokenExpired() {
    let expiresIn = sessionStorage.getItem("expiresIn");
    let dateTimeToken = sessionStorage.getItem("dateTimeToken");
    if (dateTimeToken && expiresIn) {
      let dateTimeTokenInt = parseInt(dateTimeToken);
      let setDate: Date = new Date(dateTimeTokenInt);
      let expires = parseInt(expiresIn);
      return Date.now() - setDate.getTime() > (expires * 1000 - (30 * 1000));
    }
    return true;
  }

  /**
  * Remueve el token si existe, asigna los nuevos valores y la fecha hora de obtención del token
  */
  setStorageToken(access_token: string, refresh_token: string, expires_in: number) {
    this.cleanStorageToken();
    sessionStorage.setItem("accessToken", access_token);
    sessionStorage.setItem("refreshToken", refresh_token);
    sessionStorage.setItem("expiresIn", expires_in.toString());
    sessionStorage.setItem("dateTimeToken", Date.now().toString());
  }

  /**
   * Remueve los datos del token almacenados
   */
  cleanStorageToken() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiresIn");
    sessionStorage.removeItem("dateTimeToken");
  }
}
