import { Component, Inject } from '@angular/core';
import { Contribuyente } from '../../../../../general-module/componentes-comunes/interfaces/contribuyente.interface';
import * as moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

// Dialogo para Ubicacion
@Component({
  selector: 'dialog-ubicacion',
  templateUrl: 'dialog-ubicacion.html',
})
export class DialogUbicacion {
  muestraFechaCambioDom: boolean = false;
  fechaCambioDomFiscal: any;
  detalleUbicacion: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.detalleUbicacion = data.detalle;
    if (data.fechaCambioDom && this.detalleUbicacion.tipoDireccion == Constantes.CODIGO_DIRECCION_FISCAL) {
      this.muestraFechaCambioDom = true;
      this.fechaCambioDomFiscal = moment(data.fechaCambioDom).parseZone().format('DD/MM/YYYY');
    } else {
      this.muestraFechaCambioDom = false;
    }

  }
}

// Dialogo para Historico de Ubicacion
@Component({
  selector: 'dialog-ubicacion-historico',
  templateUrl: 'dialog-ubicacion-historico.html',
})
export class DialogUbicacionHistorico {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Contribuyente.HistoricoCambioUbicacion) {
    data.fechaDesde ? moment(data.fechaDesde).parseZone().format('DD/MM/YYYY') : '';
    data.fechaHasta ? moment(data.fechaHasta).parseZone().format('DD/MM/YYYY') : '';
  }
}

// Dialogo para Establecimiento
@Component({
  selector: 'dialog_establecimientos',
  templateUrl: 'dialog-establecimientos.html'
})
export class DialogEstablecimientos {
  fechaCambioDom!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Contribuyente.EstablecimientoEntity) {
    if (data.fechaCambioDomicilioComercial) {
      this.fechaCambioDom = moment(data.fechaCambioDomicilioComercial).parseZone().format('DD/MM/YYYY');
    }
    data.fechaCambioNombreComercial ? moment(data.fechaCambioNombreComercial).parseZone().format('DD/MM/YYYY'):'';
    data.fechaCambioDomicilioComercial ? moment(data.fechaCambioDomicilioComercial).parseZone().format('DD/MM/YYYY'):'';
    data.fechaCambioActividadComercial ? moment(data.fechaCambioActividadComercial).parseZone().format('DD/MM/YYYY'):'';
    data.fechaResolucionBeneficioFiscal ? moment(data.fechaResolucionBeneficioFiscal).parseZone().format('DD/MM/YYYY'):'';
    data.fechaInicioOperaciones = moment(data.fechaInicioOperaciones).parseZone().format('DD/MM/YYYY');
    data.fechaEstado = moment(data.fechaEstado).parseZone().format('DD/MM/YYYY');
    data.fechaCancelacion ? moment(data.fechaCancelacion).parseZone().format('DD/MM/YYYY') : '';
    data.fechaInicialBeneficioFiscal ? moment(data.fechaInicialBeneficioFiscal).parseZone().format('DD/MM/YYYY'):'';
    data.fechaFinalBeneficioFiscal ? moment(data.fechaFinalBeneficioFiscal).parseZone().format('DD/MM/YYYY'):'';
  }
  printDetalle() {
    window.focus();
    window.print();
  }
}

// Dialog para historico de impuestos (iva, iso, isr); 
@Component({
  selector: 'dialog-impuestos-historico',
  templateUrl: 'dialog-impuestos-historico.html',
})
export class DialogImpuestosHistorico {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { historico: { nombreCodRegimen: string, fechaAdicion: string, fechaCambioRegimen: string }[], Impuesto: string }) {
    data.historico.forEach(res => {
      res.fechaAdicion ? moment(res.fechaAdicion).parseZone().format('DD/MM/YYYY'): '';
      res.fechaCambioRegimen ? moment(res.fechaCambioRegimen).parseZone().format('DD/MM/YYYY'): '';
    })
  }
}