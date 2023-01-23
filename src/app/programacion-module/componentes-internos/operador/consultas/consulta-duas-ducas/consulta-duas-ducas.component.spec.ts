import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDuasDucasComponent } from './consulta-duas-ducas.component';

describe('ConsultaDuasDucasComponent', () => {
  let component: ConsultaDuasDucasComponent;
  let fixture: ComponentFixture<ConsultaDuasDucasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDuasDucasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDuasDucasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
