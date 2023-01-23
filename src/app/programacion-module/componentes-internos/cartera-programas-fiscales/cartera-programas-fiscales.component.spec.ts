/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CarteraProgramasFiscalesComponent } from './cartera-programas-fiscales.component';

describe('CarteraProgramaComponent', () => {
  let component: CarteraProgramasFiscalesComponent;
  let fixture: ComponentFixture<CarteraProgramasFiscalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraProgramasFiscalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraProgramasFiscalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
