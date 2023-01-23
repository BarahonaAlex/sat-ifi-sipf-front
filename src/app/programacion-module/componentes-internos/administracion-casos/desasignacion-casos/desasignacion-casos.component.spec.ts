import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesasignacionCasosComponent } from './desasignacion-casos.component';

describe('DesasignacionCasosComponent', () => {
  let component: DesasignacionCasosComponent;
  let fixture: ComponentFixture<DesasignacionCasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesasignacionCasosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesasignacionCasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
