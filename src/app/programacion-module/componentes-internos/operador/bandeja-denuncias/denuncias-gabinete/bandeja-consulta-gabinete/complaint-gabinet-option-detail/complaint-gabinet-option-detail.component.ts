import { Component, OnInit } from '@angular/core';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';

@Component({
  selector: 'app-complaint-gabinet-option-detail',
  templateUrl: './complaint-gabinet-option-detail.component.html',
  styleUrls: ['./complaint-gabinet-option-detail.component.scss']
})
export class ComplaintGabinetOptionDetailComponent implements OnInit {

  correlativo!: String
  type!: string
  taxPayer!: Contribuyente.Respuesta
  taxPayerSerial!: any

  constructor() { }

  ngOnInit() {
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
