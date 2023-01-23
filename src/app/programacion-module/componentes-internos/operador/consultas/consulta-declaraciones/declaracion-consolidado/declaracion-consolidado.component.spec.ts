import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionConsolidadoComponent } from './declaracion-consolidado.component';

describe('DeclaracionConsolidadoComponent', () => {
  let component: DeclaracionConsolidadoComponent;
  let fixture: ComponentFixture<DeclaracionConsolidadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclaracionConsolidadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclaracionConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
