import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'app-solicitud-credito-fiscal',
  templateUrl: './solicitud-credito-fiscal.component.html',
  styleUrls: ['./solicitud-credito-fiscal.component.css']
})
export class SolicitudCreditoFiscalComponent implements OnInit {

  showRequestTaxpayer:boolean = true;
  showNewRequest:boolean = false;

  displayedColumnsTaxpayer: string[] = [
    'noSolicitud', 
    'estadoSolicitud', 
    'fechaSolicitud'
  ];

  contribuyenteFormGroup!: FormGroup; /* primer steper */
  contadorFormGroup!: FormGroup; /* primer steper */
  representanteFormGroup!: FormGroup; /* primer steper */


  constructor(private formBuilder: FormBuilder) { 

   
    
  }

  ngOnInit(): void {
    this.contribuyenteFormGroup = new FormGroup({
      nitContribuyente: new FormControl(''),
      nombreContribuyente: new FormControl(''),
      dpiContribuyente: new FormControl(''),
      pasaporteContribuyente: new FormControl(''),
      domicilioContribuyente: new FormControl(''),
      correoContribuyente: new FormControl(''),
    });

    this.representanteFormGroup = new FormGroup({
      nombreRepresentante: new FormControl(''),
      dpiRepresentant: new FormControl(''),
      fechaNombramientoRepresentant: new FormControl(''),
      pasaporteRepresentante: new FormControl('')
    });

    this.contadorFormGroup = new FormGroup({
      nitContador: new FormControl(''),
      nombreContador: new FormControl(''),
      dpiContador: new FormControl(''),
      fechaNombramientoContador: new FormControl('')
    });
  }

  nuevaSolicitud(){
    this.showNewRequest = true;
    this.showRequestTaxpayer = false;
  }

  cancelarNueva(){
    this.showNewRequest = false;
    this.showRequestTaxpayer = true;
  }
}
