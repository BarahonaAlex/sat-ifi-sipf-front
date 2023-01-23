import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Button, CustomNode, FormStructure, Input, TextArea } from 'mat-dynamic-form';
import { listaAlcances, docPdf, metaAlcanceMasivo, alcance, alcanceDetalle } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { Catalog, Item } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { FindingDetail, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Input as InputCore } from '@angular/core';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { MatPaginator } from '@angular/material/paginator';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { MatStepper } from '@angular/material/stepper';
import { PresenciasFiscales } from 'src/app/general-module/componentes-comunes/interfaces/presencias-fiscales';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';
import * as moment from 'moment';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
@Component({
  selector: 'app-alcances-masivo',
  templateUrl: './alcances-masivo.component.html',
  styleUrls: ['./alcances-masivo.component.scss']
})
export class AlcancesMasivoComponent implements OnInit {

  /* variables para permitir solo numero en un input*/
  key: any;
  teclado: any;
  numero: any;
  especiales: any;
  teclado_especial!: boolean;

  @InputCore('idCase') idCase!: number
  principal: listaAlcances[] = [
    { nombre: 'ANTECEDENTES', listItem: [], completed: false, id: 980 },
    { nombre: 'OBJETIVOS GENERAL', listItem: [], completed: false, id: 978 },
    { nombre: 'OBJETIVOS ESPECÍFICOS', listItem: [], completed: false, id: 981 },
    { nombre: 'META', listItem: [], completed: false, id: 982 },
    { nombre: 'PROCEDIMIENTOS', listItem: [], completed: false, id: 983 },
  ]
  @ViewChild('MatLugares') set matPaginatorLugares(mp1: MatPaginator) {
    this.dataSourceLugares.paginator = mp1
  }
  @ViewChild('MatAntecedentes') set matPaginatorAntecedentes(mp1: MatPaginator) {
    this.dataSourceAntecedentes.paginator = mp1
  }
  @ViewChild('MatObGeneral') set matPaginatorObGeneral(mp2: MatPaginator) {
    this.dataSourceObGeneral.paginator = mp2
  }
  @ViewChild('MatObEspecifico') set matPaginatorObEspecifico(mp3: MatPaginator) {
    this.dataSourceObEspecifico.paginator = mp3
  }
  @ViewChild('MatMeta') set matPaginatorMeta(mp4: MatPaginator) {
    this.dataSource.paginator = mp4
  }
  @ViewChild('MatItem') set matPaginatorItem(mp5: MatPaginator) {
    this.dataSource2.paginator = mp5
  }
  @ViewChild('MatProcedimientos') set matPaginatorProcedimientos(mp5: MatPaginator) {
    this.dataSource4.paginator = mp5
  }
  @ViewChild('MatLugar') set matPaginatorLugar(mp6: MatPaginator) {
    this.dataSource3.paginator = mp6
  }
  @ViewChild('chekSelect') chekSelect!: MatCheckbox
  @ViewChild('stepper') stepper!: MatStepper;
  columns = ['caso', 'acciones'];
  columns2 = ['gerencia', 'meta'];
  columns3 = ['fecha', 'dias', 'horarioInicio', 'horarioFin', 'lugar', 'acciones'];
  columns4 = ['Nombre', 'Descripcion', 'acciones'];
  columnsLugares = ['Departamento', 'Municipio', 'acciones'];
  dataSource4 = new MatTableDataSource();
  dataSource3 = new MatTableDataSource<metaAlcanceMasivo>();
  dataSource2 = new MatTableDataSource<Catalog>();
  dataSource = new MatTableDataSource<string>();
  dataSourceAntecedentes = new MatTableDataSource<string>();
  dataSourceObGeneral = new MatTableDataSource<string>();
  dataSourceObEspecifico = new MatTableDataSource<string>();
  dataSourceLugares = new MatTableDataSource();
  vAntecedentes: Boolean = false
  vInconsistencias: Boolean = false
  vObjetivos: Boolean = false
  vMinimos: Boolean = false
  vGenerales: Boolean = false
  vVista: number = 0
  vTitulo: string = ""
  catalogos?: Item[]//ANTECEDENTES
  catalogosAntecentes!: Item[]
  catalogosGeneral!: Item[]
  catalogosEspecificos!: Item[]
  catalogosMetaGeneral  !: Item[]
  catalogosProcedimiento!: Item[]
  vtextArea: string[] = []
  select?: Item;
  selectStr?: string;
  selectHijo?: any;
  vReporte: listaAlcances[] = []
  nitContribuyente!: string
  vOtro: Boolean = false
  estructura!: FormStructure;
  showVisor = false
  id !: number
  estado!: number
  objeto!: any
  arrayProperties: { name: string, key: string }[] = [];
  documento!: Blob
  catalogosMeta!: Catalog[];
  catalogosPadre!: Catalog[];
  catalogosHijo!: Catalog[];
  catalogoDepartamento!: Catalog[];
  catalogoMunicipio!: Catalog[];
  catalogosDepHijo!: Catalog[];
  catalogosGerencia!: Catalog[];
  listProcedimientos: Item[] = [];
  depaSelect: any;
  muniSelect: any;
  programa: any;
  detalleGroup!: FormGroup;
  processSelectProcess!: FormGroup;
  idFormulario: number = 0;
  idAlcance!: number;
  nodeId!: string;
  tituloTempleate: string = "Elaboracion de Formulario";
  idProceso!: string
  vComentario?: string
  usuario!: UserLogged;
  catalogoLugar!: string[];
  cambios: boolean = false;
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
        this.gestor.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
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
  /*************************************/
  /*************************************/
  constructor(
    private micro: AlcancesService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private gestor: GestorService,
    private router: ActivatedRoute,
    private redireccion: Router,
    private microPresencias: PresenciasFiscalesService,
    private user: UserService,
    private injector: Injector,
    private ngZone: NgZone
  ) {
    this.detalleGroup = new FormGroup({
      pedirodoDel: new FormControl(),
      pedirodoAl: new FormControl(),
      programa: new FormControl(),
      meta: new FormControl(),
      ejecucion: new FormControl(),
      gerencia: new FormControl(),
      horaInicio: new FormControl(),
      horaFin: new FormControl(),
      dias: new FormControl(),
      lugarEjecucion: new FormControl()
    });
    this.processSelectProcess = new FormGroup({
      proceso: new FormControl(''),
      select: new FormControl(''),
    });
  }

  /*************************************/
  /*************************************/

  async ngOnInit() {

    this.router.paramMap.subscribe(async params => {
      this.idFormulario = parseInt(params.get('id') ?? '0');
    });
    this.microPresencias.getPresencesById(this.idFormulario).toPromise().then(res => {
      if (res != null) {
        this.detalleGroup.patchValue({
          pedirodoDel: moment(res.fechaInicio.toString()).format('YYYY-MM-DD'),
          pedirodoAl: moment(res.fechaFin.toString()).format('YYYY-MM-DD'),
          programa: res.idPrograma,
          meta: res.meta,
          gerencia: res.idGerencia
        });

        this.idProceso = res.idProceso || ""
        this.estado = res.idEstado || 0;
        this.idAlcance = res.idAlcance || 0;
        //this.idFormulario = res.idFormulario || 0;
        if (res.idEstado == 18 || res.idEstado == 19) {
          this.vOtro = true
          this.tituloTempleate = "Verificacion de Formulario"
          this.detalleGroup.disable();
        } else if (res.idEstado == 181) {
          this.micro.getScopePresencias(res.idAlcance || 0).toPromise().then(res => {
            res.masivo.forEach((x, index) => {
              if (this.principal.find(y => y.id == x.idSeccion)) {
                JSON.parse(x.detalle + "").forEach((z: any) => {
                  this.principal.find(y => y.id == x.idSeccion)?.listItem.push(z)
                  if (this.principal.find(y => y.id == 983) == this.principal.find(y => y.id == x.idSeccion)) {
                    this.listProcedimientos.push(z)
                  }
                  if (z != null) {
                    let i = this.principal.indexOf(this.principal.find(y => y.id == x.idSeccion)!)
                    this.principal[i].completed = true
                  }
                })
              }
              //this.principal.find(y => y.id == x.idSeccion)?.listItem.push(JSON.parse(x.detalle+"")+"")
            });
            this.vComentario = res.comentario.comentarios
          })
        } else {

          this.loadAntecedentes()
          this.loadObgeneral()
          this.Meta()

          this.metaCatalogo()

        }
        this.metaCatalogo()
        this.loadEspecifico()
        this.loadProcedimiento()
        this.dataSourceLugares.data = JSON.parse(res.lugarDepartamental);
        this.catalogoLugar = []
        this.dataSourceLugares.data.forEach((x: any) => {
          this.catalogoLugar.push(x.municipio)
        })
        this.dataSource3.data = JSON.parse(res.lugarEjecucion + "");
      }
      else {
        this.estado = 177;
        this.loadAntecedentes()
        this.loadObgeneral()
        this.Meta()
        this.loadEspecifico()
        this.loadProcedimiento()
        this.metaCatalogo()
      }

    })
    this.catalogo.getCatalogDataByIdCatalog(77).toPromise().then(res => {
      this.catalogoDepartamento = res

    })
    this.catalogo.getCatalogDataByIdCatalog(78).toPromise().then(res => {
      this.catalogoMunicipio = res

    })

    this.micro.getProgram(42).toPromise().then(res => {
      this.programa = res
    })

    this.user.getUserLogged().toPromise().then(result => {
      this.usuario = result;
    })
  }
  //Ingreso de Formulario 
  /*************************************/
  /*************************************/
  CargarMunicipio(idpadre: number) {

    let catalogo: Catalog[] = this.catalogoMunicipio.filter(x => x.codigoDatoPadre == idpadre)
    this.catalogosDepHijo = catalogo
  }
  /*************************************/
  /*************************************/
  AgregarLugar() {

    if (this.depaSelect !== undefined && this.muniSelect !== undefined) {
      let lugar = { departamento: this.depaSelect.nombre, municipio: this.muniSelect.nombre }
      if (this.dataSourceLugares.data.find((x: any) => x.municipio == lugar.municipio)) {
        this.modal.show({
          icon: 'error',
          title: 'Lugares Repetidos',
          text: "El municipio ya se encuentra en la lista"
        });
      } else {
        this.dataSourceLugares.data.push(lugar)
      }
      this.catalogoLugar = []
      this.dataSourceLugares.data.forEach((x: any) => {
        this.catalogoLugar.push(x.municipio)
      })
      this.dataSourceLugares.data = this.dataSourceLugares.data
      this.cambios = true
    } else {
      this.modal.show({
        icon: 'error',
        title: 'Lugar incompleto',
        text: "No se ha terminado de seleccionar el lugar correctamente"
      });
    }



  }
  /*************************************/
  /*************************************/
  AgregarLugarEjecucion() {

    if (moment(this.detalleGroup.controls['ejecucion'].value).format('YYYY-MM-DD') >= moment(this.detalleGroup.controls['pedirodoDel'].value).format('YYYY-MM-DD') &&
      moment(this.detalleGroup.controls['ejecucion'].value).format('YYYY-MM-DD') <= moment(this.detalleGroup.controls['pedirodoAl'].value).format('YYYY-MM-DD')) {
      if (this.detalleGroup.controls['horaFin'].value != null && this.detalleGroup.controls['horaInicio'].value != null) {
        this.dataSource3.data.push({
          dias: this.detalleGroup.controls['dias'].value,
          fecha: this.detalleGroup.controls['ejecucion'].value,
          horarioFin: this.detalleGroup.controls['horaFin'].value,
          horarioInicio: this.detalleGroup.controls['horaInicio'].value,
          lugar: this.detalleGroup.controls['lugarEjecucion'].value
        })
      } else {
        this.modal.show({
          icon: 'error',
          title: 'Hora Incorrecta',
          text: "No se a completado el horario de ejecucion"
        });
      }

    } else {
      this.modal.show({
        icon: 'error',
        title: 'Fecha  incorrecta',
        text: "Se ha escogido una fecha fuera del limite del periodo"
      });
    }



    this.dataSource3.data = this.dataSource3.data
    this.cambios = true
  }
  /*************************************/
  /*************************************/
  EliminarLugar(item: any) {
    var i = this.dataSourceLugares.data.indexOf(item);
    i !== -1 && this.dataSourceLugares.data.splice(i, 1);
    this.dataSourceLugares.data = this.dataSourceLugares.data
    this.cambios = true
  }
  /*************************************/
  /*************************************/
  EliminarLugarEjecucion(item: any) {
    var i = this.dataSource3.data.indexOf(item);
    i !== -1 && this.dataSource3.data.splice(i, 1);
    this.dataSource3.data = this.dataSource3.data
    this.cambios = true
  }
  /*************************************/
  /*************************************/
  displayValue() {
    if (this.dataSourceLugares.data.length > 0) {
      // moment(res.fechaInicio.toString()).format('YYYY-MM-DD')
      if (moment(this.detalleGroup.controls['pedirodoDel'].value).format('YYYY-MM-DD') < moment(this.detalleGroup.controls['pedirodoAl'].value).format('YYYY-MM-DD')) {
        if (this.detalleGroup.controls['meta'].value > 0 && this.dataSource3.data.length > 0 && this.detalleGroup.controls['gerencia'].value != null) {
          this.CrearFormulario();
        } else {
          if (this.detalleGroup.controls['gerencia'].value == null) {
            this.modal.show({
              icon: 'error',
              title: 'Sin seleccionar gerencia',
              text: "No se a seleccionado gerencia"
            });
          } else if (this.detalleGroup.controls['meta'].value == null) {
            this.modal.show({
              icon: 'error',
              title: 'Sin meta programada',
              text: "No se a ingresado el valor de la meta programada",
            });
          } else if (this.dataSource3.data.length == 0) {
            this.modal.show({
              icon: 'error',
              title: 'Sin lugar de ejecución',
              text: "No se a ingresado lugares para la ejecución",
            });
          }

        }
      } else {
        this.modal.show({
          icon: 'error',
          title: 'Periodos Incorrectos',
          text: "Se ha escogido un periodo incorrecto"
        });
      }

    } else {
      this.modal.show({
        icon: 'error',
        title: 'Lugares Incompletos',
        text: "No se ha agregado ningun lugar para realizar el estudio"
      });
    }

  }
  /*************************************/
  /*************************************/
  Cambios() {
    this.cambios = true
  }
  /*************************************/
  /*************************************/
  CrearFormulario() {

    let geren: Catalog = this.catalogosGerencia.find(x => x.codigo == this.detalleGroup.controls['gerencia'].value) || {}
    let formulario!: PresenciasFiscales
    if (this.idFormulario == 0) {
      formulario = {
        fechaInicio: this.detalleGroup.controls['pedirodoDel'].value,
        fechaFin: this.detalleGroup.controls['pedirodoAl'].value,
        idPrograma: this.detalleGroup.controls['programa'].value,
        meta: this.detalleGroup.controls['meta'].value,
        lugarDepartamental: JSON.stringify(this.dataSourceLugares.data),
        idGerencia: geren.codigo,
        lugarEjecucion: JSON.stringify(this.dataSource3.data),
      }

      this.microPresencias.createPresences(formulario).toPromise().then(res => {
        this.idFormulario = res.idFormulario || 0
        this.modal.show({
          icon: 'success',
          title: 'Formulario Creado',
          text: "Se ha creado el formulario correctamente"
        });

      })
    } else {
      //Actualizar
      formulario = {
        idFormulario: this.idFormulario,
        fechaInicio: this.detalleGroup.controls['pedirodoDel'].value,
        fechaFin: this.detalleGroup.controls['pedirodoAl'].value,
        idPrograma: this.detalleGroup.controls['programa'].value,
        meta: this.detalleGroup.controls['meta'].value,
        lugarDepartamental: JSON.stringify(this.dataSourceLugares.data),
        idGerencia: geren.codigo,
        lugarEjecucion: JSON.stringify(this.dataSource3.data),
      }

      this.microPresencias.updatePresencia(formulario).toPromise().then(res => {
        this.modal.show({
          icon: 'success',
          title: 'Formulario Creado',
          text: "Se ha creado el formulario correctamente"
        });
      })

    }
    let item2: Catalog[] = []
    item2.push({ codigo: this.detalleGroup.controls['meta'].value, nombre: geren.nombre })
    this.dataSource2.data = item2
    this.stepper.next();

    //
  }

  /*************************************/
  /*************************************/
  verAlcance() {
    const post = {
      id: this.idAlcance
    }
    this.microPresencias.getPath(post).toPromise().then(res => {
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        this.nodeId = result.list.entries[0].entry.id
        this.showVisor = true
        this.stepper.next();
      })
    })
  }
  //Creacion del Alcances   
  drop(event: CdkDragDrop<string[]>) {

    moveItemInArray(this.principal, event.previousIndex, event.currentIndex);

  }

  /*************************************/
  /*************************************/
  Seleccionar(objeto: string) {

    this.objeto = this.principal.find(x => x.nombre == objeto)

    if (objeto == "ANTECEDENTES") {
      this.vAntecedentes = true
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 0
      this.vTitulo = "ANTECEDENTES"

      this.dataSourceAntecedentes.data = this.principal[this.principal.indexOf(this.objeto)].listItem

    } if (objeto == "META") {
      this.vInconsistencias = true
      this.vAntecedentes = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 2
      this.vTitulo = "META"


      this.dataSource.data = this.principal[this.principal.indexOf(this.objeto)].listItem


    } if (objeto == "OBJETIVOS GENERAL") {
      this.vObjetivos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 0
      this.vTitulo = "OBJETIVOS GENERAL"

      this.dataSourceObGeneral.data = this.principal[this.principal.indexOf(this.objeto)].listItem


    }
    if (objeto == "OBJETIVOS ESPECÍFICOS") {
      this.vMinimos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vGenerales = false
      this.vVista = 1
      this.vTitulo = "OBJETIVOS ESPECÍFICOS"
      this.dataSourceObEspecifico.data = this.principal[this.principal.indexOf(this.objeto)].listItem
    }
    if (objeto == "PROCEDIMIENTOS") {
      this.vGenerales = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vVista = 3
      this.vTitulo = "PROCEDIMIENTOS"
      this.dataSource4.data = this.principal[this.principal.indexOf(this.objeto)].listItem
    }

  }
  /*************************************/
  /*************************************/

  agregar() {

    /*    if (this.vOtro) {
         this.Otro();
       } else { */
    let datos = this.selectStr;
    var i = this.principal.indexOf(this.objeto);
    if (this.vMinimos == true) {
      if (this.vOtro == true) {
        let item = this.estructura.getControlById('otro')?.value
      item = item.replace(/<p>|<\/p>|&nbsp;|\s/g, "")
        if (item.length == 0) {
          this.vOtro = false
          this.modal.show({
            title: "IFI-400",
            text: "No se puede agregar un ítem vacío",
            icon: "error"
          }).then((result) => {
            if (result == 'primary') {
              this.modal.close('primary');
            }
          })

        } else {
          this.principal[i].listItem.push(this.estructura.getControlById('otro')?.value + "")
          this.dataSourceObEspecifico.data = this.principal[i].listItem
          this.vOtro = false
          this.modal.close('primary');
        }
      } /* else {
          if (this.vMinimos == true) {
            this.dataSourceObEspecifico.data = this.principal[i].listItem
            this.dataSourceObEspecifico.paginator = this.dataSourceObEspecifico.paginator
          }
          this.dataSource.data = this.principal[this.principal.indexOf(this.objeto)].listItem
        } */
      else {
        if (datos != '0') {
          if (this.principal[i].listItem.find(x => x == datos)) {
            this.modal.show({
              title: "IFI-400",
              text: "El ítem ya existe",
              icon: "error",
            });
          } else {
            this.principal[i].listItem.push(datos || "")
            this.dataSourceObEspecifico.data = this.principal[i].listItem
            this.dataSourceObEspecifico.paginator = this.dataSourceObEspecifico.paginator
          }
        } else {
          this.modal.show({
            title: "IFI-400",
            text: "No se puede agregar un ítem vacío",
            icon: "error"
          });
        }

      }
    }
    //}
  }

  /*************************************/
  /*************************************/

  agregarProcedimiento() {
    let datos = this.selectHijo;
    let duplicado: boolean = false;

    if (datos !== undefined && datos !== "" && datos !== null) {
      for (let i = 0; i < this.listProcedimientos.length; i++) {
        if (this.listProcedimientos[i].nombre == datos?.nombrePadre && this.listProcedimientos[i].descripcion == datos?.descripcion) {
          duplicado = true;
          this.catalogosHijo = []
          this.processSelectProcess.reset()
          this.modal.show({
            icon: 'warning',
            title: 'Procedimiento duplicado',
            text: 'El procedimiento seleccionado ya se encuentra ingresado.',
            showConfirmButton: true,
            showCloseButton: false,
          })
          break;
        }
      }
      if (!duplicado) {
        this.listProcedimientos.push({
          descripcion: datos?.descripcion,
          nombre: datos?.nombrePadre,
          codigo: 0,
          estado: '',
          codigoIngresado: '0'
        })
        this.dataSource4.data = this.listProcedimientos;
        this.catalogosHijo = []
        this.processSelectProcess.reset();
      }
    } else {
      this.modal.show({
        icon: 'warning',
        title: 'Procedimiento no seleccionado',
        text: 'No se ha seleccionado ningun procedimiento para agregar',
        showConfirmButton: true,
        showCloseButton: false,
      })
    }
  }

  /*************************************/
  /*************************************/
  saveAll() {
    let texto = ``
    this.principal.forEach((x, index) => {
      if (x.nombre == "META") {
        texto = `<table style="border-collapse: collapse; width: 100%;  " border="1" data-mce-selected="1">
        <colgroup>
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
        </colgroup>
        <tbody>
        <tr style="color: #FFF; background-color: #0A324E; font-family: Arial, Helvetica, sans-serif; font-size: 11pt;">
        <td style="text-align: center;">Gerencia Regional<br></td>
        <td style="text-align: center;">Meta<br></td>
        </tr>`
        this.dataSource2.data.forEach(element => {
          texto += `<tr>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.nombre}</td>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.codigo}</td>
          </tr>`
        })
        texto += `</tbody></table><br><br><table style="border-collapse: collapse; width: 100%;  " border="1" data-mce-selected="1">
        <colgroup>
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 25%;">
        </colgroup>
        <tbody>
        <tr style="color: #FFF; background-color: #0A324E; font-family: Arial, Helvetica, sans-serif; font-size: 11pt;">
        <th style="text-align: center;">Fecha</th>
        <th style="text-align: center;">Día</th>
        <th style="text-align: center;">Horario de Inicio</th>
        <th style="text-align: center;">Horario de Finalizacion</th>
        <th style="text-align: center;">Lugar a Trabajar</th>
        </tr>`
        this.dataSource3.data.forEach(element => {
          texto += `<tr>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${moment(element.fecha).format("DD-MM-YYYY")}</td>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.dias}</td>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.horarioInicio}</td>
          <td style="text-align: center; margin-top: 20px; margin-bottom: 20px; height: 25PX;">${element.horarioFin}</td><td>${element.lugar}</td>
          </tr>`
        })
        texto += `</table>`
        if (this.principal[index].listItem.length == 2) {
          this.principal[index].listItem.push(texto)
        }
        else { this.principal[index].listItem[2] = texto }
      }
      if (x.nombre == "PROCEDIMIENTOS") {
        this.principal[index].listItem = []
        let listJefeSeccion = `<strong>Jefe de Sección de Operativos Fiscales:</strong><p><ul>`
        let listSupervisor = `<strong>Supervisor:</strong><p><ul>`
        let listAuditor = `<strong>Técnico de Fiscalización y/o Técnico de Auditoría Tributaria:</strong><p><ul>`
        this.dataSource4.data.forEach((element: any) => {
          if (element.nombre == "PROCEDIMIENTO JEFE DE SECCION") {

            listJefeSeccion += `<li>${element.descripcion}</li>`
          } else if (element.nombre == "PROCEDIMIENTO SUPERVISOR") {

            listSupervisor += `<li>${element.descripcion}</li>`
          } else {

            listAuditor += `<li>${element.descripcion}</li>`
          }

        })
        listJefeSeccion += `</p></ul>`
        listSupervisor += `</p></ul>`
        listAuditor += `</p></ul>`
        texto = listJefeSeccion + listSupervisor + listAuditor
        if (this.principal[index].listItem.length == 0) {
          this.principal[index].listItem.push(texto)
        } else { this.principal[index].listItem[0] = texto }
      }
    })
    /* if (this.vTitulo == "META") {
      texto = `<table class="default" border="1"><tr><td>Gerencia Regional</td><td>Meta</td></tr>`
      this.dataSource2.data.forEach(element => {
        texto += `<tr><td>${element.nombre}</td><td>${element.codigo}</td></tr>`
      })
      texto += `</table><br><br><table border="1"  class="default"><tr><td>Fecha</td><td>Días</td><td>Horario de Inicio</td><td>Horario de Finalizacion</td><td>Lugar a Trabajar</td></tr>`
      this.dataSource3.data.forEach(element => {
        texto += `<tr><td>${moment(element.fecha).format("DD-MM-YYYY") }</td><td>${element.dias}</td><td>${element.horarioInicio}</td><td>${element.horarioFin}</td><td>${element.lugar}</td></tr>`
      })
      texto += `</table><br><br>`
      if (this.principal[i].listItem.length == 2) {
        this.principal[i].listItem.push(texto)
      }
      else { this.principal[i].listItem[2] = texto }
    } else {
      this.principal[i].listItem = []
      let listJefeSeccion = `<strong>PROCEDIMIENTO JEFE DE SECCION</strong><br><ul>`
      let listSupervisor = `<strong>PROCEDIMIENTO SUPERVISOR</strong><br><ul>`
      let listAuditor = `<strong>PROCEDIMIENTOS AUDITOR</strong><br><ul>`
      this.dataSource4.data.forEach((element: any) => {
        if (element.nombre == "PROCEDIMIENTO JEFE DE SECCION") {

          listJefeSeccion += `<li>${element.descripcion}</li>`
        } else if (element.nombre == "PROCEDIMIENTO SUPERVISOR") {

          listSupervisor += `<li>${element.descripcion}</li>`
        } else {

          listAuditor += `<li>${element.descripcion}</li>`
        }

      })
      listJefeSeccion += `</ul>`
      listSupervisor += `</ul>`
      listAuditor += `</ul>`
      texto = listJefeSeccion + listSupervisor + listAuditor
      if (this.principal[i].listItem.length == 0) {
        this.principal[i].listItem.push(texto)
      } else { this.principal[i].listItem[0] = texto }
    } 


    this.modal.show({
      icon: 'success',
      title: 'Informacion Guardada',
      text: 'Su informacion ha sido guardada correctamente',
      showConfirmButton: true,
      showCloseButton: true,
    })*/
  }
  /*************************************/
  /*************************************/
  async GenerarAlcance() {
    this.saveAll();
    let seleccionado = false
    let crear = true

    let texto2 = await this.micro.getTemplate(Constantes.MASIVO).toPromise()
    let encabezado = `<!DOCTYPE html><html><head> <style>
    .header {
        position: running(header);
        
    }
    .footerRight{
      position: running(footerRight);
      text-align: right;
      font-size:12pt;
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
        content:  'Página 'counter(page) ' de ' counter(pages);
        font-size:12pt;
    }   

    }
   
 
</style></head>`
    let contenido: string = `
    </div><body style="text-align: justify;"><div class="header">
   `
    contenido += texto2.encabezado + "</div>"
    let piePagina = `<div class="footerRight">`
    let contenido2 = texto2.piePagina.match(/<([^}]*)>/g);
    let variables = texto2.piePagina.match(/{([^}]*)}/g);
    contenido2.forEach((element: any, index: number) => {
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
    contenido += piePagina + "</div>"

    let texto: string = `<dl>`
    this.principal.forEach(element => {
      if (element.completed) {
        seleccionado = true
        if (element.listItem.length > 0) {
          if (element.nombre == "OBJETIVOS ESPECÍFICOS") {
            texto += "<p><li><strong>" + element.nombre + ":</strong></li></p><ul>"
            element.listItem.forEach(item => {
              texto += "<li>" + item + "</li>"
            })
            texto += "</ul>"
          } else {
            texto += "<p><li><strong>" + element.nombre + ":</strong></li> </p> "
            element.listItem.forEach(item => {
              texto += "<p>" + item + "</p>"
            })
          }
        } else {
          this.modal.show({
            icon: 'error',
            title: 'Error Ítem vacio',
            text: "Se ha encontrado el contenido de " + element.nombre.toLowerCase() + " vacio, por favor verifique",
          });
          crear = false
        }
      }
    })
    texto += "</dl></body></html>"

    let post: docPdf = {
      datos: encabezado + contenido + texto,

    }

    if (crear && seleccionado) {
      await this.micro.generationPdf(post).toPromise().then(res => {
        texto = ""
        this.documento = res
        this.showVisor = true
        let id = this.principal.findIndex((element: any) => element.nombre == "PROCEDIMIENTOS")
        this.principal[id].listItem = []
        this.dataSource4.data.forEach((element: any) => {
          this.principal[id].listItem.push(element)
        })
        id = this.principal.findIndex((element: any) => element.nombre == "META")
        this.principal[id].listItem = []
        this.dataSource.data.splice(2, 1);
        this.dataSource.data.forEach((element: any) => {
          this.principal[id].listItem.push(element)
        })
      })
    }
    else {
      if (!seleccionado) {
        this.modal.show({
          icon: 'error',
          title: 'Error Selección',
          text: "No ha seleccionado ningun Titulo",
        });
      }
    }

  }
  /*************************************/
  /*************************************/

  Eliminar(item: any) {

    let id = this.principal.indexOf(this.objeto);
    let i = this.principal[id].listItem.indexOf(item);

    switch (this.vTitulo) {
      case "OBJETIVOS ESPECÍFICOS":
        this.principal[id].listItem.splice(i, 1);
        this.dataSourceObEspecifico.data = this.principal[id].listItem
        break;
      case "META":
        this.principal[id].listItem.splice(i, 1);
        this.dataSource.data = this.principal[id].listItem
        break;
      case "ANTECEDENTES":
        this.principal[id].listItem.splice(i, 1);
        this.dataSourceAntecedentes.data = this.principal[id].listItem
        break;
      case "OBJETIVOS GENERAL":
        this.principal[id].listItem.splice(i, 1);
        this.dataSourceObGeneral.data = this.principal[id].listItem
        break;
      case "PROCEDIMIENTOS":
        this.listProcedimientos.splice(this.listProcedimientos.indexOf(item), 1)
        this.dataSource4.data = this.listProcedimientos
        break;
    }

  }
  /*************************************/
  /*************************************/

  EliminarMeta(item: any) {
    var i = this.dataSource2.data.indexOf(item);
    i !== -1 && this.dataSource2.data.splice(i, 1);

    this.dataSource2.data = this.dataSource2.data

  }
  /*************************************/
  /*************************************/

  Editar(item: string) {

    this.id = this.dataSource.data.indexOf(item);

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [/* new TextArea('editarInput', 'Editar', item).apply({
        singleLine: true
      }), */
        new CustomNode<RichTextComponent>('editarInput', RichTextComponent, { initialValue: item }).apply({
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
        new Button('editar', 'Guardar', {
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
  /*************************************/
  changeObjectives() {
    if (Number(this.selectStr) === 0) {
      this.vOtro = true;
    }
    else {
      this.vOtro = false;
    }
  }
  /*************************************/
  /*************************************/

  Otro() {
    this.vOtro = true
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('otro', RichTextComponent).apply({
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
  /*************************************/
  /*************************************/
  editarLista() {
    let item = this.estructura.getControlById('editarInput')?.value
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
      switch (this.vTitulo) {
        case "OBJETIVOS ESPECÍFICOS":
          this.dataSourceObEspecifico.data.splice(this.id, 1, this.estructura.getControlById('editarInput')?.value);
          this.dataSourceObEspecifico.data = this.dataSourceObEspecifico.data
          this.modal.close()
          break;
        case "META":
          this.dataSource.data.splice(this.id, 1, this.estructura.getControlById('editarInput')?.value);
          this.dataSource.data = this.dataSource.data
          this.modal.close()
          break;
        case "ANTECEDENTES":
          this.dataSourceAntecedentes.data.splice(this.id, 1, this.estructura.getControlById('editarInput')?.value);
          this.dataSourceAntecedentes.data = this.dataSourceAntecedentes.data
          this.modal.close()
          break;
        case "OBJETIVOS GENERAL":
          this.dataSourceObGeneral.data.splice(this.id, 1, this.estructura.getControlById('editarInput')?.value);
          this.dataSourceObGeneral.data = this.dataSourceObGeneral.data
          this.modal.close()
          break;
        case "PROCEDIMIENTOS":
          this.dataSource4.data.splice(this.id, 1, this.estructura.getControlById('editarInput')?.value);
          this.dataSource4.data = this.dataSource4.data
          this.modal.close()
          break;
      }
    }
  }
  /*************************************/
  /*************************************/
  onEvent(id: string, value: any): void {
  }
  /*************************************/
  /*************************************/
  onClick(actionId: string): void {

    if (actionId == 'guardar') {
      this.agregar();
      //this.modal.close('primary');
    }
    else if (actionId == 'editar') {

      this.editarLista();
      //this.modal.close('primary');
    }
    else if (actionId == 'guardarItem') {
      let item2: Catalog[] = this.dataSource2.data
      item2.push({ codigo: this.estructura.getControlById('meta')?.value, nombre: this.select })
      this.dataSource2.data = item2
      this.modal.close('primary');
    }
    else {
      this.modal.close('cancel');
    }
  }
  /*************************************/
  /*************************************/

  itemToString(item: Topic[]): string {
    if (item != null) {
      return item.map(i => `${i.impuesto}/${i.rubro}`).join(', ');
    }
    return "Sin rubro seleccionado";
  }
  /*************************************/
  /*************************************/
  regresar() {
    this.showVisor = false
    this.cambios = false
    this.micro.deletePdf().toPromise().then()
  }
  async GuardarArchivo() {

    let ruta = ""
    let formData = new FormData();
    var file = new File([this.documento], "Alcances.pdf");
    formData.append('file', file);
    let secciones: alcanceDetalle[] = []

    this.principal.forEach((element, index) => {
      secciones.push({
        idSeccion: element.id || 0,
        detalle: JSON.stringify(element.listItem)
      })
    });

    let formulario: PresenciasFiscales = {
      fechaInicio: this.detalleGroup.controls['pedirodoDel'].value,
      fechaFin: this.detalleGroup.controls['pedirodoAl'].value,
      idPrograma: this.detalleGroup.controls['programa'].value,
      meta: this.detalleGroup.controls['meta'].value,
      lugarDepartamental: JSON.stringify(this.dataSourceLugares.data),
      lugarEjecucion: JSON.stringify(this.dataSource3.data),
      idPresencia: this.idFormulario,
      idTipoAlcance: 973,
      secciones: secciones,
      idAlcance: this.idAlcance,
      idProceso: this.idProceso
    }
    formData.append('data', JSON.stringify(formulario));
    if (this.estado == 181) {
      await this.microPresencias.updatePresenciaProceso(formData, this.idAlcance).toPromise().then(res => {
        this.modal.show({
          icon: 'success',
          title: 'Correccion Exitosa',
          text: "Se ha realizado la generación del Alcance exitosamente"
        });
      })
    } else {
      await this.microPresencias.createStartProcessPresences(formData).toPromise().then(res => {
        this.modal.show({
          icon: 'success',
          title: 'Generacion Exitosa',
          text: "Se ha realizado la generación del Alcance exitosamente"
        });
      })
    }
    this.ngOnInit();
    this.redireccion.navigate(['/programacion/operador/cartera/presencias']);
    this.showVisor = false
    /* let post = {
      id: this.idAlcance
    }
    this.gestor.contentSitesBasePathByParams('ALCANCEMASIVO', post).toPromise().then(res => {
      ruta = res.id
      this.gestor.contentSitesFoldersByNodeIdfiles(ruta, formData).toPromise().then(res => {
        this.modal.show({
          icon: 'success',
          title: 'Generacion Exitosa',
          text: "Se ha realizado la generación del Alcance exitosamente"
        });
        this.ngOnInit();
        this.redireccion.navigate(['/programacion/operador/cartera/presencias']);
        this.showVisor = false
      }) 
    })*/
  }
  /*************************************/
  /*************************************/
  CargarHijo() {

    let idCatalogo = this.select

    this.catalogo.getCatSonAdmin(Number(idCatalogo?.codigoIngresado)).toPromise().then(res => {

      this.catalogosHijo = res

    })
  }
  /*************************************/
  /*************************************/
  metaCatalogo() {
    this.catalogo.getCatalogDataByIdCatalog(9).toPromise().then(res => {
      this.catalogosMeta = res
      this.catalogosGerencia = res
    })
  }

  /*************************************/
  /*************************************/
  Meta() {

    this.metaCatalogo();
    this.catalogo.getCatSonAdmin(52).toPromise().then(res => {
      this.objeto = this.principal.find(x => x.nombre == "META")
      this.catalogosMetaGeneral = res
      this.principal[this.principal.indexOf(this.objeto)].listItem = []
      this.catalogosMetaGeneral.forEach(element => {
        this.principal[this.principal.indexOf(this.objeto)].listItem.push(element.descripcion)
        this.Seleccionar("META");
      })
    })

  }
  /*************************************/
  /*************************************/
  loadAntecedentes() {

    this.catalogo.getCatSonAdmin(49).toPromise().then(res => {
      this.objeto = this.principal.find(x => x.nombre == "ANTECEDENTES")
      this.catalogosAntecentes = res
      this.principal[this.principal.indexOf(this.objeto)].listItem = []
      this.catalogosAntecentes.forEach(element => {
        this.principal[this.principal.indexOf(this.objeto)].listItem.push(element.descripcion)
        this.Seleccionar("ANTECEDENTES");
      })


    })
  }
  /*************************************/
  /*************************************/
  loadObgeneral() {

    this.catalogo.getCatSonAdmin(50).toPromise().then(res => {
      this.objeto = this.principal.find(x => x.nombre == "OBJETIVOS GENERAL")
      this.catalogosGeneral = res
      this.principal[this.principal.indexOf(this.objeto)].listItem = []
      this.catalogosGeneral.forEach(element => {
        this.principal[this.principal.indexOf(this.objeto)].listItem.push(element.descripcion)
        this.Seleccionar("OBJETIVOS GENERAL");
      })
    })
  }
  /*************************************/
  /*************************************/
  loadEspecifico() {

    this.catalogo.getCatSonAdmin(51).toPromise().then(res => {
      this.catalogosEspecificos = res

    })
  }
  /*************************************/
  /*************************************/
  loadProcedimiento() {
    this.catalogo.getCatSonAdmin(57).toPromise().then(res => {
      this.catalogosPadre = res
    })
  }
  /*************************************/
  /*************************************/
  public soloNumeros(e: any) {
    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '8';
    this.numero = '0123456789';
    this.teclado_especial = false;
    for (const i in this.especiales) {
      if (this.key === this.especiales[i]) {
        this.teclado_especial = true;
      }
    }

    if (this.numero.indexOf(this.teclado) === -1 && !this.teclado_especial) {
      return false;
    }
    return true;
  }
}
