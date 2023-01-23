import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, Pipe, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormStructure, Button, TextArea } from 'mat-dynamic-form';
import { EntryNodoAcs, ListaNodosAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import { CreditoFiscalResponse, RejectApproveDocumentParam } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Logs } from 'selenium-webdriver';

@Component({
  selector: 'app-bandeja-credito-fiscal-documento',
  templateUrl: './bandeja-credito-fiscal-documento.component.html',
  styleUrls: ['./bandeja-credito-fiscal-documento.component.css']
})
export class BandejaCreditoFiscalDocumentoComponent implements OnInit {
  @Input('idCedula') idCedula!: number;
  @Input('idEstadoSolicitud') idEstadoSolicitud!: number;
  @Output('cantidadEvent') cantidadArchivosEvent = new EventEmitter<any>(); 
  @Output() componentEvent = new EventEmitter<Boolean>();

  estructura!: FormStructure;
  showVisor: Boolean = true;
  showIcon: Boolean = false;
  nodeId!: string;
  folder!: string
  vListaDocumentos: EntryNodoAcs[] = []
  selection = new SelectionModel<EntryNodoAcs>(true, []);
  arrayProperties: { name: string, key: string }[] = [];
  jsonDocument: any;
  listaDocumentos: { nombre: string,id:string, idDoc:number }[] = []
  nodeNombre!: string;
  idArchivo!: number;
  casoId!: number;
  textDocument!: string;
  nit: string | undefined;
  periodo: string | undefined;
  listaDataArchivos: CreditoFiscalResponse[]=[];
  validateActionsDefault!: Button[];
  idDocument!: number;
  canDoc: number = 0;
  
   @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['nombre','acciones']; 
  dataSource = new MatTableDataSource<any>();


  constructor(
    private gestor: GestorService,
    private modal: DialogService,
    private servicioDocumento: CreditoFiscal,
    private dialogService: DialogService,
    private router: Router,

  ) {
    this.dataSource.data = []
  }

  async ngOnInit() {

    this.componentEvent.emit(true);    
    
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Comentarios', '').apply({
          singleLine: true, maxCharCount: 400
        })
      ],
      validateActions: [],
    });
    

    await this.servicioDocumento.getCreditoFiscalDocumentoById(this.idCedula, 1053).toPromise().then(resultado => {
      console.log(resultado);
      
      if(resultado.length > 0){
      this.nit = resultado[0].nitContribuyente;
      this.periodo = resultado[0].periodo;
      this.columns
      
      this.listaDataArchivos = resultado
      this.canDoc = resultado.length
      this.cantidadArchivosEvent.emit(this.canDoc);  
      
        
      }else{
        this.cantidadArchivosEvent.emit(0)
        this.listaDataArchivos = []   
        this.dataSource.data = []
        this.showVisor = true   
      }

    })

    if(this.listaDataArchivos.length !== 0){
      this.VerArchivo()
    } else{
      this.dataSource.data.length = 0
    }
    
  }

  async VerArchivo() {

    let post = {
      nit: this.nit,
      periodo: this.periodo
    }

    await this.servicioDocumento.getPath(post).toPromise().then(res => {
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {

        if (result != null) {
          this.EstructuraArchivos(result)

        } else {
          this.modal.show({
            icon: 'warning',
            title: 'IFI-100',
            text: 'No tiene Documentos de Respaldo',
            showCancelButton: false,
            disableClose: false,
          })

        }

      })

    })
  }

  EstructuraArchivos(datos: ListaNodosAcs) {
    this.listaDocumentos=[];
    console.log(datos);
    
    datos.list.entries.forEach(element => {
      let dato = this.listaDataArchivos.find((date: any) => date.nombre == element.entry.name) || null
      if(dato!=null){
        this.listaDocumentos.push( {nombre:dato.nombre!,id:element.entry.id!,idDoc:dato.idArchivo!} )
      }
    })
    this.dataSource.data=this.listaDocumentos
    this.showVisor= true;
    this.showIcon = false; 
    
  }

  showFile(id: string, nombre:string, idDoc: number) {
    
    this.nodeId = id;
    this.nodeNombre=nombre
    this.idDocument = idDoc
    this.showIcon = true;
    this.showVisor = false   
    this.componentEvent.emit(false);
    
  }

  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  onClick(actionId: string): void {

    if (actionId == 'Regresar') {
      this.showVisor = true
      this.modal.close('cancel');
    } else {
      this.nodeId = actionId
      this.showVisor = false
      this.modal.close('cancel');
    }
  }

  actionDocument (opcion: Number, nombre: string, nodo: string) {
    console.log("comment: string, idDoc: number");    

    let documentDTO = {
      documentosRespaldo: ""
    }
    switch (opcion) {
      case 1:
        this.dialogService.show({
          icon: 'question',
          title: 'Aprobar',
          text: "¿Está seguro de Aprobar el documento?",
          showCancelButton: true
        }).then(res => {
          if (res == 'primary') {

            this.servicioDocumento.rejectApproveFiscalDocument("", this.idDocument, 1054).toPromise().then(r =>{
              console.log(r);
              
                this.dialogService.show({
                  icon: 'success',
                  title: 'IFI-200',
                  text: "Aprobación exitosa"
                }) .then(result => {
                  console.log("despues",this.canDoc);
                  
                    this.ngOnInit();                 
                   
                });
              
              
            })
               
          }
        })
        
        break;

      case 2:

        this.dialogService.show({
              icon: 'warning',
              title: 'Rechazar',
              text: "¿Está seguro de Rechazar el documento?",
              showCancelButton: true
          
        }).then(res =>{

          if(res == "primary"){
            this.dialogService.show({
              title: "Comentario de rechazo",
            formStructure: this.estructura,
            showConfirmButton: true,
            showCancelButton: true

            }).then(r =>{
              if(r == "primary"){
                
                this.servicioDocumento.rejectApproveFiscalDocument(this.estructura.getControlById('comentarios')?.value, this.idDocument, 1055).toPromise().then(res =>{
                  
                    this.dialogService.show({
                      icon: 'success',
                      title: 'IFI-200',
                      text: "Rechazo exitoso"
                    }) .then(result => {
                      console.log("despues",this.canDoc);
                      
                      
                        this.ngOnInit();
                        
                    }); 
                  
                }) 
              }
            })
          }
          
        })
        
        break;

    }
  }

}
