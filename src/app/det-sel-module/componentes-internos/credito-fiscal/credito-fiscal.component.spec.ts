import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoFiscalComponent } from './credito-fiscal.component';

describe('CreditoFiscalComponent', () => {
  let component: CreditoFiscalComponent;
  let fixture: ComponentFixture<CreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
