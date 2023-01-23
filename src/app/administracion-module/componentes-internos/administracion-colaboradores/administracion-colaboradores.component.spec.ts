import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionColaboradoresComponent } from './administracion-colaboradores.component';

describe('AdministracionColaboradoresComponent', () => {
  let component: AdministracionColaboradoresComponent;
  let fixture: ComponentFixture<AdministracionColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
