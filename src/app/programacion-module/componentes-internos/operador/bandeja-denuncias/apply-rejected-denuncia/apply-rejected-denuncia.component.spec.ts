import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyRejectedDenunciaComponent } from './apply-rejected-denuncia.component';

describe('ApplyRejectedDenunciaComponent', () => {
  let component: ApplyRejectedDenunciaComponent;
  let fixture: ComponentFixture<ApplyRejectedDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyRejectedDenunciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyRejectedDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
