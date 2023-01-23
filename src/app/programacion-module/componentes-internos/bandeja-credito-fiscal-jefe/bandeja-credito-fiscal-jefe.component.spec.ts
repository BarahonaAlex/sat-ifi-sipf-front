import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCreditoFiscalJefeComponent } from './bandeja-credito-fiscal-jefe.component';

describe('BandejaCreditoFiscalJefeComponent', () => {
  let component: BandejaCreditoFiscalJefeComponent;
  let fixture: ComponentFixture<BandejaCreditoFiscalJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCreditoFiscalJefeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaCreditoFiscalJefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
