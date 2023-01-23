import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { DenunciaGrabada } from 'src/app/general-module/componentes-comunes/interfaces/DenunciaGrabada';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { DenunciaService } from 'src/app/general-module/componentes-comunes/servicios/denuncia.service';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { Button, DatePicker, Dropdown, FormListener, FormStructure, OptionChild } from 'mat-dynamic-form';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { professionals } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { AsignacionDenunciaParam } from 'src/app/general-module/componentes-comunes/interfaces/AsignacionDenunciaParam';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-cartela-denuncia-aprobado',
  templateUrl: './cartela-denuncia-aprobado.component.html',
  styleUrls: ['./cartela-denuncia-aprobado.component.css']
})
export class CartelaDenunciaAprobadoComponent implements OnInit, FormListener {

  @ViewChild('table') table!: TablaDinamicaComponent<DenunciaGrabada>;
  @Output('onFinished') onFinished = new EventEmitter<boolean>();
  data!: DynamicDataTable<DenunciaGrabada>;


  formStructure!: FormStructure;
  selectedComplaints: DenunciaGrabada[] = [];
  listColaboratores!: professionals[];
  selectedColaborator: professionals = { nit: '', nombres: '' };





  constructor(private denunciaService: DenunciaService,
    private dialog: DialogService,
    private colaboratorService: ColaboradoresService
  ) { }
  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }




  ngOnInit(): void {

    this.data = {
      data: [],
      header: [
        { id: 'correlativo', nameColum: 'Correlativo' },
        { id: 'nitDenunciado', nameColum: 'NIT denunciado' },
        { id: 'nitDenunciante', nameColum: 'NIT denunciante' },
        { id: 'fechaGrabacionStr', nameColum: 'Fecha denuncia' },

        {
          id: 'actions', nameColum: '',
          child: {
            type: 'check', onClick: item => {
              this.addToSelected(item[0].checked, item[1]);
            }
          }
        },
      ],
      noColum: [5, 10, 15]
    };

    this.colaboratorService.getSubcolaboratoresByLevel(1).toPromise().then(resultado => {
      this.listColaboratores = resultado;
    });

  }

  addToSelected(checked: boolean, complaintSelected: DenunciaGrabada): void {

    if (checked) {
      this.selectedComplaints.push(complaintSelected);
    }
    else {

      const indexOfComplaint = this.selectedComplaints.findIndex((complaint) => {
        return complaint.correlativo === complaintSelected.correlativo;
      });

      this.selectedComplaints.splice(indexOfComplaint, 1);
    }


  }

  addComplaints(): void {
    this.formStructure = this.initFormStructureComplaints();
    this.dialog.show({
      title: 'Buscar denuncias',
      showConfirmButton: false,
      formStructure: this.formStructure
    });

  }

  private initFormStructureComplaints(): FormStructure {
    return new FormStructure().apply({
      showTitle: false,
      nodes: [

        new DatePicker('periodoRevisionInicio', 'Período Inicio').apply({ validator: Validators.required }),
        new DatePicker('periodoRevisionFin', 'Período Fin').apply({ validator: Validators.required }),


      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('findComplaints', 'Buscar', {
          callback: this, style: 'primary'
        }).apply({
          validateForm: true,
          icon: 'search'
        })
        ,

      ]
    });
  }


  private initFormStructureAssignment(): FormStructure {
    return new FormStructure().apply({
      showTitle: false,
      nodes: [
        new Dropdown('colaborador', 'Colaborador',
          this.listColaboratores.map(colaborador => new
            OptionChild(colaborador.nombres, colaborador.nit))).apply(
              { validator: Validators.required, singleLine: true }),



      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('assignToColaborator', 'Asignar denuncias', {
          callback: this, style: 'primary'
        }).apply({
          validateForm: true,
          icon: 'assignment'
        })
        ,

      ]
    });
  }


  findComplaints(): void {

    const pParams: DenunciaGrabada = {};
    pParams.pFechaInicio = moment(this.formStructure.getControlById('periodoRevisionInicio')?.value.toDate().toString()).format('DD/MM/YYYY');
    pParams.pFechaFin = moment(this.formStructure.getControlById('periodoRevisionFin')?.value.toDate().toString()).format('DD/MM/YYYY') ;
    this.denunciaService.getComplaintsByDateRange(pParams).toPromise().then(
      result => {

        const datepipe: DatePipe = new DatePipe('en-US');

        result.forEach(item => {

          item.fechaGrabacionStr = datepipe.transform(item.fechaGrabacion, 'dd/MM/YYYY')!;

        });
        this.data.data = result;
        this.table.dataSource.data = result;
        this.dialog.close();
      }
    );
  }

  cancel(): void {
    this.onFinished.emit(false);
  }

  onClick(actionId: string): void {
    switch (actionId) {
      case 'assignToColaborator':
        this.assignToColaborator();
        break;
      case 'findComplaints':
        if (
          this.formStructure.getControlById('periodoRevisionInicio')?.value.toDate() >
          this.formStructure.getControlById('periodoRevisionFin')?.value.toDate()
        ) {
          this.dialog.showSnackBar({
            icon: 'error',
            title: 'IFI-200',
            text: `La fecha de fin del rango no puede ser mayor a la fecha de incio del mismo.`,
            duration: 3000
          });

        }
        else {
          this.findComplaints();
        }

        break;
      default:
        this.dialog.close();
        break;
    }
  }

  assignToColaborator(): void {
    const listCorrelatives: string[] = [];

    this.selectedComplaints.forEach(item => {
      if (item.correlativo) {
        listCorrelatives.push(item.correlativo);
      }
    });

    const params: AsignacionDenunciaParam =
      { pLista: listCorrelatives, pNitResponsable: this.formStructure.getControlById('colaborador')?.value };
    this.denunciaService.postAssignment(params).toPromise().then(result => {

      this.dialog.close();

      this.dialog.showSnackBar({
        icon: 'success',
        title: 'IFI-200',
        text: `Se ha realizado la asignación de denuncias, exitosamente.`,
        duration: 3000
      });


      this.selectedComplaints.forEach(item => {
        if (item.correlativo) {

          const index = this.table.dataSource.data.indexOf(item);

          if (index > -1) {
            this.table.dataSource.data.splice(index, 1);
          }
        }

      });
      this.table.dataSource.data = this.table.dataSource.data;
      this.selectedComplaints = []
    });

  }



  saveWithComplaints(): void {
    this.formStructure = this.initFormStructureAssignment();
    this.dialog.show({
      title: 'Asignar denuncias a colaborador',
      showConfirmButton: false,
      formStructure: this.formStructure,
     // width:'60%'

    });

  }

}
