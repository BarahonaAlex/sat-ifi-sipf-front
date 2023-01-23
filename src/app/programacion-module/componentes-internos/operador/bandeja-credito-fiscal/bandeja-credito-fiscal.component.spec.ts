import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCreditoFiscalComponent } from './bandeja-credito-fiscal.component';

describe('BandejaCreditoFiscalComponent', () => {
  let component: BandejaCreditoFiscalComponent;
  let fixture: ComponentFixture<BandejaCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
