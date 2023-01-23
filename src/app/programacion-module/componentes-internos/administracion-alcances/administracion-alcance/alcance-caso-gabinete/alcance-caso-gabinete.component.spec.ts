import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcanceCasoGabineteComponent } from './alcance-caso-gabinete.component';

describe('AlcanceCasoGabineteComponent', () => {
  let component: AlcanceCasoGabineteComponent;
  let fixture: ComponentFixture<AlcanceCasoGabineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcanceCasoGabineteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcanceCasoGabineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
