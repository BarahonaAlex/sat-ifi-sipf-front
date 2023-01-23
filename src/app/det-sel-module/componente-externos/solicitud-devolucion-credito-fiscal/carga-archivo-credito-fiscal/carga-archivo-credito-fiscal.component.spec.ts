import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaArchivoCreditoFiscalComponent } from './carga-archivo-credito-fiscal.component';

describe('CargaArchivoCreditoFiscalComponent', () => {
  let component: CargaArchivoCreditoFiscalComponent;
  let fixture: ComponentFixture<CargaArchivoCreditoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaArchivoCreditoFiscalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaArchivoCreditoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
