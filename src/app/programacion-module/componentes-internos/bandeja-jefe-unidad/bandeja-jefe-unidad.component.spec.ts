import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaJefeUnidadComponent } from './bandeja-jefe-unidad.component';

describe('BandejaJefeUnidadComponent', () => {
  let component: BandejaJefeUnidadComponent;
  let fixture: ComponentFixture<BandejaJefeUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaJefeUnidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaJefeUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
