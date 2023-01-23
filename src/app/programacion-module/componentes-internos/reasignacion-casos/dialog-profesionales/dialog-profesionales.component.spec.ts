import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfesionalesComponent } from './dialog-profesionales.component';

describe('DialogProfesionalesComponent', () => {
  let component: DialogProfesionalesComponent;
  let fixture: ComponentFixture<DialogProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
