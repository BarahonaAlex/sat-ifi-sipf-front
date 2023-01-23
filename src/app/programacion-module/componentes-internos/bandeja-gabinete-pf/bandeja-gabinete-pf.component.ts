import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Button, FormStructure, FormListener, DatePicker, Dropdown, OptionChild, Input, InputNumber, RadioGroup } from 'mat-dynamic-form';
import { MassiveAssignParams } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { ColaboratorDto } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { MassiveAssignationParams, MassiveResumeDto } from 'src/app/general-module/componentes-comunes/interfaces/MassiveResumeDto';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';

@Component({
  selector: 'app-bandeja-gabinete-pf',
  templateUrl: './bandeja-gabinete-pf.component.html',
  styleUrls: ['./bandeja-gabinete-pf.component.scss']
})
export class BandejaGabinetePfComponent implements OnInit, FormListener {

  @ViewChild('table') table!: TablaDinamicaComponent<MassiveResumeDto>;

  data!: DynamicDataTable<MassiveResumeDto>;

  caseTypeList!: Catalog[];

  caseTypeSelected = new FormControl('');

  formStructure!: FormStructure;

  selectedData!: MassiveResumeDto;

  massiveAssignationParams!: MassiveAssignationParams;

  subcolaboratoresList!: ColaboratorDto[];



  constructor(private casoService: CasosService,
    private catalogoService: CatalogosService,
    private dialog: DialogService,
    private colaboratorService: ColaboradoresService) { }

  changeType() {

    this.casoService.getResumeMassive(this.caseTypeSelected.value).toPromise().then(result => {
      this.data.data = result;
      this.table.dataSource.data = this.data.data;
    });
  }

  ngOnInit() {

    this.colaboratorService.getSubcolaboratoresByLevel(1)
      .toPromise()
      .then(result => {

        this.subcolaboratoresList = result;
      });

    this.data = {
      data: [],
      header: [
        { id: 'nombreGerencia', nameColum: 'Gerencia' },
        { id: 'cantidad', nameColum: 'Cantidad de Casos' },

        {
          id: 'actions', nameColum: '', actions: [
            { btnKey: 'delete', btnName: 'Asignar casos', btnIcon: 'add', onClick: item => this.goAssign(item) }

          ]
        },
      ],
      noColum: [5, 10, 15]
    };

    this.catalogoService.getCatalogDataByIdCatalogStatusSpecialConditionName(87, 'gabinete-punto-fijo')
      .toPromise()
      .then(result => {
        this.caseTypeList = result.filter(item => item.valor === '1');
        //this.caseTypeList = result;
      });


  }

  goAssign(pData: MassiveResumeDto) {
    this.selectedData = pData;

    this.formStructure = this.initFormStructure(this.selectedData);
    this.dialog.show({
      title: 'Asignar casos',
      showConfirmButton: false,
      formStructure: this.formStructure
    })

  }


  private initFormStructure(data?: MassiveResumeDto): FormStructure {
    return new FormStructure().apply({
      showTitle: false,
      nodes: [
        new Input('gerencia', 'Gerencia', data?.nombreGerencia).apply({
          disabled: true
        }),
        new Input('caseType', 'Tipo de casos', data?.nombreTipoCaso).apply({
          disabled: true
        }),
        new Input('cantidadCasos', 'Cantidad de casos disponible', data?.cantidad).apply({
          disabled: true
        }),
        new Dropdown('colaborator', 'Colaborador',
          this.subcolaboratoresList?.map(
            colaborator =>
              new OptionChild(colaborator.nombres, colaborator.nit)))
          .apply({ validator: Validators.required }),

        new InputNumber('cantidadAsignar', 'Cantidad de casos a asignar').apply({ validator: Validators.required }),


      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
  }


  onEvent(id: string, value: any): void {
  }

  save() {
    if (this.formStructure.getControlById('cantidadAsignar')?.value < 1
    ) {
      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-200',
        text: `La cantidad de casos a asignar no puede ser 0.`,
        duration: 3000
      });
    }
    else if (this.formStructure.getControlById('cantidadAsignar')?.value > this.selectedData.cantidad) {

      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-200',
        text: `La cantidad de casos a asignar no puede ser mayor a la cantidad de casos disponible.`,
        duration: 3000
      });
    } else {

      let vParams: MassiveAssignParams = {
        pcantidadCasos: this.formStructure.getControlById('cantidadAsignar')?.value,
        pidGerencia: this.selectedData.idGerencia,
        pnitResponsable: this.formStructure.getControlById('colaborator')?.value,
        ptipoCaso: this.selectedData.idTipoCaso,
      };


      this.casoService.putMassiveAssign(vParams).toPromise().then(result => {



        this.dialog.close();
        this.dialog.showSnackBar({
          icon: 'success',
          title: 'IFI-200',
          text: `Asignación realizada con exito.`,
          duration: 3000
        });

        this.changeType();
      });
    }
  }

  cancel() { }
  onClick(actionId: string): void {
    switch (actionId) {
      case 'save':
        this.save();
        break;/*
      case 'update':
        this.updateCase();
        break;*/
      default:
        this.dialog.close();
        break;
    }
  }

}
