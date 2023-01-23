import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsisteLibrosComponent } from './asiste-libros.component';

describe('AsisteLibrosComponent', () => {
  let component: AsisteLibrosComponent;
  let fixture: ComponentFixture<AsisteLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsisteLibrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisteLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
