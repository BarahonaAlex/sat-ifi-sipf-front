import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionCatalogosComponent } from './administracion-catalogos.component';

describe('AdministracionCatalogosComponent', () => {
  let component: AdministracionCatalogosComponent;
  let fixture: ComponentFixture<AdministracionCatalogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionCatalogosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionCatalogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
