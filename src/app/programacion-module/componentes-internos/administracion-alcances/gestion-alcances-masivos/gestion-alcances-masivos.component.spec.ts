import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlcancesMasivosComponent } from './gestion-alcances-masivos.component';

describe('GestionAlcancesMasivosComponent', () => {
  let component: GestionAlcancesMasivosComponent;
  let fixture: ComponentFixture<GestionAlcancesMasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAlcancesMasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAlcancesMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
