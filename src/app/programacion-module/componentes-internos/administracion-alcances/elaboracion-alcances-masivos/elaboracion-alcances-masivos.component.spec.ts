import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionAlcancesMasivosComponent } from './elaboracion-alcances-masivos.component';

describe('ElaboracionAlcancesMasivosComponent', () => {
  let component: ElaboracionAlcancesMasivosComponent;
  let fixture: ComponentFixture<ElaboracionAlcancesMasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionAlcancesMasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboracionAlcancesMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
