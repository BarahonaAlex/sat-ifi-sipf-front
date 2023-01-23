import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintGabinetOptionQueryComponent } from './complaint-gabinet-option-query.component';

describe('ComplaintGabinetOptionQueryComponent', () => {
  let component: ComplaintGabinetOptionQueryComponent;
  let fixture: ComponentFixture<ComplaintGabinetOptionQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintGabinetOptionQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintGabinetOptionQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
