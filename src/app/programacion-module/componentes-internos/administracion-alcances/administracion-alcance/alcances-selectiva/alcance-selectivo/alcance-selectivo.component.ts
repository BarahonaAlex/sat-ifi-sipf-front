import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Injector, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { Item } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { alcance, alcanceDetalle, docPdf, listaAlcances, listaGeneral } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { Button, CustomNode, FormStructure, Input } from 'mat-dynamic-form';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FindingDetail, Topic } from 'src/app/general-module/componentes-comunes/interfaces/hallazgos.interface';
import { Input as InputCore } from '@angular/core';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { ActivatedRoute, Router } from '@angular/router';
import { chown } from 'fs';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { AuditInteface } from 'src/app/general-module/componentes-comunes/interfaces/Audit.inteface';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { UserLogged } from 'src/app/general-module/componentes-comunes/interfaces/user.interface';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { DialogIcon } from 'src/app/general-module/componentes-comunes/clases/dialog';
import { DetalleComponent } from 'src/app/programacion-module/componentes-internos/operador/hallazgos/detalle/detalle.component';

@Component({
  selector: 'app-alcance-selectivo',
  templateUrl: './alcance-selectivo.component.html',
  styleUrls: ['./alcance-selectivo.component.scss']
})
export class AlcanceSelectivoComponent implements OnInit {


  @InputCore('idCase') idCase!: number;
  @InputCore('idProgram') idProgram!: number;
  @InputCore('taxPayerData') taxPayerData!: Contribuyente.Respuesta;
  @InputCore('taxPayerCase') taxPayerCase!: CaseDetail;
  @Output('onFinished') onFinished = new EventEmitter<boolean>();
  principal: listaAlcances[] = [
    { nombre: 'ANTECEDENTES', listItem: [], completed: false, id: 980 },
    { nombre: 'INCONSISTENCIAS', listItem: [], completed: false, id: 984 },
    { nombre: 'OBJETIVOS', listItem: [], completed: false, id: 985 },
    { nombre: 'PROCEDIMIENTOS MÍNIMOS', listItem: [], completed: false, id: 986 },
    { nombre: 'ASPECTOS GENERALES', listItem: [], completed: false, id: 978 }
  ]
  idAlcance: any;


  @ViewChild('MatPaginatorbjetivo') set matPaginatorObjetivo(mp1: MatPaginator) {
    this.dataSourceObjetivos.paginator = mp1
  }
  @ViewChild('MatProcedimientos') set matPaginatorProcedimientos(mp3: MatPaginator) {
    this.dataSourceProcedimientos.paginator = mp3
  }
  @ViewChild('MatAntecedentes') set matPaginatorAntecedentes(mp3: MatPaginator) {
    this.dataSourceAntecedentes.paginator = mp3
  }
  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.dataSource2.paginator = mp2;
  }
  columns = ['caso', 'descripcion', 'acciones'];
  columnsAntecedentes = ['numeroExpediente', 'ubicacion', 'estadoExpediente', 'nombramiento', 'estadoNombramiento', 'nombrePlan', 'comentario', 'acciones'];
  columns2 = ['nombre', 'desc', 'rubros'];
  @InputCore('dataSource2') dataSource2 = new MatTableDataSource<FindingDetail>();
  dataSourceObjetivos = new MatTableDataSource<any>();
  dataSourceProcedimientos = new MatTableDataSource<any>();
  dataSourceAntecedentes = new MatTableDataSource<AuditInteface>();
  vAntecedentes: Boolean = false
  vInconsistencias: Boolean = false
  vObjetivos: Boolean = false
  vMinimos: Boolean = false
  vGenerales: Boolean = false
  vVista: number = 0
  vTitulo: string = ""
  catalogosOb: Item[] = [];
  catalogosPro!: Item[];
  catalogosObBk: Item[] = [];
  catalogosProBk: Item[] = [];
  vtextArea: string = ' '
  vtextArea2: string = ' '
  select?: Item;
  vReporte: listaAlcances[] = []
  nitContribuyente!: string
  vOtro: Boolean = false
  estructura!: FormStructure;
  showVisor = false
  nodeId = ""
  estado!: number
  objeto!: any
  id !: number
  vComentario?: string
  arrayProperties: { name: string, key: string }[] = [];
  @ViewChild('chekSelect') chekSelect!: MatCheckbox
  documento!: Blob
  listaNombresObjetivos: { caso: string, descripcion: string }[] = []
  listaNombresProcedimientos: { caso: string, descripcion: string }[] = []
  allowExecute = false;
  usuario!: UserLogged;
  ritchGroup!: FormGroup;
  scopeSelect!: FormGroup;
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
  constructor(
    private micro: AlcancesService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private gestor: GestorService,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private injector: Injector,
    private ngZone: NgZone,
  ) {
    this.route.paramMap.subscribe(async params => {
      this.idCase = parseInt(params.get('id') ?? '-1');
    })
    this.ritchGroup = new FormGroup({
      componenteRicht: new FormControl(),
      componenteRicht2: new FormControl()
    })
    this.scopeSelect = new FormGroup({
      proceso: new FormControl(''),
      objetivo: new FormControl(''),
    })
  }

  async ngOnInit() {

    this.reloadObjetivos();
    this.reloadProcedimientos();
    //this.Hallazgos();
    await this.micro.getDataCase(this.idCase).toPromise().then(res => {
      if (res.caso != null) {
        this.nitContribuyente = res.caso.nitContribuyente,
          this.estado = res.caso.idEstado
        this.idAlcance = res.caso.idAlcance
        this.vComentario = res.comentario?.comentarios
        console.log("trae el alcance",this.idAlcance);
        
        if (res.caso.idPrograma) {
          this.allowExecute = true;
        }

        if(this.idAlcance){
          this.micro.getScopeSelectiva(this.idAlcance).toPromise().then(res => {
            console.log(res)
            res.masivo.forEach((x, index) => {
              if (this.principal.find(y => y.id == x.idSeccion)) {
                JSON.parse(x.detalle + "").forEach((z: any) => {
                  this.principal.find(y => y.id == x.idSeccion)?.listItem.push(z)
                  if (z != null) {
                    let i = this.principal.indexOf(this.principal.find(y => y.id == x.idSeccion)!)
                    this.principal[i].completed = true
                  }
    
                  if (x.idSeccion == 986) {
                    let nombre = this.catalogosPro.find(data => data.descripcion == z)?.nombre || "otros"                    
                    this.listaNombresProcedimientos.push({ caso: nombre, descripcion: z })
                    this.catalogosPro.splice(this.catalogosPro.findIndex(item => item.nombre === nombre), 1);
                  }
                  if (x.idSeccion == 985) {
                    let nombre = this.catalogosOb.find(data => data.descripcion == z)?.nombre || "otros"
                    this.listaNombresObjetivos.push({ caso: nombre, descripcion: z })
                    this.catalogosOb.splice(this.catalogosPro.findIndex(item => item.nombre === nombre), 1);
                  }
                })
    
              }
            });
            this.vtextArea = this.principal.find(x => x.id == 978)?.listItem.toString() || ""
            this.ritchGroup.controls['componenteRicht2'].setValue(this.vtextArea)
          })
        }
      }
    })
    if (this.estado == 15) {
      this.Antecedentes()

    } else if (this.estado == 181) {    
      this.getNodeId();

    } else {
      this.LoadDocumento()
    }
    this.user.getUserLogged().toPromise().then(result => {
      this.usuario = result;
    })
  }
  async LoadDocumento() {
    const post = {
      caso: this.idCase
    }
    await this.micro.getPath(post).toPromise().then(res => {
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        let node = result.list.entries.find(res => res.entry.name === 'Alcances.pdf')?.entry;
        this.nodeId = node?.id || ""
        this.showVisor = true
      })

    })
  }

  async getNodeId() {
    const post = {
      caso: this.idCase
    }
    await this.micro.getPath(post).toPromise().then(res => {
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        let node = result.list.entries.find(res => res.entry.name === 'Alcances.pdf')?.entry;
        this.nodeId = node?.id || ""
      })

    })
  }
  drop(event: CdkDragDrop<string[]>) {

    moveItemInArray(this.principal, event.previousIndex, event.currentIndex);

  }
  cancel(): void {

    this.onFinished.emit(false);

  }

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

    } if (objeto == "INCONSISTENCIAS") {
      this.vInconsistencias = true
      this.vAntecedentes = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 0
      this.vTitulo = "INCONSISTENCIAS"
      // this.Hallazgos();

    } if (objeto == "OBJETIVOS") {
      this.vObjetivos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vMinimos = false
      this.vGenerales = false
      this.vVista = 1
      this.vTitulo = "OBJETIVOS"

      this.dataSourceObjetivos.data = this.listaNombresObjetivos
    }
    if (objeto == "PROCEDIMIENTOS MÍNIMOS") {
      this.vMinimos = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vGenerales = false
      this.vVista = 1
      this.vTitulo = "PROCEDIMIENTOS MÍNIMOS"

      this.dataSourceProcedimientos.data = this.listaNombresProcedimientos
    }
    if (objeto == "ASPECTOS GENERALES") {
      this.vGenerales = true
      this.vAntecedentes = false
      this.vInconsistencias = false
      this.vObjetivos = false
      this.vMinimos = false
      this.vVista = 2
      this.vTitulo = "ASPECTOS GENERALES"

    }

  }

  showMessage(title: string, text: string, icon: DialogIcon) {

    this.modal.show({
      title: title,
      text: text,
      icon: icon,
      //  duration: 3000
    });
  }



  agregar() {

    let msg = '';
    if (this.objeto.id == 986) {
      msg = 'Debe seleccionar un procedimiento';

      if (this.scopeSelect.get('proceso')?.value === null) {
        this.showMessage('IFI-400', msg, 'warning');
        return;
      }

      if (this.scopeSelect.get('proceso')?.value === undefined) {
        this.showMessage('IFI-400', msg, 'warning');
        return;
      }


    }
    else if (this.objeto.id == 985) {
      if (this.scopeSelect.get('objetivo')?.value != 0) {
        msg = 'Debe seleccionar un objetivo';
        if (this.scopeSelect.get('objetivo')?.value === null) {
          this.showMessage('IFI-400', msg, 'warning');
          return;
        }

        if (this.scopeSelect.get('objetivo')?.value.nombre === undefined) {
          this.showMessage('IFI-400', msg, 'warning');
          return;
        }
      }
    }

    var i = this.principal.indexOf(this.objeto);
    if (this.vObjetivos == true || this.vMinimos == true) {
      if (this.vOtro == true) {
        let item = this.estructura.getControlById('otro')?.value
        if (item.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
          this.principal[i].listItem.push(this.estructura.getControlById('otro')?.value)
          this.vOtro = false
          if (this.objeto.id == 986) {
            this.listaNombresProcedimientos.push({ caso: "otro", descripcion: this.estructura.getControlById('otro')?.value })
          } else {
            this.listaNombresObjetivos.push({ caso: "otro", descripcion: this.estructura.getControlById('otro')?.value })
          }
          this.modal.close('primary');
        } else {
          this.vOtro = false
          this.modal.close('primary');
          this.modal.show({
            title: "IFI-400",
            text: "No se puede agregar un ítem vacío",
            icon: "error",
            //  duration: 3000
          });

        }

      } else {
        if (this.objeto.id == 986) {
          this.select = this.scopeSelect.get('proceso')?.value;
        } else if (this.objeto.id == 985) {
          this.select = this.scopeSelect.get('objetivo')?.value;
        }

        if (this.select?.nombre != undefined) {
          if (this.principal[i].listItem.find(x => x == this.select?.descripcion)) {
            this.modal.show({
              title: "IFI-400",
              text: "El ítem ya existe",
              icon: "error",
            });
          } else {

            this.principal[i].listItem.push(this.select.descripcion)
            if (this.objeto.id == 986) {
              this.catalogosPro.splice(this.catalogosPro.findIndex(item => item.nombre === this.select?.nombre), 1);
              this.listaNombresProcedimientos.push({ caso: this.select.nombre, descripcion: this.select.descripcion })
            } else {
              this.catalogosOb.splice(this.catalogosOb.findIndex(item => item.nombre === this.select?.nombre), 1);
              this.listaNombresObjetivos.push({ caso: this.select.nombre, descripcion: this.select.descripcion })
            }
          }


        }
      }
      if (this.vObjetivos) {
        this.dataSourceObjetivos.data = this.listaNombresObjetivos
      } else {
        this.dataSourceProcedimientos.data = this.listaNombresProcedimientos
      }
    }
    this.scopeSelect.reset()
  }
  async saveInconsistencias() {
    let i = -1
    let datos: FindingDetail[] = this.dataSource2.data
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
      //}
    })

  }
  saveAll() {

    this.saveInconsistencias()
    this.principal.forEach((x, index) => {

      if (x.nombre == "ASPECTOS GENERALES") {
        let item = this.ritchGroup.controls['componenteRicht2'].value
        this.principal[index].listItem = []
        if (x.completed == true && item.length > 0 && item.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
          this.vtextArea = this.ritchGroup.controls['componenteRicht2'].value
          this.principal[index].listItem.push(this.vtextArea)
        } else {
          console.log('no se agrega')
        }
      }
      if (x.nombre == "ANTECEDENTES") {//el otro ritch y terminamos flujo basico
        let item = this.ritchGroup.controls['componenteRicht'].value
        this.vtextArea2 = this.ritchGroup.controls['componenteRicht'].value
        let datos = this.dataSourceAntecedentes.data
        if (datos.length > 0) {
          let conjuntoData = `<table class="table">`
          conjuntoData += `<tr><th class="th" >Número de expediente</th>
          <th class="th">Ubicacion</th>
          <th class="th">Estado</th>
          <th class="th">Nombramiento</th>
          <th class="th">Estado Nombramiento</th>
          <th class="th">Programa</th>
          <th class="th">Comentario</th></tr>`
          datos.forEach(element => {
            conjuntoData += "<tr><td>" + element.numeroExpediente + "</td><td>" + element.ubicacion + "</td><td>" + element.estadoExpediente + "</td><td>"
              + element.nombramiento + "</td><td>" + element.estadoNombramiento + "</td><td>" + element.nombrePlan + "</td><td>" + element.comentario + "</td></tr>"
          });
          conjuntoData += "</table>"
          this.principal[index].listItem = []
          this.principal[index].listItem.push(item + conjuntoData)
        }else if(item.length > 0 && item.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0){
          this.principal[index].listItem = []
          this.principal[index].listItem.push(item)
        }

      }
    })
  }
  async GenerarAlcance() {
    this.saveAll()
    let crear = true
    let seleccionado = false
    let texto2 = await this.micro.getTemplate(Constantes.SELECTIVO).toPromise()
    let variables = texto2.encabezado.match(/{([^}]*)}/g);
    let contenido = texto2.encabezado.match(/<([^}]*)>/g);
    
    let texto: string = `
    </div><div class="header" id="header">
   `
   let espacio = variables.length
    contenido.forEach((element: any, index: number) => {
      texto += element
      if (index <= variables.length) {
        switch (variables[index]) {
          case "{nombreContribuyente}":
            if (this.taxPayerData.data.attributes.datos.empresa) {

              texto += this.taxPayerData.data.attributes.datos.empresa.razonSocial;
            }
            else {
              let vTaxPayerName = this.taxPayerData.data.attributes.datos.contribuyente.persona?.primer_Nombre;
              vTaxPayerName = vTaxPayerName.concat(' ');
              vTaxPayerName = vTaxPayerName.concat(this.taxPayerData.data.attributes.datos.contribuyente.persona?.segundo_Nombre);
              vTaxPayerName = vTaxPayerName.concat(' ');
              vTaxPayerName = vTaxPayerName.concat(this.taxPayerData.data.attributes.datos.contribuyente.persona?.primer_Apellido);
              vTaxPayerName = vTaxPayerName.concat(' ');
              vTaxPayerName = vTaxPayerName.concat(this.taxPayerData.data.attributes.datos.contribuyente.persona?.segundo_Apellido);
              if (this.taxPayerData.data.attributes.datos.contribuyente.persona?.apellido_Casada != null) {
                vTaxPayerName = vTaxPayerName.concat(' DE ');
                vTaxPayerName = vTaxPayerName.concat(this.taxPayerData.data.attributes.datos.contribuyente.persona?.segundo_Apellido);
              }
              texto += vTaxPayerName;
            }
            espacio += Math.ceil((texto.length-678)/47);
           
            break;
          case "{nitContribuyente}":
            texto += this.taxPayerCase.nitContribuyente
            break;
          case "{periodoRevisionInicio}":
            texto += moment(`${this.taxPayerCase.periodoRevisionInicio}`).format('DD-MM-YYYY')
            break;
          case "{periodoRevisionFin}":
            texto += moment(`${this.taxPayerCase.periodoRevisionFin}`).format('DD-MM-YYYY')
            break;
          case "{impuesto}":
            const nombre = JSON.parse(this.taxPayerCase.impuestos || "") || []
            let impuesto = nombre.map((t: any) => t.nombreimpuesto).join('-')
            texto += impuesto
            break;
          case "{programa}":
            texto += this.taxPayerCase.idPrograma + "-" + this.taxPayerCase.nombrePrograma
            break;
          case "{idCaso}":
            texto += this.taxPayerCase.idCaso
            break;
        }
      }
    })
    console.log(espacio)
    let margen =0
    if(espacio<10){
      margen=125+(espacio*15.6)
    }else{
      margen=125+(espacio*16.6)
    }
    console.log(margen)
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
        margin-top: `+Math.ceil(margen)+`px;
        @top-left {
            content: element(header);
            border-bottom:4px solid #000;
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
    texto += `</div><div class="content" id="content"><ol type="I">`
    let piePagina = `<body class="body"><div class="footerRight">`
    contenido = texto2.piePagina.match(/<([^}]*)>/g);
    variables = texto2.piePagina.match(/{([^}]*)}/g);
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
          if (element.id == 986) {
            texto += "<ol>"
            element.listItem.forEach(item => {
              texto += "<li>" + item + "</li>"
            })
            texto += "</ol>"
          } else {
            element.listItem.forEach(item => {
              texto += "<p>" + item + "</p>"
            })
          }

          /*  if (element.nombre == "ASPECTOS GENERALES") {
             element.listItem = this.ritchGroup.controls['componenteRicht2'].value
           } */
          texto += "<br>"
        } else {
          this.modal.show({
            icon: 'error',
            title: 'Error Ítem vacio',
            text: "Se ha encontrado el contenido de " + element.nombre + " vacio, por favor verifique",
          });
          crear = false
        }


      }
    })

    texto += `</ol></div></body>  </html>`
    /*  console.log(encabezado)
     console.log(texto)
     console.log(piePagina)
     console.log("mirameee" + encabezado + piePagina + texto); */
    //console.log(encabezado + piePagina + texto)
    let post: docPdf = {
      datos: encabezado + piePagina + texto,
      idCaso: this.idCase,
      idEstado: this.estado
    }

    if (crear && seleccionado) {
      await this.micro.generationPdf(post).toPromise().then(res => {
        texto = ""
        this.documento = res
        this.showVisor = true

      })
    } else {
      if (!seleccionado) {
        this.modal.show({
          icon: 'error',
          title: 'Error Selección',
          text: "No ha seleccionado ningun Titulo",
        });
      }

    }

  }
  Eliminar(item: any) {
    var i: number
    let index = this.principal.indexOf(this.objeto)
    if (this.objeto.nombre == 'ANTECEDENTES') {
      i = this.dataSourceAntecedentes.data.indexOf(item)
      this.dataSourceAntecedentes.data.splice(i, 1);
      this.dataSourceAntecedentes.data = this.dataSourceAntecedentes.data;
    } if (this.objeto.nombre == 'OBJETIVOS') {

      let list = this.catalogosObBk.filter(itemR => itemR.nombre === item.caso)
      if (list.length > 0) {
        this.catalogosOb.push(list[0]);
      }

      i = this.dataSourceObjetivos.data.indexOf(item)
      this.dataSourceObjetivos.data.splice(i, 1);
      this.dataSourceObjetivos.data = this.dataSourceObjetivos.data
      this.principal[index].listItem = []
      this.dataSourceObjetivos.data.forEach(element => {
        this.principal[index].listItem.push(element.descripcion)
      });
    } if (this.objeto.nombre == 'PROCEDIMIENTOS MÍNIMOS') {

      let list = this.catalogosProBk.filter(itemR => itemR.nombre === item.caso)
      if (list.length > 0) {
        this.catalogosPro.push(list[0]);
      }

      i = this.dataSourceProcedimientos.data.indexOf(item)
      this.dataSourceProcedimientos.data.splice(i, 1);
      this.dataSourceProcedimientos.data = this.dataSourceProcedimientos.data
      this.principal[index].listItem = []
      this.dataSourceProcedimientos.data.forEach(element => {
        this.principal[index].listItem.push(element.descripcion)
      });
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

  Editar(item: any) {
    console.log(item);

    this.id = this.dataSourceObjetivos.data.indexOf(item);
    console.log(this.dataSourceObjetivos.data.indexOf(item));

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [/* new TextArea('editarInput', 'Editar', item).apply({
        singleLine: true
      }), */
        new CustomNode<RichTextComponent>('editarInput', RichTextComponent, { initialValue: item.descripcion }).apply({
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

  editarLista() {
    console.log(this.estructura.getControlById('editarInput')?.value)
    let item = this.estructura.getControlById('editarInput')?.value
    item = item.replace(/<p>|<\/p>|&nbsp;|\s/g, "")
    /*  item=item.replace("<p>","")
     item=item.replace("</p>","")
     item=item.replace("&nbsp;","") */
    console.log(item.length)
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
        case "OBJETIVOS":
          this.dataSourceObjetivos.data.splice(this.id, 1,{caso: 'otro', descripcion: this.estructura.getControlById('editarInput')?.value} );
          this.dataSourceObjetivos.data = this.dataSourceObjetivos.data
          this.modal.close()
          var i = this.principal.indexOf(this.objeto);
          this.principal[i].listItem.splice(this.id,1, this.estructura.getControlById('editarInput')?.value).toString();
          break;
        case "PROCEDIMIENTOS MÍNIMOS":
          this.dataSourceProcedimientos.data.splice(this.id, 1, {caso: 'otro', descripcion: this.estructura.getControlById('editarInput')?.value});
          this.dataSourceProcedimientos.data = this.dataSourceProcedimientos.data
          this.modal.close()
          var i = this.principal.indexOf(this.objeto);
          this.principal[i].listItem.splice(this.id,1, this.estructura.getControlById('editarInput')?.value).toString();
          break;
      }
    }
  }

  async Antecedentes() {

    var i = this.principal.indexOf(this.objeto);
    await this.micro.getAntecedentes(Number(this.nitContribuyente)).toPromise().then((res: any) => {

      this.dataSourceAntecedentes.data = res
    })

  }
  Hallazgos() {

    this.micro.getFindings(this.idCase).toPromise().then((res: any) => {
      this.dataSource2.data = res

    })


  }
  onEvent(id: string, value: any): void {
    console.log(id)
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.agregar();
      //  this.modal.close('primary');
    } else if (actionId == 'editar') {

      this.editarLista();
      //this.modal.close('primary');
    }
    else {
      this.vOtro = false
      this.scopeSelect.get('objetivo')?.setValue(null);
      this.scopeSelect.get('objetivo')?.markAsUntouched();
      this.scopeSelect.get('objetivo')?.updateValueAndValidity();
      this.scopeSelect.updateValueAndValidity();
      this.modal.close('cancel');
    }
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
    this.micro.deletePdf().toPromise().then()
    console.log(this.principal)

  }
  GuardarArchivo() {

    const post = {
      caso: this.idCase
    }

    let ruta = ""
    let formData = new FormData();
    let secciones: alcanceDetalle[] = []
    this.principal.forEach((element, index) => {
      if (element.completed) {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: JSON.stringify(element.listItem)
        })
      } else {
        secciones.push({
          idSeccion: element.id || 0,
          detalle: '[]'
        })
      }

    });
    let post2: docPdf = {
      datos: "",
      idCaso: this.idCase,
      idEstado: this.estado,
      secciones: secciones
    }
    
    formData.append('files', this.documento, "Alcances.pdf");
    this.gestor.contentSitesBasePathByParams('RUTA_BASE_CASO', post).toPromise().then(res => {
      ruta = res.id

      this.gestor.contentSitesFoldersByNodeIdfiles(ruta, formData).toPromise().then(res => {
        this.micro.authorizerPdf(post2).toPromise().then(res => {
          this.modal.show({
            icon: 'success',
            title: 'Generación Exitosa',
            text: "Se ha realizado la generación del Alcance exitosamente"
          });
          this.showVisor = false
          this.router.navigate(['/programacion/operador/cartera/casos'])
        });
      })
    })

  }
  reloadAntecedentes() {
    this.Antecedentes()
  }
  reloadInconsistencias() {
    this.Hallazgos()
  }
  reloadObjetivos() {
    this.catalogo.getCatSonAdmin(46).toPromise().then(res => {
      this.catalogosOb = res;
      this.catalogosObBk = Object.assign([], res);;

    })
  }
  reloadProcedimientos() {

    this.catalogo.getCatSonAdmin(47).toPromise().then(res => {
      this.catalogosPro = res;
      this.catalogosProBk = Object.assign([], res);

    });
  }
  saveChanges(){
    let seccionesTemp: alcanceDetalle[] = []
    this.principal.forEach((element, index) => {
      if (element.completed) {
        seccionesTemp.push({
          idSeccion: element.id || 0,
          detalle: JSON.stringify(element.listItem)
        })
      } else {
        seccionesTemp.push({
          idSeccion: element.id || 0,
          detalle: '[]'
        })
      }

    });
    let param: docPdf = {
      datos: "",
      idCaso: this.idCase,
      idEstado: this.estado,
      secciones: seccionesTemp,
      cambios: 1
    }
    this.micro.authorizerPdf(param).toPromise().then(res => {
      console.log(res);
      
      this.modal.show({
        icon: 'success',
        title: 'Cambios Guardados',
        text: "Se han guardado los cambios para la generación del alcance"
      });
    });
  }
}


