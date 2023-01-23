import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';
import { EnterExitLeft } from 'src/app/general-module/componentes-comunes/util/animation-utils';
import { Button, FormListener, FormStructure, TextArea } from 'mat-dynamic-form';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HallazgosService } from 'src/app/general-module/componentes-comunes/servicios/hallazgos.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { ReviewFindings } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
  animations: [
    EnterExitLeft
  ],
})
export class RevisionComponent implements OnInit, FormListener {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.fuenteDatos.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.fuenteDatos.paginator = mp;
  }

  columnas = ['id', 'nombre', 'plazo', 'tipo', 'estado'];
  fuenteDatos = new MatTableDataSource<ReviewFindings>();

  estadosFinancieros: ReviewFindings[] = [];
  terceros: ReviewFindings[] = [];
  declaraciones: ReviewFindings[] = [];

  case!: CaseDetail;
  porRevisar: boolean = false;
  cargado: boolean = false;
  autorizado: boolean = false;
  tipo!: string;
  estructura!: FormStructure;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private utilidades: UtilidadesService,
    private findingService: HallazgosService,
    private caseService: CasosService
  ) {
    this.fuenteDatos.data = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = parseInt(params.get('id') as string);
      const estado = parseInt(params.get('estado') as string);
      this.tipo = params.get('tipo') as string
      this.case = await (await this.caseService.getCaseById(id).toPromise()).caso;

      if (!this.case) {
        this.dialog.show({
          icon: 'error',
          title: 'IFI-404',
          text: 'El número de alcance ingresado no existe',
          disableClose: true,
          confirmButtonText: 'Regresar'
        }).then(() => {
          this.router.navigate(['/programacion/revision', this.tipo]);
        });
      } else {
        if (this.tipo == 'detalle') {
          this.obtenerAlcances();
        } else {
          this.obtenerHallzagos(estado);
        }
      }
    });
  }

  onClick(actionId: string): void {
    console.log(actionId);
    if (actionId == 'guardar') {
      this.dialog.close('primary');
    } else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  cancelarRevision() {
    this.utilidades.forcedNavigate(['/programacion/revision/', this.tipo]);
  }

  revisarHallazgo(tipo: string, tipoHallazgo: string, alcance: ReviewFindings) {
    const data = HALLAZGO_REVISAR[tipo];
    if (data.mostrarComentario) {
      this.estructura = new FormStructure().apply({
        appearance: 'standard',
        globalValidators: Validators.required,
        showTitle: false,
        nodes: [
          new TextArea('comentarios', data.textoComentario).apply({
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
        title: `${data.tipo} hallazgo`,
        formStructure: this.estructura,
        showCancelButton: false,
        showConfirmButton: false,
      }).then(result => {
        console.log(this.estructura.getValue());

        if (result == 'primary') {
          this.fuenteDatos.data.push({ ...alcance, typeFinding: tipoHallazgo, state: `Revisado (${data.tipo})`, comment: this.estructura.getValue<any>().comentarios });
          this.fuenteDatos.filter = '';
          alcance.reviewed = true;
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: "Se ha realizado la revisión del hallazgo",
            duration: 3000
          });
        }
      })
    } else {
      this.dialog.show({
        icon: 'question',
        title: 'IFI-100',
        text: data.msg,
        showCancelButton: true,
        confirmButtonText: `Si, ${HALLAZGO_REVISAR[tipo].tipo.toLowerCase()}`,
        cancelButtonText: 'No, cancelar',
        disableClose: true,
      }).then(result => {
        if (result == 'primary') {
          this.fuenteDatos.data.push({ ...alcance, typeFinding: tipoHallazgo, state: `Revisado (${data.tipo})` });
          this.fuenteDatos.filter = '';
          alcance.reviewed = true;
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: "Se ha realizado la revisión del hallazgo",
            duration: 3000
          });
        }
      });
    }
  }

  quitarHallzago(alcance: ReviewFindings) {
    this.fuenteDatos.data.splice(this.fuenteDatos.data.findIndex(item => item.idHallazgos == alcance.idHallazgos), 1);
    this.fuenteDatos.filter = '';
    alcance.reviewed = false;
  }

  hallazgosRevisados(array: ReviewFindings[]) {
    return array.filter(item => item.reviewed).length == array.length;
  }

  obtenerNombre(hallzago: ReviewFindings) {
    switch (hallzago.idTipoHallazgo) {
      case 1:
        return hallzago.idFuente;
      case 2:
        return hallzago.idRubro;
      case 3:
        return hallzago.idFormulario;
      default: return hallzago.idHallazgos;
    }
  }

  obtenerPlazo(hallzago: ReviewFindings) {
    const pipe = new DatePipe('es');
    if (hallzago.idTipoHallazgo == 2) {
      return `Al ${pipe.transform(hallzago.periodoEstadosFinancieros, "dd 'de' MMMM 'de' yyyy")}`;
    } else {
      return `Del ${pipe.transform(hallzago.fechaInicio, "dd 'de' MMMM 'de' yyyy")} al ${pipe.transform(hallzago.fechaFin, "dd 'de' MMMM 'de' yyyy")}`;
    }
  }

  obtenerHallzagos(estado: number) {
    /* this.findingService.getFindingsDetail(this.case.idCaso, estado, this.case.nitColaborador).toPromise().then(res => {
      console.log(res);
      if (res?.length > 0) {
        this.estadosFinancieros = res.filter(item => item.idTipoHallazgo == 2);
        this.terceros = res.filter(item => item.idTipoHallazgo == 1);
        this.declaraciones = res.filter(item => item.idTipoHallazgo == 3);
      }
    }).catch(err => {
      console.log(err);
      throw err;
    }).finally(() => {
      this.cargado = true;
      this.autorizado = true;
    }); */
  }

  obtenerAlcances() {
    this.obtenerHallzagos(16);
  }
}

const HALLAZGO_REVISAR: { [key: string]: { msg: string, tipo: string, mostrarComentario: boolean, textoComentario?: string } } = {
  'APROBAR': {
    msg: '¿Está seguro de aprobar el alcance?',
    tipo: "Aprobar",
    mostrarComentario: false
  },
  'RECHAZAR': {
    msg: '¿Está seguro de rechazar el alcance?',
    tipo: "Rechazar",
    mostrarComentario: true,
    textoComentario: "Comentario por rechazo"
  },
  'SEGUIMIENTO': {
    msg: '¿Está seguro de solicitar cambios al alcance?',
    tipo: "Solicitar cambios",
    mostrarComentario: true,
    textoComentario: "Comentario por cambios"
  }
}