import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { from, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { BlockUiService } from "../../componentes-comunes/servicios/block-ui.service";
import { Oauth2Service } from "../callback-oauth2/oauth2.service";
import { DialogService } from "../../componentes-comunes/servicios/dialog.service";
import { map } from "rxjs/operators";
import { CustomNode, FormStructure } from 'mat-dynamic-form';
import { HcaptchaComponent } from '../hcaptcha/hcaptcha.component';

@Injectable({
  providedIn: 'root'
})
export class HcaptchaGuard implements CanActivate, CanActivateChild {

  constructor(
    private oauth2: Oauth2Service,
    private dialog: DialogService,
    private blockUI: BlockUiService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.blockUI.block();
    if (!environment.seguridad) {
      console.warn("SEGURIDAD INACTIVA");
      this.blockUI.unblock();
      return true;
    }
    if (
      !sessionStorage.getItem('accessToken') ||
      sessionStorage.getItem('guard') != 'hcaptcha' ||
      this.oauth2.isTokenExpired()
    ) {      
      this.blockUI.unblock();
      return from(
        this.dialog.show({
          disableClose: true,
          showCancelButton: false,
          showConfirmButton: false,
          formStructure: new FormStructure().apply({
            showTitle: false,
            nodes: [
              new CustomNode<HcaptchaComponent>('captcha', HcaptchaComponent, {}).apply({ singleLine: true }),
            ]
          }),
        })).pipe(map((value) => value == 'primary'));
    }

    this.blockUI.unblock();
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state)
  }
}
