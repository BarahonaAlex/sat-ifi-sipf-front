import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosContablesRegimenElectronicoComponent } from './libros-contables-regimen-electronico.component';

describe('LibrosContablesRegimenElectronicoComponent', () => {
  let component: LibrosContablesRegimenElectronicoComponent;
  let fixture: ComponentFixture<LibrosContablesRegimenElectronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrosContablesRegimenElectronicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosContablesRegimenElectronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
