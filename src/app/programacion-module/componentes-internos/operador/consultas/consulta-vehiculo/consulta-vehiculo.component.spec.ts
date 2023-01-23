import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVehiculoComponent } from './consulta-vehiculo.component';

describe('ConsultaVehiculoComponent', () => {
  let component: ConsultaVehiculoComponent;
  let fixture: ComponentFixture<ConsultaVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
