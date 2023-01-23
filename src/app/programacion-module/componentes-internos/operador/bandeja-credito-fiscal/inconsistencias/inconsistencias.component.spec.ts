import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InconsistenciasComponent } from './inconsistencias.component';

describe('InconsistenciasComponent', () => {
  let component: InconsistenciasComponent;
  let fixture: ComponentFixture<InconsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InconsistenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InconsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
