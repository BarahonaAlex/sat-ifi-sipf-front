import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorDto, ErrorResponse } from '../../componentes-seguridad/interceptors/error/error-response';

@Component({
  selector: 'bad-request',
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.scss']
})
export class BadRequestComponent implements OnInit {

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  error!: ErrorResponse;
  columns = ['param', 'value', 'description'];
  dataSource = new MatTableDataSource<ErrorDto>();
  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.error.errors;
  }

}
