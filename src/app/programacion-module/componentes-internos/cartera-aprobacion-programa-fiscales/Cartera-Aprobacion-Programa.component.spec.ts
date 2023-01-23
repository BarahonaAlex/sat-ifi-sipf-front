/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteraAprobacionProgramaComponent } from './Cartera-Aprobacion-Programa.component';

describe('CarteraAprobacionProgramaComponent', () => {
  let component: CarteraAprobacionProgramaComponent;
  let fixture: ComponentFixture<CarteraAprobacionProgramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraAprobacionProgramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraAprobacionProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
