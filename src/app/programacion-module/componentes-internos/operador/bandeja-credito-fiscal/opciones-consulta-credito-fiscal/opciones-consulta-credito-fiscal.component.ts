import { Component, Input, OnInit } from '@angular/core';
import { CustomNode, FormStructure } from 'mat-dynamic-form';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { CreditoFiscalResponse } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { OpcionDetalleComponent } from '../../opcion-detalle/opcion-detalle.component';

@Component({
  selector: 'app-opciones-consulta-credito-fiscal',
  templateUrl: './opciones-consulta-credito-fiscal.component.html',
  styleUrls: ['./opciones-consulta-credito-fiscal.component.scss']
})
export class OpcionesConsultaCreditoFiscalComponent implements OnInit {

  @Input('idSolicitud') idSolicitud!: number;
  @Input('taxPayerData') taxPayerData!: Contribuyente.Respuesta;
  @Input('taxPayerCredito') taxPayerCredito!: CreditoFiscalResponse;
  private formStructure!: FormStructure;

  constructor(
    private dialog: DialogService
  ) { }

  ngOnInit() {
  }

  openModal(type: string) {
    this.formStructure = new FormStructure().apply({
      showTitle: false,
      nodes: [
        new CustomNode<OpcionDetalleComponent>(
          'detalle_solicitud',
          OpcionDetalleComponent,
          { id: this.idSolicitud, taxPayer: this.taxPayerData, type, taxPayerCase: this.taxPayerCredito, btnHallazgos: false}
        ).apply({
          singleLine: true
        })
      ],
      validateActions: []
    });

    this.dialog.show({
      title: `Consulta ${TYPE_MAPPER[type]}`,
      formStructure: this.formStructure,
      width: "100%",
      height: "100%",
      showConfirmButton: false,
      showCloseButton: true,
      disableClose: true
    })
  }
}

const TYPE_MAPPER: { [key: string]: string } = {
  'RTU': 'Registro Tributario Unificado',
  'HAUD': 'Auditorías Anteriores',
  'DC': 'Declaraciones',
  'CVH': 'Vehículos',
  'CP': 'Convenios de Pago',
  'AL': 'Asiste Libros',
  'RIVA': 'Retenciones IVA',
  'RISR': 'Retenciones ISR',
  'FEL': 'Facturas Electrónicas',
  'DD': 'DUAS y DUCAS',
  'EFA': 'Estados Financieros Auditados'
}

