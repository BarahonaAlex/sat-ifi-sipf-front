import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionAlcanceComponent } from './elaboracion-alcance.component';

describe('ElaboracionAlcanceComponent', () => {
  let component: ElaboracionAlcanceComponent;
  let fixture: ComponentFixture<ElaboracionAlcanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionAlcanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboracionAlcanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
