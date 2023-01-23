import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaImportacionExportacionComponent } from './consulta-importacion-exportacion.component';

describe('ConsultaImportacionExportacionComponent', () => {
  let component: ConsultaImportacionExportacionComponent;
  let fixture: ComponentFixture<ConsultaImportacionExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaImportacionExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaImportacionExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
