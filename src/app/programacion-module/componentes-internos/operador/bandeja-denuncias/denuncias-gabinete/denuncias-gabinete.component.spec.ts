import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenunciasGabineteComponent } from './denuncias-gabinete.component';

describe('DenunciasGabineteComponent', () => {
  let component: DenunciasGabineteComponent;
  let fixture: ComponentFixture<DenunciasGabineteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DenunciasGabineteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DenunciasGabineteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
