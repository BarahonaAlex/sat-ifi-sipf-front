import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaConsultaMasivoComponent } from './bandeja-consulta-masivo.component';

describe('BandejaConsultaMasivoComponent', () => {
  let component: BandejaConsultaMasivoComponent;
  let fixture: ComponentFixture<BandejaConsultaMasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaConsultaMasivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaConsultaMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
