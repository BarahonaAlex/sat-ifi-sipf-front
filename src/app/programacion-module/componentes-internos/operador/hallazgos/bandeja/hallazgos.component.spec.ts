/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HallazgosComponent } from './hallazgos.component';

describe('HallazgosComponent', () => {
  let component: HallazgosComponent;
  let fixture: ComponentFixture<HallazgosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallazgosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallazgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
