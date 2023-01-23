import { CaseDetail } from './../../../../general-module/componentes-comunes/interfaces/casos.interface';
import { Component, OnInit } from '@angular/core';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opcion-detalle',
  templateUrl: './opcion-detalle.component.html',
  styleUrls: ['./opcion-detalle.component.scss']
})
export class OpcionDetalleComponent implements OnInit {

  id!: number
  type!: string
  taxPayer!: Contribuyente.Respuesta
  taxPayerCase!: CaseDetail
  btnHallazgos: Boolean = true

  constructor(private router: Router) { }

  ngOnInit() {
  }

  newWindowFindings(id:number){
    console.log('llamara a la nueva ventana' + id)

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['programacion/operador/bandeja/hallazgos/'+id])
    );
  
    window.open(url, '_blank');
  }

  selectOption(id: string) {
    const children = document.getElementById('option_container_modal')?.children ?? [];
    const option = document.getElementById(id);
    const button = document.getElementById(`${id}_button`);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childButton = document.getElementById(`${child.id}_button`);
      child.classList.remove('selected-modal');
      childButton?.classList.remove('mat-raised-button')
    }

    option?.classList.add('selected-modal');

    button?.classList.add('mat-raised-button')
  }
}
