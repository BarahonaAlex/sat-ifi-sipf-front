import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNode, FormStructure } from 'mat-dynamic-form';
import { filter } from 'rxjs/operators';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { Scope } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { parsearNombre } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { VisorComponent } from 'src/app/general-module/componentes-comunes/visor/visor.component';
import { AlcanceDenunciaComponent } from '../administracion-alcance/alcance-denuncia/alcance-denuncia.component';

export interface DenunciaAP{
  correlativo: string;
  estado: string;
  nitDenunciado: string;
  nitDenunciante: string;
  insumo: number;
}

@Component({
  selector: 'app-elaboracion-alcance-denuncias',
  templateUrl: './elaboracion-alcance-denuncias.component.html',
  styleUrls: ['./elaboracion-alcance-denuncias.component.scss']
})
export class ElaboracionAlcanceDenunciasComponent implements OnInit {
  DenunciaAprobada: string[] = ['idAlcance', 'nombreTipo', 'nombreEstado', 'Accion'];
  DenunciaA = new MatTableDataSource<Scope>()
  next : boolean = false
  arrayProperties: { name: string, key: string }[] = [];
  showVisor: Boolean = true;
  nodeId!: string
  constructor(private router: Router,
     public dialog: MatDialog,
      private services: DenunciasService,
      private gestor: GestorService,
      private dialogService: DialogService) { }
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.DenunciaA.paginator = mp1;
  }
  ngOnInit(): void {
   
    this.getScope()
  }
  getScope(){
    this.services.getScope().toPromise().then(res =>{
      this.DenunciaA.data = res
    })
  }

  showAnalityc(/* item: number */) {
    this.router.navigate(['/programacion/elaboracion/alcances/denuncias'/* , item */])
  }

  openModalScope(/* item: number */) {
    this.router.navigate(['/programacion/cartera/alcance/denuncias'/* , item */])
  }
  gAlcance(){
    this.next = true
  }
  openModalCabinet(){
    this.router.navigate(['/programacion/cartera/denuncia/gabinete'/* , item */])
  }
  abrirAlcance(){            
    this.router.navigate([`/programacion/operador/alcance/presencias/puntosFijos/0`/* , item */])
  }
  corregirAlcance(id:number){            
    this.router.navigate([`/programacion/operador/alcance/presencias/puntosFijos/${id}`/* , item */])
  }
  verAlcance(item:Scope){
    let post = {
      id: item.idAlcance
    }

    this.services.getPath(post).toPromise().then(res => {

      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        if(result != null){
        this.nodeId= result.list?.entries[0]?.entry?.id;
        this.showVisor = false;
        }
        else{
          this.dialogService.show({
            icon: 'error',
            title: 'IFI-404',
            text: "No se ha encontrado el archivo Alcance",
          });
        }
      })

    })
  }
  regresar() {
    this.showVisor = true;
    this.nodeId = ""
    this.ngOnInit()
  }
  getColor(idEstado: number): string {
    let vColor = ""
    switch (idEstado) {
      case 181:
        vColor = 'red'
        break
      default:
        vColor = 'black'
    }
    return vColor
  }
}