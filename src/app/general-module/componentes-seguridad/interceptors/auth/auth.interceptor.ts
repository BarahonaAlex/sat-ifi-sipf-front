import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oauth2Service } from 'src/app/general-module/componentes-seguridad/callback-oauth2/oauth2.service';
import { mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenOauth2 } from '../../callback-oauth2/token-oauth2';


const ENDPOINT_SEC = environment.API_URL_SEC;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private oauth2: Oauth2Service
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
     * Se agrega token a los servicios excepto el de seguridad
     */
    if (environment.seguridad && !request.url.includes(ENDPOINT_SEC)) {
      const refreshToken = sessionStorage.getItem("refreshToken");
      const guardType = sessionStorage.getItem("guard");
      /**
       * Cuando el token de acceso ha expirado y tienen token de refresco intenta renovar el token de acceso
       */
      if (refreshToken && this.oauth2.isTokenExpired()) {

        /**
         * Invocación al servicio para renovar token
         */
        return this.oauth2.getNewToken(refreshToken)
          .pipe(
            mergeMap((token: TokenOauth2) => {

              /**
              * Cuando se tiene respuesta del servicio de renovación de token
              * se guarda el nuevo token de acceso y refresco en sessionStorage
              */
              if (token) {
                this.oauth2.setStorageToken(token.access_token, token.refresh_token, token.expires_in);
              }
              /**
              * Cuando no hay resultado al tratar de renovar se colocan valores invalidos
              */
              else {
                this.oauth2.setStorageToken("invalidated", "invalidated", 0);
              }
              return next.handle(this.addAccessToken(request))
            })
          );
      }
      /**
       * Si no hay token de refresco o no ha expirado el token de acceso agrega el token de acceso que ya se tiene
       */
      else {
        return next.handle(this.addAccessToken(request));
      }
    }
    /**
     * Retorna la petición sin modificación
     */
    else {
      let authReq = request;
      return next.handle(authReq);
    }
  }

  /**
   * Agrega el token de acceso al header de autorizacion
   */
  addAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    let authToken = sessionStorage.getItem("accessToken");
    let newRequest = request;
    if (authToken) {
      return newRequest.clone({
        headers: newRequest.headers.append('Authorization', 'Bearer ' + authToken)
      });
    }
    return newRequest;
  }
}
