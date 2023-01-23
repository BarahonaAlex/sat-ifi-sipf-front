import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { DatePicker, Dropdown, FormListener, FormStructure, Input, OptionChild, Button, InputNumber, RadioGroup, CustomNode } from 'mat-dynamic-form';
import * as moment from 'moment';
import { Caso, Insumo } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { InputService } from 'src/app/general-module/componentes-comunes/servicios/input.service';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

@Component({
  selector: 'app-ingreso-insumo-manual',
  templateUrl: './ingreso-insumo-manual.component.html',
  styleUrls: ['./ingreso-insumo-manual.component.css']
})
export class IngresoInsumoManualComponent implements OnInit, FormListener {

  @ViewChild('table') table!: TablaDinamicaComponent<Caso>;
  @Output('onFinished') onFinished = new EventEmitter<boolean>();
  masiveLoadForm: FormGroup;
  formStructure!: FormStructure;
  updateIndex!: number
  data!: DynamicDataTable<Caso>

  catalogs: { [key: string]: Catalog[] } = {};

  constructor(
    private dialog: DialogService,
    private inputService: InputService,
    private taxPayer: ContribuyenteService,
    catalogService: CatalogosService,
    private userService: UserService
  ) {
    this.masiveLoadForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      departament: new FormControl('', Validators.required),
      management: new FormControl('', Validators.required)
    });

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INGRESO_CASES_DEPARTAMENTO)
      .toPromise()
      .then(data => this.catalogs.departaments = data);

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INGRESO_CASES_GERENCIAS)
      .toPromise()
      .then(data => this.catalogs.managements = data);

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_INGRESO_CASES_IMPUESTOS)
      .toPromise()
      .then(data => this.catalogs.taxes = data);

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_CASOS)
      .toPromise()
      .then(data => this.catalogs.types = data.filter(k => k.codigo != 1041));

    catalogService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_INSUMOS).toPromise()
      .then(data => this.catalogs.inputTypes = data);
  }

  ngOnInit() {
    this.data = {
      data: [],
      header: [
        { id: 'nitContribuyente', nameColum: 'NIT' },
        { id: 'nombreImpuestos', nameColum: 'Impuestos' },
        { id: 'periodoRevisionInicioStr', nameColum: 'Periodo Inicio' },
        { id: 'periodoRevisionFinStr', nameColum: 'Periodo Fin' },
        { id: 'montoRecaudado', nameColum: 'Posible Recaudo' },
        { id: 'requiereDocumentacion', nameColum: 'Requiere Documentación' },
        {
          id: 'actions', nameColum: '', actions: [
            { btnKey: 'delete', btnName: 'Quitar caso', btnIcon: 'delete', onClick: item => this.removeTaxPayer(item[0]), type: 'index' },
            {
              btnKey: 'edit', btnName: 'Editar caso', btnIcon: 'edit', onClick: item => {
                console.log(item);
                this.editTaxPayer(item[0])
                this.updateIndex = item[1]
              }, type: 'index'
            }
          ],
        },
      ],
      noColum: [5, 10, 15]
    }
  }

  onEvent(id: string, value: any): void {
    switch (id) {
      case 'nitContribuyente':
        this.formStructure.getControlById('name')?.setValue(null);
        this.taxPayer.getGeneralTaxpayerInformation(value).toPromise().then(res => {
          const data = res.data.attributes.datos;
          const detail = data.contribuyente?.persona ?? data.empresa;

          this.formStructure.getControlById('name')?.setValue(this.parseName(detail))
        })
        break;
    }
  }

  onClick(actionId: string): void {
    switch (actionId) {
      case 'save':
        this.addCase();
        break;
      case 'update':
        this.updateCase();
        break;
      default:
        this.dialog.close();
        break;
    }
  }

  addTaxPayer() {
    this.formStructure = this.initFormStructure();
    this.dialog.show({
      title: 'Agregar Caso',
      showConfirmButton: false,
      formStructure: this.formStructure
    })
  }

  save() {
    const body: Insumo = {
      idGerencia: this.masiveLoadForm.get('management')?.value,
      idDepartamento: this.masiveLoadForm.get('type')?.value == 971 ? 173 : this.masiveLoadForm.get('departament')?.value,
      idTipoCaso: this.masiveLoadForm.get('type')?.value,
      idTipoInsumo: this.catalogs.inputTypes.find(t => t.codigoIngresado == this.masiveLoadForm.get('type')?.value)?.codigo,
      nombreInsumo: this.masiveLoadForm.get('name')?.value,
      descripcion: this.masiveLoadForm.get('description')?.value,
      casos: this.data.data
    }

    console.log(body);

    this.inputService.createManualInput(body).toPromise().then(_ => {
      this.dialog.showSnackBar({
        title: "IFI-200",
        text: "Se realizó la creación del insumo correctamente.",
        icon: "success",
        duration: 3000
      });

      this.onFinished.emit(true);
    })
  }

  cancel() {
    this.onFinished.emit(false)
  }

  private addCase() {

    const formString = JSON.stringify({ ...this.formStructure.getValue() })

    console.log(this.formStructure.getValue());
    const form = JSON.parse(formString)
    const prueba = form.impuestos.map((t: any) =>
      this.catalogs.taxes.filter(tax => tax.codigo == t).map(tax => tax.nombre).sort().join(', ')
    )
    form.nombreImpuestos = prueba
    if (form.periodoRevisionInicio > form.periodoRevisionFin) {
      this.dialog.showSnackBar({
        title: "IFI-400",
        text: "El periodo de inicio no puede ser mayor al periodo final.",
        icon: "error",
        duration: 3000
      });
    } else {

      this.dialog.close();
      form.periodoRevisionInicioStr = moment(form.periodoRevisionInicio).format('DD/MM/YYYY');
      form.periodoRevisionFinStr = moment(form.periodoRevisionFin).format('DD/MM/YYYY');
      console.log(form);

      this.table.pushData(form);
    }
  }

  private updateCase(data?: Caso) {
    this.dialog.close();
    const i = this.table.dataSource.data.indexOf(data)

    const formString = JSON.stringify({ ...this.formStructure.getValue() })
    const form = JSON.parse(formString)
    const prueba = form.impuestos.map((t: any) =>
      this.catalogs.taxes.filter(tax => tax.codigo == t).map(tax => tax.nombre).sort().join(', ')
    )
    form.nombreImpuestos = prueba
    //const newCase = this.formStructure.getValue<Caso>();
    //const index = this.data.data.findIndex(item => item.nitContribuyente == newCase.nitContribuyente);

    if (form.periodoRevisionInicio > form.periodoRevisionFin) {
      this.dialog.showSnackBar({
        title: "IFI-400",
        text: "El periodo de inicio no puede ser mayor al periodo final.",
        icon: "error",
        duration: 3000
      });
    } else {
      this.table.dataSource.data.indexOf(form)

      if (i != -1) {
        console.log(form);

        form.periodoRevisionInicioStr = moment(form.periodoRevisionInicio).format('DD/MM/YYYY');
        form.periodoRevisionFinStr = moment(form.periodoRevisionFin).format('DD/MM/YYYY');

        this.table.dataSource.data.splice(i, 1, form);
      }

      console.log(this.data.data);

      this.table.dataSource.data = this.data.data;
    }
  }

  private editTaxPayer(data: Caso) {
    console.log(data);

    this.taxPayer.getGeneralTaxpayerInformation(data.nitContribuyente).toPromise().then(res => {
      const taxPayer = res.data.attributes.datos;
      const detail = taxPayer.contribuyente?.persona ?? taxPayer.empresa;

      data.nombreContribuyente = this.parseName(detail);

      this.formStructure = this.initFormStructure(data);
      this.dialog.show({
        title: 'Editar Caso',
        showConfirmButton: false,
        formStructure: this.formStructure
      })
    })
  }

  private removeTaxPayer(element: Caso) {
    const i = this.table.dataSource.data.indexOf(element)

    if (i != -1) {
      this.table.dataSource.data.splice(i, 1);
    }

    this.table.updateData((this.table.dataSource.data as Caso[]))
  }

  private initFormStructure(data?: Caso): FormStructure {
    console.log(data);
    return new FormStructure().apply({
      showTitle: false,
      nodes: [
        new Input('nitContribuyente', 'NIT', data?.nitContribuyente).apply({
          action: { callback: this, type: 'change' },
          validator: Validators.required
        }),
        new Input('name', 'Contribuyente', data?.nombreContribuyente).apply({
          readOnly: true,
          validator: Validators.required
        }),
        new DatePicker('periodoRevisionInicio', 'Periodo Inicio', data?.periodoRevisionInicio).apply({ validator: Validators.required }),
        new DatePicker('periodoRevisionFin', 'Periodo Fin', data?.periodoRevisionFin).apply({ validator: Validators.required }),
        new Dropdown('impuestos', 'Impuestos', this.catalogs?.taxes?.map(tax => new OptionChild(tax.nombre, tax.codigo))).apply({
          validator: Validators.required,
          selectedValue: data?.impuestos ?? []
        }).apply({
          multiple: true,
          action: {
            type: 'valueChange', onEvent: (item: any) => {
              console.log(item.event);
            }
          }
        }),
        new InputNumber('montoRecaudado', 'Posible Recaudo', data?.montoRecaudado).apply({ validator: Validators.required }),

        new Input('loginProfesional', 'Login de profesional', data?.loginProfesional).apply({
          action: {
            type: 'change', onEvent: async (item: any) =>  {
              let k = item.event.target.value
              if(/\s/g.test(k) || /\d/.test(k)){
                this.formStructure.getControlById('loginProfesional')?.reset()
              }
              else{
                k = await this.userService.obtenerInfoGeneralByLogin(k).toPromise().then(res => {
                  return res?.nombre
                }) ?? undefined
                if(k){
                  this.formStructure.getControlById('nombreProfesional')?.setValue(k)
                }
                else{
                  this.formStructure.getControlById('nombreProfesional')?.setValue('')
                  this.formStructure.getControlById('loginProfesional')?.setErrors({required: true})
                  this.formStructure.getNodeById('loginProfesional')?.apply({
                    errorMessage: 'El Profesional no se encuentra en el sistema Prosis',
                  })
                }
            }
          }
          },
          validator: Validators.required
        }),
        new Input('nombreProfesional', 'Nombre de Profesional', data?.nombreProfesional).apply({
          readOnly: true,
          validator: Validators.required
        }),

        new RadioGroup('requiereDocumentacion', 'Requiere Documentación', [
          new OptionChild('Si', 'X'),
          new OptionChild('No', ' ')
        ], true).apply({
          selectedValue: data?.requiereDocumentacion ?? ' ',
        })
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button(data ? 'update' : 'save', 'Guardar', {
          onEvent: () => {
            if(data){
              this.updateCase(data)
            }
            else{
              this.addCase()
            }
          },
          style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save',
        }),
      ]
    });
  }

  private parseName(detail: any) {
    return detail.razonSocial ?? `${detail.primer_Nombre ?? ''} ${detail.segundo_Nombre ?? ''} ${detail.primer_Apellido ?? ''} ${detail.segundo_Apellido ?? ''}`.replace(/\s+/g, ' ').trim();
  }

  cleanDepartment(tipo: number) {
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
