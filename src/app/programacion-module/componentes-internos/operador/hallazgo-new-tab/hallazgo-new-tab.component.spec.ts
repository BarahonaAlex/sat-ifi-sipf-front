/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HallazgoNewTabComponent } from './hallazgo-new-tab.component';

describe('HallazgoNewTabComponent', () => {
  let component: HallazgoNewTabComponent;
  let fixture: ComponentFixture<HallazgoNewTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallazgoNewTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallazgoNewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
