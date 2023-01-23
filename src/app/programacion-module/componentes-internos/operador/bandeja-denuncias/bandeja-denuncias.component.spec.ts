import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDenunciasComponent } from './bandeja-denuncias.component';

describe('BandejaDenunciasComponent', () => {
  let component: BandejaDenunciasComponent;
  let fixture: ComponentFixture<BandejaDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaDenunciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
