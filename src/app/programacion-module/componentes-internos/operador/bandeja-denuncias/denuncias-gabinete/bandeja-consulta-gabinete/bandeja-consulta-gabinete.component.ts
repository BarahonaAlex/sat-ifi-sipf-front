import { DenunciasService } from './../../../../../../general-module/componentes-comunes/servicios/denuncias.service';
import { DenunciaService } from './../../../../../../general-module/componentes-comunes/servicios/denuncia.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, CustomNode, FormStructure } from 'mat-dynamic-form';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { ProgramasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/programas-fiscales.service';
import { VisorComponent } from 'src/app/general-module/componentes-comunes/visor/visor.component';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { MatTableDataSource } from '@angular/material/table';
import { FindingDetail } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';

@Component({
  selector: 'app-bandeja-consulta-gabinete',
  templateUrl: './bandeja-consulta-gabinete.component.html',
  styleUrls: ['./bandeja-consulta-gabinete.component.scss']
})
export class BandejaConsultaGabineteComponent implements OnInit {

  authorized: boolean = true;
  loaded: boolean = true;
  id!: number;
  idProgram!: number;
  taxPayerData!: Contribuyente.Respuesta;
  taxPayer = { name: '', activity: '', dpi: '', address: '', classification: '', taxPayerType: '', taxes: '' };
  files: EntryNodoAcs[] = [];
  taxPayerCase!: CaseDetail;
  nameProgram!: string;
  validateActionsDefault!: Button[];
  estructura!: FormStructure;
  estado!: number;
  correlativo!: String;
  dataSource2 = new MatTableDataSource<FindingDetail>()
  constructor(private router: Router,
    private route: ActivatedRoute,
    private taxPayerService: ContribuyenteService,
    private denunciaService: DenunciasService,
    private contentService: GestorService,
    private dialog: DialogService,
    private fiscalProgramService: ProgramasFiscalesService) { }

  async ngOnInit(): Promise<void> {

    await this.route.paramMap.subscribe(params => {      
      console.log(params.get('correlativo'))

      this.correlativo = params.get('correlativo') ?? '';

      this.denunciaService.getDetailComplaints(this.correlativo.toString()).subscribe((data) => {
        console.log(data);
        

        this.taxPayerService.getGeneralTaxpayerInformation(data[0].nit).
          toPromise().then(resultTwo => {
            this.taxPayerData = resultTwo;
            
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
              classification: detail.codigo_Clasificacion_Desc ? detail.codigo_Clasificacion_Desc.toLocaleLowerCase() : 'No especificada',
              taxPayerType: data.tipoContribuyente.valueDesc ? data.tipoContribuyente.valueDesc.toLocaleLowerCase() : 'No especificado'
            }
          });
        

      })
    });

    this.toggleTaxPayer();
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

  separateCUI(cui: string): string {
    return `${cui.slice(0, 4)} ${cui.slice(4, 9)} ${cui.slice(9, 13)}`
  }

  showFile(node: EntryNodoAcs) {
    const structure = new FormStructure().apply({
      showTitle: false,
      nodes: [
        new CustomNode<VisorComponent>('viewer', VisorComponent, {
          nodeId: node.id,
          arregloPropiedades: node.properties
        }).apply({ singleLine: true })
      ],
      validateActions: []
    });
    this.dialog.show({
      title: 'Visor de archivos',
      formStructure: structure,
      width: '100%',
      showCloseButton: true,
      showConfirmButton: false,
    });
  }
  eventCatcher(e: any) {
    console.log(e)
    this.dataSource2.data = e;
  }
  

}
