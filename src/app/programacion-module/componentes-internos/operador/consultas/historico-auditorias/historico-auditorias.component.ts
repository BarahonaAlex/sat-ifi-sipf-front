import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Button, FormStructure, TextArea } from 'mat-dynamic-form';
import { MatTableDataSource } from '@angular/material/table';

import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { AuditInteface } from 'src/app/general-module/componentes-comunes/interfaces/Audit.inteface';
import { AuditCommentInterface } from 'src/app/general-module/componentes-comunes/interfaces/AuditComment.interface';
import { audit } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-historico-auditorias',
  templateUrl: './historico-auditorias.component.html',
  styleUrls: ['./historico-auditorias.component.css']
})
export class HistoricoAuditoriasComponent implements OnInit {
  @Input() selectedNit!: string;
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  @Input('nit') nit!: string;

  structure!: FormStructure;
  structure2!: FormStructure;


  displayedColumns: string[] = ['numeroExpediente',
    'ubicacion',
    'estadoExpediente',
    'nombramiento',
    'fechaPeriodoDel',
    'fechaPeriodoAl',
    'estadoNombramiento',
    'nombrePlan',
    'multa',
    'ajuste',
    'comentario',
    'acciones'];

  constructor(private casosService: CasosService,
    private dialog: DialogService) { }

  async ngOnInit() {
    this.dataSource.data = await this.casosService.getAuditHistorialByNit(this.nit).toPromise();
  }

  onClick(actionId: string): void {
    if (actionId === 'guardar') {
      this.dialog.close('primary');
    } else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  goSaveComment(auditSelected: AuditInteface): void {
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Agregar comentario.').apply({
          singleLine: true
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.dialog.show({
      title: `Guardar comentario.`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(resutl => {

      if (resutl === 'primary') {
        const vComment: AuditCommentInterface = {
          nombrameinto: auditSelected.nombramiento,
          expediente: auditSelected.numeroExpediente,
          comentario: this.structure.getValue<any>().comentarios

        };

        this.casosService.createOrModifyAuditComment(vComment).toPromise().then(result => {

          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha guardado el comentario, exitosamente.`,
            duration: 3000
          });
          auditSelected.comentario = vComment.comentario;
        });

      }
    });
  }

  deleteComment(auditSelected: AuditInteface): void {

    this.dialog.show({
      title: `Eliminar comentario.`,
      text: `¿Está seguro de eliminar el comentario?`,
      formStructure: this.structure2,
      showCancelButton: true,
      showConfirmButton: true,
      disableClose: true,
    }).then(resutl => {

      if (resutl === 'primary') {

        const vComment: AuditCommentInterface = {
          nombrameinto: auditSelected.nombramiento,
          expediente: auditSelected.numeroExpediente,
          comentario: auditSelected.comentario

        };

        this.casosService.deleteAuditComment(vComment).toPromise().then(result => {

          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha eliminado el comentario, exitosamente.`,
            duration: 3000
          });
          auditSelected.comentario = '';
        });

      }
    });
  }


}
