import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSolicitudCreditoFiscalComponent } from './new-solicitud-credito-fiscal.component';

describe('NewSolicitudCreditoFiscalComponent', () => {
  let component: NewSolicitudCreditoFiscalComponent;
  let fixture: ComponentFixture<NewSolicitudCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSolicitudCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSolicitudCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
