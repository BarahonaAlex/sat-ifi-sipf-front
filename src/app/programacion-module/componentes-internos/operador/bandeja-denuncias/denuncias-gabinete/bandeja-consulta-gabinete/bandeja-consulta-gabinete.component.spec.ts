import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaConsultaGabineteComponent } from './bandeja-consulta-gabinete.component';

describe('BandejaConsultaGabineteComponent', () => {
  let component: BandejaConsultaGabineteComponent;
  let fixture: ComponentFixture<BandejaConsultaGabineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaConsultaGabineteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaConsultaGabineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
