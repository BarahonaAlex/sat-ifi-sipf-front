import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';

@Component({
  selector: 'app-bandeja-solicitudes',
  templateUrl: './bandeja-solicitudes.component.html',
  styleUrls: ['./bandeja-solicitudes.component.scss']
})
export class BandejaSolicitudesComponent implements OnInit {
   @ViewChild('MatPaginator') set matPaginator(mp: MatPaginator) {
    this.bandejacasos.paginator = mp;
  }
  displayedColumns2: string[] = ['idSolicitud', 'nit', 'nombre', 'estado', 'solicitud', 'acciones'];
  bandejacasos = new MatTableDataSource();
  showVisor: Boolean = true;
  node: EntryNodoAcs | any;

  constructor(private dialogo: DialogService,
    private caseService: CasosService,
    private gestorService: GestorService) { }

  ngOnInit(): void {
    this.caseService.getSolicitudAduanas().toPromise().then(res => {
      console.log(res);
      this.bandejacasos.data = res;
      /* setTimeout(() => this.bandejacasos.paginator = this.paginator); */
    })
  }

  getVisor(e: any) {
    console.log(e.idSolicitud);
    this.gestorService.contentSitesBasePathByParams('POSTERIORI', { carpeta: parseInt(e.idSolicitud) }).toPromise().then(res => {
      console.log(res.id)
      this.gestorService.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(data => {
        console.log(data)
        this.node = data.list.entries[0].entry;
        this.showVisor = this.node.isFile ? false : true;
        if (!this.node || !this.node.isFile) {
          this.dialogo.show({
            icon: 'error',
            title: 'IFI-404',
            text: "No se ha encontrado la documentación de respaldo",
          });
        }
      })
    })
  }

  regresar() {
    this.showVisor = true;
  }

}
