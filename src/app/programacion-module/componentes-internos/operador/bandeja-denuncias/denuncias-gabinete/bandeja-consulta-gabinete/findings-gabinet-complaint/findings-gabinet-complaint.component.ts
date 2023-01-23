import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FindingDetail, FindingInsert, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { HallazgosService } from 'src/app/general-module/componentes-comunes/servicios/hallazgos.service';
import { Button, CustomNode, FormStructure, Input as InputNode } from 'mat-dynamic-form';
import { Validators } from '@angular/forms';
import { DetailFindingsGabinetComplaintComponent } from './detail-findings-gabinet-complaint/detail-findings-gabinet-complaint.component';

@Component({
  selector: 'app-findings-gabinet-complaint',
  templateUrl: './findings-gabinet-complaint.component.html',
  styleUrls: ['./findings-gabinet-complaint.component.scss']
})
export class FindingsGabinetComplaintComponent implements OnInit {

  private formStructure!: FormStructure;
  private initialValue?: FindingDetail;

  @Input('correlativo') correlativo!: String;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['id', 'nombre', 'desc', 'rubros', 'acciones'];
  dataSource = new MatTableDataSource<FindingDetail>();
  @Output("dataEmit") evento: EventEmitter<FindingDetail[]> = new EventEmitter();

  constructor(
    private dialog: DialogService,
    private finding: HallazgosService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.finding.getFindingsDetail(0, this.correlativo.toString()).toPromise().then(res => {
      console.log(res);
      this.dataSource.data = res;
      this.evento.emit(res);
    })
  }

  sanitizeHtml(html: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  itemToString(item: Topic[]): string {
    if (item != null) {
      return item.map(i => `${i.impuesto}/${i.rubro}`).join(', ');
    }
    return "Sin rubro seleccionado";
  }

  createFormStructure(title: string, initialValue?: FindingDetail, viewing: boolean = false) {
    this.initialValue = initialValue;
    this.formStructure = new FormStructure().apply({
      showTitle: false,
      globalValidators: Validators.required,
      nodes: [
        new InputNode('complaint', 'Correlativo de la Denuncia', this.correlativo).apply({
          disabled: true
        }),
        new InputNode('name', 'Nombre de Hallazgo', initialValue?.nombre ?? '').apply({
          maxCharCount: 300,
          disabled: viewing
        }),
        new CustomNode<DetailFindingsGabinetComplaintComponent>('findingForm', DetailFindingsGabinetComplaintComponent).apply({
          singleLine: true,
          properties: { initialValue, viewing, correlativo: this.correlativo }
        })
      ],
      validateActions: viewing ? [] : [
        new Button('cancel', 'Cancelar', { style: 'warn', onEvent: () => this.dialog.close() }).apply({
          icon: 'cancel'
        }),
        new Button('save', 'Guardar', { style: 'primary', onEvent: () => this.saveFinding() }).apply({
          icon: 'save',
          //  validateForm: true
        })
      ]
    });

    this.dialog.show({
      title: `${title} Hallazgo`,
      formStructure: this.formStructure,
      showConfirmButton: false,
      showCloseButton: true,
      disableClose: true
    })
  }

  saveFinding() {
    const finding = this.formStructure.getValue<any>();
    const body: FindingInsert = {
      correlativo: this.correlativo,
      nombre: finding.name,
      descripcion: finding.findingForm.description,
      rubros: finding.findingForm.selection,
    }

    if (finding.findingForm.description != "" && finding.name != "") {
      if (this.initialValue) {
        this.finding.updateFinding(this.initialValue.id, body).toPromise().then(_ => {
          this.showMessage('actualizado');
        })
      } else {
        this.finding.createFinding(body).toPromise().then(_ => {
          this.showMessage('creado');
        })
      }
    } else {
      this.dialog.show({
        title: 'Error',
        text: `Debe llenar todos los campos de nombre y agregar descripción`,
        icon: 'error'
      })
    }
  }

  private showMessage(action: string) {
    this.dialog.close();
    this.dialog.show({
      title: `Hallazgo ${action}`,
      text: `El hallazgo se ha ${action} correctamente`,
      icon: 'success'
    });
    this.ngOnInit();
  }


  deleteFinding(finding: FindingDetail) {
    this.dialog.show({
      title: 'Confirmar eliminación',
      text: `¿Está seguro de eliminar el hallazgo "${finding.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: 'warn',
      cancelButtonColor: 'primary',
    }).then(res => {
      if (res == 'primary') {
        this.finding.deleteFinding(finding.id, true).toPromise().then(res => {
          this.showMessage('eliminado');
        })
      }
    });
  }
}
