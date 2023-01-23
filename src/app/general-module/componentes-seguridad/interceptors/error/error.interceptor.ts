import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { BlockUiService } from 'src/app/general-module/componentes-comunes/servicios/block-ui.service';
import { Oauth2Service } from '../../callback-oauth2/oauth2.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private blockUI: BlockUiService,
    private oauth2: Oauth2Service
  ) { }

  /**
   * Interceptor para ventana de espera de respuesta de la petición
   * y manejo de mensajes de error
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.blockUI.block();
    return next.handle(request).pipe(
      finalize(() => {
        this.blockUI.unblock();
      }),
      delay(100),
      catchError((httperror: HttpErrorResponse) => {
        /**
           * Cuando el error es por token invalido se debe a que la sesión fue cerrada o el token expiró
           * Se limpia la información del token y se redirecciona para volver al guard y obtener nuevo token
           */
        if (httperror.status === 401
          && httperror.error
          && httperror.error.error
          && httperror.error.error === "invalid_token"
          && sessionStorage.getItem("guard")
          && sessionStorage.getItem("guard") === "Authorization") {
          this.oauth2.cleanStorageToken();
          window.location.href = window.location.href;
        }

        if (httperror.status == 401) {
          httperror = new HttpErrorResponse({
            error: httperror.error,
            url: `${request.method} ${request.url}`,
            headers: httperror.headers,
            status: httperror.status,
            statusText: httperror.statusText
          })
        }

        this.blockUI.unblock();
        return throwError(httperror);
      })
    ) as Observable<HttpEvent<any>>;
  };
}
