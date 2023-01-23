import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionAlcanceAprobadorComponent } from './revision-alcance-aprobador.component';

describe('RevisionAlcanceAprobadorComponent', () => {
  let component: RevisionAlcanceAprobadorComponent;
  let fixture: ComponentFixture<RevisionAlcanceAprobadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionAlcanceAprobadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionAlcanceAprobadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
