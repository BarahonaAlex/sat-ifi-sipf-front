/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlcanceSelectivoComponent } from './alcance-selectivo.component';

describe('AlcanceSelectivoComponent', () => {
  let component: AlcanceSelectivoComponent;
  let fixture: ComponentFixture<AlcanceSelectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlcanceSelectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcanceSelectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
