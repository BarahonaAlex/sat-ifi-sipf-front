import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnnualAuditPlan } from 'src/app/general-module/componentes-comunes/interfaces/Reports.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ReportesService } from 'src/app/general-module/componentes-comunes/servicios/reportes.service';

@Component({
  selector: 'app-plan-anual-fiscalizacion',
  templateUrl: './plan-anual-fiscalizacion.component.html',
  styleUrls: ['./plan-anual-fiscalizacion.component.css']
})

export class PlanAnualFiscalizacionComponent implements OnInit {

  meses = [
    { codigo: 1, nombre: "ENERO" },
    { codigo: 2, nombre: "FEBRERO" },
    { codigo: 3, nombre: "MARZO" },
    { codigo: 4, nombre: "ABRIL" },
    { codigo: 5, nombre: "MAYO" },
    { codigo: 6, nombre: "JUNIO" },
    { codigo: 7, nombre: "JULIO" },
    { codigo: 8, nombre: "AGOSTO" },
    { codigo: 9, nombre: "SEPTIEMBRE" },
    { codigo: 10, nombre: "OCTUBRE" },
    { codigo: 11, nombre: "NOVIEMBRE" },
    { codigo: 12, nombre: "DICIEMBRE" },
  ];

  gerencias =[
    { codigo: 1, nombre: "CENTRAL" },
    { codigo: 2, nombre: "SUR" },
    { codigo: 3, nombre: "NORORIENTE" },
  ]

  tipos = [
    { codigo: 1, nombre: "Selectivo" },
    { codigo: 2, nombre: "Masivo" },
    { codigo: 3, nombre: "Comex" },
  ];

 
  generalFormGroup!: FormGroup;
  planForm!: FormGroup;
  arrayPlanes = new Array;
  mostrarMes = false;

  constructor(
    private reportsServices: ReportesService,
    private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.generalFormGroup = new FormGroup({
      indicador: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required),
    });

    this.planForm = new FormGroup({
      meta: new FormControl('', Validators.required),
    });
  }

  addPlan(){
    this.mostrarMes = true
   //this.arrayPlanes.push(this.generalFormGroup)
  }

  createPlan() {
    console.log(this.planForm.value.meta)
    /*this.reportsServices.createAnnualAuditPlan(this.arrayPlanes).toPromise().then(res => {
      console.log(res)
      if (!res) {
        this.dialogService.show({
          title: 'Guardado sin exito',
          text: `El plan anual de fiscalizacion no se guardo correctamente, verifique la Informacion ingresada`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.dialogService.show({
          title: 'Guardado con exito',
          text: `El plan anual de fiscalizacion se creo correctamente`,
          icon: 'success',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      }
    }).catch(error => {
      console.log(error);
      this.dialogService.show({
        title: 'Verifique Informacion',
        text: `Verifique la Informacion ingresada`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    })*/
  }

}

