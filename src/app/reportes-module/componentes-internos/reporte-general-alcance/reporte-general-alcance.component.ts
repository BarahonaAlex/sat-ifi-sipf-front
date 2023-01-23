
import { MatTableDataSource } from '@angular/material/table';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/Contribuyente';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReportesService } from 'src/app/general-module/componentes-comunes/servicios/reportes.service';

@Component({
  selector: 'app-reporte-general-alcance',
  templateUrl: './reporte-general-alcance.component.html',
  styleUrls: ['./reporte-general-alcance.component.css']
})

/**
   * @description Modulo Reportes de Alcances
   * @author ajsbatzmo (Jamier Batz)
   * @since 24/02/2022
   */
export class ReporteGeneralAlcanceComponent implements OnInit {

  displayedColumnsScope: string[] = ['nit', 'programa', 'periodo', 'acciones'];
  displayedColumnsMassScope: string[] = ['actividad', 'programa', 'plazo', 'acciones'];
  dataSourceScope = new MatTableDataSource();
  dataSourceMassScope = new MatTableDataSource();
  scope!: FormGroup;
  massScope!: FormGroup;
  showTable: boolean = false;
  showTableMass: boolean = false;
  scopeFilter: Boolean = true;
  massScopeFilter: Boolean = false;

  constructor(
    private recordScope: FormBuilder,
    private recordMassScope: FormBuilder,
    private scopeReport: ReportesService
  ) {
    this.scopeForm();
    this.massScopeForm();
  }

  ngOnInit(): void { }

  /**
   * @description Funcion que muestra el card de casos masivos
   */
  showCardMassScope() {

    if (this.scopeFilter == true && this.massScopeFilter == false) {
      this.scopeFilter = false;
      this.massScopeFilter = true;
    } else if (this.scopeFilter == false && this.massScopeFilter == true) {
      this.scopeFilter = true;
      this.massScopeFilter = false;
    }
  }

  scopeForm() {
    this.scope = this.recordScope.group({
      Nit: ['', Validators.required],
    })
  }

  massScopeForm() {
    this.massScope = this.recordMassScope.group({
      ID: ['', Validators.required],
    })
  }

   /**
   * @description Funcion que obtiene los datos de un Alcance tipo Solicitud y tipo Selectivo mediante el NIT
   */
  getScope() {
    console.log(this.scope.value.Nit);
    this.scopeReport.getScope(this.scope.value.Nit).toPromise().then(res => {
      this.dataSourceScope.data = res;
      console.log(res);
      this.showTable = true;
    })
  }

    /**
   * @description Funcion que obtiene los datos de un Alcance tipo Masivo mediante el ID CASO
   */
  getMassScope() {
    console.log(this.massScope.value.ID);
    this.scopeReport.getMassScope(this.massScope.value.ID).toPromise().then(res => {
      this.dataSourceMassScope.data = res;
      console.log(res);
      this.showTableMass = true;
    })
  }

    /**
   * @description Funcion que genera un Reporte del Alcance tipo Solicitud y tipo Selectivo mediante el NIT
   */
  getScopeReport(alcance: any) {
    this.scopeReport.getScopeReport(alcance.nit, alcance.tipoAlcance).subscribe(
      (data) => {
        FileUtils.downloadFile(data, 'Reporte de Alcance.docx')
      }
    )
  }

  /**
   * @description Funcion que genera un Reporte del Alcance tipo Masivo mediante el ID CASO
   */
  getMassScopeReport(alcance: any) {
    this.scopeReport.getMassScopeReport(alcance.idCaso, alcance.tipoAlcance).subscribe(
      (data) => {
        FileUtils.downloadFile(data, 'Reporte de Alcance Masivo.docx')
      }
    )
  }

}
