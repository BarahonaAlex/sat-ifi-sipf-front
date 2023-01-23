import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { CaseTaxesInterface } from './../../../general-module/componentes-comunes/interfaces/CasosDTE';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, CustomNode, FormStructure, Input, TextArea } from 'mat-dynamic-form';
import * as moment from 'moment';
import { Case } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { EntryNodoAcs, ListaNodosAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { MatStepper } from '@angular/material/stepper';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';

@Component({
  selector: 'app-detalle-caso-DTE',
  templateUrl: './detalle-caso-DTE.component.html',
  styleUrls: ['./detalle-caso-DTE.component.scss']
})
export class DetalleCasoDTEComponent implements OnInit {

  idInsumo?: number;
  idCase!: number;
  detalleGroup!: FormGroup;
  archivosGrop!: FormGroup;
  arrayProperties: { name: string, key: string }[] = [];
  estructura!: FormStructure;
  showVisor: Boolean = true;
  nodeId!: string;
  editar: Boolean = false
  folder!: string
  vconstante = Constantes.ESTADO_CASO_CORREGIR
  estado!: number
  vComentario?: string
  vListaDocumentos: EntryNodoAcs[] = []
  selection = new SelectionModel<EntryNodoAcs>(true, []);
  impuestos!: Catalog[];
  gerencia!: Catalog[];
  departamento!: Catalog[];
  imp!: CaseTaxesInterface[];
  gen!: number
  dep!: number
  stepperBoolean: boolean = true;
  selectedNode!: EntryNodoAcs;
  listaArchivos!: FileData[];
  constantes = Constantes;
  @ViewChild('matStepper') stepper!: MatStepper;

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private micro: CasosDTEService,
    private gestor: GestorService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private user: UserService) {

  }

  ngOnInit() {
    this.router.paramMap.subscribe(params => {
      this.idCase = parseInt(params.get('idCase') as string);
      this.idInsumo = parseInt(params.get('idInsumo') as string);
    });

    this.detalleGroup = new FormGroup({
      periodo: new FormControl('', Validators.required,),
      periodoal: new FormControl('', Validators.required),
      asignado: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      nit: new FormControl('', Validators.required),
      nombreCaso: new FormControl('', Validators.required),
      nombreDepartamento: new FormControl('', Validators.required),
      nombreEstado: new FormControl('', Validators.required),
      nombreGerencia: new FormControl('', Validators.required),
      nombreImpuesto: new FormControl('', Validators.required),
      idCaso: new FormControl('', Validators.required),
      loginProfesional: new FormControl('', Validators.required),
    });
    this.archivosGrop = new FormGroup({
      fichaTecnica: new FormControl(),
      doc1: new FormControl(),
      doc2: new FormControl()
    })

    this.detalleGroup.disable()
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [],
      validateActions: []
    });
    this.CargaDatos()
  }
  regresar() {
    this.route.navigate(['det-sel/cartera/casos/dte'], { queryParams: { id: this.idInsumo } })
  }
  CargaDatos() {
    this.micro.detailCase(this.idCase).toPromise().then(async res => {
      console.log(res);
      
      this.imp = JSON.parse(res.caso.impuestos!)
      let loginProfesional = res.caso.loginProfesional ? await this.user.obtenerInfoGeneralByLogin(res.caso.loginProfesional!).toPromise() : null

      console.log(res)
      this.detalleGroup.patchValue({
        idCaso: res.caso.idCaso,
        periodo: moment(res.caso.periodoRevisionInicio).format('YYYY-MM-DD'),
        periodoal: moment(res.caso.periodoRevisionFin).format('YYYY-MM-DD'),
        asignado: res.caso.nitColaborador + ' - ' + res.caso.nombreColaborador,
        descripcion: res.caso.descripcion,
        nit: res.caso.nitContribuyente,
        nombreCaso: res.caso.nombreCaso,
        nombreEstado: res.caso.nombreEstado,
        nombreImpuesto: this.imp.map((item) => item.idimpuesto),
        loginProfesional: loginProfesional?.nombre
      });
      
      if (res.caso.nitColaborador == null) {
        this.detalleGroup.controls['asignado'].setValue('NO ASIGNADO')
      }
      this.gen = res.caso.idGerencia
      this.dep = res.caso.idTipoAlcance
      this.estado = res.caso.idEstado
      if (res.comentario == null) {
        console.log("entra")

      } else {
        if (this.estado == 1040) {
          this.vconstante = Constantes.ESTADO_CASO_RECHAZADO_DEFINITIVO
        }
        this.vComentario = res.comentario.comentarios
      }

    });
    this.CargaCatalogos()
    this.VerArchivo()
  }

  async VerArchivo() {

    let post = {
      caso: this.idCase,
      carpeta: "Archivos Respaldo"
    }
    console.log(post);

    await this.micro.getPath(post).toPromise().then(res => {
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        console.log(result)

        if (result != null) {
          this.vListaDocumentos = []
          this.EstructuraArchivos(result)
          /*  
            this.modal.show({
             title: `Archivos de respaldo`,
             formStructure: this.estructura,
             showCancelButton: false,
             showConfirmButton: false,
             disableClose: true,
           })  */
        } else {
          /*    this.modal.show({
              icon: 'warning',
              title: 'IFI-100',
              text: 'No se tiene coneccion con el servidor',
              showCancelButton: false,
              confirmButtonText: `Si`,
              cancelButtonText: 'No, cancelar', 
              disableClose: false,
            })  */

          this.stepperBoolean = false
        }

      }).catch(err => {
        if (err.status == 500) {
          this.modal.show({
            icon: 'warning',
            title: 'IFI-100',
            text: 'No se tiene coneccion con el servidor',
            showCancelButton: false,
            confirmButtonText: `Si`,
            cancelButtonText: 'No, cancelar',
            disableClose: false,
          })
          this.stepperBoolean = false
        }
      })

    })
  }

  EstructuraArchivos(datos: ListaNodosAcs) {

    datos.list.entries.forEach(element => {
      this.vListaDocumentos.push({ ...element.entry, icon: element.entry.name.split('.').pop() })
      let node = [new Button(element.entry.id, 'Ficha tecnica ' + element.entry.name, { callback: this }).apply({
        disabled: false,
        color: "primary",
        action: { type: 'onclick', callback: this }
      })]
      this.estructura.createNodes(1, node)
    })
    this.estructura = this.estructura
  }
  
  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  onClick(actionId: string): void {
    console.log('onclick')

    if (actionId == 'cancelar') {
      this.showVisor = true
      this.modal.close('cancel');
    } else if (actionId == 'rechazo') {
      this.RechazoDefinitivo()
      this.modal.close('cancel');
    } else if (actionId == 'sustituir') {
      // console.log('sustituir');
      //console.log(this.estructura.getControlById('doc')?.value);
      this.selectedNode.name = this.estructura.getControlById('doc')?.value.name;
      this.selectedNode.icon = this.estructura.getControlById('doc')?.value.name.split('.').pop();
      if (this.listaArchivos == undefined) {
        this.listaArchivos = [];
        this.listaArchivos.push(new FileData(this.estructura.getControlById('doc')?.value, this.selectedNode.id));
      } else {
        let file = this.listaArchivos.find(item => item.idFile == this.selectedNode.id);
        if (file == undefined || file == null) {
          this.listaArchivos.push(new FileData(this.estructura.getControlById('doc')?.value, this.selectedNode.id));
        }
        else {
          file.file = this.estructura.getControlById('doc')?.value;
        }

      }

      this.modal.close('cancel');

    } else {
      this.nodeId = actionId
      this.showVisor = false
      this.modal.close('cancel');
    }
  }

  showFile(node: EntryNodoAcs) {
    this.nodeId = node.id;
    this.arrayProperties = node.properties;
    this.showVisor = false
  }

  stateChange(state: FileChange): void {
    if (state.state == 'uploading') {
      console.log('uploading');
    }
    if (state.state == 'uploaded') {
      console.log('se cargo el archivo')

    }
    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
    }

  }
  EditarCaso() {
    this.detalleGroup.enable()
    this.detalleGroup.controls['idCaso'].disable()
    this.detalleGroup.controls['nombreEstado'].disable()
    this.detalleGroup.controls['asignado'].disable()
    this.detalleGroup.controls['descripcion'].disable()
    this.editar = true
    //this.regresar();
  }
  Cancelar() {
    this.detalleGroup.disable()
    this.editar = false
    //this.vListaDocumentos = []
  }
  EliminarDoc() {
    console.log(this.selection.selected)
    this.selection.selected.forEach(async element => {
    })
  }
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.vListaDocumentos.length;
    return numSelected === numRows;

  }

  masterToggle() {

    this.isAllSelected()
      ? this.selection.clear()
      : this.vListaDocumentos.forEach((row) => this.selection.select(row));
  }


  Estructura() {

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode('doc', UploadFileComponent, {
          label: 'Documento',
          accept: ['xlsx', 'pdf', 'png', 'jpg', 'jpeg'],
          folder: this.nodeId,
          saveOnLoad: false,
        }).apply({ singleLine: true, require: false })

      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('sustituir', 'Sustituir', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: false,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura
  }


  sustituir(node: EntryNodoAcs) {
    console.log('boton sustituir ');
    console.log(node);
    this.selectedNode = node;

    this.Estructura()
    this.modal.show({
      title: `Adjuntar archivos `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })
  }
  Guardar() {

    console.log('boton guardar');

    let listData: PutData[] = [];
    const formData = new FormData();

    let index = 0;
    if (this.listaArchivos) {
      console.log("entra al if")
      this.listaArchivos.forEach(item => {
        formData.append('file', item.file, item.file.name);
        listData.push(new PutData(item.idFile, item.file.name, index));
        index++;
      });
    }
    const post: Case = {
      periodoRevisionInicio: this.detalleGroup.controls['periodo'].value,
      periodoRevisionFin: this.detalleGroup.controls['periodoal'].value,
      nitColaborador: this.detalleGroup.controls['asignado'].value,
      descripcion: this.detalleGroup.controls['descripcion'].value,
      nitContribuyente: this.detalleGroup.controls['nit'].value,
      nombreCaso: this.detalleGroup.controls['nombreCaso'].value,
      tipoAlcance: this.dep,
      gerencia: this.gen,
      impuestos: this.detalleGroup.get('nombreImpuesto')?.value,
    }

    console.log(post);
    let caseWrapper: CaseWrapper = new CaseWrapper();
    caseWrapper.caseData = post;
    caseWrapper.listFileData = listData;
    formData.append('data', JSON.stringify(caseWrapper));

    this.micro.UpdateCaseMultipar(this.idCase, formData).toPromise().then(res => {
      this.modal.show({
        icon: 'success',
        title: 'Modificación Exitosa',
        text: "Se ha realizado la modificación del caso correctamente"
      });

      this.stepper.reset();
      this.regresar();
      this.Cancelar();
    });
  }

  async CargaCatalogos() {
    let listIdCatalog = [
      String(Constantes.CAT_INGRESO_CASES_GERENCIAS),
      String(Constantes.CAT_INGRESO_CASES_IMPUESTOS),
      String(Constantes.CAT_INGRESO_CASES_DEPARTAMENTO)
    ]
    await this.catalogo.getCatalogDataByListIdCatalog(listIdCatalog).toPromise().then(resultSet => {
      this.gerencia = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_INGRESO_CASES_GERENCIAS)
      this.impuestos = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_INGRESO_CASES_IMPUESTOS)
      this.departamento = resultSet.filter(item => item.codigoCatalogo === Constantes.CAT_INGRESO_CASES_DEPARTAMENTO);
    });
  }
  Definitivo() {

    this.modal.show({
      icon: 'question',
      title: 'IFI-100',
      text: '¿Desea rechazar definitivamente el caso?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        this.estructura = new FormStructure().apply({
          appearance: 'standard',
          globalValidators: Validators.required,
          showTitle: false,
          nodes: [new TextArea('editar', '', '').apply({
            singleLine: true
          })],
          validateActions: [
            new Button('cancelar', 'Cancelar', {
              callback: this, style: 'warn'
            }).apply({
              icon: 'close'
            }),
            new Button('rechazo', 'Guardar', {
              callback: this, style: 'primary',
            }).apply({
              validateForm: true,
              icon: 'save'
            }),
          ]
        });
        this.estructura = this.estructura
        this.modal.show({
          title: `Comentario de Rechazo`,
          formStructure: this.estructura,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        })
        /*  */
      }
    })
  }
  RechazoDefinitivo() {
    const post: Case = {
      comentario: this.estructura.getControlById('editar')?.value
    }
    console.log(post)
    //cambiar para que no se el estado quemado
    this.micro.finalRejection(this.idCase, post).toPromise().then(res => {
      this.modal.show({
        icon: 'success',
        title: 'Rechazo Exitoso',
        text: "Se ha realizado el rechazo definitivo del caso correctamente"
      });

      window.location.reload();
    });
  }
}

export class FileData {
  file!: File;
  idFile!: string;
  constructor(file: File, idFile: string) {
    this.file = file;
    this.idFile = idFile;
  }
}
export class PutData {
  idFile!: string;
  fileName!: String;
  index!: number;
  constructor(idFile: string, fileName: string, index: number) {
    this.fileName = fileName;
    this.idFile = idFile;
    this.index = index;
  }
}

export class CaseWrapper {
  caseData!: Case;
  listFileData!: PutData[];
  constructor() { }
}

