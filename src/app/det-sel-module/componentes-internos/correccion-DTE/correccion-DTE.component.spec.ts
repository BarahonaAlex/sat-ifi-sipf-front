/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CorreccionDTEComponent } from './correccion-DTE.component';

describe('CorreccionDTEComponent', () => {
  let component: CorreccionDTEComponent;
  let fixture: ComponentFixture<CorreccionDTEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorreccionDTEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorreccionDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
