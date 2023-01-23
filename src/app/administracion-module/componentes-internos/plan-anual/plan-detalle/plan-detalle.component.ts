import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, CustomNode, Dropdown, FormStructure, Input, InputNumber, OptionChild } from 'mat-dynamic-form';
import * as moment from 'moment';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { IndicatorDetail, Month, MonthDetail, YearlyPlan, YearlyPlanDetail } from 'src/app/general-module/componentes-comunes/interfaces/plan-anual.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { PlanAnualService } from 'src/app/general-module/componentes-comunes/servicios/plan-anual.service';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { MetaPresenciasComponent } from '../metas/meta-presencias/meta-presencias.component';
import { MetaPublicacionesComponent } from '../metas/meta-publicaciones/meta-publicaciones.component';

@Component({
  selector: 'app-plan-detalle',
  templateUrl: './plan-detalle.component.html',
  styleUrls: ['./plan-detalle.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: Constantes.DATE_FORMATS
    },
  ]
})
export class PlanDetalleComponent implements OnInit {

  idYearlyPlan?: number;
  months!: DynamicDataTable<MonthDetail>;
  indicators!: DynamicDataTable<IndicatorDetail>;
  planFormGroup!: FormGroup;
  catalogs: { [key: string]: Catalog[] } = {};
  edited: boolean = false;
  yearlyPlan?: YearlyPlanDetail;

  @ViewChild('indicatorsTable') indicatorsTable!: TablaDinamicaComponent<IndicatorDetail>
  @ViewChild('goalsTable') goalsTable!: TablaDinamicaComponent<MonthDetail>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: DialogService,
    private yearlyPlanService: PlanAnualService,
    catalogService: CatalogosService,
    private location: Location
  ) {
    this.planFormGroup = new FormGroup({
      year: new FormControl(null, Validators.required)
    });

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INDICADORES_PLAN)
      .toPromise()
      .then(data => this.catalogs.indicators = data);

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_META)
      .toPromise()
      .then(data => this.catalogs.types = data);

    this.catalogs.months = Constantes.MONTHS_MAP;

    this.planFormGroup.get('year')?.valueChanges.subscribe(value => {
      value.year() !== this.yearlyPlan?.year && (this.edited = true);
    });

    this.initTables();
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) this.initWithParams(parseInt(params.get('id')!));
    });
  }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['administracion/plan/anual/fiscalizacion']);
  }

  showAddIndicator() {
    this.dialog.show({
      title: 'Agregar indicador',
      formStructure: this.initIndicatorStructure(),
      showConfirmButton: false,
      disableClose: true,
    });
  }

  showAddGoal() {
    this.dialog.show({
      title: 'Agregar meta',
      formStructure: this.initGoalStructure(),
      showConfirmButton: false,
      disableClose: true,
    });
  }

  removeMonth(data: MonthDetail) {
    this.dialog.show({
      title: 'IFI-003',
      text: `¿Está seguro que desea eliminar la meta de tipo "${this.catalogs.types.find(type => type.codigo == data.type)?.nombre}" para el mes de "${Constantes.MONTHS_MAP.find(i => i.codigo == data.month)?.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result == 'primary') {
        this.yearlyPlanService.deleteMonthYearlyPlan(this.idYearlyPlan!, data.month!, data.type!).toPromise().then(_ => {
          this.yearlyPlanService.getYearlyPlan(this.idYearlyPlan!).toPromise().then((data) => {
            
            this.yearlyPlan = data;
            if (data.months) {
              this.goalsTable.updateData(data.months);
            }
            else {

              this.goalsTable.dataSource.data = [];
            }

          });
          this.dialog.close();
          this.dialog.show({
            title: 'IFI-200',
            text: `La meta de tipo "${this.catalogs.types.find(type => type.codigo == data.type)?.nombre}" para el mes de "${Constantes.MONTHS_MAP.find(i => i.codigo == data.month)?.nombre}" fue eliminada correctamente`,
            icon: 'success',
          });

        });
      }
    });
  }

  editMonth(month: MonthDetail) {
    const structure = this.initGoalStructure(month);
    this.dialog.show({
      title: 'Editar meta',
      formStructure: structure,
      showConfirmButton: false,
      disableClose: true,
    });
    
    setTimeout(() => {
      this.changeType(structure, month);
    });
  }

  removeIndicator(data: IndicatorDetail) {
    const index = this.indicators.data.findIndex(item => data.indicator === item.indicator);
    this.indicators.data.splice(index, 1);
    this.edited = true;
    this.indicatorsTable.updateData();
  }

  editIndicator(indicator: IndicatorDetail) {
    this.dialog.show({
      title: 'Editar indicador',
      formStructure: this.initIndicatorStructure(indicator),
      showConfirmButton: false,
      disableClose: true,
    });
  }

  yearPicked(event: any, picker: MatDatepicker<number>) {
    picker.close();
    this.planFormGroup.patchValue({ year: event });
  }

  saveYearlyPlan() {
    const yearlyPlan: YearlyPlan = {
      year: this.planFormGroup.get('year')?.value.year(),
      indicators: this.indicators.data.map(item => ({ id: item.indicator, value: item.value })),
    }

    if (this.yearlyPlan) {
      this.yearlyPlanService.updateYearlyPlan(this.yearlyPlan.year, yearlyPlan).toPromise().then((data) => {
        this.edited = false;
        this.dialog.show({
          title: 'IFI-200',
          icon: 'success',
          text: 'Cambios guardados correctamente',
        });
      });
    } else {
      this.yearlyPlanService.createYearlyPlan(yearlyPlan).toPromise().then((data) => {
        this.location.replaceState(`administracion/plan/anual/fiscalizacion/detalle/${data}`);
        this.idYearlyPlan = data;
        this.edited = false;
        this.dialog.show({
          title: 'IFI-200',
          icon: 'success',
          text: 'Plan anual guardado correctamente',
        });
      });
    }
  }

  cancelIndicatorEditing() {
    this.edited = false;
    if (!this.yearlyPlan) {
      this.planFormGroup.reset();
      this.indicatorsTable.updateData([]);
    } else {
      this.yearlyPlanService.getYearlyPlan(this.idYearlyPlan!).toPromise().then((data) => {
        this.yearlyPlan = data;
        this.planFormGroup.patchValue({ year: moment().year(data.year) });
        this.idYearlyPlan = data.plan;
        this.indicatorsTable.updateData(data.indicators);
      });
    }
  }

  private initWithParams(year: number) {
    this.yearlyPlanService.getYearlyPlan(year).toPromise().then((data) => {
      this.yearlyPlan = data;
      this.planFormGroup.patchValue({ year: moment().year(data.year) });
      this.idYearlyPlan = data.plan;
      this.indicatorsTable.updateData(data.indicators);
      this.goalsTable.updateData(data.months);
    });
  }

  private addIndicator(form: FormStructure, data?: IndicatorDetail) {

    const indicator = this.catalogs.indicators?.find(item => item.codigo === form.getValue<any>().indicator);

    const indicatorDetail: IndicatorDetail = {
      indicator: indicator?.codigo,
      name: indicator?.nombre,
      value: parseInt(form.getValue<any>().value),
    };

    if (!this.checkIfIndicatorExists(indicatorDetail) && !data) return;

    if (data) {
      if (indicatorDetail.indicator != data.indicator && !this.checkIfIndicatorExists(indicatorDetail)) return;
      const index = this.indicators.data.findIndex(item => data.indicator === item.indicator);
      this.indicators.data[index] = indicatorDetail;
    } else {
      this.indicators.data.push(indicatorDetail);
    }
    this.edited = true;
    this.indicatorsTable.updateData();
    this.dialog.close();
  }

  private addGoal(form: FormStructure, old?: MonthDetail) {
    const month = form.getValue<Month>();
    month.plan = this.idYearlyPlan!;

    if (!old) {
      
      this.yearlyPlanService.createYearlyPlanMonth(month).toPromise().then(_ => {
        this.yearlyPlanService.getYearlyPlan(this.idYearlyPlan!).toPromise().then((data) => {
          this.yearlyPlan = data;
          this.goalsTable.updateData(data.months);
        });
        this.dialog.close();
        this.dialog.show({
          title: 'IFI-200',
          text: 'Meta agregada correctamente',
          icon: 'success',
        });
      });
    } else {
      month.month = old.month;
      month.type = old.type;

      

      this.yearlyPlanService.updateYearlyPlanMonth(month).toPromise().then(_ => {
        this.yearlyPlanService.getYearlyPlan(this.idYearlyPlan!).toPromise().then((data) => {
          this.yearlyPlan = data;
          this.goalsTable.updateData(data.months);
        });
        this.dialog.close();
        this.dialog.show({
          title: 'IFI-200',
          text: 'Cambios guardados correctamente',
          icon: 'success',
        });
      });
    }
  }

  private checkIfIndicatorExists(indicatorDetail: IndicatorDetail) {
    const oldIndicator = this.indicators.data.find(item => item.indicator === indicatorDetail.indicator);
    if (oldIndicator) {
      this.dialog.showSnackBar({
        title: 'IFI-400',
        icon: 'warning',
        text: 'El indicador ya fue agregado',
        showCloseButton: true,
        duration: 5000,
      });
      return false;
    }
    return true;
  }

  private initTables() {
    this.months = {
      data: [],
      header: [
        { id: 'id', nameColum: 'No' },
        { id: 'monthName', nameColum: 'Mes' },
        { id: 'typeName', nameColum: 'Tipo' },
        {
          id: 'actions', nameColum: '', actions: [
            { btnKey: 'edit', btnName: 'Editar meta', btnIcon: 'edit', onClick: item => this.editMonth(item) },
            { btnKey: 'delete', btnName: 'Eliminar meta', btnIcon: 'delete', onClick: item => this.removeMonth(item) },
          ]
        },
      ],
      noColum: [5, 10, 15]
    };

    this.indicators = {
      data: [],
      header: [
        { id: 'indicator', nameColum: 'No' },
        { id: 'name', nameColum: 'Nombre' },
        { id: 'value', nameColum: 'Valor' },
        {
          id: 'actions', nameColum: '', actions: [
            { btnKey: 'edit', btnName: 'Editar indicador', btnIcon: 'edit', onClick: item => this.editIndicator(item) },
            { btnKey: 'delete', btnName: 'Quitar indicador', btnIcon: 'delete', onClick: item => this.removeIndicator(item) },
          ]
        },
      ],
      noColum: [5, 10, 15]
    }
  }

  private initIndicatorStructure(data?: IndicatorDetail) {
    return new FormStructure().apply({
      showTitle: false,
      globalValidators: Validators.required,
      nodes: [
        new Dropdown('indicator', 'Indicador', this.catalogs?.indicators?.map(tax => new OptionChild(tax.nombre, tax.codigo))).apply({
          selectedValue: data?.indicator
        }),
        new InputNumber('value', 'Valor', data?.value).apply({
          max: 100,
          min: 0,
        }),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          onEvent: () => this.dialog.close(), style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          onEvent: event => this.addIndicator(event.structure, data), style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
  }

  private initGoalStructure(data?: MonthDetail) {

    return new FormStructure().apply({
      showTitle: false,
      globalValidators: Validators.required,
      nodes: [
        new Dropdown('type', 'Tipo', this.catalogs?.types?.map(tax => new OptionChild(tax.nombre, tax.codigo))).apply({
          selectedValue: data?.type,
          disabled: !!data,
          action: { onEvent: event => this.changeType(event.structure), type: 'valueChange' }
        }),
        new Dropdown('month', 'Mes', this.catalogs?.months?.map(tax => new OptionChild(tax.nombre, tax.codigo))).apply({
          selectedValue: data?.month,
          disabled: !!data
        })
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          onEvent: () => this.dialog.close(), style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          onEvent: event => this.addGoal(event.structure, data), style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
  }

  private changeType(form: FormStructure, data?: MonthDetail) {
    
    const node = form.getNodeById('goals');
    if (node) {
      form.removeNodes([node]);
    }

    if (form.getControlById('type')?.value == 1010) {
      
      form.createNodes(2, [new CustomNode<MetaPublicacionesComponent>('goals', MetaPublicacionesComponent, { month: data }).apply({
        singleLine: true
      })]);
    } else if (form.getControlById('type')?.value == 1011) {

      form.createNodes(2, [new CustomNode<MetaPresenciasComponent>('goals', MetaPresenciasComponent, { month: data }).apply({
        singleLine: true
      })]);
    }
  }
}

