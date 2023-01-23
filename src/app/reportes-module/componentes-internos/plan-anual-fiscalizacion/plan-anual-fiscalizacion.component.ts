import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { timeStamp } from 'console';
import { AnnualAuditPlanResponse, AnnualGeneralPlanResponse, AnnualManagmentPlanResponse, YearPlan } from 'src/app/general-module/componentes-comunes/interfaces/Reports.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ReportesService } from 'src/app/general-module/componentes-comunes/servicios/reportes.service';

@Component({
  selector: 'app-plan-anual-fiscalizacion',
  templateUrl: './plan-anual-fiscalizacion.component.html',
  styleUrls: ['./plan-anual-fiscalizacion.component.scss']
})
export class PlanAnualFiscalizacionComponent implements OnInit {

  meses = [
    { codigo: 1, nombre: "Enero" },
    { codigo: 2, nombre: "Febrero" },
    { codigo: 3, nombre: "Marzo" },
    { codigo: 4, nombre: "Abril" },
    { codigo: 5, nombre: "Mayo" },
    { codigo: 6, nombre: "Junio" },
    { codigo: 7, nombre: "Julio" },
    { codigo: 8, nombre: "Agosto" },
    { codigo: 9, nombre: "Septiembre" },
    { codigo: 10, nombre: "Octubre" },
    { codigo: 11, nombre: "Noviembre" },
    { codigo: 12, nombre: "Diciembre" },
  ];

  dataSourceGeneral = new MatTableDataSource<AnnualGeneralPlanResponse>();
  displayedColumns: string[] = [
    'gerencia',
    'selectivo',
    'masivo',
    'comex',
    'fiscaInter',
    'totalGerencia'
  ];

  dataSourceManagement = new MatTableDataSource<AnnualManagmentPlanResponse>();
  displayedColumnsManagement: string[] = [
    'gerencia',
    'meta',
    'trabajadas',
    'porcentaje',
  ];

  dataSourceAudit = new MatTableDataSource<AnnualAuditPlanResponse>();
  displayedColumnsAudit: string[] = [
    'auditoria',
    'meta',
    'trabajadas',
    'porcentaje',
  ];

  generalFormGroup!: FormGroup;
  planGeneral!: AnnualGeneralPlanResponse[];
  totalMetaSelectivo: number = 0
  totalMetaMasivo: number = 0
  totalMetaComex: number = 0
  totalMetaFiscaInter: number = 0
  totalMetaGerencia: number = 0
  planGerencia!: AnnualManagmentPlanResponse[];
  porcentajeGerencia: number = 0
  planAuditoria!: AnnualAuditPlanResponse[];
  porcentajeAuditoria: number = 0
  mostrarTablas = false
  anioPlan!: YearPlan[];

  constructor(private reportesService: ReportesService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.getFormulario();
    this.getAnios();
  }

  getFormulario() {
    this.generalFormGroup = new FormGroup({
      mes: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required),
    });
  }

  /**
      * @description Metodo para obtener lista de planes creados en base al año
      * @author Jamier Batz (ajsbatzmo)
      * @since 18/08/2022
      */
  getAnios() {
    this.reportesService.getYearPlan().toPromise().then(res => {
      console.log(res)
      if (res.length == 0) {
        this.dialogService.show({
          title: 'Plan no existe',
          text: `No existe plan de fiscalización creado`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.anioPlan = res
      }
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
    })
  }

  /**
      * @description Metodo para mostrar plan de acuerdo a seleccion de tipo de reporte
      * @author Jamier Batz (ajsbatzmo)
      * @since 18/08/2022
      */
  getPlanes() {
    let mes = this.generalFormGroup.get('mes')?.value
    let anio = this.generalFormGroup.get('anio')?.value
    this.getPlanGeneral(mes, anio);
    this.getPlanGerencia(mes, anio);
    this.getPlanAuditoria(mes, anio);
    this.mostrarTablas = true
  }

  /**
      * @description Metodo para obtener plan de metas iniciadas generales
      * @author Jamier Batz (ajsbatzmo)
      * @since 18/08/2022
      */
  getPlanGeneral(mes: number, anio: number) {
    this.dataSourceGeneral.data = []
    this.planGeneral = []
    this.totalMetaSelectivo = 0
    this.totalMetaMasivo = 0
    this.totalMetaComex = 0
    this.totalMetaFiscaInter = 0
    this.totalMetaGerencia = 0
    this.reportesService.getAnnualGeneralPlan(mes, anio).toPromise().then(res => {
      console.log(res)
      if (res.length == 0) {
        this.dialogService.show({
          title: 'Plan no existe',
          text: `No existe plan de fiscalización creado`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.dataSourceGeneral.data = res
        this.planGeneral = res
        this.planGeneral.forEach((meta, index) => {
          this.totalMetaSelectivo += meta.selectivo
          this.totalMetaMasivo += meta.masivo
          this.totalMetaComex += meta.comex
          this.totalMetaFiscaInter += meta.fiscaInter
          this.totalMetaGerencia = meta.selectivo + meta.masivo + meta.comex + meta.fiscaInter
          this.dataSourceGeneral.data[index].totalGerencia = this.totalMetaGerencia
          console.log(this.totalMetaGerencia)
        })
        this.planGeneral.push({
          gerencia: "Total",
          selectivo: this.totalMetaSelectivo,
          masivo: this.totalMetaMasivo,
          comex: this.totalMetaComex,
          fiscaInter: this.totalMetaFiscaInter,
        })
        this.dataSourceGeneral.data = this.planGeneral
        console.log(this.dataSourceGeneral.data)
        console.log(this.totalMetaGerencia)
      }
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
    })

  }

  /**
      * @description Metodo para obtener plan de metas finalizadas en base a gerencias y auditorias
      * @author Jamier Batz (ajsbatzmo)
      * @since 18/08/2022
      */
  getPlanGerencia(mes: number, anio: number) {
    this.dataSourceManagement.data = []
    this.planGerencia = []
    this.reportesService.getAnnualManagmentPlan(mes, anio).toPromise().then(res => {
      console.log(res)
      if (res.length == 0) {
        this.dialogService.show({
          title: 'Plan no existe',
          text: `No existe plan de fiscalización creado`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.dataSourceManagement.data = res
        this.planGerencia = res
        this.planGerencia.forEach((meta, index) => {
          this.porcentajeGerencia = (meta.trabajadas / meta.meta) * 100
          console.log(this.porcentajeGerencia)
          this.dataSourceManagement.data[index].porcentajeGerencia = this.porcentajeGerencia
        })
      }
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
    })
  }

  /**
      * @description Metodo para obtener plan de metas finalizadas en base a auditorias
      * @author Jamier Batz (ajsbatzmo)
      * @since 18/08/2022
      */
  getPlanAuditoria(mes: number, anio: number) {
    this.dataSourceAudit.data = []
    this.planAuditoria = []
    this.reportesService.getAnnualAuditPlan(mes, anio).toPromise().then(res => {
      console.log(res)
      if (res.length == 0) {
        this.dialogService.show({
          title: 'Plan no existe',
          text: `No existe plan de fiscalización creado`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.dataSourceAudit.data = res
        this.planAuditoria = res
        this.planAuditoria.forEach((meta, index) => {
          this.porcentajeAuditoria = (meta.trabajadas / meta.metas) * 100
          console.log(this.porcentajeAuditoria)
          this.dataSourceAudit.data[index].porcentajeAuditoria = this.porcentajeAuditoria
        })
      }
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
    })
  }

  /**
        * @description Metodo para definir el color del rango de porcentaje de logro
        * @author Jamier Batz (ajsbatzmo)
        * @since 18/08/2022
        */
  getColor(porcentaje: number): string {
    let vColor = "";
    if (porcentaje == 0 || porcentaje <= 60) {
      vColor = "red";
    } else if (porcentaje >= 61 || porcentaje <= 89) {
      vColor = "yellow";
    } else {
      vColor = "green";
    }
    return vColor;
  }

}
