import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-bandeja-casos-aprobador',
  templateUrl: './bandeja-casos-aprobador.component.html',
  styleUrls: ['./bandeja-casos-aprobador.component.scss']
})
export class BandejaCasosAprobadorComponent implements OnInit {
  dataTable!: DynamicDataTable<CaseList>;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
    //mp.showFirstLastButtons = true;
  }

  columns = ['id', 'caso', 'nit', 'recaudo', 'impuesto', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<CaseList>();
  showVisor: Boolean = true;
  showVisorRejet: Boolean = false;
  rechazoFrom!: FormGroup;
  idCaso!: number;
  rechazoComentario:string="";
  
  constructor(
    private caseDetail: CasosDTEService,
    private router: Router,
    private caseService: CasosService,
    private alcanceServices: AlcancesService,
    private dialogo: DialogService
  ) {
    this.rechazoFrom = new FormGroup({
      idCaso: new FormControl(''),
      nombreCaso: new FormControl(''),
      nitColaborador: new FormControl(''),
      nombreColaborador: new FormControl(''),
      nombreDepartamento: new FormControl(''),
      nombreGerencia: new FormControl(''),
      estadoCaso: new FormControl(''),
      comentarioRechazo: new FormControl(''),
    });
  }

  async ngOnInit() {
    let stateUno: number[] = [1091 ,1094]
    let cases = await this.alcanceServices.getSelectScope(stateUno).toPromise()

    /* let cases = await this.caseService.getCasesByStates(state).toPromise()
    console.log(cases); */
    
    this.dataTable = {
      header: [
        { id: 'idCaso', nameColum: 'Identificador Caso' },
        { id: 'nitContribuyente', nameColum: 'NIT' },
        { id: 'nombreContribuyente', nameColum: 'Nombre' },
        { id: 'montoRecaudado', nameColum: 'Posible Recaudo' },
        { id: 'nombreImpuesto', nameColum: 'Impuesto' },
        { id: 'nombreEstadoAlcance', nameColum: 'Estado' },
        {
          id: 'acciones', nameColum: '', actions: [
            {
              btnName: 'Revisar Alcance', btnKey: 'revisarAlcance', btnIcon: 'done', hiddenWhen: item => {
                if (item.estadoAlcance == 1091) return false;
                return true;
              }, onClick: item => {
                console.log(item.idCaso);

                this.router.navigate(['/programacion/aprobador/revision/alcance', item.idCaso]);
              }
            },
            {
              btnName: 'visor de rechazo', btnKey: 'visorRecazo', btnIcon: 'done', hiddenWhen: item => {
                if (item.estadoAlcance == 1095) return false;
                return true;
              }, onClick: item => {
                this.prueba(item.idCaso);
              }
            }
          ]
        },
      ],
      
      data: cases.map(k => {
        const impuestos = k.impuestos ? JSON.parse(String(k.impuestos)) : [];
        console.log("Entra en data");

        k.nombreImpuesto = impuestos.map((i: any) => i.nombreimpuesto).join(', ');

        return k
      }),
      noColum: [5, 10, 15]
    }
    console.log(this.dataTable)
  }

  showAnalityc(idCaso: number) {
    this.router.navigate(['/programacion/operador/cartera/casos', idCaso])
  }

  ruta() {
    this.showVisor = false;
  }

  ruta2() {
    this.showVisor = true;
  }

  ruta3() {
    this.showVisorRejet = false;
  }

  approveRejected() {
    console.log(this.idCaso);
    this.caseService.putDeclineApprover(this.idCaso).toPromise().then(res => {
      console.log(res);
      this.dialogo.show({
        icon: 'success',
        title: 'IFI-200',
        text: 'Aprobación del Rechazo correctamente',
        showCloseButton: false,
      }).then(res => {
        window.location.reload();
      })

    })
  }

  prueba(e: any) {
    this.showVisorRejet = true
    this.idCaso = e;
    this.caseDetail.detailCase(e).toPromise().then(res => {

      this.rechazoFrom.get('idCaso')?.setValue(res.caso.idCaso)
      this.rechazoFrom.get('nombreCaso')?.setValue(res.caso.nombreCaso)
      this.rechazoFrom.get('nitColaborador')?.setValue(res.caso.nitColaborador)
      this.rechazoFrom.get('nombreColaborador')?.setValue(res.caso.nombreColaborador)
      this.rechazoFrom.get('nombreGerencia')?.setValue(res.caso.nombreGerencia)
      this.rechazoFrom.get('nombreDepartamento')?.setValue(res.caso.nombreDepartamento)
      this.rechazoFrom.get('estadoCaso')?.setValue(res.caso.nombreEstado)
      this.rechazoFrom.get('comentarioRechazo')?.setValue(res.comentario.comentarios)
      this.rechazoComentario = res.comentario.comentarios

      this.rechazoFrom.get('idCaso')?.disable()
      this.rechazoFrom.get('nombreCaso')?.disable()
      this.rechazoFrom.get('nitColaborador')?.disable()
      this.rechazoFrom.get('nombreColaborador')?.disable()
      this.rechazoFrom.get('nombreGerencia')?.disable()
      this.rechazoFrom.get('nombreDepartamento')?.disable()
      this.rechazoFrom.get('estadoCaso')?.disable()
      this.rechazoFrom.get('comentarioRechazo')?.disable()
      console.log(res);
    })
  }

  notAprove() {
    console.log(this.idCaso);
    this.caseService.putNotAprover(this.idCaso).toPromise().then(res => {
      console.log(res);
      this.dialogo.show({
        icon: 'success',
        title: 'IFI-200',
        text: 'Rechazo correctamente',
        showCloseButton: false,
      }).then(res => {
        window.location.reload();
      })
    })
  }

}
