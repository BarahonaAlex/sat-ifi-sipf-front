import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcanceDenunciaComponent } from './alcance-denuncia.component';

describe('AlcanceDenunciaComponent', () => {
  let component: AlcanceDenunciaComponent;
  let fixture: ComponentFixture<AlcanceDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcanceDenunciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcanceDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
