import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { MetaPresenciasComponent } from 'src/app/administracion-module/componentes-internos/plan-anual/metas/meta-presencias/meta-presencias.component';
import { MetaPublicacionesComponent } from 'src/app/administracion-module/componentes-internos/plan-anual/metas/meta-publicaciones/meta-publicaciones.component';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { MonthDetail, YearlyPlanDetail } from 'src/app/general-module/componentes-comunes/interfaces/plan-anual.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { PlanAnualService } from 'src/app/general-module/componentes-comunes/servicios/plan-anual.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';


@Component({
  selector: 'app-plan-anual',
  templateUrl: './plan-anual.component.html',
  styleUrls: ['./plan-anual.component.scss'],
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
export class PlanAnualComponent implements OnInit {

  filterForm: FormGroup;
  catalogs: { [key: string]: Catalog[] } = {};
  data: any = { showData: false };
  yearlyPlan?: YearlyPlanDetail;

  monthDetails!: MonthDetail;

  presenceDetails!: MonthDetail;
  showMessage = false;

  errorMessage!: string;

  @ViewChild('month') month!: MetaPublicacionesComponent;

  @ViewChild('presence') presence!: MetaPresenciasComponent;



  constructor(private yearlyPlanService: PlanAnualService,
    private dialog: DialogService) {

    this.catalogs.months = Constantes.MONTHS_MAP;

    this.filterForm = new FormGroup({
      year: new FormControl(null, Validators.required),
      month: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.data.showData = false;
  }

  yearPicked(event: Event, picker: MatDatepicker<Moment>) {
    picker.close();
    this.filterForm.patchValue({ year: event });
  }




  filterData() {

    if (this.yearlyPlan!.months.filter(month => month.month === this.data.month).length > 0) {
      this.monthDetails = this.yearlyPlan!.months.filter(month => month.month === this.data.month)[0];
      if (this.yearlyPlan!.months.filter(month => month.month === this.data.month).length > 1) {
        this.presenceDetails = this.yearlyPlan!.months.filter(month => month.month === this.data.month)[1];
      }
      else {
        this.presenceDetails = {};
      }

      setTimeout(() => {
        this.data.showData = true;
        this.month.update(this.monthDetails);
        this.presence.update(this.presenceDetails);
      });


      this.data.showData = true;
    }
    else {
      this.errorMessage = "No existe datos para el mes seleccionado en el plan anual de fiscalización.";
      this.monthDetails = {};
      this.presenceDetails = {};
      this.errorMessage = this.errorMessage;
      this.showMessage = true;

      this.dialog.show({
        title: "IFI-404",
        text: this.errorMessage,
        icon: "error",
        disableClose: true,
        showCloseButton: true,
      });
    }



  }

  findData() {

    this.yearlyPlanService.getYearlyPlan(this.data.year.year()).toPromise().then((data) => {
      this.yearlyPlan = data;
      this.showMessage = false;
      this.filterData();
    }).catch(ex => {

      this.errorMessage = "No existe plan anual de fiscalización creado.";
      this.showMessage = true;
      this.yearlyPlan = undefined;
      this.errorMessage = this.errorMessage;
      this.data.showData = false;
      this.dialog.show({
        title: "IFI-404",
        text: this.errorMessage,
        icon: "error",
        disableClose: true,
        showCloseButton: true,
      });
    });
  }

  findGolsByYearAndMonth() {
    this.data = {
      year: this.filterForm.get('year')?.value,
      month: this.filterForm.get('month')?.value,
      showData: false
    };

    if (this.yearlyPlan) {

      if (this.yearlyPlan.year === this.data.year.year()) {

        this.filterData();
      }
      else {

        this.findData();
      }
    } else {

      this.findData();
    }

  }
}
