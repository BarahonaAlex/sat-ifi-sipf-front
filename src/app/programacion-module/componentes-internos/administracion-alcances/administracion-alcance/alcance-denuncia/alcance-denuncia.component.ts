import { element } from 'protractor';
import { Component, Injector, NgZone, OnInit } from '@angular/core';
import {
  alcance,
  alcanceDetalle,
  listaAlcances,
} from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  Catalog,
  Item,
  ItemTwo,
} from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { docPdf } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import {
  Button,
  CustomNode,
  FormStructure,
  Input,
  TextArea,
} from 'mat-dynamic-form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FindingDetail,
  Topic,
} from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { Input as InputCore } from '@angular/core';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import {
  AlcanceDenuncia,
  CabinetComplaints,
  DenunciaAP,
  Gerencias,
  ProcesosMasivos,
} from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { SelectionModel } from '@angular/cdk/collections';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { iif } from 'rxjs';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { kStringMaxLength } from 'buffer';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { MatDialog } from '@angular/material/dialog';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-alcance-denuncia',
  templateUrl: './alcance-denuncia.component.html',
  styleUrls: ['./alcance-denuncia.component.css'],
})
export class AlcanceDenunciaComponent implements OnInit {
  @InputCore('idCase') idCase!: number;
  principal: listaAlcances[] = [
    { nombre: 'DESCRIPCION', listItem: [], completed: false, id: 977 },
    { nombre: 'OBJETIVO GENERAL', listItem: [], completed: false, id: 978 },
    {
      nombre: 'OBJETIVOS ESPECIFICOS',
      listItem: [],
      completed: false,
      id: 981,
    },
    { nombre: 'DENUNCIAS', listItem: [], completed: false, id: 979 },
    { nombre: 'PROCEDIMIENTOS', listItem: [], completed: false, id: 983 },
  ];
  enableScope: boolean = false;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }
  columns = ['caso', 'acciones'];
  dataSourceDescriptionColumns = ['caso', 'acciones'];
  columns2 = ['nombre', 'desc', 'rubros'];
  columns4 = ['Nombre', 'Descripcion', 'acciones'];
  columns3 = ['Nombre', 'Descripcion'];
  columns5 = ['Nombre', 'Descripcion', 'acciones'];
  DenunciaAprobada: string[] = ['seleccion', 'correlativo'];
  DenunciaA = new MatTableDataSource<DenunciaAP>();
  dataSource4 = new MatTableDataSource();
  dataSource5 = new MatTableDataSource<any>();
  dataSource6 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
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
  denuncia!: number;
  gerencias!: Gerencias[];
  catalogos?: Item[];
  objetivoEliminado: Item[] = [];
  validar?: Item[] = [];
  vtextArea: string[] = [];
  select?: ItemTwo;
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
  correlativo!: string;
  processSelect!: FormGroup;
  tipoAlcance!: number;
  arrayProperties: { name: string; key: string }[] = [];
  selectionComplaints = new SelectionModel<DenunciaAP>(true, []);
  @ViewChild('chekSelect') chekSelect!: MatCheckbox;
  usuario!: UserLogged;
  idAlcance!: number;
  vComentario!: string;
  vEstado!: number;
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
          .uploadToS3(`${this.idCase}/${createUID()}`, file as Blob)
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
    private services: DenunciasService,
    private gestor: GestorService,
    private dialogService: DialogService,
    private redireccion: Router,
    private dialog: MatDialog,
    private microPresencias: PresenciasFiscalesService,
    private user: UserService,
    private injector: Injector,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    this.user
      .getUserLogged()
      .toPromise()
      .then((result) => {
        this.usuario = result;
      });
    this.processSelect = new FormGroup({
      objetivo: new FormControl(''),
      gerencia: new FormControl(''),
      proceso: new FormControl(''),
      procedimiento: new FormControl(''),
      item: new FormControl(''),
    });
    this.route.paramMap.subscribe((params) => {
      this.idAlcance = Number(params.get('id'));
    });
  }

  async ngOnInit() {
    this.getProcedimientosAlcances();
    await this.services
      .getAlcances(this.idAlcance)
      .toPromise()
      .then((result) => {
        if (result.masivo.length > 0) {
          this.vEstado = result.masivo[0].estado;
          this.vComentario = result.comentario.comentarios;
          result.masivo.forEach((element: any) => {
            if (this.principal.find((x) => x.id == element.idSeccion)) {
              JSON.parse(element.detalle + '').forEach((z: any) => {
                this.principal
                  .find((y) => y.id == element.idSeccion)
                  ?.listItem.push(z);
                if (z != null) {
                  let i = this.principal.indexOf(
                    this.principal.find((y) => y.id == element.idSeccion)!
                  );
                  this.principal[i].completed = true;
                  if (element.idSeccion == 979) {
                    this.test(true);
                    let denuncias = JSON.parse(element.detalle + '');
                    this.DenunciaA.data = denuncias;
                  }
                  if (element.idSeccion == 983) {
                    let nombre =
                      this.catalogosPadre.find(
                        (data) => data.nombre == z.nombre
                      )?.nombre || 'otros';
                    this.listProcedimientos.push({
                      descripcion: z.descripcion,
                      nombre: nombre,
                      codigo: 0,
                      estado: '',
                    });
                    this.dataSource5.data = this.listProcedimientos;
                  }
                }
              });
            }
          });
        } else {
          this.Descripcion();
          this.ObjetivoG();
        }
      });

    this.ObjetivoE();
    this.getCatalogRegion();
    this.getProcessMasive();
    this.getProcedimientosAlcances();
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
  getComplaintsByProcessandGerency() {
    this.selectionComplaints.clear();
    let Region = this.idR;
    let Proceso = this.idP;
    if (Region == undefined || Proceso == undefined) {
      this.dialogService.show({
        title: 'Detalle denuncia.',
        text: 'Debe seleccionar una región y/o un proceso para consultar',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      this.services
        .getComplaintsForScope(Region, Proceso)
        .toPromise()
        .then((res) => {
          if (res.length == 0) {
            this.dialogService.show({
              title: 'Detalle denuncia.',
              text: 'No se encontro ninguna denuncia con las especificaciones indicadas.',
              icon: 'warning',
              disableClose: true,
            });
            this.DenunciaA.data = [];
          } else {
            this.DenunciaA.data = res;
          }
        });
    }
  }

  guardarDenuncia(item: any) {
    var i = this.principal.indexOf(item);
    let textoDenuncia = ``;
    let texto = ``;
    this.selectionComplaints.selected.forEach((Unassign) => {
      this.correlativo = Unassign.correlativo;
    });
    if (this.vTitulo == 'DENUNCIAS SELECCIONADAS') {
      let Denuncias = `<strong>CORRELATIVO DENUNCIA</strong><br><ul>`;

      this.selectionComplaints.selected.forEach((element: any) => {
        Denuncias += `<li>${element.correlativo}</li>`;
      });
      Denuncias += `</ul>`;
      textoDenuncia = Denuncias;
      if (this.principal[i].listItem.length == 0) {
        this.principal[i].listItem.push(textoDenuncia);
      } else {
        this.principal[i].listItem[0] = textoDenuncia;
      }
    }
  }
  agregarMeta() {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('meta', 'Cantidad', '').apply({
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
      title: `Cantidad Meta`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
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
    /*   this.selectionComplaints.selected.forEach(Unassign => {
        this.correlativo = Unassign.correlativo
      }) */

    let ruta = '';
    let formData = new FormData();
    formData.append('files', this.documento, 'Alcances.pdf');
    let secciones: alcanceDetalle[] = [];
    this.principal.forEach((element, index) => {
      if (element.completed == false) {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: '[]'
        })
      }
      if (element.id != 979 && element.id != 983) {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: JSON.stringify(element.listItem),
        });
      } else {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: element.listItem.toString(),
        });
      }
    });
    if (this.idP == 961) {
      this.tipoAlcance = 975;
    } else {
      this.tipoAlcance = 973;
    }
    const DetalleDeunciaAndAlcance: AlcanceDenuncia = {
      correlativo: this.selectionComplaints.selected[0].correlativo,
      idTipoAlcance: this.tipoAlcance,
      correlativos: this.selectionComplaints.selected.map((x) => x.correlativo),
      secciones: secciones.filter((x) => x.detalle != '[]'),
    };
    formData.append('data', JSON.stringify(DetalleDeunciaAndAlcance));

    if (this.vEstado != 181) {
      this.services
        .createStartProcessDenuncias(formData)
        .toPromise()
        .then((denunciaDetalle) => {
          this.modal.show({
            icon: 'success',
            title: 'Generacion Exitosa',
            text: 'Se ha realizado la generación del Alcance exitosamente',
          });
          this.redireccion.navigate([
            '/programacion/elaboracion/alcances/denuncias',
          ]);
        });
    } else {
      this.services
        .putProcessDenuncias(formData, this.idAlcance)
        .toPromise()
        .then((denunciaDetalle) => {
          this.modal.show({
            icon: 'success',
            title: 'Generación Exitosa',
            text: 'Se ha realizado la generación del Alcance exitosamente',
          });
          this.redireccion.navigate([
            '/programacion/elaboracion/alcances/denuncias',
          ]);
        });
    }
    this.showVisor = false 
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
    if (objeto == 'OBJETIVO GENERAL') {
      this.vInconsistencias = true;
      this.vAntecedentes = false;
      this.vObjetivos = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vTitulo = 'OBJETIVO GENERAL';
      this.dataSource6.data =
        this.principal[this.principal.indexOf(this.objeto)].listItem;
    }
    if (objeto == 'OBJETIVOS ESPECIFICOS') {
      this.vObjetivos = true;
      this.vInconsistencias = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vTitulo = 'OBJETIVOS ESPECIFICOS';
      this.dataSourceObEspecifico.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
    if (objeto == 'DENUNCIAS') {
      this.vObjetivos = true;
      this.vInconsistencias = false;
      this.vMinimos = false;
      this.vGenerales = false;
      this.vVista = 4;
      this.vTitulo = 'DENUNCIAS SELECCIONADAS';
    }
    if (objeto == 'PROCEDIMIENTOS') {
      this.vMinimos = true;
      this.vAntecedentes = false;
      this.vInconsistencias = false;
      this.vObjetivos = false;
      this.vGenerales = false;
      this.vVista = 3;
      this.vTitulo = 'PROCEDIMIENTOS';
      this.dataSource.data =
        this.principal.find((x) => x.nombre == this.vTitulo)?.listItem || [];
    }
  }
  getCatalogRegion() {
    this.services
      .getManagaments()
      .toPromise()
      .then((res) => {
        this.gerencias = res;
      });
  }
  CargarHijo() {
    let idCatalogo = this.select;
    this.catalogo
      .getCatSonAdmin(Number(idCatalogo?.codigoIngresado))
      .toPromise()
      .then((res) => {
        this.catalogosHijo = res;
      });
  }
  agregarProcedimiento(item: any) {
    let ingresados = false;
    var i = this.principal.indexOf(item);
    let datos = this.selectHijo;
    let texto = ``;
    if (this.selectHijo == null) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'Debe seleccionar un procedimiento para poder agregar.',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      this.dataSource5.data.forEach((element: any) => {
        if (element.nombre == datos.nombrePadre && element.descripcion == datos.descripcion) {
          ingresados = true
          this.dialogService.show({
            title: 'Detalle alcance.',
            text: 'Procedimiento e ítem seleccionados ya fueron ingresados.',
            icon: 'warning',
            disableClose: true,
          });
        }
      });
      if (!ingresados) {
        this.listProcedimientos.push({
          descripcion: datos?.descripcion!,
          nombre: datos.nombrePadre!,
          codigo: 0,
          estado: '',
        });
        this.dataSource5.data = this.listProcedimientos;
        this.catalogosHijo = [];
        if (this.vTitulo == 'PROCEDIMIENTOS') {
          let listJefeSeccion = `<strong>PROCEDIMIENTOS DENUNCIA JEFE DE SECCION</strong><p><ul>`;
          let listSupervisor = `<strong>PROCEDMIENTOS DENUNCIA SUPERVISOR</strong><p><ul>`;
          let listAuditor = `<strong>PROCEDMIENTOS DENUNCIA AUDITOR</strong><p><ul>`;
          this.dataSource5.data.forEach((element: any) => {
            if (element.nombre == 'PROCEDIMIENTOS DENUNCIA JEFE DE SECCION') {
              listJefeSeccion += `<li>${element.descripcion}</li><p></p>`;
            } else if (element.nombre == 'PROCEDMIENTOS DENUNCIA SUPERVISOR') {
              listSupervisor += `<li>${element.descripcion}</li><p></p>`;
            } else {
              listAuditor += `<li>${element.descripcion}</li><p></p>`;
            }
          });
          listJefeSeccion += `</ul>`;
          listSupervisor += `</ul>`;
          listAuditor += `</ul>`;
          texto = listJefeSeccion + listSupervisor + listAuditor;
          if (this.principal[i].listItem.length == 0) {
            this.principal[i].listItem.push(texto);
          } else {
            this.principal[i].listItem[0] = texto;
          }
        }
      }
    }

    this.processSelect.reset();
    this.catalogosHijo = [];
  }
  getProcedimientosAlcances() {
    this.services
      .getCatalogProcessComplaint(56)
      .toPromise()
      .then((res) => {
        this.catalogosPadre = res;
      });
  }
  getProcessMasive() {
    this.services
      .getProcessMasive()
      .toPromise()
      .then((res) => {
        this.tipos = res;
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
        new TextArea('editar', 'Editar', item).apply({
          singleLine: true,
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('editar', 'Guardar', {
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

  /**
   * @author aalsuruyq (Anderson Suruy)
   * @description Metodo que obtine el texto plano del RichText.
   * @param html body.
   */
  getHtmlText(html: any) {
    let doc = new DOMParser().parseFromString(html, 'text/html'),
      text = doc.body.textContent || '';
    text = text.trim().replace(/\s{2,}/g, ' ');
    return text;
  }

  agregar() {
    let datos = this.select?.descripcion;
    this.objetivoEliminado.push(this.select!);

    if (this.select == null) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'Debe seleccionar un objetivo para poder agregar.',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      var i = this.principal.indexOf(this.objeto);
      if (this.vObjetivos == true || this.vMinimos == true) {
        if (this.vOtro == true) {
          let item = this.estructura.getControlById('otro')?.value;
          if (this.getHtmlText(item).replace(/\s+/g, '').length > 0) {
            this.principal[i].listItem.push(
              this.estructura.getControlById('otro')?.value
            );
            this.vOtro = false;
            this.modal.close('primary');
          } else {
            this.vOtro = false;
            this.modal.close('primary');
            this.dialogService
              .show({
                title: 'IFI-400',
                text: 'No se puede agregar un ítem vacío',
                icon: 'error',
              })
              .then(() => {
                this.modal.close('primary');
              });
          }
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
        this.catalogos!.splice(
          this.catalogos!.findIndex(
            (item) => item.nombre === this.select?.nombre
          ),
          1
        );
      }
    }
    this.processSelect.reset();
  }

  saveAll(item: any) {
    var i = this.principal.indexOf(item);
    let textoDenuncia = ``;
    let texto = ``;
    if (this.vTitulo == 'DENUNCIAS SELECCIONADAS') {
      let Denuncias = `<strong>CORRELATIVO DENUNCIA</strong><br><ul>`;
      let NitDenunciante = `<strong>NIT DENUNCIANTE</strong><br><ul>`;
      let NitDenunciado = `<strong>NIT DENUNCIADO</strong><br><ul>`;

      this.DenunciaA.data.forEach((element: any) => {
        Denuncias += `<li>${element.correlativo}</li>`;
        NitDenunciante += `<li></li>${element.nitDenunciante}</li>`;
        NitDenunciado += `<li>${element.nitDenunciado}</li>`;
      });
      Denuncias += `</ul>`;
      NitDenunciante += `</ul>`;
      textoDenuncia = Denuncias + NitDenunciante + NitDenunciado;
      if (this.principal[i].listItem.length == 0) {
        this.principal[i].listItem.push(textoDenuncia);
      } else {
        this.principal[i].listItem[0] = textoDenuncia;
      }
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
        new TextArea('editar', 'Editar', item).apply({
          singleLine: true,
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this,
          style: 'warn',
        }).apply({
          icon: 'close',
        }),
        new Button('editar', 'Guardar', {
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

  guardarDenunciaByPrincipalIndex(index: number) {
    var i = index;
    let textoDenuncia = ``;
    let texto = ``;

    let Denuncias = `<strong>CORRELATIVO DENUNCIA</strong><br><ul>`;

    this.selectionComplaints.selected.forEach((selectedComplaint) => {
      Denuncias += `<li>${selectedComplaint.correlativo}</li>`;
    });

    /* this.DenunciaA.data.forEach((element: any) => {
      Denuncias += `<li>${element.correlativo}</li>`
    }) */
    Denuncias += `</ul>`;
    textoDenuncia = Denuncias;
    if (this.principal[i].listItem.length == 0) {
      this.principal[i].listItem.push(textoDenuncia);
    } else {
      this.principal[i].listItem[0] = textoDenuncia;
    }
  }

  async GenerarAlcance() {
    let crear = true;
    let seleccionado = false;
    let element = this.principal.find((x) => x.nombre == 'DENUNCIAS');
    var i = element != undefined ? this.principal.indexOf(element) : 3;

    if (i != -1 && this.selectionComplaints.selected.length == 0) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'No se puede generar alcance porque no selecciono y/o agrego una "Denuncia".',
        icon: 'warning',
        disableClose: true,
      });
    } else {
      if (i != -1) {
        this.guardarDenunciaByPrincipalIndex(i);
      }

      let texto2 = await this.micro
        .getTemplate(Constantes.DENUNCIA)
        .toPromise();
      let header = texto2.encabezado;
      let encabezado = `<!DOCTYPE html><html><head> <style>
      .header {position: running(header);}
      .footerRight{
                   position: running(footerRight);
                   text-align: right;}
      .body{
                   position: running(body);
                   text-align: justify;
                   font-family: Arial, Helvetica, sans-serif;}
      .table, th, td {
                   border: 1px solid black;
                   border-collapse: collapse;
                   font-size:8pt;}
     .th{background-color: #5DADE2;}
      @page {
             size: A4;
             margin: 20mm;
             margin-top: 200px;
      @top-left {
                 content: element(header);
                 border-bottom:2px solid #434190;}
      @bottom-center {content: element(footer);}
      @bottom-right {
                     content: element(footerRight);
                     margin-left: -100px;}
      @bottom-center{
                     content: counter(page);
                     font-size:11pt;}   
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
              }
              break;
            case '{fecha}':
              piePagina += new Date().toLocaleDateString();
              break;
          }
        }
      });

      this.principal.forEach((element) => {
        if (element.completed) {
          seleccionado = true;
          if (element.listItem.length > 0) {
            texto += '<br><li><strong>' + element.nombre + '</strong></li> ';
            element.listItem.forEach((item) => {
              texto += '<p>' + item + '</p><br>';
            });
            if (element.id == 979) {
              element.listItem = [];
              element.listItem.push(JSON.stringify(this.DenunciaA.data));
            } else if (element.id == 983) {
              element.listItem = [];
              element.listItem.push(JSON.stringify(this.dataSource5.data));
            }
          } else {
            this.modal.show({
              icon: 'error',
              title: 'Error Ítem vacio',
              text:
                'Se ha encontrado el contenido de ' +
                element.nombre +
                ' vacio, por favor verifique',
            });
            crear = false;
          }
        }
      });
      texto += '</ol></body></html>';
      let post: docPdf = {
        datos: encabezado + piePagina + texto,
        idCaso: this.idCase,
        idEstado: this.estado,
      };
      if (seleccionado && crear) {
        await this.micro
          .generationPdf(post)
          .toPromise()
          .then((res) => {
            texto = '';
            this.documento = res;
            this.showVisor = true;
          });
      } else {
        if (!seleccionado) {
          this.modal.show({
            icon: 'error',
            title: 'Error Seleccion',
            text: 'No ha seleccionado ningun Titulo',
          });
        }
      }
    }
  }

  editarLista() {
    this.dataSource.data.splice(
      this.id,
      1,
      this.estructura.getControlById('editar')?.value
    );
    this.dataSource.data = this.dataSource.data;
  }
  Eliminar(item: any) {
    var i = this.dataSourceObEspecifico.data.indexOf(item);
    i !== -1 && this.dataSourceObEspecifico.data.splice(i, 1);
    this.dataSourceObEspecifico.data = this.dataSourceObEspecifico.data;
    var objetivo = this.objetivoEliminado.find((res) =>
      res.descripcion.match(item)
    );
    if (objetivo !== undefined) {
      this.catalogos!.push(objetivo);
    }
    this.catalogos?.sort();
    var k = this.objetivoEliminado.findIndex((res) =>
      res.descripcion.match(item)
    );
    k !== -1 && this.objetivoEliminado.splice(k, 1);
  }
  EliminarProcedimiento(item: any) {
    var i = this.dataSource5.data.indexOf(item);
    i !== -1 && this.dataSource5.data.splice(i, 1);
    this.dataSource5.data = this.dataSource5.data;
  }
  EliminarDescripcion(item: any) {
    var i = this.dataSource4.data.indexOf(item);
    i !== -1 && this.dataSource4.data.splice(i, 1);
    this.dataSource4.data = this.dataSource4.data;
  }
  onEvent(id: string, value: any): void {}

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.agregar();
    }

    if (actionId == 'editar') {
      this.editarLista();
      this.modal.close('primary');
    }
    if (actionId == 'guardarItem') {
      let item2: Catalog[] = this.dataSource2.data;
      item2.push({
        codigo: this.estructura.getControlById('meta')?.value,
        nombre: this.select,
      });
      this.dataSource2.data = item2;
      this.modal.close('primary');
    }
    if (actionId == 'cancelar') {
      this.modal.close('primary');
      this.processSelect.reset();
    }
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
          outputFormat: 'text',
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
      .getCatSonAdmin(53)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find((x) => x.nombre == 'DESCRIPCION');
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource4.data = res;
      });
  }
  async ObjetivoG() {
    await this.catalogo
      .getCatSonAdmin(54)
      .toPromise()
      .then((res) => {
        this.objeto = this.principal.find(
          (x) => x.nombre == 'OBJETIVO GENERAL'
        );
        this.principal[this.principal.indexOf(this.objeto)].listItem = [];
        res.forEach((element) => {
          this.principal[this.principal.indexOf(this.objeto)].listItem.push(
            element.descripcion
          );
        });
        this.dataSource6.data = res;
      });
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
  test(e: boolean) {
    this.enableScope = e;
  }
}
