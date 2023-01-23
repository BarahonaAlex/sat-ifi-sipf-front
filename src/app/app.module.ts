import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralService } from './general-module/componentes-comunes/servicios/general.service';
import { CallbackOauth2Component } from './general-module/componentes-seguridad/callback-oauth2/callback-oauth2.component';
import { Oauth2Service } from './general-module/componentes-seguridad/callback-oauth2/oauth2.service';
import { AuthInterceptor } from './general-module/componentes-seguridad/interceptors/auth/auth.interceptor';
import { CacheInterceptor } from './general-module/componentes-seguridad/interceptors/cache/cache.interceptor';
import { ErrorInterceptor } from './general-module/componentes-seguridad/interceptors/error/error.interceptor';
import { GlobalErrorHandler } from './general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { GeneralModule } from './general-module/general.module';
import { MaterialModule } from './material.module';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    CallbackOauth2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    GeneralModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    GeneralService,
    Oauth2Service,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'es'
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private updates: SwUpdate,
    private appRef: ApplicationRef
  ) {
    this.updateVersion();
    this.checkPeriodicalUpdate();
  }

  /**
   * Metodo para validar si hay actualizaciones de la aplicación de angular
   * este se ejecuta cada 6 horas
   */
  checkPeriodicalUpdate() {
    if (this.updates.isEnabled) {
      const appIsStable = this.appRef.isStable.pipe(first(isStable => isStable === true));
      const everyNHours = interval(6 * 60 * 60 * 1000);
      const everyHoursAppIsStable = concat(appIsStable, everyNHours);
      everyHoursAppIsStable.subscribe(() => {
        console.log("Buscando actualizaciones");
        this.updates.checkForUpdate();
      });
    }
  }

  /**
   * Valida si hay una versión disponible de la aplicación de angular
   * Muestra un mensaje al usuario para realizar la actualización
   */
  updateVersion() {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        console.log('Nueva versión disponible: ', event.available.hash);
        this.updates.activateUpdate().then(() => document.location.reload());
        /*const snack = this.snackBar.open(`Nueva versión ${event.available.hash}`, 'Actualizar');
        snack.onAction().subscribe(()=>{
          this.updates.activateUpdate().then(() => document.location.reload());
        });*/
      });
      this.updates.activated.subscribe(event => {
        console.log('Actualizada de la versión ', event.previous?.hash, ' a ', event.current.hash);
      });
    }
  }

}
