import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MonthDetail } from 'src/app/general-module/componentes-comunes/interfaces/plan-anual.interface';

@Component({
  selector: 'app-meta-presencias',
  templateUrl: './meta-presencias.component.html',
  styleUrls: ['./meta-presencias.component.css']
})
export class MetaPresenciasComponent implements OnInit {

  control?: FormControl;
  @Input("month")
  month?: MonthDetail
  @Input("readOnly")
  readOnly: boolean = false;

  planForm: FormGroup;
  totalsManagement: number = 0;

  constructor() {
    this.planForm = new FormGroup({
      goal1: new FormControl({ value: 0, disabled: this.readOnly }),
      goal2: new FormControl({ value: 0, disabled: this.readOnly }),
      goal3: new FormControl({ value: 0, disabled: this.readOnly }),
      goal4: new FormControl({ value: 0, disabled: this.readOnly }),
      goal5: new FormControl({ value: 0, disabled: this.readOnly }),
      goal6: new FormControl({ value: 0, disabled: this.readOnly }),
    });
  }

  ngOnInit() {
    this.control?.setValue(this.generateGoals());
    this.month?.goals?.forEach((goal, index) => {
      this.planForm.get(`goal${index + 1}`)?.setValue(goal.value);
    });

    if (this.month) {
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.totalsManagement = 0;

    for (let i = 0; i < 6; i++) {
      this.totalsManagement += this.planForm.get(`goal${i + 1}`)?.value ?? 0;
    }

    this.control?.setValue(this.generateGoals());
  }

  generateGoals() {

    return [
      { id: this.month?.goals?.[0]?.id, management: 40, value: this.planForm.get('goal1')?.value ?? 0 },
      { id: this.month?.goals?.[1]?.id, management: 41, value: this.planForm.get('goal2')?.value ?? 0 },
      { id: this.month?.goals?.[2]?.id, management: 42, value: this.planForm.get('goal3')?.value ?? 0 },
      { id: this.month?.goals?.[3]?.id, management: 43, value: this.planForm.get('goal4')?.value ?? 0 },
      { id: this.month?.goals?.[4]?.id, management: 44, value: this.planForm.get('goal5')?.value ?? 0 },
      { id: this.month?.goals?.[5]?.id, management: 45, value: this.planForm.get('goal6')?.value ?? 0 },
    ]
  }

  update(pData: MonthDetail) {

    if (pData.goals) {


      this.planForm.get('goal1')?.setValue(pData.goals![0].value);
      this.planForm.get('goal2')?.setValue(pData.goals![1].value);
      this.planForm.get('goal3')?.setValue(pData.goals![2].value);
      this.planForm.get('goal4')?.setValue(pData.goals![3].value);
      this.planForm.get('goal5')?.setValue(pData.goals![4].value);
      this.planForm.get('goal6')?.setValue(pData.goals![5].value);

      this.planForm.get('goal1')?.disable();
      this.planForm.get('goal2')?.disable();
      this.planForm.get('goal3')?.disable();
      this.planForm.get('goal4')?.disable();
      this.planForm.get('goal5')?.disable();
      this.planForm.get('goal6')?.disable();


    }
    else {
      this.planForm.get('goal1')?.setValue(0);
      this.planForm.get('goal2')?.setValue(0);
      this.planForm.get('goal3')?.setValue(0);
      this.planForm.get('goal4')?.setValue(0);
      this.planForm.get('goal5')?.setValue(0);
      this.planForm.get('goal6')?.setValue(0);

      this.planForm.get('goal1')?.disable();
      this.planForm.get('goal2')?.disable();
      this.planForm.get('goal3')?.disable();
      this.planForm.get('goal4')?.disable();
      this.planForm.get('goal5')?.disable();
      this.planForm.get('goal6')?.disable();

    }

    this.calculateTotals();

  }
}
