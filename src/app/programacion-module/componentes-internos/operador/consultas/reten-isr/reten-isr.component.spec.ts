import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetenIsrComponent } from './reten-isr.component';

describe('RetenIsrComponent', () => {
  let component: RetenIsrComponent;
  let fixture: ComponentFixture<RetenIsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetenIsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetenIsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
