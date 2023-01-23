import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Goal, MonthDetail } from 'src/app/general-module/componentes-comunes/interfaces/plan-anual.interface';

@Component({
  selector: 'app-meta-publicaciones',
  templateUrl: './meta-publicaciones.component.html',
  styleUrls: ['./meta-publicaciones.component.css']
})
export class MetaPublicacionesComponent implements OnInit {

  control?: FormControl;
  @Input("month")
  month?: MonthDetail
  @Input("readOnly")
  readOnly: boolean = false;

  planForm: FormGroup
  totalsManagement: number[] = [0, 0, 0, 0, 0, 0];
  totalsDepartament: number[] = [0, 0, 0, 0];

  constructor() {

    console.log('llama al constructor')

    this.planForm = new FormGroup({});

    let count = 0;
    let mod = 3;
    while (count <= 23) {

      if ((count % mod) == 0 && count > 0) {
        count++;
        mod = mod + 4;
      }

      this.planForm.addControl(`goal${count + 1}`, new FormControl({ value: 0, disabled: this.readOnly }));
      count++;
    }

  }

  ngOnInit() {
    this.control?.setValue(this.generateGoals());
    let count = 0;
    let mod = 3;
    this.month?.goals?.forEach((goal, index) => {

      if ((count % mod) == 0 && count > 0) {
        count++;
        mod = mod + 4;
      }

      this.planForm.get(`goal${count + 1}`)?.setValue(goal.value);
      count++;

    });

    if (this.month) {
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.totalsManagement = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.totalsDepartament = [0, 0, 0, 0];

    for (let i = 0; i < 6; i++) {
      for (let j = i * 4; j < (i * 4 + 4); j++) {
        this.totalsManagement[i] += this.planForm.get(`goal${j + 1}`)?.value ?? 0;
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j <= 24; j += 4) {
        this.totalsDepartament[i] += this.planForm.get(`goal${j}`)?.value ?? 0;
      }
    }

    this.control?.setValue(this.generateGoals());
  }

  totalsDepartamentSum() {
    return this.totalsDepartament.reduce((a, c) => a = (a ?? 0) + c);
  }

  generateGoals() {

    return [
      { id: this.month?.goals?.[0]?.id ?? 0, management: 40, departament: 172, value: this.planForm.get('goal1')?.value ?? 0 },
      { id: this.month?.goals?.[1]?.id ?? 0, management: 40, departament: 173, value: this.planForm.get('goal2')?.value ?? 0 },
      { id: this.month?.goals?.[2]?.id ?? 0, management: 40, departament: 176, value: this.planForm.get('goal3')?.value ?? 0 },
      { id: this.month?.goals?.[3]?.id ?? 0, management: 41, departament: 172, value: this.planForm.get('goal5')?.value ?? 0 },
      { id: this.month?.goals?.[4]?.id ?? 0, management: 41, departament: 173, value: this.planForm.get('goal6')?.value ?? 0 },
      { id: this.month?.goals?.[5]?.id ?? 0, management: 41, departament: 176, value: this.planForm.get('goal7')?.value ?? 0 },
      { id: this.month?.goals?.[6]?.id ?? 0, management: 42, departament: 172, value: this.planForm.get('goal9')?.value ?? 0 },
      { id: this.month?.goals?.[7]?.id ?? 0, management: 42, departament: 173, value: this.planForm.get('goal10')?.value ?? 0 },
      { id: this.month?.goals?.[8]?.id ?? 0, management: 42, departament: 176, value: this.planForm.get('goal11')?.value ?? 0 },
      { id: this.month?.goals?.[9]?.id ?? 0, management: 43, departament: 172, value: this.planForm.get('goal13')?.value ?? 0 },
      { id: this.month?.goals?.[10]?.id ?? 0, management: 43, departament: 173, value: this.planForm.get('goal14')?.value ?? 0 },
      { id: this.month?.goals?.[11]?.id ?? 0, management: 43, departament: 176, value: this.planForm.get('goal15')?.value ?? 0 },
      { id: this.month?.goals?.[12]?.id ?? 0, management: 44, departament: 172, value: this.planForm.get('goal17')?.value ?? 0 },
      { id: this.month?.goals?.[13]?.id ?? 0, management: 44, departament: 173, value: this.planForm.get('goal18')?.value ?? 0 },
      { id: this.month?.goals?.[14]?.id ?? 0, management: 44, departament: 176, value: this.planForm.get('goal19')?.value ?? 0 },
      { id: this.month?.goals?.[15]?.id ?? 0, management: 45, departament: 172, value: this.planForm.get('goal21')?.value ?? 0 },
      { id: this.month?.goals?.[16]?.id ?? 0, management: 45, departament: 173, value: this.planForm.get('goal22')?.value ?? 0 },
      { id: this.month?.goals?.[17]?.id ?? 0, management: 45, departament: 176, value: this.planForm.get('goal23')?.value ?? 0 },
    ]
  }

  update(pData: MonthDetail) {

    console.log('update del month ')

    if (pData.goals) {
      console.log('update del month entra if')
      let count = 0;
      let count2 = 0;
      let mod = 3;
      while (count <= 23) {

        if ((count % mod) == 0 && count > 0) {
          count++;
          mod = mod + 4;
        }


        if (count2 < 18) {
          this.planForm.get(`goal${count + 1}`)?.setValue(pData.goals![count2].value);
          this.planForm.get(`goal${count + 1}`)?.disable();

        }

        count++;
        count2++;
      }


    }
    else {
      console.log('update del month entra else ')

      let count = 0;
      let count2 = 0;
      let mod = 3;
      while (count <= 23) {

        if ((count % mod) == 0 && count > 0) {
          count++;
          mod = mod + 4;
        }


        if (count2 < 18) {
          this.planForm.get(`goal${count + 1}`)?.setValue(0);
          this.planForm.get(`goal${count + 1}`)?.disable();

        }

        count++;
        count2++;
      }


    }

    this.calculateTotals();


  }
}
