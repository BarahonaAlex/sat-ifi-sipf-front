import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Injector, NgZone, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FormStructure, Input, Button, TextArea, CustomNode, Dropdown, OptionChild } from 'mat-dynamic-form';
import { element } from 'protractor';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { ManageableCatalog, CreateItem, EditItem, Item, Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CollaboratorResponse } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';

@Component({
  selector: 'app-administracion-catalogos',
  templateUrl: './administracion-catalogos.component.html',
  styleUrls: ['./administracion-catalogos.component.css']
})
/**
* @description Componente para la administracion de catalogos
* @author ajsbatzmo (Jamier Batz)
* @since 17/06/2022
*/
export class AdministracionCatalogosComponent implements OnInit {

  //*******Tabla Catalogos Padres****** */
  dataTableFather = new MatTableDataSource();
  displayedColumns: string[] = ['catalogo', 'descripcion', 'acciones'];
  mostrarTablaPadre = true;

  //*******Tabla Catalogos Hijos****** */
  dataTableSon = new MatTableDataSource();
  displayedColumnsSon: string[] = ['No.', 'catalogo', 'descripcion', 'estado', 'accion'];
  mostrarTablaHijo = false;

  saveCatFatherInfo!: ManageableCatalog[];
  generalFormGroup!: FormGroup;
  idCatalog!: number;
  structure!: FormStructure;
  validateActionsDefault: Button[] = [];
  nameCatalog: string = "Catálogos Administrables";
  itemCatalog!: Item;
  formStructure!: FormStructure;
  element?: CollaboratorResponse;
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
        this.gestorService.uploadToS3(`${this.nameCatalog}/${createUID()}`, file as Blob).toPromise().then(res => {
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


  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.dataTableFather.paginator = mp1;
  }

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.dataTableSon.paginator = mp2;
  }

  constructor(
    private servicio: CatalogosService,
    private dialogService: DialogService,
    private gestorService: GestorService,
    private injector: Injector,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private catalogService: CatalogosService
  ) { }

  ngOnInit(): void {
    this.generalFormGroup = new FormGroup({
      nombreCatalogo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });

    this.getManageableCatalog();
  }

  /**
 * @description Metodo para mostrar catalogos padres administrables
 * @author ajsbatzmo (Jamier Batz)
 * @since 17/06/2022
 */
  getManageableCatalog() {
    setTimeout(() => {
      this.servicio.getManageableCatalog().toPromise().then(res => {
        this.dataTableFather.data = res;
        this.saveCatFatherInfo = res;
      })
    });
  }

  /**
* @description Metodo para mostrar items hijos en base a id de padre
* @author ajsbatzmo (Jamier Batz)
* @since 17/06/2022
*/
  getItemSonById(id: number, name?: string) {
    this.idCatalog = id;
    this.servicio.getCatSonAdmin(id).toPromise().then(res => {
      this.dataTableSon.data = res;
      this.mostrarTablaPadre = false;
      this.mostrarTablaHijo = true;
      this.nameCatalog = name ?? this.nameCatalog;
    })
  }

  /**
* @description Metodo para remover un item
* @author ajsbatzmo (Jamier Batz)
* @since 17/06/2022
*/
  removeItemSon(id: number) {
    this.dialogService.show({
      title: 'Confirmación',
      text: `¿Está seguro que desea remover este ítem?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(async result => {
      if (result !== 'primary') return;
      await this.servicio.updateStatusCatalogSon(id).toPromise().then(res => {
        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Ítem removido exitosamente`,
          icon: 'success',
          duration: 3000
        })
      })
      this.getItemSonById(this.idCatalog);
    });
  }

  /**
* @description //Metodo neceario para ejecutar el Callback en el structure, espesificamente en los botones
*/
  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  /**
 * @description Metodo para mostrar estructura de creacion de un item
 * @author ajsbatzmo (Jamier Batz)
 * @since 17/06/2022
 */
  createItemSon() {
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('nameItem', 'Nombre').apply({
          singleLine: true, minCharCount: 1, maxCharCount: 50
        }),
        new CustomNode<RichTextComponent>('descripItem', RichTextComponent, {
          options: this.options,
          label: 'Descripción: ',
          outputFormat: "html"
        }).apply({
          singleLine: true,
          placeholder: 'Descripción',
        }),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.dialogService.show({
      title: `Agregar Ítem`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    })
  }

  /**
 * @description Metodo para mostrar estructura de edicion un item
 * @author ajsbatzmo (Jamier Batz)
 * @since 17/06/2022
 */
  editCatalogSon(item: Item) {
    this.itemCatalog = item
    console.log(item);
    console.log("item");
    console.log(item.estado);
    item.estado = (item.estado == 'ACTIVO') ? '1' : '2'
    let selectedState = item.estado;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('nombre', 'Nuevo nombre', item.nombre).apply({
          singleLine: true, minCharCount: 1, maxCharCount: 50
        }),
        new Dropdown('state', 'Estado', [
          new OptionChild('ACTIVO', '1'),
          new OptionChild('INACTIVO', '2')
        ]).apply({
          selectedValue: item.estado,//item.estado
          action: {
            type: "valueChange", onEvent: (element) => {
              console.log(element)
              selectedState = element.event
            }
          },
          disabled: false
        }),
        new CustomNode<RichTextComponent>('descripcion', RichTextComponent, {
          options: this.options,
          outputFormat: "html",
          label: 'Nueva descripción',
          initialValue: item.descripcion
        }).apply({
          singleLine: true
        }),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn',

          onEvent: () =>{ item.estado = (item.estado == '1') ? 'ACTIVO' : 'INACTIVO'
          this.dialogService.close('cancel')}



        }).apply({
          icon: 'close'
        }),
        new Button('edit', 'Guardar', {
          callback: this,style: 'primary', onEvent: () =>
            this.editItem(!selectedState.match(item.estado) ? true : false)
        }).apply({
          validateForm: true,
          icon: 'save'
        }),

      ]
    });




    this.dialogService.show({
      title: `Editar Ítem`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    })
  }

  /**
* @description metodo neceasrio onClick implementado en structure, sirve para ejecutar las funciones del structure
*/
  onClick(actionId: string): void {
    if (actionId == 'save') {

      let componentNames: string[];
      componentNames = ['descripItem', 'nameItem'];

      let errors = false;
      componentNames.forEach(item => {
        if (this.structure.getControlById(item)?.value.trim().length === 0) {
          this.structure.getFormGroup().get(item)?.setValue(null);
          this.structure.getFormGroup().get(item)?.updateValueAndValidity();
          this.structure.getFormGroup().get(item)?.markAsTouched();
          this.structure.getFormGroup().updateValueAndValidity();
          errors = true;

        }
      });


      if (errors) {

        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Existen campos requeridos vacíos, favor revisar.`,
          icon: 'warning',
          duration: 3000
        })
        return;
      }
      else {

        this.createItem()//se ejecuta la funcion de crear item
        this.dialogService.close('primary');
      }


    }
    else if (actionId == 'edit') {


      let componentNames: string[];
      componentNames = ['descripcion', 'nombre', 'estado'];

      let errors = false;
      componentNames.forEach(item => {
        if (this.structure.getControlById(item)?.value.trim().length === 0) {
          this.structure.getFormGroup().get(item)?.setValue(null);
          this.structure.getFormGroup().get(item)?.updateValueAndValidity();
          this.structure.getFormGroup().get(item)?.markAsTouched();
          this.structure.getFormGroup().updateValueAndValidity();
          errors = true;

        }
      });


      if (errors) {

        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Existen campos requeridos vacíos, favor revisar.`,
          icon: 'warning',
          duration: 3000
        })
        return;
      }
      else {
        this.dialogService.close('primary');
      }
    }
    else if (actionId == 'cancelar') {
      this.dialogService.close('cancel');
    } else {
      this.dialogService.close('cancel');
    }
  }

  /**
* @description Metodo crear un item
* @author ajsbatzmo (Jamier Batz)
* @since 17/06/2022
*/
  createItem() {
    const createItem: CreateItem = {
      codigoCatalogo: this.idCatalog,
      descripcion: this.structure.getControlById('descripItem')?.value,
      nombre: this.structure.getControlById('nameItem')?.value
    }
    if (createItem.nombre != "" && createItem.descripcion != "") {
      this.servicio.saveCatalogSon(createItem).toPromise().then(res => {
        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Ítem agregado exitosamente`,
          icon: 'success',
          duration: 3000
        })
        this.getItemSonById(this.idCatalog);
      })
    } else {
      this.dialogService.show({
        title: 'Campos vacios!',
        text: `Por favor ingrese la informacion que se le solicita`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: true
      })
    }
  }

  /**
* @description Metodo para editar un item
* @author ajsbatzmo (Jamier Batz)
* @since 17/06/2022
*/
  editItem(isChange: boolean) {
    console.log(isChange ? 'si cambio' : 'nel :(')
    const updateCat: EditItem = {
      descripcion: this.structure.getControlById('descripcion')?.value,
      nombre: this.structure.getControlById('nombre')?.value,
      isChangeState: isChange
    }
    if (updateCat.nombre != "" && updateCat.descripcion != "") {
      this.servicio.updateCatalogSon(this.itemCatalog.codigo, updateCat).toPromise().then(res => {
        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Ítem editado exitosamente`,
          icon: 'success',
          duration: 3000
        })
        this.getItemSonById(this.idCatalog);
      })
    } else {
      this.dialogService.show({
        title: 'Campos vacios!',
        text: `Por favor ingrese la informacion que se le solicita`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: true
      })
    }
  }

  /**
 * @description Metodo para retornar a la tabla donde se muestran los catalogs padres
 * @author ajsbatzmo (Jamier Batz)
 * @since 17/06/2022
 */
  returnMaster() {
    this.ngOnInit();
    this.mostrarTablaPadre = true;
    this.mostrarTablaHijo = false;
    this.nameCatalog = "Administración de Catálogos";
  }

  /**
 * @description Metodo filtrar catalogos padres
 * @author ajsbatzmo (Jamier Batz)
 * @since 24/06/2022
 */
  catalogSearchFilter(event: Event) {
    this.dataTableFather.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  /**
* @description Metodo para filtrar items
* @author ajsbatzmo (Jamier Batz)
* @since 24/06/2022
*/
  itemSearchFilter(event: Event) {
    this.dataTableSon.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  /**
* @description Metodo para filtrar items
* @author ajsbatzmo (Jamier Batz)
* @since 24/06/2022
*/
  getCatalogName(name: string) {
    this.nameCatalog = name;
  }

  /**
   * @description Metodo para sanitizar el html antes de incrustarlo en en pantalla.
   * @param html {string} con el html a sanitizar
   * @returns {SafeResourceUrl} con el html sanitizado
   * @author crramosl (Carlos Ramos)
   */
  sanitizeHtml(html: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
