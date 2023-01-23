import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcancePuntosFijosComponent } from './alcance-puntos-fijos.component';

describe('AlcancePuntosFijosComponent', () => {
  let component: AlcancePuntosFijosComponent;
  let fixture: ComponentFixture<AlcancePuntosFijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcancePuntosFijosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcancePuntosFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
