import { ComplaintGabinetOptionDetailComponent } from './../complaint-gabinet-option-detail/complaint-gabinet-option-detail.component';
import { Component, Input, OnInit } from '@angular/core';
import { CustomNode, FormStructure } from 'mat-dynamic-form';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-complaint-gabinet-option-query',
  templateUrl: './complaint-gabinet-option-query.component.html',
  styleUrls: ['./complaint-gabinet-option-query.component.scss']
})
export class ComplaintGabinetOptionQueryComponent implements OnInit {
  @Input('correlativo') correlativo!: String;
  @Input('taxPayerData') taxPayerData!: Contribuyente.Respuesta;
/*   @Input('taxPayerCase') taxPayerCase!: CaseDetail; */
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
        new CustomNode<ComplaintGabinetOptionDetailComponent>(
          'detalle_solicitud',
          ComplaintGabinetOptionDetailComponent,
          { correlativo: this.correlativo, taxPayer: this.taxPayerData, type, }
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
  'CVH': 'Vehículos',
  'CP': 'Convenios de Pago',
  'AL': 'Asiste Libros',
  'RIVA': 'Retenciones IVA',
  'HAUD': 'Auditorías Anteriores',
  'RISR': 'Retenciones ISR',
  'FEL': 'Facturas Electrónicas',
  'DC': 'Declaraciones',
  'DD': 'DUAS y DUCAS',
  'EFA': 'Estrategias de Fiscalización para el Auditor'
}
