import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetenIVAComponent } from './reten-iva.component';

describe('RetenIVAComponent', () => {
  let component: RetenIVAComponent;
  let fixture: ComponentFixture<RetenIVAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetenIVAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetenIVAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
