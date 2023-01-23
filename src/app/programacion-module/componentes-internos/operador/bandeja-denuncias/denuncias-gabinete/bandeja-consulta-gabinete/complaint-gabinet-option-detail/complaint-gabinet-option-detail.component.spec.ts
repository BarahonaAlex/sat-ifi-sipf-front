import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintGabinetOptionDetailComponent } from './complaint-gabinet-option-detail.component';

describe('ComplaintGabinetOptionDetailComponent', () => {
  let component: ComplaintGabinetOptionDetailComponent;
  let fixture: ComponentFixture<ComplaintGabinetOptionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintGabinetOptionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintGabinetOptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
