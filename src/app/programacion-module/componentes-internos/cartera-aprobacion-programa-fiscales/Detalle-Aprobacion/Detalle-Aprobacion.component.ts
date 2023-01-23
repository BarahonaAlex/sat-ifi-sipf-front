import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { DetalleAprobacionPrograma } from 'src/app/general-module/componentes-comunes/interfaces/Aprobacion-Programa';
import { ProgramasFiscalesService } from '../../../../general-module/componentes-comunes/servicios/programas-fiscales.service';

@Component({
  selector: 'app-Detalle-Aprobacion',
  templateUrl: './Detalle-Aprobacion.component.html',
  styleUrls: ['./Detalle-Aprobacion.component.scss']
})
export class DetalleAprobacionComponent implements OnInit {
  idGerencia!: number
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['id', 'nombre', 'impuesto', 'periodo', 'cantidadCasos', 'acciones'];
  dataSource = new MatTableDataSource<DetalleAprobacionPrograma>();
  listau!: any
  nombreGerencia: String = "";
  selection = new SelectionModel<DetalleAprobacionPrograma>(true, []);
  constructor(private aRoute: ActivatedRoute,
    private modal: DialogService,
    private micro: ProgramasFiscalesService,
    private catalogo: CatalogosService) {
    this.aRoute.queryParams.pipe(filter(params => params.id)).subscribe(params => {
      this.idGerencia = params.id;
    });

  }


  async ngOnInit() {
    console.log(this.idGerencia)
    this.dataSource.data = await this.micro.getDetalleCartera(this.idGerencia).toPromise()
    this.listau = await this.catalogo.getDataById(this.idGerencia).toPromise()
    this.nombreGerencia = this.listau.nombre

    console.log(this.dataSource.data)
  }
  async Aprobar() {
    console.log(this.selection.selected)
    let post;
    this.selection.selected.forEach(async element => {
      post = {
        "idGerencia": element.idGerencia,
        "idPrograma": element.idPrograma,
        "cantidad": element.cantidad,
        "siglas": this.listau.descripcion,
        "periodo": element.periodo
      }
      console.log(post);
      await this.micro.aprobarProgramas(post).toPromise().then(res => {
        this.modal.show({
          icon: 'success',
          title: 'Exito',
          text: "Se Aprobo correctamente",
        });
      });
    });
  }

  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data?.length;
    return numSelected === numRows;

  }

  masterToggle() {

    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data?.forEach((row) => this.selection.select(row));
  }
}
