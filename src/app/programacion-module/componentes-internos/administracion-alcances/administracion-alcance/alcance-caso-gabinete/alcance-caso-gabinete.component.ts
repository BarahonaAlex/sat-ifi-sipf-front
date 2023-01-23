import { SelectionModel } from '@angular/cdk/collections';
import { Injector, Input as InputC, NgZone } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, CustomNode, FormStructure, TextArea } from 'mat-dynamic-form';
import { alcanceDetalle, docPdf, listaAlcances } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { CasesAlcance } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Catalog, Item } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { DenunciaAP, Gerencias, ProcesosMasivos } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { FindingDetail, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-alcance-caso-gabinete',
  templateUrl: './alcance-caso-gabinete.component.html',
  styleUrls: ['./alcance-caso-gabinete.component.css']
})
export class AlcanceCasoGabineteComponent implements OnInit {


  @InputC('idCaso') idCaso!: number;
  @InputC('idProgram') idProgram!: number;
  principal: listaAlcances[] = [
    { nombre: 'ANTECEDENTES', listItem: [], completed: false, id: 980 },
    { nombre: 'OBJETIVOS', listItem: [], completed: false, id: 981 },
    { nombre: 'INCONSISTENCIAS', listItem: [], completed: false, id: 984 },
    { nombre: 'PROCEDIMIENTOS', listItem: [], completed: false, id: 983 },
    { nombre: 'ASPECTOS GENERALES', listItem: [], completed: false, id: 987 }
  ]
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }
  @ViewChild('MatPaginator2') set matPaginatorItem(mp: MatPaginator) {
    this.dataSource11.paginator = mp;
  }
  columns = ['caso', 'acciones'];
  dataSourceDescriptionColumns = ['caso', 'acciones'];
  columns2 = ['nombre', 'desc', 'rubros'];
  columns4 = ['Nombre', 'Descripcion', 'acciones'];
  columns3 = ['nombre', 'Descripcion'];
  columnsProdecimiento = ['nombre', 'Descripcion', 'acciones'];
  columnsAspectos = ['nombre', 'descripcion', 'acciones'];
  columnsHallazgo = ['nombre', 'desc', 'rubros'];
  DenunciaAprobada: string[] = ['seleccion', 'correlativo', 'nitDenunciado', 'nitDenunciante', 'estado'];
  DenunciaA = new MatTableDataSource<DenunciaAP>()
  dataSource4 = new MatTableDataSource<any>();
  dataSource5 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  @InputC('dataSource2') dataSource11 = new MatTableDataSource<FindingDetail>();
  dataSourceDescription = new MatTableDataSource<any>();
  dataSourceObEspecifico = new MatTableDataSource<string>();
  vAntecedentes: Boolean = false
  vInconsistencias: Boolean = false
  listProcedimientos: Item[] = []
  listAspectos: Item[] = []
  vObjetivos: Boolean = false
  vMinimos: Boolean = false
  vGenerales: Boolean = false
  selectHijo!: Item;
  selectAspecto!: Item;
  vVista: number = 0
  vTitulo: string = ""
  denuncia!: number;
  gerencias!: Gerencias[]
  catalogos!: Item[]
  catalogosOb: Item[] = [];
  validar?: Item[] = []
  vtextArea: string[] = []
  select?: Item;
  selectProcess!: String
  preuba!: Item[];
  selectGerencia?: Item;
  selectProceso?: Item;
  vReporte: listaAlcances[] = []
  nitContribuyente!: string
  vOtro: Boolean = false
  estructura!: FormStructure;
  showVisor = false
  nodeId = ""
  catalogosEspecificos?: Item[]
  conjuntoDenuncias: string[] = []
  estado!: number
  documento!: Blob
  refres!: Catalog[];
  catalogosHijo!: Catalog[];
  aspectosGenerales!: Catalog[];
  catalogosPadre!: Catalog[];
  idR !: number
  idP!: number
  tipos!: ProcesosMasivos[]
  id !: number
  plantillaDenuncia: number = 4
  objeto!: any
  correlativo!: string
  cabinet!: FormGroup;
  arrayProperties: { name: string, key: string }[] = [];
  selectionComplaints = new SelectionModel<DenunciaAP>(true, []);
  @ViewChild('chekSelect') chekSelect!: MatCheckbox
  usuario!: UserLogged;
  objetivoEliminado: Item[] = []
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
        this.gestor.uploadToS3(`${this.correlativo}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.NgZone)
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

  /**
   * @author (lfvillag) Luis Villagran
   * @description contiene el formulario para poder recargar una opción luego de agregarla. 
   * @param micro 
   * @param modal 
   * @param catalogo 
   * @param services 
   * @param servicesD 
   * @param gestor 
   * @param dialogService 
   * @param redireccion 
   * @param user 
   */
  constructor(
    private micro: AlcancesService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private services: CasosService,
    private servicesD: DenunciasService,
    private gestor: GestorService,
    private dialogService: DialogService,
    private redireccion: Router,
    private user: UserService,
    private injector: Injector,
    private NgZone: NgZone,) {
    //Obtiene el usuario para setearlo en el pie de pagina del archivo generado.
    this.user.getUserLogged().toPromise().then(result => {
      this.usuario = result;
    })
    //formulario Reactivo.
    this.cabinet = new FormGroup({
      select: new FormControl(''),
      objetivo: new FormControl(''),
      aspecto: new FormControl(''),
    })
  }

  async ngOnInit() {
    await this.services.getCaseById(this.idCaso).toPromise().then(result => {

      this.Antecedentes()
      this.ObjetivoE()
      this.AspectosGenerales()
      this.GetProcess()
      this.getCatalogRegion()
      this.getProcessMasive()
      this.getProcedimientosAlcances()
      this.Hallazgos()

      if (result.caso.idEstado == 181) {
        this.micro.getScopeSelectiva(result.caso.idAlcance).toPromise().then(res => {
          res.masivo.forEach((x, index) => {
            if (this.principal.find(y => y.id == x.idSeccion)) {
              JSON.parse(x.detalle + "").forEach((z: any) => {
                // this.principal.find(y => y.id == x.idSeccion)?.listItem.push(z)
                if (z != null) {
                  let i = this.principal.indexOf(this.principal.find(y => y.id == x.idSeccion)!)
                  this.principal[i].completed = true

                  if (x.idSeccion == 981) {
                    this.select = this.catalogos.find(y => y.descripcion.match(z))


                    this.objetivoEliminado.push(this.select!)
                    if (this.select) {

                      this.principal[i].listItem.push(this.select.descripcion + "")
                      this.catalogos.splice(this.catalogos.findIndex(item => item.nombre === this.select?.nombre), 1);
                      this.cabinet.reset()                      
                      this.dataSourceObEspecifico.data = this.principal[i].listItem
                    }
                  }

                  if (x.idSeccion == 983) {
                    const g = this.catalogosHijo.find(y => y.descripcion.match(z))

                    this.listProcedimientos.push({
                      descripcion: g?.descripcion!,
                      nombre: g?.nombre!,
                      codigo: 0,
                      estado: ''
                    })
                    this.dataSource5.data = this.listProcedimientos
                    this.dataSource5.data.forEach(procedimiento => {
                      this.principal[i].listItem.push(procedimiento.descripcion)
                    })


                    this.catalogosHijo.splice(this.catalogosHijo.findIndex(item => item.nombre === this.select?.nombre) - 1, 1);

                  }

                  if (x.idSeccion == 987) {
                    const dato = this.aspectosGenerales.find(y => y.descripcion.match(z))

                    this.listAspectos.push({
                      descripcion: dato?.descripcion!,
                      nombre: dato?.nombre!,
                      codigo: 0,
                      estado: ''
                    })

                    this.dataSource2.data = this.listAspectos

                    this.dataSource2.data.forEach(aspectos => {
                      this.principal[i].listItem.push(aspectos.descripcion)
                    })                    
                    this.cabinet.reset()

                    this.aspectosGenerales.splice(this.aspectosGenerales.findIndex(item => item.nombre === dato?.nombre), 1);

                  }

                }
              })
            }
          });
        })
      }
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.principal, event.previousIndex, event.currentIndex);
  }
  getSelectProcess(event: any) {
    this.idP = event
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
    let ruta = ""
    let formData = new FormData();
    formData.append('files', this.documento, "Alcances.pdf");
    let secciones: alcanceDetalle[] = []
    this.principal.forEach((element, index) => {
      secciones.push({
        idSeccion: element.id || 0,
        detalle: JSON.stringify(element.listItem)
      })
    });
    //constante para crear alcance
    const DetalleCasos: CasesAlcance = {
      idCaso: this.idCaso,
      idTipoAlcance: 976,
      secciones: secciones,
      idTipoCaso: 972
    }
    formData.append('files', this.documento, "Alcances.pdf");
    this.services.createStartProcessCases(DetalleCasos).toPromise().then(casoDetalle => {
      let post = {
        id: casoDetalle
      }
      this.gestor.contentSitesBasePathByParams('ALCANCEMASIVO', post).toPromise().then(ACSprocess => {
        ruta = ACSprocess.id
        this.gestor.contentSitesFoldersByNodeIdfiles(ruta, formData).toPromise().then(res => {
        })
      })
      this.modal.show({
        icon: 'success',
        title: 'Generación Exitosa',
        text: "Se ha realizado la generación del Alcance exitosamente"
      });
      this.redireccion.navigate(['/programacion/operador/bandeja/alcance/masivos'])
    })
    this.showVisor = false
  }

  Seleccionar(objeto: string) {
    this.objeto = this.principal.find(x => x.nombre == objeto)
    if (objeto == "ANTECEDENTES") {
      this.vAntecedentes = true
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vGenerales = false
      this.vTitulo = "ANTECEDENTES"
      this.dataSource4.data = this.principal[this.principal.indexOf(this.objeto)].listItem
    } if (objeto == "OBJETIVOS") {
      this.vObjetivos = true
      this.vInconsistencias = false
      this.vMinimos = false
      this.vGenerales = false
      this.vTitulo = "OBJETIVOS"
      this.dataSourceObEspecifico.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
    }
    if (objeto == "PROCEDIMIENTOS") {
      this.vMinimos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vGenerales = false
      this.vVista = 3
      this.vTitulo = "PROCEDIMIENTOS"
      this.dataSource.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
    }
    if (objeto == "INCONSISTENCIAS") {
      this.vInconsistencias = true
      this.vAntecedentes = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 0
      this.vTitulo = "INCONSISTENCIAS"
    }
    if (objeto == "ASPECTOS GENERALES") {
      this.vMinimos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vGenerales = false
      this.vVista = 3
      this.vTitulo = "ASPECTOS GENERALES"
      this.dataSource.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
    }
  }
  getCatalogRegion() {
    this.servicesD.getManagaments().toPromise().then(res => {
      this.gerencias = res;
    })
  }
  AspectosGenerales() {
    this.catalogo.getCatSonAdmin(91).toPromise().then(res => {
      this.aspectosGenerales = res
    })
  }
  agregarAspecto() {
    var i = this.principal.indexOf(this.principal.find(x => x.id == 987)!);
    const dato = this.selectAspecto
    if (this.cabinet.get('aspecto')?.value == null || this.cabinet.get('aspecto')?.value == undefined) {
      this.dialogService.show({
        title: 'IFI-400',
        text: `Debe seleccionar un aspecto general`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    } else {
      this.listAspectos.push({
        descripcion: dato?.descripcion!,
        nombre: dato?.nombre!,
        codigo: 0,
        estado: ''
      })
      this.dataSource2.data = this.listAspectos
      this.dataSource2.data.forEach(aspectos => {
        this.principal[i].listItem.push(aspectos.descripcion)
      })

      this.dataSource2.data = this.listAspectos
      this.cabinet.reset()

      this.aspectosGenerales.splice(this.aspectosGenerales.findIndex(item => item.nombre === dato.nombre), 1);
    }
  }
  GetProcess() {
    this.catalogo.getCatSonAdmin(200).toPromise().then(res => {
      this.catalogosHijo = res
      this.refres = res
    })
  }
  agregarProcedimiento() {
    var i = this.principal.indexOf(this.objeto);
    const dato = this.selectHijo

    if (this.cabinet.get('select')?.value == null || this.cabinet.get('select')?.value == undefined) {
      this.dialogService.show({
        title: 'IFI-400',
        text: `Debe seleccionar un procedimiento`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    } else {
      this.listProcedimientos.push({
        descripcion: dato?.descripcion!,
        nombre: dato?.nombre!,
        codigo: 0,
        estado: ''
      })
      this.dataSource5.data = this.listProcedimientos
      this.dataSource5.data.forEach(procedimiento => {
        this.principal[i].listItem.push(procedimiento.descripcion)
      })


      this.catalogosHijo.splice(this.catalogosHijo.findIndex(item => item.nombre === this.select?.nombre) - 1, 1);
    }
    this.cabinet.reset()
  }
  ///AQUI VA LE NUEW METODO
  getProcedimientosAlcances() {
    this.servicesD.getCatalogProcessComplaint(56).toPromise().then(res => {
      this.catalogosPadre = res
    })
  }
  getProcessMasive() {
    this.servicesD.getProcessMasive().toPromise().then(res => {
      this.tipos = res
    })
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo carga el catalogo child del componente padre.
   * 
   */
  UpgradeChild() {
    let idCatalogo = this.select
    this.catalogo.getCatSonAdmin(Number(idCatalogo)).toPromise().then(res => {
      this.catalogosHijo = res
    })
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
      nodes: [new CustomNode<RichTextComponent>('editar', RichTextComponent, { initialValue: item }).apply({
        singleLine: true,
        options: this.options,
        outputFormat: "html"
      })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('editarB', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.estructura = this.estructura
    this.modal.show({
      title: `Editar `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })
  }

  Hallazgos() {
    this.micro.getFindings(this.idCaso).toPromise().then((res: any) => {
      this.dataSource11.data = res
      this.saveInconsistencias()
    })


  }
  EliminarAspecto(item: any) {
    let index = this.principal.indexOf(this.objeto)
    var i = this.dataSource2.data.indexOf(item);
    i !== -1 && this.dataSource2.data.splice(i, 1);
    this.dataSource2.data = this.dataSource2.data
    this.principal[index].listItem = []
    this.dataSource2.data.forEach(element => {
      this.principal[index].listItem.push(element.descripcion)
    });
    this.aspectosGenerales.push(item);
  }

  reloadInconsistencias() {
    this.Hallazgos()
  }
  EliminarProceso(item: any) {
    let index = this.principal.indexOf(this.objeto)
    var i = this.dataSource5.data.indexOf(item);
    i !== -1 && this.dataSource5.data.splice(i, 1);
    this.dataSource5.data = this.dataSource5.data
    this.principal[index].listItem = []
    this.dataSource5.data.forEach(element => {
      this.principal[index].listItem.push(element.descripcion)
    });
    this.catalogosHijo.push(item)
  }

  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que permite agregar un procedimiento seleccionado a la tabla y luego mostrarlo en el scope
   */
  addGeneralObject() {
    let datos = this.selectHijo
    //OBJETIVOS ESPECÍFICOS O ASPECTOS GENERALES
    this.listProcedimientos.push({
      descripcion: datos?.descripcion!,
      nombre: datos?.nombre!,
      codigo: 0,
      estado: ''
    })
    this.dataSource3.data = this.listProcedimientos || []
  }
  agregar() {

    let datos = this.select?.descripcion;
    this.objetivoEliminado.push(this.select!)

    var i = this.principal.indexOf(this.objeto);
    if ((this.cabinet.get('objetivo')?.value == null || this.cabinet.get('objetivo')?.value == undefined) || (!this.vOtro && this.cabinet.get('objetivo')?.value == 0)) {
      this.dialogService.show({
        title: 'IFI-400',
        text: `Debe seleccionar un objetivo`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    } else if (this.vObjetivos == true || this.vMinimos == true) {

      if (this.vOtro == true) {
        let item = this.estructura.getControlById('otro')?.value
        if (item.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length == 0) {
          this.modal.show({
            icon: 'error',
            title: 'Error',
            text: "No puede dejar el campo vacio",
          }).then(result => {
            if (result == "primary") {
              this.vOtro = false
              this.modal.close()
            }
          })

        } else {
          this.principal[i].listItem.push(this.estructura.getControlById('otro')?.value + "")
          this.vOtro = false
        }

      } else {
        this.principal[i].listItem.push(datos + "")

        this.catalogos.splice(this.catalogos.findIndex(item => item.nombre === this.select?.nombre), 1);
      }
      if (this.vMinimos == true) {
        this.dataSourceObEspecifico.data = this.principal[i].listItem
        this.dataSourceObEspecifico.paginator = this.dataSourceObEspecifico.paginator
      }
      this.dataSourceObEspecifico.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
    }
    this.cabinet.reset()
  }

  async saveInconsistencias() {
    let i = -1
    let datos: FindingDetail[] = this.dataSource11.data
    let conjuntoData: string = ""
    this.principal.forEach((x, index) => {

      if (x.nombre == "INCONSISTENCIAS") {
        i = index
        //if (this.principal[i].listItem.length == 0 || this.principal[i].listItem.length < datos.length || this.principal[i].listItem.length > datos.length || this.principal[i].listItem.length == 1) {
        this.principal[i].listItem = []
        datos.forEach(element => {
          let desc = element.descripcion.split("<p>")
          let descFinal: string = ""
          desc.forEach(x => {
            if (x != "") {
              descFinal += x
            }
          })
          conjuntoData = "<p><strong>" + element.nombre + ": </strong> " + descFinal
          this.principal[i].listItem.push(conjuntoData)
        }
        );
      }
    })

  }

  saveAll(item: any) {
    var i = this.principal.indexOf(item);
    let textoDenuncia = ``
    let texto = ``
    /** Se setea la data de procedimientos al array principal PROCEDIMIENTOS*/
    if (this.vTitulo == "PROCEDIMIENTOS") {
      this.dataSource5.data.forEach(proceso => {
        this.principal[i].listItem.push(proceso.descripcion)
      })
    }
    /** Se setea la data de procedimientos al array principal ASPECTOS*/
    if (this.vTitulo == "ASPECTOS GENERALES") {
      this.dataSource2.data.forEach(aspectos => {
        this.principal[i].listItem.push(aspectos.descripcion)
      })
    }
    else {
      this.vtextArea.forEach(element => {
        this.principal[i].listItem.push("<p><h4>" + element + "</h4></p>")
      })
    }
    this.modal.show({
      icon: 'success',
      title: 'Informacion Guardada',
      text: 'Su informacion ha sido guardada correctamente',
      showConfirmButton: true,
      showCloseButton: true,
    })
  }

  Editar(item: string) {
    this.id = this.dataSource.data.indexOf(item);
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [new CustomNode<RichTextComponent>('editar', RichTextComponent, { initialValue: item }).apply({
        singleLine: true,
        options: this.options,
        outputFormat: "html"
      })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('editarB', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura

    this.modal.show({
      title: `Editar `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })
  }
  async GenerarAlcance() {
    this.saveInconsistencias();
    let inconsistenciasSection = this.principal.find(x => x.nombre == "INCONSISTENCIAS")
    let seleccionado = false
    let crear = true
    var i = this.principal.indexOf(inconsistenciasSection!);

    if (this.principal[i].completed == false) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'No se puede generar alcance por que no seleciono el item "Inconsistencias".',
        icon: 'warning',
        disableClose: true
      })
    }

    else if (this.principal[i].listItem.length == 0) {
      this.dialogService.show({
        title: 'Detalle alcance.',
        text: 'No se puede generar alcance por que no selecciono ninguna "inconsistencia".',
        icon: 'warning',
        disableClose: true
      })
    }


    else {
      let texto2 = await this.micro.getTemplate(Constantes.DENUNCIA).toPromise()
      let header = texto2.encabezado
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
  }
  .table, th, td {
    border: 1px solid ;
     font-size:8pt;
   }
   .th{
    background-color: #5DADE2;
   }
  @page {
        size: A4;
        margin: 18mm;
        margin-top: 250px;
        @top-left {
            content: element(header);
            font-size:11pt;
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
</style></head>`
      let texto: string = `</div><div class="header">` + header + `</div>`
      let piePagina = `<body class="body"><div class="footerRight">`
      texto += `</div><ol>`
      let contenido = texto2.piePagina.match(/<([^}]*)>/g);
      let variables = texto2.piePagina.match(/{([^}]*)}/g);
      contenido.forEach((element: any, index: number) => {
        piePagina += element
        if (index <= variables.length) {
          switch (variables[index]) {
            case "{usuario}":
              if (this.usuario != null) {
                piePagina += this.usuario.login
              } else {
                piePagina += "usuario"
              }
              break;
            case "{fecha}":
              piePagina += new Date().toLocaleDateString()
              break;
          }
        }

      })

      this.principal.forEach(element => {

        if (element.completed) {
          seleccionado = true

          if (element.listItem.length > 0) {
            texto += "<li><strong>" + element.nombre + "</strong></li>"
            element.listItem.forEach(item => {
              texto += "<p>" + item + "</p><br>"
            })
          }
          else {
            this.modal.show({
              icon: 'error',
              title: 'Error Ítem vacio',
              text: "Se ha encontrado el contenido de " + element.nombre + " vacio, por favor verifique",
            });
            crear = false
          }

        }

      })

      texto += "</ol></body></html>"
      let post: docPdf = {
        datos: encabezado + piePagina + texto,
        idCaso: 0,
        idEstado: this.estado
      }
      if (crear && seleccionado) {
        await this.micro.generationPdf(post).toPromise().then(res => {
          texto = ""
          this.documento = res
          this.showVisor = true

        })
      }
      else {
        if (!seleccionado) {
          this.modal.show({
            icon: 'error',
            title: 'Error Seleccion',
            text: "No ha seleccionado ningun Titulo",
          });
        }
      }
    }
  }
  editarLista() {
    this.id !== -1 && this.dataSource.data.splice(this.id, 1);
    let item = this.estructura.getControlById('editar')?.value
    item = item.replace(/<p>|<\/p>|&nbsp;|\s/g, "")
    if (item.length == 0) {
      this.modal.show({
        icon: 'error',
        title: 'Error',
        text: "No puede dejar el campo vacio",
      }).then((result) => {
        if (result == 'primary') {
          this.modal.close('primary');
        }
      })
    } else {
      this.dataSource.data.splice(this.id, 1, this.estructura.getControlById('editar')?.value);
      this.principal[this.principal.indexOf(this.objeto)].listItem = this.dataSource.data
      this.dataSource4.data = this.principal[this.principal.indexOf(this.objeto)].listItem
      this.modal.close('primary');
    }
  }
  Eliminar(item: any) {
    var i = this.dataSourceObEspecifico.data.indexOf(item);
    i !== -1 && this.dataSourceObEspecifico.data.splice(i, 1);
    this.dataSourceObEspecifico.data = this.dataSourceObEspecifico.data
    this.catalogos.push(this.objetivoEliminado.find(res => res.descripcion.match(item))!)
    var k = this.objetivoEliminado.findIndex(res => res.descripcion.match(item))
    k !== -1 && this.objetivoEliminado.splice(k, 1)

  }

  EliminarAntecedente(item: any) {
    let index = this.principal.indexOf(this.objeto)
    var i = this.dataSource4.data.indexOf(item);
    i !== -1 && this.dataSource4.data.splice(i, 1);
    this.dataSource4.data = this.dataSource4.data
    this.principal[index].listItem = []
    this.dataSource4.data.forEach(element => {
      this.principal[index].listItem.push(element.descripcion)
    });
  }

  onEvent(id: string, value: any): void {
  }
  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.agregar();
      this.modal.close('primary');
    }

    else if (actionId == 'editarB') {
      this.editarLista();
      // this.modal.close('primary');
    }
    else if (actionId == 'guardarItem') {
      let item2: Catalog[] = this.dataSource2.data
      item2.push({ codigo: this.estructura.getControlById('meta')?.value, nombre: this.select })
      this.dataSource2.data = item2
      //this.modal.close('primary');
    }
    else if (actionId == 'cancelar') {
      this.modal.close('cancel');
      this.vOtro = false
    }
  }
  Otro() {
    this.vOtro = true
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [new CustomNode<RichTextComponent>('otro', RichTextComponent).apply({
        singleLine: true,
        options: this.options,
        outputFormat: "html"
      })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura

    this.modal.show({
      title: `Otros `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })
  }
  async Antecedentes() {
    await this.catalogo.getCatSonAdmin(88).toPromise().then(res => {
      this.objeto = this.principal.find(x => x.nombre == "ANTECEDENTES")
      res.forEach(element => {
        this.principal[this.principal.indexOf(this.objeto)].listItem.push(element.descripcion)
      })
      this.dataSource4.data = res

    })
  }
  ObjetivoE() {
    this.catalogo.getCatSonAdmin(89).toPromise().then(res => {
      this.catalogos = res
    })
  }
  itemToString(item: Topic[]): string {
    if (item != null) {
      return item.map(i => `${i.impuesto}/${i.rubro}`).join(', ');
    }
    return "Sin rubro seleccionado";
  }
  regresar() {
    this.showVisor = false
    this.nodeId = ""
  }

}
function InputCore(arg0: string) {
  throw new Error('Function not implemented.');
}

