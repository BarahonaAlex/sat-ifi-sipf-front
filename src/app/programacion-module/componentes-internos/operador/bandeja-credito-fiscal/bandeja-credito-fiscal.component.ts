import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';

@Component({
  selector: 'app-bandeja-credito-fiscal',
  templateUrl: './bandeja-credito-fiscal.component.html',
  styleUrls: ['./bandeja-credito-fiscal.component.css']
})
export class BandejaCreditoFiscalComponent implements OnInit {

  @ViewChild('MatPaginator') set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['noSolicitud',
            'noFormulario', 
            'nit', 
            'contribuyente', 
            'recaudo', 
            'multa', 
            'estado', 
            'acciones'
  ];

  dataSource = new MatTableDataSource();

  

  constructor(private creditoFiscalService: CreditoFiscal,
    private router: Router) { }

  ngOnInit(): void {
    let estados: number[] = [1056,1077]
    this.creditoFiscalService.getAllFiscalCreditByStatusAndProfetional().toPromise().then(res =>{
      this.dataSource.data = res
      
    })
  }

  showAnalityc(idSolicitud: number) {
    this.router.navigate(['programacion/operador/bandeja/credito/fiscal/', idSolicitud])
  }

}
