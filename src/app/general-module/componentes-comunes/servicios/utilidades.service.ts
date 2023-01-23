import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private router: Router) { }

  /**
   * @description Metodo para formatear el nombre de NOMBRE,NOMBRE,,APELLIDO,APELLIDO a Nombre Nombre Apellido Apellido
   * @author Carlos Ramos (crramosl)
   * @since 26/11/2021
   * @param nombre en formato NOMBRE,NOMBRE,,APELLIDO,APELLIDO o NOMBRE NOMBRE  APELLIDO APELLIDO
   * @returns nombre formateado
   */
  formatName(nombre: string): string {
    return nombre.replace(/(\,+)|(\s+)/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  /**
   * @description Metodo para navegar entre rutas, sin excepcion a navegar a la ruta actual
   * @author Carlos Ramos (crramosl)
   * @since 26/11/2021
   * @param comands arreglo de rutas
   * @param extras parametros de rutas {@link NavigationExtras}
   */
  forcedNavigate(comands: string[], extras?: NavigationExtras) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(comands, extras));
  }
}
