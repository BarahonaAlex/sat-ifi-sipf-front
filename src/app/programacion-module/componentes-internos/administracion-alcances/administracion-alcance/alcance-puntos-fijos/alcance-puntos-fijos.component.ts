import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Button,
  CustomNode,
  FormStructure,
  Input,
  TextArea,
} from 'mat-dynamic-form';
import {
  alcanceDetalle,
  docPdf,
  listaAlcances,
} from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import {
  Catalog,
  Item,
} from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import {
  AlcanceDenuncia,
  Gerencias,
  ProcesosMasivos,
} from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { DenunciaAP } from '../../elaboracion-alcance-denuncias/elaboracion-alcance-denuncias.component';
import { Input as InputC } from '@angular/core';
import {
  CasesAlcance,
  TableScope,
} from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
@Component({
  selector: 'app-alcance-puntos-fijos',
  templateUrl: './alcance-puntos-fijos.component.html',
  styleUrls: ['./alcance-puntos-fijos.component.css'],
})
export class AlcancePuntosFijosComponent implements OnInit {
  principal: listaAlcances[] = [
    { nombre: 'DESCRIPCION', listItem: [], completed: false, id: 977 },
    { nombre: 'OBJETIVO', listItem: [], completed: false, id: 985 },
    { nombre: 'META', listItem: [], completed: false, id: 982 },
    { nombre: 'PROCEDIMIENTOS', listItem: [], completed: false, id: 983 },
    { nombre: 'REGISTROS', listItem: [], completed: false, id: 981 },
    { nombre: 'OBSERVACION', listItem: [], completed: false, id: 979 },
  ];
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }
  @ViewChild('MatItem') set matPaginatorItem(mp: MatPaginator) {
    this.dataSource10.paginator = mp;
  }
  columns = ['caso', 'acciones'];
  dataSourceDescriptionColumns = ['caso', 'acciones'];
  columns2 = ['nombre', 'desc', 'rubros'];
  columns4 = ['Nombre', 'acciones'];
  columns3 = ['Nombre'];
  columns9 = ['gerencia', 'tecnico', 'presencias', 'meta', 'acciones'];
  columns5 = ['Nombre', 'descripcion', 'acciones'];
  columns6 = ['Nombre', 'descripcion'];
  columns7 = ['Nombre', 'descripcion'];
  columns8 = ['descripcion'];
  DenunciaAprobada: string[] = [
    'seleccion',
    'correlativo',
    'nitDenunciado',
    'nitDenunciante',
    'estado',
  ];
  DenunciaA = new MatTableDataSource<DenunciaAP>();
  dataSource4 = new MatTableDataSource();
  dataSource5 = new MatTableDataSource<any>();
  dataSource6 = new MatTableDataSource<any>();
  dataSource7 = new MatTableDataSource<any>();
  dataSource8 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  dataSource10 = new MatTableDataSource<TableScope>();
  catalogosMeta!: Catalog[];
  dataSourceDescription = new MatTableDataSource<any>();
  dataSourceObEspecifico = new MatTableDataSource<string>();
  vAntecedentes: Boolean = false;
  vInconsistencias: Boolean = false;
  listProcedimientos: Item[] = [];
  vObjetivos: Boolean = false;
  vMinimos: Boolean = false;
  vGenerales: Boolean = false;
  selectHijo!: Item;
  vVista: number = 0;
  vTitulo: string = '';
  META!: string;
  denuncia!: number;
  gerencias!: Gerencias[];
  catalogos?: Item[];
  validar?: Item[] = [];
  vtextArea: string[] = [];
  select?: Item;
  selectProcess!: String;
  selectGerencia?: Item;
  selectProceso?: Item;
  vReporte: listaAlcances[] = [];
  nitContribuyente!: string;
  vOtro: Boolean = false;
  estructura!: FormStructure;
  showVisor = false;
  nodeId = '';
  catalogosEspecificos?: Item[];
  conjuntoDenuncias: string[] = [];
  estado!: number;
  documento!: Blob;
  catalogosHijo!: Catalog[];
  catalogosPadre!: Catalog[];
  idR!: number;
  idP!: number;
  tipos!: ProcesosMasivos[];
  id!: number;
  plantillaDenuncia: number = 4;
  objeto!: any;
  catalogosMetaGeneral!: Item[];
  idCaso!: number;
  correlativo!: string;
  metaAntecedentes!: Item[];
  processSelect!: FormGroup;
  TotalTableScope!: number;
  arrayProperties: { name: string; key: string }[] = [];
  selectionComplaints = new SelectionModel<DenunciaAP>(true, []);
  comentario!:any;

  @ViewChild('chekSelect') chekSelect!: MatCheckbox;
  usuario!: UserLogged;
  options = {
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help charmap emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit insert format table',
    toolbar:
      'undo redo | bold italic underline strikethrough | formatselect fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen preview print | charmap image table',
    toolbar_sticky: true,
    content_style:
      '* { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; }',
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
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
        this.gestor
          .uploadToS3(`${this.correlativo}/${createUID()}`, file as Blob)
          .toPromise()
          .then((res) => {
            callback(res.url, { title: res.key });
          })
          .catch((error) => {
            const errorHandler = new GlobalErrorHandler(
              this.injector,
              this.ngZone
            );
            errorHandler.handleError(error);
          });
      };
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    noneditable_noneditable_class: 'mceNonEditable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image quicktable table',
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };
  constructor(
    private micro: AlcancesService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private services: CasosService,
    private gestor: GestorService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private servicesD: DenunciasService,
    private microPresencias: PresenciasFiscalesService,
    private user: UserService,
    private router: Router,
    private injector: Injector,
    private ngZone: NgZone
  ) {
    this.route.paramMap.subscribe(async (params) => {
      this.idCaso = parseInt(params.get('idCaso') ?? '-1');
    });
    this.user
      .getUserLogged()
      .toPromise()
      .then((result) => {
        this.usuario = result;
      });
    this.processSelect = new FormGroup({
      proceso: new FormControl(''),
      select: new FormControl(''),
    });
  }
  async ngOnInit() {
    await this.services
      .getCaseById(this.idCaso)
      .toPromise()
      .then((result) => {
        this.Descripcion();
        this.ObjetivoE();
        this.ObjetivoG();
        this.Registros();
        this.Observaciones();
        this.getMeta();
        this.metaCatalogo();
        this.getProcedimientosAlcances();
        console.log(result)

        this.comentario = result.comentario !== null ? result.comentario.comentarios : null

        if (result.caso.idEstado == 181) {
          this.micro.getScopeSelectiva(result.caso.idAlcance).toPromise().then((res) => {
            res.masivo.forEach((x, index) => {
              if (this.principal.find((y) => y.id == x.idSeccion)) {
                if (x.idSeccion == 982) {
                  JSON.parse(x.detalle + '').forEach((z: any) => {
                    if (z != null) {
                      let i = this.principal.indexOf(
                        this.principal.find((y) => y.id == x.idSeccion)!
                      );
                      this.principal[i].completed = true;
                      if (this.isJsonString(z)) {
                        this.dataSource10.data = [JSON.parse(z)];
                      }
                    }
                  });
                } else {
                  JSON.parse(x.detalle + '').forEach((z: any) => {
                    if (z != null) {
                      let i = this.principal.indexOf(
                        this.principal.find((y) => y.id == x.idSeccion)!
                      );
                      this.principal[i].completed = true;
                    }
                  });
                }
              }
              if (x.idSeccion == 983) {
                JSON.parse(x.detalle + '').forEach((z: any) => {
                  if (z != null) {
                    let i = this.principal.indexOf(
                      this.principal.find((y) => y.id == x.idSeccion)!
                    );
                    this.principal[i].completed = true;

                    if (this.isJsonString(z)) {
                      if (JSON.parse(z).length > 0) {
                        this.listProcedimientos.push(JSON.parse(z)[0])
                        this.dataSource5.data = this.listProcedimientos
                      }

                    }
                  }
                });
              }
            });
          });
        }
      });
  }

  isJsonString(string: string) {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }
    return true;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.principal, event.previousIndex, event.currentIndex);
  }
  getSelectProcess(event: any) {
    this.idP = event;
  }
  getSelectGerency(event: any) {
    this.idR = event;
  }
  agregarMeta() {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('meta', 'Cantidad de Técnicos', '').apply({
          singleLine: true,
          type: 'number',
        }),
        new Input('metaPresencia', 'Cantidad de Presencias', '').apply({
          singleLine: true,
          type: 'number',
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('guardarItem', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    this.modal.show({
      title: `Digite la cantidad Meta`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  onEvent(id: string, value: any): void { }
  onClick(actionId: string): void {
    var i = this.principal.indexOf(this.objeto);
    if (actionId == 'guardar') {
      this.agregar();
      this.modal.close('primary');
    } else if (actionId == 'editarButtom') {
      this.editarLista();
    } else if (actionId == 'guardarItem') {
      let Data = ``;
      let item2: any[] = this.dataSource10.data;
      let k = {
        nombre: this.select,
        tecnicos: this.estructura.getControlById('meta')?.value,
        presencias: this.estructura.getControlById('metaPresencia')?.value,
        total:
          this.estructura.getControlById('meta')?.value *
          this.estructura.getControlById('metaPresencia')?.value,
      };
      this.META = JSON.stringify(k);
      item2.push(k);
      this.dataSource10.data = item2;
      if (this.vTitulo == 'META') {
        let table = `<table style="border-collapse: collapse; width: 100%;  " border="1" data-mce-selected="1">
        <colgroup>
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
        </colgroup>
        <tbody> `;
        let encabezadoTable = `<tr style="color: #FFF; background-color: #0A324E; font-family: Arial, Helvetica, sans-serif; font-size: 11pt;">
        <td style="text-align: center;">GERENCIA REGIONAL<br></td>
        <td style="text-align: center;">TÉCNICOS<br></td>
        <td style="text-align: center;">CANTIDAD DE PRESENCIAS</br> POR TÉCNICO <br></td>
        <td style="text-align: center;">TOTAL<br></td>
        </tr>`;
        let encabezadoData = `<tr style="font-family: 'Gotham', sans-serif; font-size: 16px;  height: 50PX;">`;
        let finTable = `</tbody></table>`;
        Data += table += encabezadoTable += encabezadoData;
        this.dataSource10.data.forEach((element) => {
          Data += `<td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.nombre}<br></td>
                   <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.tecnicos}<br></td>
                   <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.presencias}<br></td>
                   <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.total}<br></td></tr> `;
        });
        Data += finTable;
        if (this.principal[i].listItem.length == 2) {
          this.principal[i].listItem.push(Data);
        } else {
          this.principal[i].listItem[2] = Data;
        }
      }
      this.modal.close('primary');
    } else {
      this.modal.close('cancel');
    }
  }
  isAllSelectedComplaints() {
    const numSelected = this.selectionComplaints.selected.length;
    const numRows = this.DenunciaA.data?.length;
    return numSelected === numRows;
  }
  masterToggleComplaints() {
    this.isAllSelectedComplaints()
      ? this.selectionComplaints.clear()
      : this.DenunciaA.data?.forEach((row) =>
        this.selectionComplaints.select(row)
      );
  }
  async GuardarArchivo() {
    let ruta = '';
    let formData = new FormData();
    formData.append('files', this.documento, 'Alcances.pdf');
    let secciones: alcanceDetalle[] = [];
    this.principal.forEach((element, index) => {
      if (element.completed == true) {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: JSON.stringify(element.listItem),
        });
      }
    });
    //constante para crear alcance
    const DetalleCasos: CasesAlcance = {
      idCaso: this.idCaso,
      idTipoAlcance: 975,
      secciones: secciones,
      idTipoCaso: 971,
    };
    formData.append('files', this.documento, 'Alcances.pdf');
    this.services
      .createStartProcessCases(DetalleCasos)
      .toPromise()
      .then((casoDetalle) => {
        let post = {
          id: casoDetalle,
        };
        this.gestor
          .contentSitesBasePathByParams('ALCANCEMASIVO', post)
          .toPromise()
          .then((ACSprocess) => {
            ruta = ACSprocess.id;
            this.gestor
              .contentSitesFoldersByNodeIdfiles(ruta, formData)
              .toPromise()
              .then((res) => { });
          });
        this.modal.show({
          icon: 'success',
          title: 'Generación Exitosa',
          text: 'Se ha realizado la generación del Alcance exitosamente',
        });
        this.router.navigate([
          '/programacion/operador/bandeja/alcance/masivos',
        ]);
      });
    this.showVisor = false;
  }
  Seleccionar(objeto: string) {
    this.objeto = this.principal.find((x) => x.nombre == objeto);
    if (objeto == 'DESCRIPCION') {
      this.vAntecedentes = true;
      this.vInconsistencias = false;
      this.vObjetivos = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vTitulo = 'DESCRIPCION';
      this.dataSource4.data =
        this.principal[this.principal.indexOf(this.objeto)].listItem;
    }
    if (objeto == 'OBJETIVO') {
      this.vInconsistencias = true;
      this.vAntecedentes = false;
      this.vObjetivos = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vTitulo = 'OBJETIVO';
      this.dataSource3.data =
        this.principal[this.principal.indexOf(this.objeto)].listItem;
    }
    if (objeto == 'PROCEDIMIENTOS') {
      this.vMinimos = true;
      this.vAntecedentes = false;
      this.vInconsistencias = false;
      this.vObjetivos = false;
      this.vGenerales = false;
      this.vTitulo = 'PROCEDIMIENTOS';
      this.dataSource.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
    if (objeto == 'META') {
      this.vInconsistencias = true;
      this.vAntecedentes = false;
      this.vObjetivos = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vTitulo = 'META';
    }
    if (objeto == 'REGISTROS') {
      this.vMinimos = true;
      this.vAntecedentes = false;
      this.vInconsistencias = false;
      this.vObjetivos = false;
      this.vGenerales = false;
      this.vTitulo = 'REGISTROS';
      this.dataSource.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
    if (objeto == 'OBSERVACIONES') {
      this.vMinimos = true;
      this.vAntecedentes = false;
      this.vInconsistencias = false;
      this.vObjetivos = false;
      this.vGenerales = false;
      this.vTitulo = 'OBSERVACIONES';
      this.dataSource6.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
  }
  CarrySon() {
    let idCatalogo = this.select;
    this.catalogo
      .getCatSonAdmin(Number(idCatalogo?.codigoIngresado))
      .toPromise()
      .then((res) => {
        this.catalogosHijo = res;
      });
  }
  metaCatalogo() {
    this.catalogo
      .getCatalogDataByIdCatalog(9)
      .toPromise()
      .then((res) => {
        this.catalogosMeta = res;
      });
  }
  async Meta() {
    this.metaCatalogo();
    await this.catalogo
      .getCatSonAdmin(52)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'META');
        this.catalogosMetaGeneral = res;
        this.catalogosMetaGeneral.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
      });
  }
  agregarProcedimiento() {
    var i = this.principal.indexOf(this.objeto);
    let duplicado: boolean = false;
    let datos = this.selectHijo;
    if (this.selectHijo == null) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'Debe seleccionar un procedimiento para poder agregar.',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      for (let i = 0; i < this.listProcedimientos.length; i++) {
        if (
          this.listProcedimientos[i].nombre == datos?.nombrePadre &&
          this.listProcedimientos[i].descripcion == datos?.descripcion
        ) {
          duplicado = true;
          this.catalogosHijo = [];
          this.processSelect.reset();
          this.modal.show({
            icon: 'warning',
            title: 'Procedimiento duplicado',
            text: 'El procedimiento seleccionado ya se encuentra ingresado.',
            showConfirmButton: true,
            showCloseButton: false,
          });
          break;
        }
      }
      if (!duplicado) {
        this.listProcedimientos.push({
          descripcion: datos?.descripcion!,
          nombre: datos?.nombrePadre!,
          codigo: 0,
          estado: '',
        });
        this.dataSource5.data = [];
        this.principal[i].listItem = [];
        this.dataSource5.data = this.listProcedimientos;
        this.dataSource5.data.forEach((procedimiento) => {
          this.principal[i].listItem.push(
            procedimiento.nombre,
            procedimiento.descripcion
          );
        });
        this.catalogosHijo = [];
        this.processSelect.reset();
      }
    }

    //////
  }
  ///AQUI VA LE NUEW METODO
  getProcedimientosAlcances() {
    this.servicesD
      .getCatalogProcessComplaint(97)
      .toPromise()
      .then((res) => {
        this.catalogosPadre = res;
      });
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo carga el catalogo child del componente padre.
   *
   */
  UpgradeChild() {
    let idCatalogo = this.select;
    this.catalogo
      .getCatSonAdmin(Number(idCatalogo))
      .toPromise()
      .then((res) => {
        this.catalogosHijo = res;
      });
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que permite editar el alcance seleccionado de una denuncia.
   * @param item
   */
  editScopeComplaints(item: string) {
    this.id = this.dataSource4.data.indexOf(item);
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        /*  new TextArea('editar', 'Editar', item).apply({
        singleLine: true
      }) */ new CustomNode<RichTextComponent>('editar', RichTextComponent, {
        initialValue: item,
      }).apply({
        singleLine: true,
        initialValue: item.toString(),
        options: this.options,
        outputFormat: 'html',
      }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('editarButtom', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    this.modal.show({
      title: `Editar `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que permite agregar un procedimiento seleccionado a la tabla y luego mostrarlo en el scope
   */
  addGeneralObject() {
    let datos = this.selectHijo;
    //OBJETIVOS ESPECÍFICOS O ASPECTOS GENERALES
    this.listProcedimientos.push({
      descripcion: datos?.descripcion!,
      nombre: datos?.nombre!,
      codigo: 0,
      estado: '',
    });
    this.dataSource3.data = this.listProcedimientos || [];
  }
  agregar() {
    let datos = this.select;
    var i = this.principal.indexOf(this.objeto);
    if (this.vObjetivos == true || this.vMinimos == true) {
      if (this.vOtro == true) {
        this.principal[i].listItem.push(
          this.estructura.getControlById('otro')?.value + ''
        );
        this.vOtro = false;
      } else {
        this.principal[i].listItem.push(datos + '');
      }
      if (this.vMinimos == true) {
        this.dataSourceObEspecifico.data = this.principal[i].listItem;
        this.dataSourceObEspecifico.paginator =
          this.dataSourceObEspecifico.paginator;
      }
      this.dataSourceObEspecifico.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
  }
  saveAll(item: any) {
    var i = this.principal.indexOf(item);
    let texto = ``;
    /** Adjuntar los procedimientos a la lista Principal */
    if (this.vTitulo == 'PROCEDIMIENTOS') {
      this.dataSource5.data.forEach((proceso) => {
        this.principal[i].listItem.push(proceso.descripcion);
      });
    } else {
      this.vtextArea.forEach((element) => {
        this.principal[i].listItem.push('<p><h4>' + element + '</h4></p>');
      });
    }
    this.modal.show({
      icon: 'success',
      title: 'Informacion Guardada',
      text: 'Su informacion ha sido guardada correctamente',
      showConfirmButton: true,
      showCloseButton: true,
    });
  }
  Editar(item: string) {
    this.id = this.dataSource.data.indexOf(item);
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('editar', RichTextComponent, {
          initialValue: item,
        }).apply({
          singleLine: true,
          initialValue: item.toString(),
          options: this.options,
          outputFormat: 'html',
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('editarB', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    this.modal.show({
      title: `Editar `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  async GenerarAlcance() {
    if (
      this.principal[2].completed == false ||
      this.dataSource10.data.length == 0
    ) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'No se puede generar alcance porque no selecciono y/o agrego una "Meta".',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      let texto2 = await this.micro
        .getTemplate(Constantes.DENUNCIA)
        .toPromise();
      let header = texto2.encabezado;
      let encabezado = `<!DOCTYPE html><html><head> <style>
    .header {
        position: running(header);
    }
    .footerRight{
      position: running(footerRight);
      text-align: right;
  }
  .body{
    position: running(body);
    text-align: justify;
    font-family: Arial, Helvetica, sans-serif;
  }
  .table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
     font-size:8pt;
   }
   .th{
    background-color: #5DADE2;
   }
    @page {
        size: A4;
        margin: 20mm;
        margin-top: 200px;
        @top-left {
            content: element(header);
            border-bottom:2px solid #434190;
        }
        @bottom-center {
          content: element(footer);
       }
       @bottom-right {
        content: element(footerRight);
        margin-left: -100px;   
    }
    @bottom-center{
        content: counter(page);
        font-size:11pt;
    }   
    }
</style></head>`;
      let texto: string = `</div><div class="header">` + header + `</div>`;
      let piePagina = `<body class="body"><div class="footerRight">`;
      texto += `</div><ol>`;
      let contenido = texto2.piePagina.match(/<([^}]*)>/g);
      let variables = texto2.piePagina.match(/{([^}]*)}/g);
      contenido.forEach((element: any, index: number) => {
        piePagina += element;
        if (index <= variables.length) {
          switch (variables[index]) {
            case '{usuario}':
              if (this.usuario != null) {
                piePagina += this.usuario.login;
              } else {
                piePagina += 'usuario';
              } /* this.taxPayerData.data.attributes.datos.empresa.razonSocial */
              break;
            case '{fecha}':
              piePagina += new Date().toLocaleDateString();
              break;
          }
        }
      });
      this.principal.forEach((element) => {
        if (element.completed) {
          texto += '<br><li><strong>' + element.nombre + '</strong></li>  ';
          element.listItem.forEach((item) => {
            texto += '<p>' + item + '</p><br>';
          });
        }
      });
      texto += '</ol></body></html>';
      let post: docPdf = {
        datos: encabezado + piePagina + texto,
        idCaso: 0,
        idEstado: this.estado,
      };
      await this.micro
        .generationPdf(post)
        .toPromise()
        .then((res) => {
          texto = '';
          this.documento = res;
          this.showVisor = true;
        });
      this.principal
        .filter((meta) => meta.id == 982)[0]
        .listItem.push(this.META);
      this.principal
        .filter((procedimiento) => procedimiento.id == 983)[0]
        .listItem = [JSON.stringify(this.listProcedimientos)];
    }
  }
  editarLista() {
    let item = this.estructura.getControlById('editar')?.value;
    if (item.replace(/<p>|<\/p>|&nbsp;|\s/g, '').length == 0) {
      this.modal
        .show({
          icon: 'error',
          title: 'Error',
          text: 'No puede dejar el campo vacio',
        })
        .then((result) => {
          if (result !== 'primary') {
            this.modal.close();
          }
        });
    } else {
      this.objeto = this.principal.find((x) => x.nombre == 'DESCRIPCION');
      this.dataSource.data.splice(
        this.id,
        1,
        this.estructura.getControlById('editar')?.value
      );
      this.principal[this.principal.indexOf(this.objeto)].listItem.splice(
        this.id,
        1
      );
      this.principal[this.principal.indexOf(this.objeto)].listItem.push(
        this.estructura.getControlById('editar')?.value
      );
      this.dataSource4.data = this.dataSource.data;
      this.modal.close();
    }
  }
  eliminarDescription(item: any) {
    var i = this.dataSource4.data.indexOf(item);
    i !== -1 && this.dataSource4.data.splice(i, 1);
    this.dataSource4.data = this.dataSource4.data;
  }
  Eliminar(item: any) {
    var i = this.dataSource10.data.indexOf(item);
    i !== -1 && this.dataSource10.data.splice(i, 1);
    this.dataSource10.data = this.dataSource10.data;
  }
  EliminarProceso(item: any) {
    var i = this.dataSource5.data.indexOf(item);
    i !== -1 && this.dataSource5.data.splice(i, 1);
    this.dataSource5.data = this.dataSource5.data;
  }

  Otro() {
    this.vOtro = true;
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('otro', RichTextComponent).apply({
          singleLine: true,
          options: this.options,
          outputFormat: 'html',
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('guardar', 'Guardar', {
          callback: this,
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ],
    });
    this.estructura = this.estructura;
    this.modal.show({
      title: `Otros `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }
  async Descripcion() {
    await this.catalogo
      .getCatSonAdmin(95)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'DESCRIPCION');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        this.dataSource4.data = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource4.data =
          this.principal[this.principal.indexOf(this.objeto)].listItem;
      });
  }
  async getMeta() {
    await this.catalogo
      .getCatSonAdmin(103)
      .toPromise()
      .then((res) => {
        this.metaAntecedentes = res;
        this.objeto = this.principal.find((x) => x.nombre == 'META');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource7.data = res;
      });
  }
  async Registros() {
    await this.catalogo
      .getCatSonAdmin(98)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'REGISTROS');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource8.data = res;
      });
  }
  async Observaciones() {
    await this.catalogo
      .getCatSonAdmin(99)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'OBSERVACION');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource6.data = res;
      });
  }
  async ObjetivoG() {
    await this.catalogo
      .getCatSonAdmin(96)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'OBJETIVO');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        this.dataSource3.data = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource3.data =
          this.principal[this.principal.indexOf(this.objeto)].listItem;
      });
  }
  reloadObjetivo() {
    this.ObjetivoG();
  }
  ObjetivoE() {
    this.catalogo
      .getCatSonAdmin(55)
      .toPromise()
      .then((res) => {
        this.catalogos = res;
      });
  }
  itemToString(item: Topic[]): string {
    if (item != null) {
      return item.map(i => `${i.impuesto}/${i.rubro}`).join(', ');
    }
    return "Sin rubro seleccionado";
  }
  regresar() {
    this.showVisor = false;
    this.nodeId = '';
  }
}
function InputCore(arg0: string) {
  throw new Error('Function not implemented.');
}
