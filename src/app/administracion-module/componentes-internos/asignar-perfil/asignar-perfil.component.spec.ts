import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPerfilComponent } from './asignar-perfil.component';

describe('AsignarPerfilComponent', () => {
  let component: AsignarPerfilComponent;
  let fixture: ComponentFixture<AsignarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
