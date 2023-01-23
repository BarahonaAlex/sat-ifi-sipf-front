import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { solicitudes } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';

@Component({
  selector: 'app-solicitud-devolucion-credito-fiscal',
  templateUrl: './solicitud-devolucion-credito-fiscal.component.html',
  styleUrls: ['./solicitud-devolucion-credito-fiscal.component.css'],
})
export class SolicitudDevolucionCreditoFiscalComponent implements OnInit {
  @ViewChild('MatPaginator') set matPaginator2(mp: MatPaginator) {
    this.Solicitud.paginator = mp;
  }
  BandejaSolicitud: string[] = [
    'idSolicitud',
    'numeroFormulario',
    'pinicio',
    'pfin',
    'estado',
    'Accion',
  ];
  Solicitud = new MatTableDataSource<solicitudes>();
  lenghtTableSolicitudes!: number;
  constructor(private creditServices: CreditoFiscal, private router: Router) {}
  ngOnInit(): void {
    this.getRequestTaxCredit();
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @date 09/11/2022
   * @description
   * Metodo utilizado para obtener las solicitudes que tiene un contribuyente en base a su NIT
   */
  getRequestTaxCredit() {
    this.creditServices
      .getSolicitudesCreditoFiscal()
      .toPromise()
      .then((res) => {
        this.lenghtTableSolicitudes = res.length;
        this.Solicitud.data = res;
      });
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @date 18/11/2022
   * @description
   * Metodo que abre el componente de formulario para crear una solicitud
   */
  newSolicitud() {
    this.router.navigate(['/det-sel/solicitud/formulario']);
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @date 18/11/2022
   * @description
   * Metodo que abre el componente para cargar libros, se pasan parametros para consumir servicios en el componente "Carga de Archivo"
   * @param fecha1
   * @param fecha2
   * @param nit
   * @param idSolicitud
   */
  loadFile(
    fecha1: string,
    fecha2: string,
    nit: string,
    idSolicitud: number,
    doc: number
  ) {
    this.router.navigate([
      '/det-sel/carga/credito/fiscal',
      fecha1,
      fecha2,
      nit,
      idSolicitud,
      doc,
    ]);
  }
}
