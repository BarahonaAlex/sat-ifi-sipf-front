import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignacionCasosComponent } from './reasignacion-casos.component';

describe('ReasignacionCasosComponent', () => {
  let component: ReasignacionCasosComponent;
  let fixture: ComponentFixture<ReasignacionCasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignacionCasosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignacionCasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
