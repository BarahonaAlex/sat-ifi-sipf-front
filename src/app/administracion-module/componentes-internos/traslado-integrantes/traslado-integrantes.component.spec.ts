import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladoIntegrantesComponent } from './traslado-integrantes.component';

describe('TrasladoIntegrantesComponent', () => {
  let component: TrasladoIntegrantesComponent;
  let fixture: ComponentFixture<TrasladoIntegrantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrasladoIntegrantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasladoIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
