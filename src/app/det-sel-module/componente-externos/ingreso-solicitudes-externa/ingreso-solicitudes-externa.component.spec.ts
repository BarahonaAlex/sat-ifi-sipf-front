import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoSolicitudesExternaComponent } from './ingreso-solicitudes-externa.component';

describe('IngresoSolicitudesExternaComponent', () => {
  let component: IngresoSolicitudesExternaComponent;
  let fixture: ComponentFixture<IngresoSolicitudesExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoSolicitudesExternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoSolicitudesExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
