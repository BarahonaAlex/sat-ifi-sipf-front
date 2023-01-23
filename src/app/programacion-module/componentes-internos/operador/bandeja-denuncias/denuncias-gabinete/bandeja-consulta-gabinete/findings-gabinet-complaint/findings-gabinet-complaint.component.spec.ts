import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsGabinetComplaintComponent } from './findings-gabinet-complaint.component';

describe('FindingsGabinetComplaintComponent', () => {
  let component: FindingsGabinetComplaintComponent;
  let fixture: ComponentFixture<FindingsGabinetComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsGabinetComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsGabinetComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
