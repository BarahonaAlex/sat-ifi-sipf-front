import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcanceGabineteComponent } from './alcance-gabinete.component';

describe('AlcanceGabineteComponent', () => {
  let component: AlcanceGabineteComponent;
  let fixture: ComponentFixture<AlcanceGabineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlcanceGabineteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlcanceGabineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
