import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAnualFiscalizacionComponent } from './plan-anual-fiscalizacion.component';

describe('PlanAnualFiscalizacionComponent', () => {
  let component: PlanAnualFiscalizacionComponent;
  let fixture: ComponentFixture<PlanAnualFiscalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAnualFiscalizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAnualFiscalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
