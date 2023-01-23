import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, NgZone, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../componentes-comunes/servicios/dialog.service';
import { Oauth2Service } from '../callback-oauth2/oauth2.service';

@Component({
  selector: 'app-hcaptcha',
  templateUrl: './hcaptcha.component.html',
  styleUrls: ['./hcaptcha.component.scss']
})
export class HcaptchaComponent implements OnInit {
  size: string = 'normal';
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private oauth2: Oauth2Service,
    private dialog: DialogService,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          this.size = 'compact';
        }
        if (state.breakpoints[Breakpoints.Small]) {
          this.size = 'compact';
        }
        if (state.breakpoints[Breakpoints.Medium]) {
          this.size = 'normal';
        }
        if (state.breakpoints[Breakpoints.Large]) {
          this.size = 'normal';
        }
        if (state.breakpoints[Breakpoints.XLarge]) {
          this.size = 'normal';
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  onVerify(captchaResponse: string) {
    this.oauth2.getTokenHcaptcha(captchaResponse).toPromise().then((token) => {
      if (!token) {
        this.dialog.show({
          title: 'SAT-401',
          text: 'Ocurrio un error durante el proceso de validación del captcha. Por favor, intente de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        }).then(_ => location.reload());
        return;
      }
      this.oauth2.setStorageToken(token.access_token, token.refresh_token, token.expires_in);
      sessionStorage.setItem('guard', 'hcaptcha');
      this.ngZone.run(() => {
        this.dialog.close('primary');
      });
    });
  }

  onExpired(response: any) {
    this.dialog.show({
      title: 'SAT-504',
      text: 'Se venció el tiempo de espera. Por favor, intente de nuevo.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    }).then(_ => location.reload());
  }

  onError(error: any) {
    switch (error) {
      case 'network-error':
        this.dialog.show({
          title: 'SAT-000',
          text: 'No se pudo establecer conexión con el servidor, por favor, intente revisar su conexión a internet.',
          icon: 'error',
        }).then(_ => location.reload());
        break;
      default:
        this.dialog.show({
          title: 'SAT-000',
          text: 'Error al validar el captcha. Por favor, intente de nuevo.',
          icon: 'error',
        }).then(_ => location.reload());
        break;
    }
  }
}
