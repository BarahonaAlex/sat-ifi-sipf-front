import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaAlcanceMasivoComponent } from './bandeja-alcance-masivo.component';

describe('BandejaAlcanceMasivoComponent', () => {
  let component: BandejaAlcanceMasivoComponent;
  let fixture: ComponentFixture<BandejaAlcanceMasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaAlcanceMasivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaAlcanceMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
