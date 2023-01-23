/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartelaDenunciaAprobadoComponent } from './cartela-denuncia-aprobado.component';

describe('CartelaDenunciaAprobadoComponent', () => {
  let component: CartelaDenunciaAprobadoComponent;
  let fixture: ComponentFixture<CartelaDenunciaAprobadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartelaDenunciaAprobadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartelaDenunciaAprobadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
