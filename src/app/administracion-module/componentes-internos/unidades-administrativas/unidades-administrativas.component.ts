import { EntryNodoAcs } from './../../../general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Button, DatePicker, Dropdown, FormListener, FormStructure, Input, OptionChild, } from 'mat-dynamic-form';
import { UnidadesAdministrativas, UnidadesAdministrativasPadres, } from 'src/app/general-module/componentes-comunes/interfaces/unidades-administrativas.inteface';
import { UnidadesAdministrativasService } from 'src/app/general-module/componentes-comunes/servicios/unidades-administrativas.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { Input as InputCore } from '@angular/core';
import { EquipoUnidad } from 'src/app/general-module/componentes-comunes/interfaces/equipo-trabajo.class';

@Component({
  selector: 'app-unidades-administrativas',
  templateUrl: './unidades-administrativas.component.html',
  styleUrls: ['./unidades-administrativas.component.scss'],
})
export class UnidadesAdministrativasComponent implements OnInit, FormListener {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  /**
   * @description #English With the @InputCore() decorator, the Administrative Units component becomes a child.
   * @description Con el decorador @InputCore() se convierte en hijo el componente de Unidades Administrativas.
   * @author alfvillag (Luis Villagrán)
   * @since 04/04/2022
   */
  @InputCore('child') child = false;
  @InputCore('initValue') initValue?: EquipoUnidad[];
  displayedColumns = [
    'nombre',
    'hijos',
    'hijosA',
    'hijosI',
    'nombreEstado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<UnidadesAdministrativasPadres>();
  arrayAdministrativeUnits: { name: string; id: number }[] = [];
  includeActivesUnitsForm!: FormControl;
  structure!: FormStructure;
  validateActionsDefault!: Button[];
  catStates!: Catalog[];
  selectedRow: number = 0;
  unidadAdministrativaGrupos: UnidadesAdministrativasPadres[] = [];
  tipoProgramacion!: Catalog[];
  constructor(
    private unidadesAdmonService: UnidadesAdministrativasService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private catalogosService: CatalogosService
  ) {
    this.includeActivesUnitsForm = new FormControl(false);
    this.validateActionsDefault = [
      new Button('cancelar', 'Cancelar', {
        callback: this,
        style: 'warn',
      }).apply({
        icon: 'close',
      }),
      new Button('guardar', 'Guardar', {
        callback: this,
        style: 'primary',
      }).apply({
        validateForm: true,
        icon: 'save',
      }),
    ];
  }

  async ngOnInit() {


    this.dataSource.filterPredicate = function (item, filter) {
      
      return item.nombre.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.hijos.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.hijosActivos.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.hijosInactivos.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.nombreEstado!.trim().toLowerCase().includes(filter.trim().toLowerCase())

    }

    this.catalogosService
      .getCatalogDataByIdCatalog(Constantes.CAT_ADMINISTRATIVE_UNITS)
      .toPromise()
      .then((res) => (this.catStates = res));
    this.catalogosService.getCatalogDataByIdCatalog(Constantes.CAT_TIPO_CASOS).toPromise().then((res) => {
      this.tipoProgramacion = res;
    });

    if (this.initValue) {
      const last = this.initValue.pop();
      const parent = this.initValue.pop();
      await this.getAdministrativeUnits(
        parent?.nombre as string,
        parent?.id as number
      );
      this.arrayAdministrativeUnits = [{ id: 0, name: 'Inicio' }];
      this.arrayAdministrativeUnits.push(
        ...this.initValue.map((item) => ({ name: item.nombre, id: item.id }))
      );
      this.arrayAdministrativeUnits.push({
        name: parent?.nombre as string,
        id: parent?.id as number,
      });
      this.selectRow({
        id: last?.id,
        nombre: last?.nombre,
      } as UnidadesAdministrativasPadres);
    } else {
      this.getAdministrativeUnits('Inicio', 0);
    }
  }

  /** @description Metodo para filtrar datos mostrados en tabla principal*/
  public applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;

    /*this.dataSource.filterPredicate = (data: UnidadesAdministrativasPadres, filter: string) =>{
     return data.hijos== filter || data.nombre == filter;
   }*/
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description Método para consulta de unidades administrativas
   * @author ruarcuse (Rudy Culajay)
   * @since 07/01/2022
   * @param id de la unidad administrativa
   * @param name nombre de la unidad
   */
  async getAdministrativeUnits(name: string, id: number) {
    let state: Param[] = [{ pStatus: '136' }];
    console.log(state);

    if (this.includeActivesUnitsForm.value == true) {
      state.push({ pStatus: '137' });
    }
    this.dataSource.data = [];
    if (this.selectedRow != 0) {
      const index = this.arrayAdministrativeUnits.findIndex(
        (x) => x.id == this.selectedRow
      );
      if (index != -1) {
        this.arrayAdministrativeUnits.splice(index, 1);
      }
      this.selectedRow = 0;
    }
    this.arrayAdministrativeUnits.push({ name: name, id: id });
    if (id == 0) {
      await this.unidadesAdmonService
        .getAdministrativeUnitsFather(state)
        .toPromise()
        .then((data: UnidadesAdministrativasPadres[]) => {
          if (data == null) return;
          this.dataSource.data = data;
          this.displayedColumns.find(x => x == 'fechaCreacion') ? this.displayedColumns.splice(this.displayedColumns.indexOf('fechaCreacion'), 1) : null;
          this.displayedColumns.find(x => x == 'nombreTipoProgramacion') ? this.displayedColumns.splice(this.displayedColumns.indexOf('nombreTipoProgramacion'), 1) : null;
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataSource.sort = this.sort;
          this.unidadAdministrativaGrupos = data;
          console.log(data);
          /* Para sacar las unidades en estado inactiva */
          const valor = data.filter(t => t.nombreEstado == 'INACTIVO')
          // console.log(valor.length);
        });
      return;
    }

    console.log(id);
    this.unidadesAdmonService
      .getAdministrativeUnitsByIdFather(id, state)
      .toPromise()
      .then((res: UnidadesAdministrativasPadres[]) => {
        if (res == null) return;
        !this.displayedColumns.includes('fechaCreacion') ? this.displayedColumns.splice(5, 0, 'fechaCreacion') : null;
        !this.displayedColumns.includes('nombreTipoProgramacion') ? this.displayedColumns.splice(5, 0, 'nombreTipoProgramacion') : null;
        this.dataSource.data = res;
        setTimeout(() => (this.dataSource.paginator = this.paginator));
        this.dataSource.sort = this.sort;
        console.log(res);
        const valor = res.filter((t) => t.nombreEstado == 'INACTIVO');
        console.log(valor.length);
        /*
        Validacion para saber si la unidad administrativa no tiene hijos, para el componente equipos de trabajo
        */
      });

    console.log('aca se va navegando en las unidades');
  }

  /**
   * @description Método para obtener las unidades administrativas por el hijo
   * @author asacanoes (Sergio Cano)
   * @since 01/04/2022
   * @param idUnit de la unidad administrativa
   */
  clearRoute(idUnit: number) {
    let state: Param[] = [{ pStatus: '136' }];
    this.unidadesAdmonService
      .getAdministrativeUnitsByIdFather(idUnit, state)
      .toPromise()
      .then((res: UnidadesAdministrativasPadres[]) => {
        if (res == null) {
          this.dataSource.data = [];
        }
        setTimeout(() => (this.dataSource.paginator = this.paginator));
        this.dataSource.sort = this.sort;
        // console.log(res);
      });
  }

  /**
   * @description Método para ajustar la ruta a consultar
   * @author ruarcuse (Rudy Culajay)
   * @since 07/01/2022
   * @param id de la unidad administrativa
   * @param index posición en array de rutas a eliminar
   */
  public deleteItemRoute(id: number, index: number) {
    const lengthRoute = this.arrayAdministrativeUnits.length - 1;
    /*  console.log(
       'ruta ajustar ',
       id, -+
       'index ',
       index,
       'longitud arreglo ',
       lengthRoute
     ); */
    if (index == 0) {
      const firstRoute = this.arrayAdministrativeUnits[0];
      this.arrayAdministrativeUnits = [];
      this.getAdministrativeUnits(firstRoute.name, id);
      return;
    }

    if (lengthRoute == index) {
      this.getAdministrativeUnits(
        this.arrayAdministrativeUnits[index].name,
        id
      );
      this.arrayAdministrativeUnits.pop();
      return;
    }
    const elementDelete = this.arrayAdministrativeUnits[index];
    this.arrayAdministrativeUnits.splice(index, lengthRoute);
    console.log('ruta ', this.arrayAdministrativeUnits);
    this.getAdministrativeUnits(elementDelete.name, id);
  }

  /**
   * @description Método para crear una unidad admon en una unidad padre
   * @author ruarcuse (Rudy Culajay)
   * @since 10/01/2022
   */
  public createUnit() {
    const id =
      this.arrayAdministrativeUnits[this.arrayAdministrativeUnits.length - 1]
        .id;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('name', 'Nombre', '').apply({
          singleLine: true,
          maxCharCount: 100,
        }),
        new Dropdown('tipoProgramacion', 'Tipo de Programacion',
          this.tipoProgramacion?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
            disabled: false
          })

      ],
      validateActions: this.validateActionsDefault,
    });
    if (this.arrayAdministrativeUnits.length == 1) {
      let nodes = this.structure.getNodeById('tipoProgramacion')
      this.structure.removeNodes([nodes]);
    }
    this.dialogService
      .show({
        title: `Crear Unidad Administrativa`,
        formStructure: this.structure,
        showCancelButton: false,
        showConfirmButton: false,
        disableClose: false,
      })
      .then((result) => {
        if (result !== 'primary') return;

        const unidad: UnidadesAdministrativas = {
          descripcion: this.structure.getControlById('name')?.value,
          idEstado: 136,
          idPadre: id == 0 ? null : id,
          nombre: this.structure.getControlById('name')?.value,
          idTipoProgramacion: this.structure.getControlById('tipoProgramacion')?.value,
        };
        this.unidadesAdmonService
          .createAdministrativeUnit(unidad)
          .subscribe((res) => {
            this.dialogService.show({
              icon: 'success',
              title: 'IFI-200',
              text: 'Se ha creado la unidad administrativa',
            });
            this.deleteItemRoute(id, this.arrayAdministrativeUnits.length - 1);
          });
      });
  }

  /**
   * @description Método para editar una unidad administrativa
   * @author ruarcuse (Rudy Culajay)
   * @since 10/01/2022
   * @param unidad objeto a editar
   */
  public editUnit(unit: UnidadesAdministrativasPadres) {
    const id =
      this.arrayAdministrativeUnits[this.arrayAdministrativeUnits.length - 1]
        .id;
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new Input('name', 'Nombre', unit.nombre).apply({
          maxCharCount: 100,
        }),
        new Dropdown(
          'state',
          'Estado',
          this.catStates.map(
            (res) => new OptionChild(res.nombre, String(res.codigo))
          )
        ).apply({
          selectedValue: String(unit.idEstado),
          disabled: true
        }),
        new Dropdown('tipoProgramacion', 'Tipo de Programacion',
          this.tipoProgramacion?.map(param => new OptionChild(param.nombre, param.codigo))).apply({
            disabled: false,
            selectedValue: unit.idTipoProgramacion
          }),
        new DatePicker('fechaCreacion', 'Fecha de creacion').apply({
          disabled: true,
          value: unit.fechaCreacion
        }),
      ],
      validateActions: this.validateActionsDefault,
    });
    if (this.arrayAdministrativeUnits.length == 1) {
      let nodes = this.structure.getNodeById('tipoProgramacion')
      this.structure.removeNodes([nodes]);
    }
    this.dialogService
      .show({
        title: `Editar Unidad Administrativa`,
        formStructure: this.structure,
        showCancelButton: false,
        showConfirmButton: false,
        disableClose: false,
      })
      .then((result) => {
        //console.log(this.structure.getValue());
        if (result !== 'primary') {
          return;
        }
        const unitUpdate: UnidadesAdministrativas = {
          descripcion: this.structure.getControlById('name')?.value,
          idEstado: this.structure.getControlById('state')?.value,
          idPadre: unit.idPadre ?? null,
          nombre: this.structure.getControlById('name')?.value,
          idTipoProgramacion: this.structure.getControlById('tipoProgramacion')?.value,
        };
        //Validación que sirve para saber si una unidad tiene un grupo u colaborador asociado.
        if (unit.idGrupo == null) {
          this.unidadesAdmonService
            .alterAdministrativeUnit(unitUpdate, unit.id ?? 0)
            .subscribe((res) => {
              this.dialogService.show({
                icon: 'success',
                title: 'IFI-200',
                text: 'Se ha editado la unidad administrativa',
              });
              this.deleteItemRoute(
                id,
                this.arrayAdministrativeUnits.length - 1
              );
            });
        } else if (unit.idGrupo !== null) {
          this.dialogService.show({
            icon: 'success',
            title: 'IFI-200',
            text: 'No se puede modificar la unidad porque tiene grupos u colobaradores asociados.',
          });
        }
      });
  }

  /**
   * @description Método para incluir o excluir unidades inactivas
   * @author ruarcuse (Rudy Culajay)
   * @since 10/01/2022
   * @param incluir valor booleano para incluir o excluir
   */
  public includeActivesUnits() {
    const lastUnit =
      this.arrayAdministrativeUnits[this.arrayAdministrativeUnits.length - 1];
    this.deleteItemRoute(lastUnit.id, this.arrayAdministrativeUnits.length - 1);
  }

  selectRow(unit: UnidadesAdministrativasPadres) {
    if (this.selectedRow != 0) {
      const index = this.arrayAdministrativeUnits.findIndex(
        (x) => x.id == this.selectedRow
      );
      if (index != -1) {
        this.arrayAdministrativeUnits.splice(index, 1);
      }
    }

    this.arrayAdministrativeUnits.push({ id: unit.id ?? 0, name: unit.nombre });

    this.selectedRow = unit.id ?? 0;
    // console.log('aca se selecciona la unidad');
  }

  onClick(actionId: string): void {
    console.log(actionId);
    if (actionId == 'guardar') {
      console.log(this.structure.getControlById('name')?.value.trim().length);
      if (this.structure.getControlById('name')?.value.trim().length === 0) {
        this.structure.getFormGroup().get('name')?.setValue(null);
        this.structure.getFormGroup().get('name')?.updateValueAndValidity();
        this.structure.getFormGroup().get('name')?.markAsTouched();
        this.structure.getFormGroup().updateValueAndValidity();
        console.log('hace el return');

        this.dialogService.show({
          icon: 'warning',
          title: 'IFI-100',
          text: 'El nombre de la unidad no puede estar vacío.',
        });
        return;
      } else {
        this.dialogService.close('primary');
      }
    } else {
      this.dialogService.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  mergeInfoUnitFromProsis() {
    this.dialogService
      .show({
        icon: 'info',
        title: 'IFI-204',
        text: '¿Desea actualizar las Unidades Administrativas registradas desde el Sistema Prosis?',
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then((res) => {
        if (res == 'cancel') return;
        this.unidadesAdmonService
          .getAdministrativeUnitFromProsis()
          .subscribe((res) => {
            this.deleteItemRoute(0, 0);
          });
      });
  }

  monthDiff(d1?: string): String {
    if (d1) {
      let date = Date.parse(d1);
      let timeDiff = new Date().getTime() - date;
      let thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      if (timeDiff >= thirtyDaysInMs) {
        return '';
      } else {
        return 'green';
      }
    }
    else {
      return '';
    }
  }
}
