import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEfaComponent } from './consulta-efa.component';

describe('ConsultaEfaComponent', () => {
  let component: ConsultaEfaComponent;
  let fixture: ComponentFixture<ConsultaEfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEfaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
