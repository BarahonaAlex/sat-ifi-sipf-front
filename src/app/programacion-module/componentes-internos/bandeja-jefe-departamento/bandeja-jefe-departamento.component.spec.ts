import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaJefeDepartamentoComponent } from './bandeja-jefe-departamento.component';

describe('BandejaJefeDepartamentoComponent', () => {
  let component: BandejaJefeDepartamentoComponent;
  let fixture: ComponentFixture<BandejaJefeDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaJefeDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaJefeDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
