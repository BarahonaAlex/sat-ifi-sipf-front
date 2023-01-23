/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteraInsumoAprobadorComponent } from './cartera-insumo-aprobador.component';

describe('CarteraInsumoAprobadorComponent', () => {
  let component: CarteraInsumoAprobadorComponent;
  let fixture: ComponentFixture<CarteraInsumoAprobadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraInsumoAprobadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraInsumoAprobadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
