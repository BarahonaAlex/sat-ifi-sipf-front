import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBandejaDenunciaComponent } from './detalle-bandeja-denuncia.component';

describe('DetalleBandejaDenunciaComponent', () => {
  let component: DetalleBandejaDenunciaComponent;
  let fixture: ComponentFixture<DetalleBandejaDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleBandejaDenunciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBandejaDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
