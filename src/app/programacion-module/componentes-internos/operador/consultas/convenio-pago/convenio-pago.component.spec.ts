import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioPagoComponent } from './convenio-pago.component';

describe('ConvenioPagoComponent', () => {
  let component: ConvenioPagoComponent;
  let fixture: ComponentFixture<ConvenioPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvenioPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenioPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
