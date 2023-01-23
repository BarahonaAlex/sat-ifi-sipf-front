import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administracion-alcance',
  templateUrl: './administracion-alcance.component.html',
  styleUrls: ['./administracion-alcance.component.scss']
})
export class AdministracionAlcanceComponent implements OnInit {
  informacionEstudio = [
    'a. Funciones',
    'b. Activos',
    'c. Riesgos',
    'd. Transacciones con partes relacionadas',
    'e. Información financiera para determinar el indicador de rentabilidad',
    'f. Búsqueda de comparables',
    'g. Comparables'
  ];
  principal = [
    'I. ANTECEDENTES',
    'II. HALLAZGOS',
    'III. OBJETIVOS',
    'IV. PROCEDIMIENTOS MÍNIMOS',
    'V. ASPECTOS GENERALES'
  ]
  antecedentes = [
    'A. INFORMACIÓN DEL GRUPO EMPRESARIAL',
    'B. INFORMACIÓN DEL CONTRIBUYENTE',
    'C. ANTECEDENTES DE FISCALIZACIÓN'
  ]
  informacionContribuyente = [
    '1. Descripción general del contribuyente (Razón social)',
    '2. Estructura accionaria del contribuyente (Razón social)',
    '3. Principales Clientes del contribuyente (Razón social)',
    '4. Principales proveedores del contribuyente (Razón social)',
    '5. Principales competidores del contribuyente',
    '6. Información relevante de la Declaración Jurada Anual del Impuesto Sobre la Renta',
    '7. Información relevante de Estados Financieros Auditados',
    '8. Información relevante del Estudio de Precios de Transferencia',
    '9. Análisis de la Declaración Jurada y Pago Anual del ISR, Estados Financieros Auditados y Estudio de Precios de Transferencia'
  ]

  vAantecedentes: Boolean = false
  vInformacionContribuyente: Boolean = false
  viInformacionEstudio: Boolean = false

  constructor() { }

  ngOnInit() {
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.informacionEstudio, event.previousIndex, event.currentIndex);
  }
  Seleccionar(objeto: string) {
    console.log(objeto)
    if (objeto == "I. ANTECEDENTES") {
      this.vAantecedentes = true
    } if (objeto == "B. INFORMACIÓN DEL CONTRIBUYENTE") {
      this.vInformacionContribuyente = true
    } if (objeto == "8. Información relevante del Estudio de Precios de Transferencia") {
      this.viInformacionEstudio = true
    }
  }
  
  GenerarAlcance() {
   
  }
}
