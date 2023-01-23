import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Button, CustomNode, Dropdown, FormStructure, Input, OptionChild, TextArea } from 'mat-dynamic-form';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { InsumosDTEService } from 'src/app/general-module/componentes-comunes/servicios/insumos-DTE.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { CatalogoDetalleComponent } from '../catalogo-detalle/catalogo-detalle.component';

@Component({
  selector: 'app-cartera-insumos-DTE',
  templateUrl: './cartera-insumos-DTE.component.html',
  styleUrls: ['./cartera-insumos-DTE.component.scss']
})
export class CarteraInsumosDteComponent implements OnInit {
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['insumo', 'nombreInsumo', 'gerencia', 'depto', 'descripcion', 'estado', 'casos','fecha_publicacion' , 'acciones'];

  dataSource = new MatTableDataSource();

  listau?: any
  estructura!: FormStructure;
  impuestos!: Catalog[];
  gerencia!: Catalog[];
  departamento!: Catalog[];
  vShow: number = 1
  vconstante = Constantes.ESTADO_INSUMO_CORREGIR
  constructor(private router: Router,
    private micro: InsumosDTEService,
    private catalogo: CatalogosService,
    private modal: DialogService
  ) {

  }

  ngOnInit() {
    this.micro.getCartera(Constantes.ESTADO_INSUMO_PENDIENTE_PUBLICAR,
      Constantes.ESTADO_INSUMO_NUEVO,
      Constantes.ESTADO_INSUMO_DOCUMENTAR,
      Constantes.ESTADO_INSUMO_CORREGIR,
      Constantes.ESTADO_INSUMO_SUSPENDIDO).toPromise().then(res => {
        this.listau = res;
        this.dataSource.data = this.listau;
        console.log(this.dataSource.data)
      })
  }

  /*  async Editar(id: number) {
     let datos = this.listau[id]
     await this.CargaCatalogos();
     this.EstructuraInsumo(datos)
     this.modal.show({
       title: `Modificar Insumo `,
       formStructure: this.estructura,
       showCancelButton: false,
       showConfirmButton: false,
       disableClose: true,
     })
   } 
   async EstructuraInsumo(datos: any) {
 
     this.estructura = new FormStructure().apply({
       appearance: 'standard',
       globalValidators: Validators.required,
       showTitle: false,
       nodes: [
         new Input('idInsumo', 'id Insumo', datos.idInsumo).apply({
           disabled: true
         }),
         new Input('nombreInsumo', 'Nombre Insumo', datos.nombreInsumo),
         new Dropdown('idGerencia', 'Gerencia',
           this.gerencia?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
             selectedValue: datos.idGerencia,//codigo elegio 
             disabled: false
           }),
         new Dropdown('idDepartamento', 'Departamento',
           this.departamento?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
             selectedValue: datos.idDepartamento,
             disabled: false
           }),
         new Dropdown('idImpuesto', 'Impuesto',
           this.impuestos?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
             selectedValue: datos.idImpuesto,
             disabled: false
           }),
         
 
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
           validateForm: true,
           icon: 'save'
         }),
       ]
     });
 
     this.estructura = this.estructura
   } */
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

  /*  editarInsumo() {
     console.log(this.estructura.getValue())
     let id = this.estructura.getNodeById<Input>('idInsumo')
     console.log(id.value)
     this.micro.modificarInsumo(Number(id.value), this.estructura.getValue()).toPromise().then(res => {
       this.modal.show({
         icon: 'success',
         title: 'Modificacion Exitosa',
         text: "Se ha realizado la modificacion del insumo correctamente"
       });
       this.ngOnInit();
     })
   }
   onEvent(id: string, value: any): void {
     console.log(id)
   }
 
   onClick(actionId: string): void {
     if (actionId == 'guardar') {
 
       this.editarInsumo();
       this.modal.close('primary');
     }
     else {
       console.log("entra al cancel")
       this.modal.close('cancel');
     }
   } */

  infoDetail(idInsumos: number) {

    this.router.navigate(['/det-sel/cartera/casos/dte'], { queryParams: { id: idInsumos } });
  }

  selectOption(tipo: number) {
    this.vShow = tipo
    if (tipo == 1) {
      this.ngOnInit()
    }
  }

  showCatalogs() {

    const structure = new FormStructure().apply({
      showTitle: false,
      nodes: [
        new CustomNode<CatalogoDetalleComponent>('catalogo_detalle', CatalogoDetalleComponent, {}).apply({
          singleLine: true
        })
      ],
      validateActions: []
    });
    this.modal.show({
      title: "Consulta de Catálogos",
      showConfirmButton: false,
      showCloseButton: true,
      formStructure: structure
    });
  }

  downloadTemplate() {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/docs/Carga Masiva.xlsx';
    link.download = "Plantilla Carga Masiva.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getColor(idEstado: number): string {
    let vColor = ""
    switch (idEstado) {
      case Constantes.ESTADO_INSUMO_CORREGIR:
        vColor = 'red'
        break
      default:
        vColor = 'black'
    }
    return vColor
  }
  CorregirInsumo(item: number) {

    this.router.navigate(['/det-sel/corregir/insumo', item]);
  }

  onResult(ok: boolean) {
    if (ok) return this.selectOption(1)
    this.vShow = 1;
  }


  

}
