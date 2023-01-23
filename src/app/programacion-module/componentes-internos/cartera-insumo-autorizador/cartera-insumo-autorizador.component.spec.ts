/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteraInsumoAutorizadorComponent } from './cartera-insumo-autorizador.component';

describe('CarteraInsumoAutorizadorComponent', () => {
  let component: CarteraInsumoAutorizadorComponent;
  let fixture: ComponentFixture<CarteraInsumoAutorizadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraInsumoAutorizadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraInsumoAutorizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
