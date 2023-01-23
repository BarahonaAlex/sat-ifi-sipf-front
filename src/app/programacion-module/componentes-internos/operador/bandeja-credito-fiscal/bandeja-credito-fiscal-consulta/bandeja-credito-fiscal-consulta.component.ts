import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { BandejaIncosistenicasResponse, CreditoFiscalResponse, DataExtraResponse, InconsistenciasResponse } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';

@Component({
  selector: 'app-bandeja-credito-fiscal-consulta',
  templateUrl: './bandeja-credito-fiscal-consulta.component.html',
  styleUrls: ['./bandeja-credito-fiscal-consulta.component.scss']
})
export class BandejaCreditoFiscalConsultaComponent implements OnInit {

  id!: number;
  idEstadoSolicitud!: number;
  taxPayerCredito!: CreditoFiscalResponse;
  taxPayerData!: Contribuyente.Respuesta;
  taxPayer = { name: '', activity: '', dpi: '', address: '', classification: '', taxPayerType: '', taxes: '' };
  inconsistencias!: BandejaIncosistenicasResponse[];
  comentarioCorrecciones!: string;
  esCorreccion: boolean = false
  extraDataSolicitud!: DataExtraResponse

  constructor(private route: ActivatedRoute,
    private taxPayerService: ContribuyenteService,
    private dialog: DialogService,
    private creditoFiscalService: CreditoFiscal,
    private router: Router) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(async params => {
      this.id = parseInt(params.get('id') ?? '-1');

      const res = await this.creditoFiscalService.getCreditFiscalById(this.id).toPromise();
      this.taxPayerCredito = res    
      console.log(this.taxPayerCredito);
      this.esCorreccion = res.estado === 1056 ? false : true;      
      this.idEstadoSolicitud = res.estado 
      
      const respuesta = await this.creditoFiscalService.getExtraDataRequest(this.id).toPromise();
      this.extraDataSolicitud = respuesta
      this.comentarioCorrecciones = respuesta.comentario
      
      this.taxPayerData = await this.taxPayerService.getGeneralTaxpayerInformation(res.nitContribuyente).toPromise();
      const data = this.taxPayerData.data.attributes.datos;
      const detail = data.contribuyente?.persona ?? data.empresa;
      const location = data.ubicacion.ubicaciones?.pop();
      const taxes = Object.keys(data.afiliacionImpuesto ?? {}).filter(key => (data.afiliacionImpuesto as any)[key] != null).join('/')?.toUpperCase();

      this.taxPayer = {
        name: parsearNombre(detail),
        activity: data.actividadEconomica?.nombre?.toLocaleLowerCase() ?? 'No especificada',
        dpi: detail.dpi ? this.separateCUI(detail.dpi) : 'No especificado',
        taxes: taxes == '' ? 'No especificados' : taxes,
        address: location?.vistaPrevia.toLocaleLowerCase() ?? 'No especificada',
        classification: detail.codigo_Clasificacion_Desc.toLocaleLowerCase() ?? 'No especificada',
        taxPayerType: data.tipoContribuyente.valueDesc.toLocaleLowerCase() ?? 'No especificado'
      }

    });

    this.toggleTaxPayer();
  }

  separateCUI(cui: string): string {
    return `${cui.slice(0, 4)} ${cui.slice(4, 9)} ${cui.slice(9, 13)}`
  }

  toggleTaxPayer() {
    const container = document.getElementById('toggleTayPayer');
    const taxIcon = document.getElementById('tax-icon');

    container?.classList.toggle("tp-open")
    container?.classList.toggle("tp-close")

    taxIcon?.classList.toggle('close')
    taxIcon?.classList.toggle('open')

    document.getElementById('option-container')?.classList.toggle('ms-2')
  }

  selectOption(id: string) {
    const children = document.getElementById('option-container')?.children ?? [];
    const option = document.getElementById(id);
    const button = document.getElementById(`${id}_button`);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childButton = document.getElementById(`${child.id}_button`);
      child.classList.remove('selected');
      childButton?.classList.remove('mat-raised-button')
    }

    option?.classList.add('selected');

    button?.classList.add('mat-raised-button')
  }

  regresar(){
    this.router.navigate(['programacion/operador/bandeja/credito/fiscal'])
  }

  inconsistecias(e: BandejaIncosistenicasResponse[]){
    this.inconsistencias = e
    console.log(this.inconsistencias)
  }

}
