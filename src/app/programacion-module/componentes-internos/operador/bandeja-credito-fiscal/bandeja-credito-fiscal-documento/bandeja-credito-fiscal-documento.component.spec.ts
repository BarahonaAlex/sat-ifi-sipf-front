import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCreditoFiscalDocumentoComponent } from './bandeja-credito-fiscal-documento.component';

describe('BandejaCreditoFiscalDocumentoComponent', () => {
  let component: BandejaCreditoFiscalDocumentoComponent;
  let fixture: ComponentFixture<BandejaCreditoFiscalDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCreditoFiscalDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaCreditoFiscalDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
