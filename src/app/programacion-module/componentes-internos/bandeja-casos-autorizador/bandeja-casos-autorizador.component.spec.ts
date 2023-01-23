import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCasosAutorizadorComponent } from './bandeja-casos-autorizador.component';

describe('BandejaCasosAutorizadorComponent', () => {
  let component: BandejaCasosAutorizadorComponent;
  let fixture: ComponentFixture<BandejaCasosAutorizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCasosAutorizadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaCasosAutorizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
