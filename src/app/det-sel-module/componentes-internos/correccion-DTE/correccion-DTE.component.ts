import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, FormStructure, TextArea } from 'mat-dynamic-form';
import { input } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { InsumosDTEService } from 'src/app/general-module/componentes-comunes/servicios/insumos-DTE.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

@Component({
  selector: 'app-correccion-DTE',
  templateUrl: './correccion-DTE.component.html',
  styleUrls: ['./correccion-DTE.component.scss']
})
export class CorreccionDTEComponent implements OnInit {
  impuestos!: Catalog[];
  gerencia!: Catalog[];
  departamento!: Catalog[];
  imp!:number
  gen!:number
  dep!:number
  vComentario?:string
  vconstante= Constantes.ESTADO_INSUMO_CORREGIR
  estado!:number
  detalleGroup!: FormGroup; 
  listau?:any
  idInsumo!:number 
  editar:Boolean=false
  estructura!: FormStructure;
  constructor(
    private router: ActivatedRoute,
    private route:Router,
    private micro:InsumosDTEService,
    private gestor: GestorService,
    private modal: DialogService,
    private catalogo: CatalogosService) { }

  ngOnInit() {
    this.router.paramMap.subscribe(params=>{
       this.idInsumo  = parseInt(params.get('idInsumo') as string);
      });
    
    this.detalleGroup = new FormGroup({
      idInsumo: new FormControl('', Validators.required,),
      nombreInsumo: new FormControl('', Validators.required),
      //asignado: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      nombreDepartamento: new FormControl('', Validators.required),
      nombreEstado: new FormControl('', Validators.required),
      nombreGerencia: new FormControl('', Validators.required)
     
    });
    this.micro.getCarteraCorreccion(this.idInsumo).toPromise().then(res=>{
      this.detalleGroup.patchValue({
        idInsumo:res.insumo.idInsumo,
        nombreInsumo: res.insumo.nombreInsumo,
       // asignado: res.insumo.nitEncargado ,
        descripcion: res.insumo.descripcion,    
        nombreEstado: res.insumo.nombreEstado
      });
      
      this.imp=res.insumo.idImpuesto
      this.gen=res.insumo.idGerencia
      this.dep=res.insumo.idDepartamento
      this.estado=res.insumo.idEstado
      if(res.comentario!=null)
      this.vComentario=res.comentario.comentarios
    })
    this.CargaCatalogos()
    this.detalleGroup.disable()
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
Cancelar(){
  this.detalleGroup.disable()
  this.editar=false
}
  EditarInsumo(){
   
    this.detalleGroup.enable()
    this.detalleGroup.controls['idInsumo'].disable()
    this.detalleGroup.controls['nombreEstado'].disable()
    //this.detalleGroup.controls['asignado'].disable()
    this.editar=true
  }
  Guardar(){
    
    console.log(this.detalleGroup.value)
    console.log(this.detalleGroup.controls['idInsumo'].value)
    const post: input={
     descripcion: this.detalleGroup.controls['descripcion'].value,
     nombreInsumo: this.detalleGroup.controls['nombreInsumo'].value,
     idDepartamento:this.dep,
     idEstado:Constantes.ESTADO_INSUMO_NUEVO,
     idGerencia:this.gen 
    }
   
    this.micro.correctInsumo(this.idInsumo,post).toPromise().then(res=>{
      this.modal.show({
        icon: 'success',
        title: 'Modificacion Exitosa',
        text: "Se ha realizado la modificacion del Insumo correctamente correctamente",
        showConfirmButton:true
      });
     
      window.location.reload();

    }) 
  }
  RechazoDefinitivo(){
      
     this.modal.show({
      icon: 'question',
      title: 'IFI-100',
      text: '¿Desea rechazar definitivamente el insumo?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        this.estructura =new FormStructure().apply({
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
    }
   })
  }
  Definitivo(){
    const post: input={
      comentario:this.estructura.getControlById('editar')?.value
     }
  console.log(post)
     this.micro.rejectionInsumo(this.idInsumo,post).toPromise().then(res=>{
      this.modal.show({
        icon: 'success',
        title: 'Rechazo Exitoso',
        text: "Se ha realizado el rechazo definitivo del insumo correctamente",
        showConfirmButton: true
      });
     
      window.location.reload();
    }); 
  }
  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  onClick(actionId: string): void {

    if (actionId == 'cancelar') {
      this.modal.close('cancel');
    }else if(actionId=='rechazo'){
      this.Definitivo()
      this.modal.close('cancel');
    } 
  }
}
