import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { alcance, alcanceDetalle, listaAlcances } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { Catalog, Item } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { docPdf } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { Button, CustomNode, FormStructure, Input, TextArea } from 'mat-dynamic-form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FindingDetail, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { Input as InputCore } from '@angular/core';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { AlcanceDenuncia, CabinetComplaints, DenunciaAP, Gerencias, ProcesosMasivos } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { SelectionModel } from '@angular/cdk/collections';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { iif } from 'rxjs';
import { PresenciasFiscalesService } from 'src/app/general-module/componentes-comunes/servicios/presencias-fiscales.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { HallazgosService } from 'src/app/general-module/componentes-comunes/servicios/hallazgos.service';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';

@Component({
  selector: 'app-alcance-gabinete',
  templateUrl: './alcance-gabinete.component.html',
  styleUrls: ['./alcance-gabinete.component.css']
})
export class AlcanceGabineteComponent implements OnInit {
  @InputCore('taxPayerData') taxPayerData!: Contribuyente.Respuesta
  @InputCore('correlativo') correlativoDenuncia!: String
  @InputCore('idCase') idCase!: number
  principal: listaAlcances[] = [
    { nombre: 'ANTECEDENTES', listItem: [], completed: false, id: 980 },
    { nombre: 'OBJETIVOS', listItem: [], completed: false, id: 981 },
    { nombre: 'DENUNCIAS', listItem: [], completed: false, id: 979 },
    { nombre: 'INCONSISTENCIAS', listItem: [], completed: false, id: 984 },
    { nombre: 'PROCEDIMIENTOS', listItem: [], completed: false, id: 983 },
    { nombre: 'ASPECTOS GENERALES', listItem: [], completed: false, id: 983 },
  ]
  objetivoEliminado: Item[] = [];
  aspectoEliminado: Item[] = [];
  procedimientoEliminado: Item[] = [];
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }
  columns = ['caso', 'acciones'];
  dataSourceDescriptionColumns = ['caso', 'acciones'];
  columns2 = ['nombre', 'desc', 'rubros'];
  columns4 = ['Nombre', 'Descripcion', 'acciones'];
  columns3 = ['nombre', 'Descripcion', 'acciones'];
  DenunciaAprobada: string[] = ['seleccion', 'correlativo'];
  DenunciaA = new MatTableDataSource<DenunciaAP>()
  dataSource4 = new MatTableDataSource();
  dataSource5 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  dataSourceDescription = new MatTableDataSource<any>();
  dataSourceObEspecifico = new MatTableDataSource<string>();
  vAntecedentes: Boolean = false
  vInconsistencias: Boolean = false
  listProcedimientos: Item[] = []
  vObjetivos: Boolean = false
  vMinimos: Boolean = false
  vGenerales: Boolean = false
  selectHijo!: Item;
  selectAspecto!: Item;
  vVista: number = 0
  vTitulo: string = ""
  denuncia!: number;
  gerencias!: Gerencias[]
  catalogos?: Item[]
  validar?: Item[] = []
  vtextArea: string[] = []
  select?: Item;
  listAspectos: Item[] = []
  selectProcess!: String
  preuba!: Item[];
  selectGerencia!: number;
  selectProceso?: Item;
  vReporte: listaAlcances[] = []
  nitContribuyente!: string
  vOtro: Boolean = false
  estructura!: FormStructure;
  showVisor = false
  nodeId = ""
  cabinet!: FormGroup;
  catalogosEspecificos?: Item[]
  conjuntoDenuncias: string[] = []
  estado!: number
  documento!: Blob
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
  temporal!: number
  informacion: any[] = []
  arrayProperties: { name: string, key: string }[] = [];
  selectionComplaints = new SelectionModel<DenunciaAP>(true, []);
  @ViewChild('chekSelect') chekSelect!: MatCheckbox
  @ViewChild('id') recargar = 1;
  usuario!: UserLogged;
  @InputCore('dataSource2') dataSource11 = new MatTableDataSource<FindingDetail>();
  columnsHallazgo = ['nombre', 'desc', 'rubros'];
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
    private micro: AlcancesService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private services: DenunciasService,
    private gestor: GestorService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private redireccion: Router,
    private user: UserService,
    private finding: HallazgosService,
    private injector: Injector,
    private ngZone: NgZone) {
    this.user.getUserLogged().toPromise().then(result => {
      this.usuario = result;
    })

    this.cabinet = new FormGroup({
      select: new FormControl(''),
      objetivo: new FormControl(''),
      aspecto: new FormControl(''),
    })
  }

  async ngOnInit(): Promise<void> {
    this.Antecedentes()
    this.ObjetivoE()
    this.AspectosGenerales()
    this.GetProcess()
    this.getCatalogRegion()
    this.getProcessMasive()
    this.getProcedimientosAlcances()
    this.Hallazgos()
    await this.services.getDetailComplaints(this.correlativoDenuncia.toString()).toPromise().then(k => {
      this.idR = k[0].region
      this.getComplaintsByGerency()
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.principal, event.previousIndex, event.currentIndex);
  }

  getSelectGerency(event: any) {
    this.idR = event.codigo
    this.getComplaintsByGerency()
  }
  getComplaintsByGerency() {
    this.services.getComplaintCabinet(this.idR).toPromise().then(res => {
      if (res.length == 0) {
        /* this.dialogService.show({
          title: 'Detalle denuncia.',
          text: 'No se encontro ninguna denuncia con las especificaciones indicadas.',
          icon: 'warning',
          disableClose: true
        }) */
        this.DenunciaA.data = []
      } else {
        this.DenunciaA.data = res.filter(x => x.correlativo != this.correlativoDenuncia)
      }
    })
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
  guardarDenuncia(item: any) {
    var i = this.principal.indexOf(item);
    let textoDenuncia = ``
    let texto = ``
    this.selectionComplaints.selected.forEach(Unassign => {
      this.correlativo = Unassign.correlativo
    })
    if (this.vTitulo == "DENUNCIAS SELECCIONADAS") {
      let Denuncias = `<strong>CORRELATIVO DENUNCIA</strong><br><ul>`

      this.DenunciaA.data.forEach((element: any) => {
        Denuncias += `<li>${element.correlativo}</li>`
      })
      Denuncias += `</ul>`
      textoDenuncia = Denuncias
      if (this.principal[i].listItem.length == 0) {
        this.principal[i].listItem.push(textoDenuncia)
      } else { this.principal[i].listItem[0] = textoDenuncia }
    }
  }

  guardarDenunciaByPrincipalIndex(index: number) {
    var i = index
    let textoDenuncia = ``
    let texto = ``

    let Denuncias = `<strong>CORRELATIVO DENUNCIA</strong><br><ul>`

    this.selectionComplaints.selected.forEach(selectedComplaint => {
      Denuncias += `<li>${selectedComplaint.correlativo}</li>`
    })

    /* this.DenunciaA.data.forEach((element: any) => {
      Denuncias += `<li>${element.correlativo}</li>`
    }) */
    Denuncias += `</ul>`
    textoDenuncia = Denuncias
    if (this.principal[i].listItem.length == 0) {
      this.principal[i].listItem.push(textoDenuncia)
    } else { this.principal[i].listItem[0] = textoDenuncia }
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

    const DetalleDeunciaAndAlcance: AlcanceDenuncia = {
      correlativo: this.correlativoDenuncia.toString(),
      correlativos: this.selectionComplaints.selected.map(x => x.correlativo),
      idTipoAlcance: 976,
      secciones: secciones.filter(x => x.detalle != "[]")
    }
    formData.append('data', JSON.stringify(DetalleDeunciaAndAlcance))
    this.services.createStartProcessDenuncias(formData).toPromise().then(denunciaDetalle => {
      this.modal.show({
        icon: 'success',
        title: 'Generacion Exitosa',
        text: "Se ha realizado la generación del Alcance exitosamente",
        showConfirmButton: false
      });
      this.redireccion.navigate(['/programacion/cartera/denuncia/gabinete'])
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
    if (objeto == "DENUNCIAS") {
      this.vObjetivos = true
      this.vInconsistencias = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 4
      this.vTitulo = "DENUNCIAS SELECCIONADAS"
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
    this.services.getManagaments().toPromise().then(res => {
      this.gerencias = res;
    })
  }
  AspectosGenerales() {
    this.catalogo.getCatSonAdmin(91).toPromise().then(res => {
      this.aspectosGenerales = res
    })
  }
  agregarAspecto() {
    var i = this.principal.indexOf(this.objeto);
    const dato = this.selectAspecto
    this.aspectoEliminado.push(this.selectAspecto!)
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
    this.aspectosGenerales!.splice(this.aspectosGenerales!.findIndex(item => item.nombre === this.selectAspecto?.nombre), 1);

    this.cabinet.reset()
  }
  GetProcess() {
    this.catalogo.getCatSonAdmin(200).toPromise().then(res => {
      this.catalogosHijo = res
    })
  }
  agregarProcedimiento() {
    var i = this.principal.indexOf(this.objeto);
    const dato = this.selectHijo
    this.procedimientoEliminado.push(this.selectHijo!)
    this.listProcedimientos.push({
      descripcion: dato?.descripcion!,
      nombre: dato?.nombre!,
      codigo: 0,
      estado: ''
    })
    this.dataSource5.data = this.listProcedimientos
    this.catalogosHijo!.splice(this.catalogosHijo!.findIndex(item => item.nombre === this.selectHijo?.nombre), 1);
    this.dataSource5.data.forEach(procedimiento => {
      this.principal[i].listItem.push(procedimiento.descripcion)
    })
    this.cabinet.reset()
  }
  getProcedimientosAlcances() {
    this.services.getCatalogProcessComplaint(56).toPromise().then(res => {
      this.catalogosPadre = res
    })
  }
  getProcessMasive() {
    this.services.getProcessMasive().toPromise().then(res => {
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
  * @author aalsuruyq (Anderson Suruy)
  * @description Metodo que obtine el texto plano del RichText. 
  * @param html body.
  */
  getHtmlText(html: any) {
    let doc = new DOMParser().parseFromString(html, 'text/html'),
      text = doc.body.textContent || '';
    text = text.trim().replace(/\s{2,}/g, ' ')
    return text;
  }

  agregar() {
    let datos = this.select
    var i = this.principal.indexOf(this.objeto);
    if (this.vObjetivos == true || this.vMinimos == true) {
      if (this.vOtro == true) {
        let item = this.estructura.getControlById('otro')?.value
        if (this.getHtmlText(item).replace(/\s+/g, "").length > 0) {
          this.principal[i].listItem.push(this.estructura.getControlById('otro')?.value + "")
          this.vOtro = false
          this.modal.close('primary');
        } else {
          this.vOtro = false
          this.modal.close('primary');
          this.modal.show({
            title: "IFI-400",
            text: "No se puede agregar un ítem vacío",
            icon: "error",
          }).then(() => {
            this.modal.close('primary');
          });
        }
      } else {
        this.principal[i].listItem.push(datos + "")
      }
      if (this.vMinimos == true) {
        this.dataSourceObEspecifico.data = this.principal[i].listItem
        this.dataSourceObEspecifico.paginator = this.dataSourceObEspecifico.paginator
      }
      this.dataSourceObEspecifico.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
    }
    this.cabinet.reset()
  }

  agregarObjetivo() {
    let datos = this.select?.descripcion
    this.objetivoEliminado.push(this.select!)

    var i = this.principal.indexOf(this.objeto);
    if (this.vObjetivos == true || this.vMinimos == true) {
      if (this.vOtro == true) {
        this.principal[i].listItem.push(this.estructura.getControlById('otro')?.value + "")
        this.vOtro = false
      } else {
        this.principal[i].listItem.push(datos + "")
      }
      if (this.vMinimos == true) {
        this.dataSourceObEspecifico.data = this.principal[i].listItem
        this.dataSourceObEspecifico.paginator = this.dataSourceObEspecifico.paginator
      }
      this.dataSourceObEspecifico.data = this.principal.find(x => x.nombre == this.vTitulo)?.listItem || []
      this.catalogos!.splice(this.catalogos!.findIndex(item => item.nombre === this.select?.nombre), 1);
    }
    this.cabinet.reset()
  }

  async GenerarAlcance() {
    this.saveInconsistencias();
    const denunciaPrincipal = {
      correlativo: this.correlativoDenuncia.toString(),
      estado: '',
      nitDenunciado: '',
      nitDenunciante: '',
      insumo: 0,
      nombreEstado: ''
    }

    if (this.selectionComplaints.selected.find(k => k.correlativo.match(this.correlativoDenuncia.toString())) == undefined) {
      let denunciaSection = this.principal.find(x => x.nombre == "DENUNCIAS")
      if (denunciaSection != undefined) {
        var i = this.principal.indexOf(denunciaSection!);
        this.selectionComplaints.selected.push(denunciaPrincipal)
        this.guardarDenunciaByPrincipalIndex(i)
        this.principal[i].completed = true
      }
      let hallazgoSection = this.principal.find(x => x.nombre == "INCONSISTENCIAS")
      if (hallazgoSection != undefined) {
        var i = this.principal.indexOf(hallazgoSection!);
        if (this.principal[i].completed) {
          let datos: FindingDetail[] = []
          let conjuntoData: string = ""

          this.selectionComplaints.selected.map(denuncia => {
            this.finding.getFindingsDetail(0, denuncia.correlativo).toPromise().then(res => {
              res.forEach(element => {
                datos.push(element)
              })

              if (this.principal[i].listItem.length == 0 || this.principal[i].listItem.length == 1 || this.principal[i].listItem.length < datos.length || this.principal[i].listItem.length > datos.length) {
                this.principal[i].listItem = []
                datos.forEach(element => {
                  let desc = element.descripcion.split("<p>" || "</p>")
                  conjuntoData = "<p><strong>" + element.nombre + ": </strong> " + desc[1]
                  this.principal[i].listItem.push(conjuntoData)
                }
                );
              }
            })
          })
        }
      }
    }

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
        texto += "<br><li><strong>" + element.nombre + "</strong></li>"
        element.listItem.forEach(item => {
          texto += "<p>" + item + "</p>"
        })
      }
    })
    texto += "</ul></body></html>"
    let post: docPdf = {
      datos: encabezado + piePagina + texto,
      idCaso: this.idCase,
      idEstado: this.estado
    }
    await this.micro.generationPdf(post).toPromise().then(res => {
      texto = ""
      this.documento = res
      this.showVisor = true
    })

    this.temporal = 0;
  }

  EliminarAntecedentes(item: any) {
    var i = this.dataSource4.data.indexOf(item);
    i !== -1 && this.dataSource4.data.splice(i, 1);
    this.dataSource4.data = this.dataSource4.data
  }
  EliminarObjetivos(item: any) {
    var i = this.dataSourceObEspecifico.data.indexOf(item);
    i !== -1 && this.dataSourceObEspecifico.data.splice(i, 1);
    this.dataSourceObEspecifico.data = this.dataSourceObEspecifico.data
    var objetivo = this.objetivoEliminado.find(res => res.descripcion.match(item))
    if (objetivo !== undefined) {
      this.catalogos!.push(objetivo)
    }
    this.catalogos?.sort();
    var k = this.objetivoEliminado.findIndex(res => res.descripcion.match(item))
    k !== -1 && this.objetivoEliminado.splice(k, 1)
  }
  EliminarProcedimientos(item: any) {
    let index = this.principal.indexOf(this.objeto)
    var i = this.dataSource5.data.indexOf(item);
    i !== -1 && this.dataSource5.data.splice(i, 1);
    this.dataSource5.data = this.dataSource5.data
    this.principal[index].listItem = []
    this.dataSource5.data.forEach(element => {
      this.principal[index].listItem.push(element.descripcion)
    });

    var procedimientos = this.procedimientoEliminado.find(res => res.descripcion.match(item.descripcion))
    if (procedimientos !== undefined) {
      this.catalogosHijo!.push(procedimientos)
    }
    this.catalogosHijo?.sort();
    var k = this.procedimientoEliminado.findIndex(res => res.descripcion.match(item.descripcion))
    k !== -1 && this.procedimientoEliminado.splice(k, 1)
  }
  EliminarAspectos(item: any) {
    let index = this.principal.indexOf(this.objeto)
    var i = this.dataSource2.data.indexOf(item);
    i !== -1 && this.dataSource2.data.splice(i, 1);
    this.dataSource2.data = this.dataSource2.data
    this.principal[index].listItem = []
    this.dataSource2.data.forEach(element => {
      this.principal[index].listItem.push(element.descripcion)
    });
    var aspecto = this.aspectoEliminado.find(res => res.descripcion.match(item.descripcion))
    if (aspecto !== undefined) {
      this.aspectosGenerales!.push(aspecto)
    }
    this.aspectosGenerales?.sort();
    var k = this.aspectoEliminado.findIndex(res => res.descripcion.match(item.descripcion))
    k !== -1 && this.aspectoEliminado.splice(k, 1)
  }
  onEvent(id: string, value: any): void {
  }
  onClick(actionId: string): void {
    if (actionId == 'guardar') {

      this.agregar();
      /* this.modal.close('primary'); */
    }
    else if (actionId == 'cancelar') {
      this.estructura.getControlById('otro')?.setValue("")
      this.vOtro = false
      this.modal.close('cancel');
    }
    else {
      this.modal.close('cancel');
    }
  }
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
  Hallazgos() {
    this.finding.getFindingsDetail(0, this.correlativoDenuncia.toString()).toPromise().then((res: any) => {
      this.dataSource11.data = res
    })
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

  regresar() {
    var i = this.selectionComplaints.selected.findIndex(k => k.correlativo.match(this.correlativoDenuncia.toString()))
    var indexComplaint = this.principal.findIndex(x => x.nombre == "DENUNCIAS")
    this.showVisor = false
    this.nodeId = ""
    i !== -1 && this.selectionComplaints.selected.splice(i, 1);
    if (this.selectionComplaints.selected.length == 0) {
      if (indexComplaint !== -1)
        this.principal[indexComplaint].completed = false
    }

  }
  reloadInconsistencias() {
    this.Hallazgos()
  }
}
