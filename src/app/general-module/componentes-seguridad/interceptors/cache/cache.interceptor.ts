import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RequestCacheService } from './request-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cache: RequestCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /**
     * Solo las peticiones con metodo GET y que son registradas o por medio del
     * header se guardan en cache
     */
    if (this.cache.isCacheable(req))
    {
      let cachedResponse = this.cache.get(req.url, req.headers);
      return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
    }
    /**
     * Si no es metodo GET o no se solicita guardar en cache realiza la peticion sin guardar el resultado
     */
    return this.sendRequest(req, next);
  }

  /**
   * Realiza la peticion y guarda en cache el resultado
   * @param req
   * @param next
   */
  sendRequest(req: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(req)
      .pipe(tap((event: any) => this.cache.set(req.url, event, new Date())));
  }
}
