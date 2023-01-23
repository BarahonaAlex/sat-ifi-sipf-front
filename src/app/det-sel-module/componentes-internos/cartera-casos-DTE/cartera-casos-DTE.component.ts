import { MatDialog } from '@angular/material/dialog';
import { InsumosDTEService } from './../../../general-module/componentes-comunes/servicios/insumos-DTE.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormStructure, Button, Dropdown, OptionChild, DatePicker, CustomNode, Input, InputFile, TextArea } from 'mat-dynamic-form';
import { filter } from 'rxjs/operators';
import { Case, CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { input } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { ListaNodosAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { InputService } from 'src/app/general-module/componentes-comunes/servicios/input.service';
import { InputInterface, InputInterfaceComentario } from 'src/app/general-module/componentes-comunes/interfaces/Input.interface';


const newLocal = false;
@Component({
  selector: 'app-cartera-casos-DTE',
  templateUrl: './cartera-casos-DTE.component.html',
  styleUrls: ['./cartera-casos-DTE.component.scss']
})
export class CarteraCasosDteComponent implements OnInit {
  fechaFin: any;
  descripcion: any;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['caso', 'casoNombre', 'nit', 'contribuyente', 'gerencia', 'depto', 'impuesto', 'estado', 'inicio', 'fin', 'acciones'];
  dataSource = new MatTableDataSource();
  idInsumo!: number
  listau?: any
  fechaInicio: any;
  nodeId!: string
  idCase!: number
  nombre: any
  arrayProperties: { name: string, key: string }[] = [];
  estructura!: FormStructure;
  impuestos!: Catalog[];
  gerencia!: Catalog[];
  insumo!: Catalog[];
  origen!: Catalog[];
  departamento!: Catalog[];
  showVisor: Boolean = true;
  vconstante = Constantes.ESTADO_CASO_CORREGIR;
  showDelete = false;
  showPublish = false;
  constantes = Constantes;
  inputData!: InputInterfaceComentario;
  inputStatus = 0;



  constructor(private aRoute: ActivatedRoute,
    private router: Router,
    private micro: CasosDTEService,
    private modal: DialogService,
    private catalogo: CatalogosService,
    private gestor: GestorService,
    private inputDteService: InsumosDTEService,
    private inputService: InputService) {

    this.aRoute.queryParams.pipe(filter(params => params.id)).subscribe(params => {
      this.idInsumo = params.id
    });
  }

  async ngOnInit() {
  
    if(this.idInsumo == undefined){
      this.idInsumo = 0;

    } else{
      this.inputService.getInputById(this.idInsumo).toPromise().then(result => {
        this.inputData = result;
        this.inputStatus = this.inputData.insumo.idEstado;
      }
      );
    }   
    
    this.micro.getWallet(this.idInsumo).toPromise().then(result => {
      this.listau = result;
      this.dataSource.data = this.listau.map((t: any) => {


        const impuestosLista = t.impuestos ? JSON.parse(t.impuestos) : t.impuesto ? JSON.parse(t.impuesto) : []
        /* const impuestos = t.impuesto ? JSON.parse(t.impuesto)[0] : {} */
        t.nombreImpuesto = impuestosLista.map((t: any) => t.nombreimpuesto).join(', ')
        t.idImpuesto = impuestosLista.map((t: any) => t.idimpuesto).join(', ')

        return t
      })


      console.log(this.listau)

      this.showPublish = (this.listau.filter((k: any) => k.idEstado == Constantes.ESTADO_CASO_PENDIENTE_DOCUMENTAR).length == 0);

      this.showDelete = (this.listau.filter((k: any) => k.idEstado == Constantes.ESTADO_CASO_PENDIENTE_PUBLICAR).length > 0)
        || (this.listau.filter((k: any) => k.idEstado == Constantes.ESTADO_CASO_PENDIENTE_DOCUMENTAR).length > 0);


    });




    //this.listau.filter(item=>item.idEstado=)

  }


  async CasosSinDocumentos(marcado: boolean) {

    if (marcado != false) {
      /*  this.listau = await this.micro.getWalletWithOutDocuments(this.idInsumo).toPromise() */

      this.dataSource.data = this.listau.filter((k: any) => k.idEstado == Constantes.ESTADO_CASO_PENDIENTE_DOCUMENTAR).map((t: any) => {
        const impuestosLista = t.impuestos ? JSON.parse(t.impuestos) : t.impuesto ? JSON.parse(t.impuesto) : []
        /* const impuestos = t.impuesto ? JSON.parse(t.impuesto)[0] : {} */
        t.nombreImpuesto = impuestosLista.map((t: any) => t.nombreimpuesto).join(', ')
        t.idImpuesto = impuestosLista.map((t: any) => t.idimpuesto).join(', ')
        return t
      })


    } else {
      this.ngOnInit();
    }

  }
  async AdjuntarArchivo(itemCaso: CaseList) {
    let datos = itemCaso
    let ruta = {
      "caso": String(datos.idCaso),
      "carpeta": "Archivos Respaldo"
    }

    this.idCase = datos.idCaso
    await this.micro.getPath(ruta).toPromise().then(
      resp => {
        this.nodeId = resp.id;
      })


    this.Estructura()
    this.modal.show({
      title: `Adjuntar archivos `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })


  }
  Estructura() {

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode('doc', UploadFileComponent, {
          label: 'Ficha Tecnica',
          accept: ['xlsx'],
          folder: this.nodeId,
          saveOnLoad: false,
        }).apply({ singleLine: true, require: false }),
        new CustomNode('doc1', UploadFileComponent, {
          label: 'Documento de Respaldo 1',
          accept: ['pdf', 'png', 'jpg', 'jpeg'],
          folder: this.nodeId,
          saveOnLoad: false,
        }).apply({ singleLine: true, require: false }),
        new CustomNode('doc2', UploadFileComponent, {
          label: 'Documento de Resplado 2',
          accept: ['pdf', 'png', 'jpg', 'jpeg'],
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
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: false,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura
  }
  async EditarCaso(id: number) {
    let datos = this.listau[id]
    await this.CargaCatalogos();
    this.EstructuraCaso(datos)
    this.modal.show({
      title: `Modificar Caso`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    })
  }
  ModificarCaso() {
    let id = this.estructura.getNodeById<Input>('idCaso')
    this.micro.UpdateCase(Number(id.value), this.estructura.getValue()).toPromise().then(res => {
      this.modal.show({
        icon: 'success',
        title: 'Modificación Exitosa',
        text: "Se ha realizado la modificación del caso correctamente"
      });
      this.ngOnInit();
    })
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
  async EstructuraCaso(datos: any) {

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('idCaso', 'IdCaso', datos.idCaso).apply({
          disabled: true
        }),
        new Input('nombreCaso', 'Nombre Caso', datos.nombreCaso),
        new Dropdown('gerencia', 'Gerencia',
          this.gerencia?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
            selectedValue: datos.idGerencia,//codigo elegio 
            disabled: false
          }),
        new Dropdown('tipoAlcance', 'Departamento',
          this.departamento?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
            selectedValue: datos.idTipoAlcance,
            disabled: false
          }),
        new Dropdown('impuesto', 'Impuesto',
          this.impuestos?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
            selectedValue: datos.idImpuesto,
            disabled: false
          }),
        new DatePicker('periodoRevisionInicio', 'Fecha de inicio', datos.periodoRevisionInicio),
        new DatePicker('periodoRevisionFin', 'Fecha fin', datos.periodoRevisionFin),
        new Input('descripcion', 'Descripcion', datos.descripcion),


      ],
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
  }
  async GuardarArchivo() {

    const formData = new FormData();//currentFile
    formData.append('file', this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc').instance.currentFile || "")
    formData.append('file', this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc1').instance.currentFile || "")
    formData.append('file', this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc2').instance.currentFile || "")

    let archivo = [
      { ar: this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc') },
      { ar: this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc1') },
      { ar: this.estructura.getNodeById<CustomNode<UploadFileComponent>>('doc2') }
    ]

    let dto: Case = {
      idCaso: this.idCase
    }
    formData.append('data', JSON.stringify(dto));
    let sinDoc = false
    let conDoc = false
    archivo.forEach(element => {
      if (element.ar.instance.getState() == "valid") {
        conDoc = true
      } else {
        sinDoc = true
      }

    });
    if (sinDoc) {
      if (conDoc == false) {
        await this.modal.close('primary')
        await this.modal.show({
          icon: 'question',
          title: 'Sin Adjuntar Documentos',
          text: "¿ Está seguro de Publicar el caso sin adjuntar documento ?",
          showCancelButton: true
        }).then(
          async res => {
            if (res == 'primary') {
              await this.micro.updateDocumentsCase(this.idCase, formData).toPromise().then(resp => {
                this.CasosSinDocumentos(true);
              })
            }
          }
        )
      } else {
         await this.micro.updateDocumentsCase(this.idCase, formData).toPromise().then(resp => {
          this.CasosSinDocumentos(false);
        })
      }

    } else {
      await this.micro.updateDocumentsCase(this.idCase, formData).toPromise().then(resp => {
        this.CasosSinDocumentos(false);
      })

    }

    this.ngOnInit();

  }
  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  onClick(actionId: string): void {



    if (actionId == 'guardar') {

      this.GuardarArchivo();
      this.modal.close('primary');
    }
    else if (actionId == 'editar') {
      this.ModificarCaso()
      this.modal.close('primary');
    }
    else if (actionId == 'cancelar') {

      this.modal.close('cancel');
    }
    else {

      this.nodeId = actionId
      this.showVisor = false
      this.modal.close('cancel');
    }

  }
  VerArchivo(id: number) {

    let post = {
      caso: this.listau[id].idCaso,
      carpeta: "Archivos Respaldo"
    }

    this.micro.getPath(post).toPromise().then(res => {

      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {

        //this.nodeId= result.list.entries[0].entry.id;
        this.EstructuraArchivos(result)
        this.modal.show({
          title: `Archivos de respaldo`,
          formStructure: this.estructura,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        })
      })

    })
  }
  EstructuraArchivos(datos: ListaNodosAcs) {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        })
      ]
    });
    datos.list.entries.forEach(element => {
      let node = [new Button(element.entry.id, 'Ficha tecnica ' + element.entry.name, { callback: this }).apply({
        disabled: false,
        action: { type: 'onclick', callback: this }
      })]
      this.estructura.createNodes(1, node)
    })
    this.estructura = this.estructura
  }
  regresar() {

    this.showVisor = true;
    this.nodeId = ""
    this.ngOnInit()
  }
  getColor(idEstado: number): string {
    let vColor = ""
    switch (idEstado) {
      case Constantes.ESTADO_CASO_CORREGIR:
        vColor = 'red'
        break
      case Constantes.ESTADO_INSUMO_RECHAZO_DEF:
        vColor = 'red'
        break
      case Constantes.ESTADO_CASO_RECHAZADO_OP:
        vColor = 'red'
        break
      default:
        vColor = 'black'
    }
    return vColor
  }
  verDetalle(item: CaseList) {

    this.idInsumo = item.idInsumo
    if (this.idInsumo == 0) {
      this.idInsumo = item.idInsumo

    }
    this.router.navigate(['/det-sel/detalle/caso/dte', item.idCaso, this.idInsumo]);

  }





  delete() {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Justificación de la eliminación.').apply({
          singleLine: true,
          maxCharCount: 200,
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('eliminar', 'Eliminar', {
          onEvent: () => this.deleteInput(), style: "primary"
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.modal.show({
      title: `Eliminar insumo.`,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });

  }



  deleteInput() {

    const post: input = {
      comentario: this.estructura.getControlById('comentarios')?.value
    }
    console.log(post);

    this.inputDteService.deleteInput(this.idInsumo, post).toPromise().then(result => {
      this.modal.closeAll();
      this.router.navigate(['/det-sel/cartera/insumos/dte']);
      this.modal.showSnackBar({
        title: 'IFI-200',
        text: `El insumo fue eliminado exitósamente.`,
        icon: 'success',
        duration: 3000
      }
      );

    });


  }





  publish() {

    this.modal.show({
      icon: 'question',
      title: 'IFI-100',
      text: "¿Realmente desea publicar el insumo?",
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(result => {
      if (result === 'primary') {
        const post: input = {};
        this.inputDteService.publishInput(this.idInsumo, post).toPromise().then(result => {
          this.router.navigate(['/det-sel/cartera/insumos/dte']);
          this.modal.showSnackBar({
            title: 'IFI-200',
            text: `El insumo fue publicado exitósamente.`,
            icon: 'success',
            duration: 3000
          }
          );
        });
      }
    });



  }
}


