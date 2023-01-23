import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatCellDef, MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { DynamicDataTable } from '../interfaces/dynamic-table';
import { EnterExitLeft } from '../util/animation-utils';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  /* animations: [
    EnterExitLeft
  ], */
})

export class TablaDinamicaComponent<T> implements OnInit {
  @Input('dataTable') data!: DynamicDataTable<T>;
  @Input('noDataMsg') noDataMsg: string = 'No se encontradon datos.';
  
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.data.header.map(res => this.displayedColumns.push(res.id));
    this.dataSource.data = this.data.data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateData(data?: T[]) {
    this.data.data = data ?? this.data.data;
    this.dataSource.data = this.data.data;
    this.dataSource.filter = '';
  }

  pushData(data: T) {
    this.data.data.push(data);
    this.dataSource.filter = '';
  }

  transformData(data: any): string | null {
    if (data instanceof moment) {
      return (data as moment.Moment).format('DD/MM/YYYY');
    }

    if (data instanceof Date) {
      return new DatePipe('America/Guatemala').transform(data, 'dd/MM/yyyy');
    }
    return data;
  }
}

