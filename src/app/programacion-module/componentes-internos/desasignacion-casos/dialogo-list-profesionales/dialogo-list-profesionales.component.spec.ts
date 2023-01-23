import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoListProfesionalesComponent } from './dialogo-list-profesionales.component';

describe('DialogoListProfesionalesComponent', () => {
  let component: DialogoListProfesionalesComponent;
  let fixture: ComponentFixture<DialogoListProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoListProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoListProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
