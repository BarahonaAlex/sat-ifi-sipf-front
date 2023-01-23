import { Component, Injector, NgZone, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PlantillaDocumentosService } from 'src/app/general-module/componentes-comunes/servicios/plantillas-documentos.service';
import { PlantillasDocumentosInterface } from 'src/app/general-module/componentes-comunes/interfaces/plantillas-documentos.interface';
import { ThrowStmt } from '@angular/compiler';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { Item, ManageableCatalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { Button, CustomNode, Dropdown, FormListener, FormStructure, Input, OptionChild } from 'mat-dynamic-form';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-administracion-plantillas',
  templateUrl: './administracion-plantillas.component.html',
  styleUrls: ['./administracion-plantillas.component.css']
})
export class AdministracionPlantillasComponent implements AfterViewInit, OnInit {

  @ViewChild('tabGroup', { static: true }) public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;

  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.dataSource.paginator = mp1;
  }

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }

  public chargeTab() {
    if (this.activeTabIndex == undefined) {
      this.activeTabIndex = 0;
    }
    this.header = ('<div><img src="https://alfresco.desa.sat.gob.gt/rtu/app/assets/img/sat-logo.png" alt="" width="200" height="67"></div><div style="text-align: center;" class="mceNonEditable"><strong>{titulo}</strong></div><div style="text-align: left;"><strong>Contribuyente:</strong> {nombre}<br><strong>NIT:</strong> {nit}<br><strong>Periodo:</strong> DEL {periodoInicio} AL {periodoFin}<br><strong>Impuesto:</strong> {impuesto}<br><strong class="mceNonEditable">Programa:</strong> <font class="mceNonEditable">{programa}</font></div>');

    this.footer = ('<p style="text-align: right;"><strong>{usuario}{fecha}</strong></p>');
  }

  public chargeTabNew() {
    if (this.activeTabIndex == undefined) {
      this.activeTabIndex = 0;
    }
    this.header = ('');
    this.footer = ('');
  }

  @ViewChild('editorHeader') editorHeader!: EditorComponent;
  @ViewChild('editorFooter') editorFooter!: EditorComponent;

  plantillas2!: PlantillasDocumentosInterface.PlantillasDocumentos[];
  plantillas: PlantillasDocumentosInterface.PlantillasDocumentos = {};
  searchFormGroup!: FormGroup;
  generalFormGroup!: FormGroup;

  listCatalogo!: Catalog[];

  selection = new SelectionModel<PlantillasDocumentosInterface.PlantillasDocumentos>(true, []);
  header!: string;
  footer!: string;
  editor = false;
  showNew = false;
  showTable = true;
  fontInicio!: string;
  fontFin!: string;
  variable!: string;
  catalogos?: Item[];
  catFatherInfo!: ManageableCatalog[];
  formStructure!: FormStructure;
  catDato: string = "";
  nombrePadre: string = "vacio";
  variablesPermitidas: string[] = [];
  variablesIngresadas: string[] = [];
  splitArray: string[] = [];
  varEditor: string[] = [];

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'documento',
    'fecha',
    'acciones'];

  constructor(private cd: ChangeDetectorRef,
    private catalogoService: CatalogosService,
    private plantillasDocumentosService: PlantillaDocumentosService,
    private dialog: DialogService) {
    this.searchFormGroup = new FormGroup({
      datosContribuyente: new FormControl(''),
      datosCaso: new FormControl(''),
      datosGeneral: new FormControl(''),
      impuestos: new FormControl(''),
      catalogo: new FormControl(''),



    });


    this.generalFormGroup = new FormGroup({
      nombre: new FormControl(''),
      catalogos: new FormControl(''),

      encabezado: new FormControl(''),

      piePagina: new FormControl(''),
    });
  }



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
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image quicktable table",
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };

  
  async ngOnInit(): Promise<void> {

    this.cargarDatos();
    this.header = ('<div><img src="https://alfresco.desa.sat.gob.gt/rtu/app/assets/img/sat-logo.png" alt="" width="200" height="67"></div><div style="text-align: center;" class="mceNonEditable"><strong>{titulo}</strong></div><div style="text-align: left;"><strong>Contribuyente:</strong> {nombre}<br><strong>NIT:</strong> {nit}<br><strong>Periodo:</strong> DEL {periodoInicio} AL {periodoFin}<br><strong>Impuesto:</strong> {impuesto}<br><strong>Programa:</strong> {programa}</div>');

    this.footer = ('<p style="text-align: right;"><strong>{usuario}{fecha}</strong></p>');


  }
  public ngAfterViewInit() {
    this.cd.detectChanges();
    this.header = ('<div><img src="https://alfresco.desa.sat.gob.gt/rtu/app/assets/img/sat-logo.png" alt="" width="200" height="67"></div><div style="text-align: center;" class="mceNonEditable"><strong>{titulo}</strong></div><div style="text-align: left;"><strong>Contribuyente:</strong> {nombre}<br><strong>NIT:</strong> {nit}<br><strong>Periodo:</strong> DEL {periodoInicio} AL {periodoFin}<br><strong>Impuesto:</strong> {impuesto}<br><strong>Programa:</strong> {programa}</div>');

    this.footer = ('<p style="text-align: right;"><strong>{usuario}{fecha}</strong></p>');
  }

  async cargarDatos(){
    this.dataSource.data = await this.plantillasDocumentosService.getAllTemplates().toPromise();
  }

  editar() {
    this.editor = true;
    this.showTable = false;
    this.showNew = false;
  }
 
  nuevo() {
    this.showNew = true;
    this.editor = false;
    this.showTable = false;
  }
  cancel() {
    this.showNew = false;
    this.editor = false;
    this.showTable = true;
    this.activeTabIndex == undefined;
  }



  validateTextH() {
    const text = this.editorHeader.editor.getContent();
    const matches = text.match(/{([^}]*)}/g);
    this.variablesIngresadas = matches;

    if (matches) {
      console.log(this.variablesIngresadas);
      console.log(this.variablesPermitidas)
    }
    if(this.variablesIngresadas != null){

    this.varEditor = matches;
    this.varEditor.forEach(pp => {

      if (this.variablesPermitidas.includes(pp)) {
        console.log("correcto " + pp);
      } else {
        console.log("no existe: " + pp);

      }

    })
    console.log(this.header);
   }
   this.header = (this.editorHeader.editor.getContent());
  }

  validateTextF() {
    this.footer = (this.editorFooter.editor.getContent());
  }

  async modificar(pPlantilla: PlantillasDocumentosInterface.PlantillasDocumentos): Promise<void> {
    this.showNew = true;
    this.editor = false;
    this.showTable = false;
    this.buscarPlantilla(pPlantilla);
  }

  buscarPlantilla(pPlantilla: PlantillasDocumentosInterface.PlantillasDocumentos): void {
    this.plantillas.idPlantilla = pPlantilla.idPlantilla;
    this.generalFormGroup.patchValue(pPlantilla);
    this.activeTabIndex = undefined;

    this.formStructure = new FormStructure();
    this.formStructure.nodes = [
    ];
    this.formStructure.validateActions = [];
    const dbCatalogos = pPlantilla.catalogos!;
    const listCatalogo = dbCatalogos.split(',');
    this.splitArray = listCatalogo;

    this.formStructure.nodes = listCatalogo.map(nodo => {

      return new Dropdown("id" + nodo, "catalogo" + this.nombrePadre).apply({
        action: {
          type: "valueChange", onEvent: (element) => {

            this.fontInicio = '<font class="mceNonEditable">';
            this.fontFin = '</font>';
            this.variable = this.fontInicio + element.event + this.fontFin;
            if (this.activeTabIndex == 0) {
              this.editorHeader.editor.execCommand('mceInsertContent', false, this.variable);
            }
            if (this.activeTabIndex == 1) {
              this.editorFooter.editor.execCommand('mceInsertContent', false, this.variable);
            }

          

          }
        }
      })
    })

    


    listCatalogo.forEach(catalog => {
      this.catalogoService.getCatSonAdmin(parseInt(catalog)).toPromise().then(res => {
        console.log(res);
        this.formStructure.getNodeById("id" + catalog).placeholder = res[0].nombrePadre

        this.formStructure.getNodeById("id" + catalog).value = res.map((s: Item) => new OptionChild(s.nombre, s.descripcion))
        this.variablesPermitidas = res.map((w: Item) => {
          return w.descripcion;
        });

      })
    })


  }

  prueba() {
    this.editorHeader.editor.execCommand('mceInsertContent', false, this.catDato);
  }


  public chargeTabEdit() {
    if (this.activeTabIndex == undefined) {
      this.activeTabIndex = 0;
      this.header = this.generalFormGroup.controls.encabezado.value;
      this.footer = this.generalFormGroup.controls.piePagina.value;
    }
  }

  llenarPlantillaData(): PlantillasDocumentosInterface.PlantillasDocumentos {
    this.plantillas.catalogos = "";
    this.plantillas.encabezado = this.header;
    this.plantillas.fechaModifica = "2022-02-02";
    this.plantillas.ipModificia = "10.0.1.1";
    this.plantillas.nombre = this.generalFormGroup.controls.nombre.value;
    this.plantillas.piePagina = this.footer;
    this.plantillas.usuarioModifica = "usuario";
    this.plantillas.varibalesPermitidas = this.variablesPermitidas;
    this.plantillas.varibalesIngresadas = this.variablesIngresadas;

    return this.plantillas;
  }

  async guardar(): Promise<void> {
    this.dialog.show({
      icon: 'question',
      title: 'IFI-100',
      text: '¿Desea crear la plantilla?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        let plant: PlantillasDocumentosInterface.PlantillasDocumentos;
        plant = this.llenarPlantillaData();
        this.plantillasDocumentosService.postPlantilla(plant).toPromise().then(
          programaReturn => {
            this.cancel();

            this.dialog.showSnackBar({
              icon: 'success',
              title: 'IFI-200',
              text: `Se han creado la plantilla`,
              duration: 3000
            });

          }
        );
      }
    });
  }

  async actualizar(): Promise<void> {
    this.dialog.show({
      icon: 'question',
      title: 'IFI-100',
      text: '¿Desea editar la plantilla?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        let plantilla: PlantillasDocumentosInterface.PlantillasDocumentos;
        plantilla = this.llenarPlantillaData();
        this.plantillasDocumentosService.putPlantilla(plantilla.idPlantilla, plantilla).toPromise().then(
          programaReturn => {
            this.cancel();

            this.dialog.showSnackBar({
              icon: 'success',
              title: 'IFI-200',
              text: `Se han actualizado la plantilla`,
              duration: 3000
            });

            this.cargarDatos();
          }
        );
      }
    });
  }

}
