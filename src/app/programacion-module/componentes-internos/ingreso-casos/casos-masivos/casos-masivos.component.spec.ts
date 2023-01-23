import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosMasivosComponent } from './casos-masivos.component';

describe('CasosMasivosComponent', () => {
  let component: CasosMasivosComponent;
  let fixture: ComponentFixture<CasosMasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasosMasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasosMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
