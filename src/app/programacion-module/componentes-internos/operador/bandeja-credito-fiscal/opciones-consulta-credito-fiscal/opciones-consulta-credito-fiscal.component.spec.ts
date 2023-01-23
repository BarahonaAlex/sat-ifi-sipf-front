import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesConsultaCreditoFiscalComponent } from './opciones-consulta-credito-fiscal.component';

describe('OpcionesConsultaCreditoFiscalComponent', () => {
  let component: OpcionesConsultaCreditoFiscalComponent;
  let fixture: ComponentFixture<OpcionesConsultaCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesConsultaCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionesConsultaCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
