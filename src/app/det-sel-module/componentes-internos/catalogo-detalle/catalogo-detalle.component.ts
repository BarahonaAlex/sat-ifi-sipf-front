import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

@Component({
  selector: 'app-catalogo-detalle',
  templateUrl: './catalogo-detalle.component.html',
  styleUrls: ['./catalogo-detalle.component.scss']
})
export class CatalogoDetalleComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['codigo', 'nombre', 'descripcion'];
  dataSource = new MatTableDataSource<Catalog>();

  allowedCatalogs = [
    { id: Constantes.CAT_INGRESO_CASES_IMPUESTOS, name: 'Impuestos' }
  ]

  constructor(
    private catalogService: CatalogosService
  ) { }

  ngOnInit() {
  }

  findById(id: number) {
    this.catalogService.getCatalogDataByIdCatalog(id).toPromise().then(res => this.dataSource.data = res);
  }

}
