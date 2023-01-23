import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDevolucionCreditoFiscalComponent } from './solicitud-devolucion-credito-fiscal.component';

describe('SolicitudDevolucionCreditoFiscalComponent', () => {
  let component: SolicitudDevolucionCreditoFiscalComponent;
  let fixture: ComponentFixture<SolicitudDevolucionCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudDevolucionCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudDevolucionCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
