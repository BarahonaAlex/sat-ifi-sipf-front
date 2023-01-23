import { TokenOauth2 } from './token-oauth2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Oauth2Service } from './oauth2.service';
import { UserService } from '../../componentes-comunes/servicios/user.service';

@Component({
  selector: 'app-callback-oauth2',
  templateUrl: './callback-oauth2.component.html'
})
export class CallbackOauth2Component implements OnInit {

  pageRedirect!: string;

  constructor(
    private route: ActivatedRoute,
    private oauth2: Oauth2Service,
    private router: Router,
    private userService: UserService
  ) { }

  /**
   * La acción inicial es obtener los parametros que envia el servidor de autorización y en base a estos
   * obtener un token, posteriormente redirecciona a la pantalla solicitada por el usuario
   */
  ngOnInit(): void {
    let redirect = sessionStorage.getItem('pageRedirect');
    this.pageRedirect = redirect ? redirect : "/";
    console.log("Redirect: " + this.pageRedirect);
    
    this.route.queryParams.subscribe(async params => {
      /**
       * Cuando obtiene código y token procede a guardarlo y redirecciona a la página inicialmente solicitada
       * En caso contrario mostrará el contenido de la pagina callback-oauth2
       */
      if (params['code']) {
        this.oauth2.getToken(params['code'], window.location.href.split('?')[0], params['scope']).subscribe(data => {
          /**
           * Obtiene token y lo almacena
           */
          let token: TokenOauth2 = data;
          if (token && token.access_token) {
            this.oauth2.setStorageToken(token.access_token, token.refresh_token, token.expires_in);

            this.userService.getUserLogged().toPromise();
          }
          /**
          * Redirecciona a la pantalla solicitada por el usuario
          */
          this.router.navigate([redirect]);
        });
      }
    });
  }
}
