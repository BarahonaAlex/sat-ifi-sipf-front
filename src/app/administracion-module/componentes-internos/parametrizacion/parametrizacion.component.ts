import { Component, OnInit } from '@angular/core';
import { ActionEvent, Checkbox, DatePicker, Dropdown, FormStructure, Input, InputNumber, Node, OptionChild, RadioGroup, Switch } from 'mat-dynamic-form';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { Option } from 'src/app/general-module/componentes-comunes/interfaces/parametrizacion.interface';
import { BlockUiService } from 'src/app/general-module/componentes-comunes/servicios/block-ui.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ParametrosSistemaService } from 'src/app/general-module/componentes-comunes/servicios/parametros-sistema.service';
import { UnidadesAdministrativasService } from 'src/app/general-module/componentes-comunes/servicios/unidades-administrativas.service';

@Component({
  selector: 'app-parametrizacion',
  templateUrl: './parametrizacion.component.html',
  styleUrls: ['./parametrizacion.component.scss']
})
export class ParametrizacionComponent implements OnInit {

  configs?: { option: Option, structure: FormStructure }[];

  constructor(
    private systemParams: ParametrosSistemaService,
    private catalogService: CatalogosService,
    private unitService: UnidadesAdministrativasService,
    private blockUI: BlockUiService,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.initOptions();
  }

  async initOptions() {
    this.blockUI.block();
    const options = await this.systemParams.getSystemParameters().toPromise();
    this.configs = options.map(option => {
      const structure = new FormStructure()
      structure.apply({
        showTitle: false,
        appearance: 'standard',
        nodes: [
          this.createNode(option)
        ],
        validateActions: []
      });
      return { option, structure };
    });
  }

  private createNode(option: Option): Node {

    switch (option.type) {
      case 'dropdown':
        const dropdown = new Dropdown(`node${option.id}`, 'Seleccione una opción',).apply({
          singleLine: true,
          selectedValue: option.value,
          action: { type: 'valueChange', onEvent: event => this.saveOption(event, option) }
        });
        this.getReference(option, dropdown);
        return dropdown;
      case 'radiogroup':
        const radiogroup = new RadioGroup(`node${option.id}`, 'Seleccione una opción',).apply({
          singleLine: true,
          selectedValue: option.value,
          //action: { type: 'valueChange', onEvent: event => this.saveOption(event, option) }
        });
        this.getReference(option, radiogroup);
        return radiogroup;
      case 'checkbox':
        return new Checkbox(`node${option.id}`, option.value == 'true' ? 'Activo' : 'Inactivo', option.value == 'true').apply({
          //action: { type: 'valueChange', onEvent: (param) => this.selectableValueChange(param, option) },
        })
      case 'switch':
        return new Switch(`node${option.id}`, option.value == 'true' ? 'Activo' : 'Inactivo', option.value == 'true').apply({
          //action: { type: 'valueChange', onEvent: (param) => this.selectableValueChange(param, option) },
        })
      default:
        return {
          id: `node${option.id}`,
          placeholder: 'Ingrese un valor',
          type: option.type,
          singleLine: true,
          value: option.value,
         // action: { type: 'change', onEvent: event => this.saveOption(event, option) }
        } as Node;
    }
  }

  selectableValueChange(event: ActionEvent, option: Option) {
    event.structure.getNodeById(`node${option.id}`).placeholder = event.event == true ? 'Activo' : 'Inactivo';
    this.saveOption(event, option);
  }

  private getReference(option: Option, node: Dropdown | RadioGroup) {
    if (!option.reference || !option.referenceType) return this.blockUI.unblock();
    this.getDataByType(option.referenceType, option.reference).then(res => {
      node.value = res.map(item => new OptionChild(item.nombre, item.codigo.toString()));
    }).finally(() => this.blockUI.unblock());
  }

  private getDataByType(type: number, reference: number): Promise<Catalog[]> {
    switch (type) {
      case 2:
        return this.unitService.getAdministrativeUnitsByIdFatherProsis(reference).toPromise();
      default: return this.catalogService.getCatalogDataByIdCatalog(reference).toPromise();
    }
  }

  private saveOption(event: ActionEvent, option: Option) {
    option.value = event.structure.getControlById(`node${option.id}`)?.value;
    console.log(option);
/*     this.systemParams.updateSystemParameter(option).toPromise().then(res => {
      this.dialog.showSnackBar({
        text: `Se ha actualizado el valor del parametro "${option.name}"`,
        icon: 'success',
        title: 'IFI-200',
        duration: 3000,
      });
    }); */
  }

  save(){
     this.configs?.forEach(t => {
      console.log(t.option);
      this.systemParams.updateSystemParameter(t.option).toPromise().then(res => {
      });
    })
    this.dialog.showSnackBar({
      text: `Se ha actualizado el valor del los parametros del Sistema `,
      icon: 'success',
      title: 'IFI-200',
      duration: 3000,
    });
  }
}
