import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGeneralAlcanceComponent } from './reporte-general-alcance.component';

describe('ReporteGeneralAlcanceComponent', () => {
  let component: ReporteGeneralAlcanceComponent;
  let fixture: ComponentFixture<ReporteGeneralAlcanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteGeneralAlcanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGeneralAlcanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
