import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcaptchaComponent } from './hcaptcha.component';

describe('HcaptchaComponent', () => {
  let component: HcaptchaComponent;
  let fixture: ComponentFixture<HcaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcaptchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HcaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
