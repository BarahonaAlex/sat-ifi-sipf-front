import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FindingDetail, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  control!: FormControl;
  idCase!: string;
  initialValue?: FindingDetail;
  viewing = false;

  @ViewChild('editor') editor!: EditorComponent;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['check', 'no', 'impuesto', 'seccion', 'subseccion', 'rubro'];
  selection = new SelectionModel<Topic>(true, []);
  dataSource = new MatTableDataSource<Topic>();

  options = {
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help charmap emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit insert format table',
    toolbar: 'undo redo | bold italic underline strikethrough | formatselect fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen preview print | charmap image table',
    toolbar_sticky: true,
    content_style: '* { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; }',
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    resize: false,
    importcss_append: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.style.display = 'none';
      if (meta.filetype === 'image') {
        input.accept = 'image/*';
      } else if (meta.filetype === 'media') {
        input.accept = 'video/*';
      } else input.accept = '*/*';
      input.onchange = (event: Event) => {

        // Crear ruta pre-firmada para el archivo desde S3
        const file = (event.target as HTMLInputElement).files?.item(0);
        this.gestorService.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.ngZone)
          errorHandler.handleError(error)
        })
      }
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image quicktable table",
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };

  constructor(
    private catalog: CatalogosService,
    private gestorService: GestorService,
    private injector: Injector,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.selection.changed.subscribe(() => {
      const value = this.control.value;
      value.selection = this.selection.selected.map(item => item.id);
      this.control.setValue(value);
    });

    this.control.valueChanges.subscribe((value) => {
      if (value.selection.length > 0 && value.description.length > 0) {
        this.control.setErrors(null);
      } else {
        this.control.setErrors({ required: true });
      }
    })

    this.control.setValue({ selection: [], description: this.initialValue?.descripcion ?? '' });
    this.catalog.getFindingsItems().toPromise().then(res => {
      this.dataSource.data = res;

      if (this.initialValue) {
        if(this.initialValue.rubros){
          this.initialValue.rubros.forEach(item => {
            const row = this.dataSource.data.find(row => row.id === item.id);
            if (row) {
              this.selection.select(row);
            }
          });
        }

        if (this.viewing) {
          this.editor.editor.mode.set('readonly');
          const toolbar = this.editor?.editor?.getContainer()?.querySelector('.tox-editor-header');
          if (toolbar) {
            toolbar.style.display = 'none';
          }
        }
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  validateText() {
    const value = this.control.value;
    console.log(this.control.value);
    value.description = this.editor.editor.getContent();
    this.control.setValue(value);
  }
}