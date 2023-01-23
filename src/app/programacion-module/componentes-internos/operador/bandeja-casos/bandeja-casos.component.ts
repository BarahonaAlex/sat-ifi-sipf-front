import { Component, OnInit, ViewChild } from '@angular/core';
import { Button, CustomNode, Dropdown, FormStructure, Input, OptionChild } from 'mat-dynamic-form';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { FormGroup, Validators } from '@angular/forms';
import { ProgramasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/programas-fiscales.service';

@Component({
  selector: 'app-cartera-insumos',
  templateUrl: './bandeja-casos.component.html',
  styleUrls: ['./bandeja-casos.component.scss']
})
export class BandejaCasosComponent implements OnInit {
  closeResult = '';

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['id', 'nit', 'caso', 'recaudo', 'impuesto', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<CaseList>();
  generalFormGroup!: FormGroup;

  constructor(
    private router: Router,
    private caseService: CasosService,
    private dialogService: DialogService,
    private programService: ProgramasFiscalesService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.caseService.getCasesByCollaborator().toPromise().then(res => {
      console.log(res);
      
      this.dataSource.data = res
    })
  }

  showAnalityc(idCaso: number) {
    this.router.navigate(['/programacion/operador/cartera/casos', idCaso])
  }

  showAssignProgram(caseItem: CaseList) {
    const formStructure = new FormStructure().apply({
      showTitle: false,
      globalValidators: Validators.required,
      nodes: [
        new Input('idCase', 'Número', caseItem.idCaso).apply({ disabled: true }),
        new Input('nit', 'NIT', caseItem.nitContribuyente).apply({ disabled: true }),
        new Input('nameCase', 'Nombre', caseItem.nombreCaso).apply({ disabled: true }),
        new Dropdown('program', 'Programa Fiscal'),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', { onEvent: _ => this.dialogService.close(), style: 'warn' }).apply({ icon: 'close' }),
        new Button('save', 'Asignar', {
          onEvent: (param) => {
            console.log(param.structure.getControlById('program')?.value)
            this.asignarPrograma(caseItem.idCaso, param.structure.getControlById('program')?.value)
          }, style: 'primary'
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    })

    this.programService.getFiscalProgramByStatusAndCurrentYear(108).toPromise().then(res => {
      formStructure.getNodeById('program').value = res.map(data => new OptionChild(data.nombre, data.idPrograma));
      if (res.length == 0) {
        this.dialogService.show({
          title: 'SAT-404',
          text: `No se encontraron Programas Fiscales para asignar`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true
        })
      }
    })

    this.dialogService.show({
      title: `Asignación de Progama Fiscal`,
      formStructure: formStructure,
      width: "50%",
      showConfirmButton: false,
      showCloseButton: true,
      disableClose: true
    })
  }

  asignarPrograma(idCaso: number, idProgram: string) {
    this.programService.assignFiscalProgram(parseInt(idProgram), idCaso).toPromise().then(res => {
      if (res.idPrograma = ! null) {
        this.dialogService.close();
        this.dialogService.show({
          title: 'IFI-200',
          text: `Se ha asignado correctamente el programa fiscal al caso`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true
        });
        this.initData();
      }
    })
  }
}
