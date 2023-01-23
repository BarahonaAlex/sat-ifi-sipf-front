import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCreditoFiscalComponent } from './solicitud-credito-fiscal.component';

describe('SolicitudCreditoFiscalComponent', () => {
  let component: SolicitudCreditoFiscalComponent;
  let fixture: ComponentFixture<SolicitudCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
