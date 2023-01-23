/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteraCasosAutorizadorGerencialComponent } from './cartera-casos-autoriazador-gerencial.component';

describe('CarteraCasosAutorizadorGerencialComponent', () => {
  let component: CarteraCasosAutorizadorGerencialComponent;
  let fixture: ComponentFixture<CarteraCasosAutorizadorGerencialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraCasosAutorizadorGerencialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraCasosAutorizadorGerencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
