import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import Swal from 'sweetalert2';
import { EntryNodoAcs, ListaNodosAcs } from '../interfaces/nodos-ACS.interface';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnInit {
  /* Variables para mostrar documentos */
  @Input('nodeId') nodeId!: string;
  @Input('arregloPropiedades') arregloPropiedades!: { name: string, key: string }[];
  @Input('document') document!: Blob;
  @Input('isScope') scope: boolean = false;
  mostrarPdf: boolean = false;
  mostrarImg: boolean = false;
  mostrarMensajeError: boolean = false;
  docBase64: any;
  propiedadesDocMostrar!: { key: string, value: string }[];
  displayedColumns: string[] = ['id', 'name', 'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gestorService: GestorService
  ) {
  }

  async ngOnInit() {
    if(this.document && this.nodeId){
      
      this.getVersion(this.nodeId);
      const propiedades = await this.getInfDocById(this.nodeId);
      //console.log('propiedades: ', propiedades);
      this.mapPropiedadesDoc(propiedades.properties);
      this.renderDoc(this.document)
    }
    else if (!this.document) {
      this.getVersion(this.nodeId);
      const propiedades = await this.getInfDocById(this.nodeId);
     // console.log('propiedades: ', propiedades);
      this.mapPropiedadesDoc(propiedades.properties);
      const data = await this.getDocByNodeId(this.nodeId);
      if (data.size <= 0) {
        Swal.fire({
          titleText: 'No se puede visualizar el documento, existen inconvenientes al descargar, por favor intente en otro momento',
          icon: 'error',
          showCloseButton: true,
          showConfirmButton: false
        });
        return;
      }
      this.renderDoc(data);
    }
    else{
      this.renderDoc(this.document)
    }
  } 
  /** 
* @description Metodo para filtrar contenido de tabla principal
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param event evento de teclado para filtrar
*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** 
* @description Metodo para obtener el blob de una documento en base a su `node`
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param node identificador del nodo a consultar
*/
  public async getDocByNodeId(node: string): Promise<Blob> {
    const doc = await this.gestorService.contentSitesFileById(node).
      toPromise().then((data: Blob) => {
        return data;
      });
    return doc;
  }

  /** 
* @description Metodo para obtener la informacion del nodo en base a su `node`
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param node identificador del nodo a consultar
*/
  public async getInfDocById(node: string): Promise<EntryNodoAcs> {
    const doc = await this.gestorService.contentSitesNodeById(node).
      toPromise().then((data: EntryNodoAcs) => {
        return data;
      });
    return doc;
  }

  /** 
* @description Metodo para rederizar el contendio del documento y mostrarlo
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param doc blob del documento a mostrar
* @param tipoDoc tipo del documento
*/
  public renderDoc(doc: Blob) {
    //console.log('tipo doc ', doc.type);
    const reader = new FileReader();
    reader.readAsDataURL(doc);
    reader.onloadend = () => {
      switch (doc.type) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
        case 'application/octet-stream':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-excel':
          this.mostrarMensajeError = true;
          break;
        default:
          const arrayTipo = doc.type.split('/');
          const tipoDoc = arrayTipo[0];
          //console.log('tipo de archivo ', tipoDoc)
          if (tipoDoc == 'application') this.mostrarPdf = true;
          if (tipoDoc == 'image') this.mostrarImg = true;
          this.docBase64 = reader.result;
          break;
      }
    }
  }

  /** 
* @description Metodo para descargar el documento en base a su `doc`
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param doc blob del documento a mostrar
*/
  public async downloadFile(id: string, name: string) {
    const data = await this.getDocByNodeId(id);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const url = URL.createObjectURL(data);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /** 
* @description Metodo para obtener las versiones de un documento en base a su `id`
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param id nodeId del documento
*/
  public getVersion(id: string) {
    this.gestorService.contentSitesFileByIdVersions(id, 'properties,aspectNames').subscribe((res: ListaNodosAcs) => {
      const versionData: Array<VersionTable> = new Array();
      res.list.entries.forEach(data => {
        //console.log('propiedades ', Object.entries(data.entry.properties));
        versionData.push({
          id: data.entry.id,
          idv: data.entry.idv,
          name: data.entry.name,
          editor: this.obtenerItemPropiedades(data.entry.properties, 'cm:author'),
          fecha: moment(data.entry.modifiedAt).format('DD/MM/YYYY')
        });
      })
      this.dataSource.data = versionData;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.dataSource.sort = this.sort;
    }, err => {
      console.error(err);
    });
  }

  /** 
* @description Metodo para obtener un propiedad de un arreglo
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param propiedades arreglo de propiedades
* @param item propiedad a buscar
*/
  public obtenerItemPropiedades(propiedades: object, item: string): string {
    if (propiedades == null) {
      return '';
    }
    const arrayPropiedades = Object.entries(propiedades).find(e => e[0] == item);
    return arrayPropiedades != null ? arrayPropiedades[1] : '';
  }
  /** 
* @description Metodo para mapear propiedades del documento
* @author Rudy Culajay (ruarcuse)
* @since 2/12/2021
* @param propiedades arreglo de propiedades
*/
  public mapPropiedadesDoc(propiedades: object) {
    this.propiedadesDocMostrar = [];
    if (!this.arregloPropiedades) return;
    this.arregloPropiedades.forEach(data => {
      this.propiedadesDocMostrar.push({ key: data.name, value: this.obtenerItemPropiedades(propiedades, data.key) })
    })
    
  }
  public async viewDocument(idDoc: string){    
    const file = await this.getDocByNodeId(idDoc);
    this.renderDoc(file)    
  }
}
interface VersionTable {
  id: string,
  idv: string,
  name: string,
  editor: string,
  fecha: string
}
