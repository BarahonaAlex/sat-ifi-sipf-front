import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaPosterioriAduanasComponent } from './auditoria-posteriori-aduanas.component';

describe('AuditoriaPosterioriAduanasComponent', () => {
  let component: AuditoriaPosterioriAduanasComponent;
  let fixture: ComponentFixture<AuditoriaPosterioriAduanasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaPosterioriAduanasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaPosterioriAduanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
