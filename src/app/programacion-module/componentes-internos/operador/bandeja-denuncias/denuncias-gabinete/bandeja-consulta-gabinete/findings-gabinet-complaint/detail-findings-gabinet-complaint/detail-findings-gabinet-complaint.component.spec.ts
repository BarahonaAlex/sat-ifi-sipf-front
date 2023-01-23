import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFindingsGabinetComplaintComponent } from './detail-findings-gabinet-complaint.component';

describe('DetailFindingsGabinetComplaintComponent', () => {
  let component: DetailFindingsGabinetComplaintComponent;
  let fixture: ComponentFixture<DetailFindingsGabinetComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFindingsGabinetComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFindingsGabinetComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
