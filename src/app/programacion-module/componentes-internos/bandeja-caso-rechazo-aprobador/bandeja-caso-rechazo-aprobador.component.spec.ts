import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCasoRechazoAprobadorComponent } from './bandeja-caso-rechazo-aprobador.component';

describe('BandejaCasoRechazoAprobadorComponent', () => {
  let component: BandejaCasoRechazoAprobadorComponent;
  let fixture: ComponentFixture<BandejaCasoRechazoAprobadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCasoRechazoAprobadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaCasoRechazoAprobadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
