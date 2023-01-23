import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminitracionDocumentosComponent } from './adminitracion-documentos.component';

describe('AdminitracionDocumentosComponent', () => {
  let component: AdminitracionDocumentosComponent;
  let fixture: ComponentFixture<AdminitracionDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminitracionDocumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminitracionDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
