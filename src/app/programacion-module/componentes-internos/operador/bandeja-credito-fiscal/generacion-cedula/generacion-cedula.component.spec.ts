import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionCedulaComponent } from './generacion-cedula.component';

describe('GeneracionCedulaComponent', () => {
  let component: GeneracionCedulaComponent;
  let fixture: ComponentFixture<GeneracionCedulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionCedulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionCedulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
