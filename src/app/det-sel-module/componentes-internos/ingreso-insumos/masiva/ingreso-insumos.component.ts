import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Insumo } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

@Component({
  selector: 'app-ingreso-insumos',
  templateUrl: './ingreso-insumos.component.html',
  styleUrls: ['./ingreso-insumos.component.css']
})
export class IngresoInsumosComponent implements OnInit {

  @Output('onFinished') onFinished = new EventEmitter<boolean>();
  masiveLoadForm: FormGroup;

  catalogs: { [key: string]: Catalog[] } = {};

  constructor(
    private dialog: DialogService,
    private casesService: CasosService,
    catalogService: CatalogosService
  ) {
    this.masiveLoadForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      departament: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      management: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INGRESO_CASES_DEPARTAMENTO)
      .toPromise()
      .then(data => {
        this.catalogs.departaments = data
        console.log(this.catalogs.departaments);
      });

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INGRESO_CASES_GERENCIAS)
      .toPromise()
      .then(data => this.catalogs.managements = data);

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_CASOS)
      .toPromise()
      .then(data => {
        console.log(data
        );
        this.catalogs.types = data.filter(k => k.codigo != 1041)
      });

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_INSUMOS).toPromise()
      .then(data => {
        console.log(data
        );
        this.catalogs.inputTypes = data
      });
  }

  ngOnInit() {
  }

  masiveLoad() {
    const formData = new FormData();
    const data: Insumo = {
      idGerencia: this.masiveLoadForm.get('management')?.value,
      idDepartamento: this.masiveLoadForm.get('type')?.value == 971 ? 173 : this.masiveLoadForm.get('departament')?.value,
      idTipoCaso: this.masiveLoadForm.get('type')?.value,
      idTipoInsumo: this.catalogs.inputTypes.find(t => t.codigoIngresado == this.masiveLoadForm.get('type')?.value)?.codigo,
      nombreInsumo: this.masiveLoadForm.get('name')?.value,
      descripcion: this.masiveLoadForm.get('description')?.value,
      idEstado: 177
    }

    console.log(data);


    formData.append('file', this.masiveLoadForm.controls['file'].value);
    formData.append('data', JSON.stringify(data))

    this.casesService.massiveLoad(formData).toPromise().then(_ => {
      this.dialog.showSnackBar({
        title: "IFI-200",
        text: "Se realizó la carga masiva correctamente.",
        icon: "success",
        duration: 3000
      });

      this.onFinished.emit(true)
    })
  }

  cancel() {
    this.onFinished.emit(false);
  }

  cleanDepartment(tipo: number) {
    /*     const catalog = this.catalogs.departaments.filter(t => t.codigo != 172)
    
        this.catalogs.departaments = this.masiveLoadForm.get('type')?.value == 431 ? catalog : this.catalogs.departaments */
    if (tipo == 971) {
      this.masiveLoadForm.controls['departament'].disable();
    }
    else {
      this.masiveLoadForm.controls['departament'].enable();
      this.masiveLoadForm.get('departament')?.setValue(null);
      this.masiveLoadForm.controls['departament'].markAsUntouched();
      this.masiveLoadForm.controls['departament'].updateValueAndValidity();
      this.masiveLoadForm.updateValueAndValidity();
    }

  }
}
