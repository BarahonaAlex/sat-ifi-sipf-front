import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EntryNodoAcs, ListaNodosAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import * as moment from 'moment';
import { Button, FormListener, FormStructure, Input, CustomNode } from 'mat-dynamic-form';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Validators } from '@angular/forms';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';

@Component({
  selector: 'app-adminitracion-documentos',
  templateUrl: './adminitracion-documentos.component.html',
  styleUrls: ['./adminitracion-documentos.component.scss']
})
export class AdminitracionDocumentosComponent implements OnInit, FormListener {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['name', 'createdAt', 'modifiedAt', 'acciones'];
  dataSource = new MatTableDataSource();
  nodeId: string = '';
  showVisor: Boolean = true;
  routeDocs: { route: string, nodeId: string, isFile: boolean }[];
  arrayProperties: { name: string, key: string }[] = [];
  structure!: FormStructure;
  validateActionsDefault!: Button[];

  constructor(private gestorService: GestorService,
    private dialogService: DialogService) {
    this.routeDocs = new Array();
    this.arrayProperties.push({ name: 'Autor', key: 'cm:author' })
    this.validateActionsDefault = [
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
    ];
  }

  async ngOnInit() {
    await this.gestorService.contentSitesBasePathByParams('ADMINISTRACION_DOCUMENTOS').toPromise()
      .then((data: EntryNodoAcs) => {
        console.log(data);
        this.getListNodeChildren('Inicio', String(data.id), false);
      });
  }

  /** @description Metodo para filtrar datos mostrados en tabla principal*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
  * @description Método para obtener la lista de documentos o carpetas hijas en base al nodeId
  * @author ruarcuse (Rudy Culajay)
  * @since 19/11/2021
  * @param route nombre de la carpeta
  * @param idNode indentificador del node
  */
  public getListNodeChildren(route: string, idNode: string, isFile: boolean) {
    if (isFile) {
      this.showVisor = false;
      this.nodeId = idNode;
      return;
    }
    this.routeDocs.push({ route: route, nodeId: idNode, isFile });
    this.showVisor = true;
    this.gestorService.contentSitesFolderByIdNodesChildren(idNode, 'properties,aspectNames').subscribe((res: ListaNodosAcs) => {
      console.log("nodos hijos ", res);
      if (res == null) {
        this.dataSource.data = [];
        return;
      }
      let entries: EntryNodoAcs[] = [];
      res.list.entries.forEach(res => {
        if (res.entry.isFolder) {
          res.entry.ruta = 'folder';
        } else {
          res.entry.ruta = 'description';
        }
        res.entry.createdAt = moment(res.entry.createdAt).format('DD/MM/YYYY');
        res.entry.modifiedAt = moment(res.entry.modifiedAt).format('DD/MM/YYYY');
        entries.push(res.entry);
      });
      this.dataSource.data = entries;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.dataSource.sort = this.sort;
    });

  }

  /**
  * @description Método para ajustar la ruta a consultar
  * @author ruarcuse (Rudy Culajay)
  * @since 19/11/2021
  * @param idNode indentificador del node
  * @param index posición en array de rutas a eliminar
  */
  public deleteItemRoute(idNode: string, index: number) {
    const logitudRuta = this.routeDocs.length - 1;
    console.log('ruta ajustar ', idNode, 'index ', index, 'longitud arreglo ', logitudRuta);
    if (index == 0) {
      const rutaIncial = this.routeDocs[0];
      this.routeDocs = [];
      this.getListNodeChildren(rutaIncial.route, idNode, rutaIncial.isFile);
      return;
    }

    if ((this.routeDocs.length - 1) == index) {
      this.getListNodeChildren(this.routeDocs[index].route, idNode, this.routeDocs[index].isFile);
      this.routeDocs.pop();
      return;
    }
    const elementoEliminar = this.routeDocs[index];
    this.routeDocs.splice(index, (logitudRuta));
    console.log('ruta ', this.routeDocs);
    this.getListNodeChildren(elementoEliminar.route, idNode, elementoEliminar.isFile);
  }

  /**
 * @description Método para editar nombre de carpetas o archivos
 * @author ruarcuse (Rudy Culajay)
 * @since 22/11/2021
 * @param node objeto a editar
 */
  public editNameNode(node: EntryNodoAcs) {
    const nodeId = this.routeDocs[this.routeDocs.length - 1].nodeId;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('nameNode', '', node.name).apply({
          singleLine: true, maxCharCount: 100
        }),
      ],
      validateActions: this.validateActionsDefault
    });

    this.dialogService.show({
      title: `Editar Carpeta`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    }).then(result => {
      console.log(this.structure.getValue());
      if (result !== 'primary') return;
      const nameNode = this.structure.getControlById('nameNode')?.value;
      this.gestorService.contentSitesFoldersSetNameByIdUpdate(node.id, nameNode).subscribe(res => {
        this.dialogService.show({
          icon: 'success',
          title: 'IFI-200',
          text: "Se ha realizado el combio de nombre",
        });
        this.deleteItemRoute(nodeId, this.routeDocs.length - 1);
      });
    });
  }

  /**
* @description Método para crear una carpeta en un nodoPadre
* @author ruarcuse (Rudy Culajay)
* @since 9/12/2021
*/
  public createFolder() {
    const nodeId = this.routeDocs[this.routeDocs.length - 1].nodeId;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('nameNode', '', '').apply({
          singleLine: true, maxCharCount: 100
        }),
      ],
      validateActions: this.validateActionsDefault
    });
    this.dialogService.show({
      title: `Crear Carpeta`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    }).then(result => {
      console.log(this.structure.getValue());
      const nameNode = this.structure.getControlById('nameNode')?.value;
      if (result !== 'primary') return;
      this.gestorService.contentFolderCreateByNodeId(nodeId, nameNode).subscribe(res => {
        this.dialogService.show({
          icon: 'success',
          title: 'IFI-200',
          text: "Se ha creado la carpeta",
        });
        this.deleteItemRoute(nodeId, this.routeDocs.length - 1);
      });
    });
  }

  /**
* @description Método para validar si un nodo se debe eliminar
* @author ruarcuse (Rudy Culajay)
* @since 10/12/2021
* @param node informacion del nodo
*/
  public validDeleteNode(node: EntryNodoAcs) {
    if (node.isFolder) {
      /* Se valida que antes de eliminar una carpeta, esta no contenga archivos o carpetas hijas */
      this.gestorService.contentSitesFolderByIdNodesChildren(node.id).subscribe((res: ListaNodosAcs) => {
        console.log("nodos hijos: ", res);
        if (res != null || res != undefined) {
          this.dialogService.show({
            icon: 'warning',
            title: 'IFI-500',
            text: "La carpeta que se desea eliminar contiene documentos o carpetas asociadas",
          });
          return;
        }
        this.deleteNodeACS(node);
      });
    }
    if (node.isFile) {
      this.deleteNodeACS(node);
    }
  }

  /**
* @description Método para eliminar un nodo en base a su nodeId
* @author ruarcuse (Rudy Culajay)
* @since 10/12/2021
* @param node informacion del nodo
*/
  public deleteNodeACS(node: EntryNodoAcs) {
    const nodeId = this.routeDocs[this.routeDocs.length - 1].nodeId;
    this.dialogService.show({
      icon: 'warning',
      title: 'IFI-500',
      text: `Estas seguro de eliminar ${node.isFile ? 'el' : 'la'} siguiente ${node.isFile ? 'documento: ' : 'carpeta: '} ${node.name} ?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(result => {
      if (result == 'primary') console.log('se elimina')

    });
  }

  /**
* @description Método para cargar archivos en la carpeta actual
* @author ruarcuse (Rudy Culajay)
* @since 10/12/2021
* @param node informacion del nodo
*/
  public uploadDocFolderACS() {
    const nodeId = this.routeDocs[this.routeDocs.length - 1].nodeId;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode('doc', UploadFileComponent, {
          lable: 'Archivo',
          accept: ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'],
          folder: nodeId,
        }).apply({ singleLine: true })
      ],
      validateActions: this.validateActionsDefault
    });
    this.dialogService.show({
      title: `Cargar documento`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
      width: '45%'
    }).then(result => {
      console.log(this.structure.getValue());
      if (result !== 'primary') return;
      this.deleteItemRoute(nodeId, this.routeDocs.length - 1);
    });
  }


  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogService.close('primary');
    } else {
      this.dialogService.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  stateChange(estado: any) {
    console.log(estado);
  }

}
