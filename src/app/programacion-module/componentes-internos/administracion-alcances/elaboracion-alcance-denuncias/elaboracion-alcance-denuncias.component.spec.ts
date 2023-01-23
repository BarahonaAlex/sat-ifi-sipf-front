import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionAlcanceDenunciasComponent } from './elaboracion-alcance-denuncias.component';

describe('ElaboracionAlcanceDenunciasComponent', () => {
  let component: ElaboracionAlcanceDenunciasComponent;
  let fixture: ComponentFixture<ElaboracionAlcanceDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElaboracionAlcanceDenunciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboracionAlcanceDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
