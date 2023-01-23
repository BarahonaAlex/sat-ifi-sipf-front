import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CaseList, CasesFixedPoint } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { GeneralService } from 'src/app/general-module/componentes-comunes/servicios/general.service';
import { AlcanceCasoGabineteComponent } from '../../administracion-alcances/administracion-alcance/alcance-caso-gabinete/alcance-caso-gabinete.component';
import { ProcesosMasivos } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-bandeja-alcance-masivo',
  templateUrl: './bandeja-alcance-masivo.component.html',
  styleUrls: ['./bandeja-alcance-masivo.component.scss']
})
export class BandejaAlcanceMasivoComponent implements OnInit {
  getComplaints = ['idCaso', 'nitContribuyente', 'nombreGerencia', 'nombreEstado', 'acciones'];
  dataSourceFixed = new MatTableDataSource<CasesFixedPoint>()
  dataSourceFiscal = new MatTableDataSource<CasesFixedPoint>()
  selectionComplaints = new SelectionModel<CasesFixedPoint>(true, []);
  valor: any = ''
  procesos!: ProcesosMasivos[]
  codigoProceso!: number
  generalFormGroup!: FormGroup
  dataCases!: CasesFixedPoint
  lenght!: number
  lenghtCabinet!: number
  @Output() newItemEvent = new EventEmitter<number>();
  @ViewChild('GabinetPaginator') set matPaginator1(mp1: MatPaginator){
    this.dataSourceFiscal.paginator = mp1
    
  }
  @ViewChild('PointPaginator') set matPaginator2(mp2: MatPaginator){
    this.dataSourceFixed.paginator = mp2
  }

  constructor(private caseService: CasosService, private dialogService: DialogService, private router: Router, private overlay: Overlay) {
    this.generalFormGroup = new FormGroup({
      professional: new FormControl('', Validators.required),
      profesionalReassign: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    this.getCatalogProcesMasive()
    this.getFiscalCases()
    this.getFixedCases()
  }
  getCatalogProcesMasive() {
    this.caseService.getProcesMasiveCatalog().toPromise().then(res => {
      this.procesos = res
    })
  }
  selectProcesMasive(event: any) {
    this.codigoProceso = event
   // console.log(event)
    if (event == 961) {
      this.getFixedCases()
    } else if (event == 962) {
      this.getFiscalCases()
    }
  }
  getFixedCases() {
    this.caseService.getCasesFixedPoint().toPromise().then(res => {
      this.lenght = res.length
      let puntosFijosRes = res
        this.dataSourceFixed.data = res
    })
  }
  showAnalityc(idCaso: number) {
    this.router.navigate(['/programacion/operador/alcance/cabinet/', idCaso])
  }
  showAnalitycFixedPoint(idCaso: number) {
    this.router.navigate(['/programacion/operador/alcance/fixed/point/', idCaso])
  }
  getFiscalCases() {
    this.caseService.getCasesFiscal().toPromise().then(res => {
      this.lenghtCabinet = res.length
      let cabinet = res
        this.dataSourceFiscal.data = res
    })
  }
  openScopeFixed(e: any) {
    this.router.navigate(['/programacion/operador/alcance/cabinet/', e.idCaso])
  }
}
