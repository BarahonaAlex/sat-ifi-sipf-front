import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { EquipoTrabajo, EquipoTrabajoRespuestaDetalle, Integrante } from 'src/app/general-module/componentes-comunes/interfaces/equipo-trabajo.class';
import { Operator, PerfilInterface } from 'src/app/general-module/componentes-comunes/interfaces/Perfil.interface';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { PerfilService } from 'src/app/general-module/componentes-comunes/servicios/perfil.service';
import { EnterExitLeft } from 'src/app/general-module/componentes-comunes/util/animation-utils';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { UnidadesAdministrativasComponent } from '../../unidades-administrativas/unidades-administrativas.component';

@Component({
  selector: 'app-grupo-detalle',
  templateUrl: './grupo-detalle.component.html',
  styleUrls: ['./grupo-detalle.component.css'],
  animations: [
    EnterExitLeft
  ],
})
export class GrupoDetalleComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @Input('group') group?: EquipoTrabajoRespuestaDetalle;
  @Input('checked') checked: boolean = false;
  @Output('onCancel') onCancel = new EventEmitter();
  @Output('onSave') onSave = new EventEmitter<EquipoTrabajo>();
  @Output('onUpdate') onUpdate = new EventEmitter<EquipoTrabajo>();
  @ViewChild('unitAdministrative') unitAdministrative!: UnidadesAdministrativasComponent;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columnasColaborador = ['nit', 'nombre', 'puesto', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Operator>();
  control!: FormControl;
  groupDetailStep!: FormGroup;
  membersStep!: FormGroup;
  states?: Catalog[]
  profiles: { [key: string]: PerfilInterface[] } = {};
  operator?: Operator;
  maxNitLenght = 16;

  constructor(
    private profileService: PerfilService,
    private dialog: DialogService,
    private catalogService: CatalogosService
  ) {
    this.profileService.getPerfilxRol(Constantes.USER_PROFILES[3]).toPromise().then(data => this.profiles.operator = data);
  }

  ngOnInit() {
    if (this.group) {
      this.catalogService.getCatalogDataByIdCatalog(Constantes.CAT_ESTADOS_GRUPOS_TRABAJO).toPromise().then(data => this.states = data);
    }
    this.initForms();
  }

  getEmployee(nit: string, type: number, name: string) {
    if (nit == null || nit == '') return;

    const formGroup = type == 3 ? this.membersStep : this.groupDetailStep;

    formGroup.get(name)?.setErrors(null);
console.log(type);
console.log(nit);
console.log(name);
    this.profileService.getProfileByRolLoginDetail(Constantes.USER_PROFILES[type], nit, type == 5).toPromise().then(res => {
      console.log(res);
      if (type != 3) this.profiles[name] = res.profiles;
      else this.operator = res.user;
      formGroup.get(`${name}Name`)?.setValue(res.user.nombre);
    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;

      const control = formGroup.get(name);
      control?.setErrors({ 'invalid': true });
      control?.markAsTouched();

      setTimeout(() => {
        document.getElementById(name)!.innerText = error.error.userMessage;
      });
    })
  }

  save() {
    const group: EquipoTrabajo = {
      idUnidadAdministrativa: this.unitAdministrative.selectedRow,
      nombre: this.groupDetailStep.get('name')?.value,
      descripcion: this.groupDetailStep.get('description')?.value,
      estado: this.groupDetailStep.get('state')?.value ?? 163,
      integrantes: this.dataSource.data.map(operator => ({ nit: operator.nit, profile: parseInt(this.membersStep.value.operatorProfile), rol: 3 }))
    };

    //Para autorizador gerencial Intendente
      group.integrantes.push({
        nit: this.groupDetailStep.value.intendente,
        profile: parseInt(this.groupDetailStep.value.intendenteProfile),
        rol: 12
      });
    ////
    group.integrantes.push({
      nit: this.groupDetailStep.value.generalAuth,
      profile: parseInt(this.groupDetailStep.value.generalAuthProfile),
      rol: 8
    });

    group.integrantes.push({
      nit: this.groupDetailStep.value.auth,
      profile: parseInt(this.groupDetailStep.value.authProfile),
      rol: 1
    });

    group.integrantes.push({
      nit: this.groupDetailStep.value.approver,
      profile: parseInt(this.groupDetailStep.value.approverProfile),
      rol: 2
    });

    if (this.groupDetailStep.value.verifier) {
      group.integrantes.push({
        nit: this.groupDetailStep.value.verifier,
        profile: parseInt(this.groupDetailStep.value.verifierProfile),
        rol: 4
      });
    }
    console.log(group);
    

    if (this.group) {
      //Grupo a Actulizar
      console.log(group);
      this.onUpdate.emit(group);
    } else {
      this.onSave.emit(group);
    }
  }

  addOperator() {
    const operator = this.dataSource.data.find(operator => operator.nit == this.operator?.nit);
    if (operator) {
      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-002',
        text: 'El colaborador que intenta agregar ya se encuentra en el equipo de trabajo.',
        duration: 3000
      })
    } else {
      this.dataSource.data.push(this.operator!);
      this.dataSource.filter = "";
      this.operator = undefined;
      this.membersStep.get('operator')?.setValue('');
      this.membersStep.get('operatorName')?.setValue('');
    }
  }

  deleteOperator(operator: Operator) {
    this.profileService.getTransferRequestExist(operator.nit).toPromise().then(res => {
      if (res) {
        this.dialog.show({
          title: 'Solicitud de traslado pendiente',
          text: `Actualmente el operador tiene una solicitud de traslado pendiente, por favor validar.`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      }
      else {
        this.dataSource.data = this.dataSource.data.filter(item => item.nit != operator.nit);
        this.dataSource.filter = "";
      }
    });
  }

  private initForms() {
    //hace llamado al initForms
    console.log('hace llamado de initForms')
    this.groupDetailStep = new FormGroup({
      name: new FormControl(this.group?.equipoTrabajo?.nombre),
      state: new FormControl(this.group?.equipoTrabajo?.estado),
      description: new FormControl(this.group?.equipoTrabajo?.descripcion),
      generalAuth: new FormControl(''),
      generalAuthName: new FormControl({ value: '', disabled: true }),
      generalAuthProfile: new FormControl(''),
      auth: new FormControl(''),
      authName: new FormControl({ value: '', disabled: true }),
      authProfile: new FormControl(''),
      approver: new FormControl(''),
      approverName: new FormControl({ value: '', disabled: true }),
      approverProfile: new FormControl(''),
      verifier: new FormControl(''),
      verifierName: new FormControl({ value: '', disabled: true }),
      verifierProfile: new FormControl(''),
      intendente: new FormControl(''),
      intendenteName: new FormControl({ value: '', disabled: true }),
      intendenteProfile: new FormControl('')
    });



    this.membersStep = new FormGroup({
      operator: new FormControl(''),
      operatorName: new FormControl({ value: '', disabled: true }),
      operatorProfile: new FormControl(this.group?.equipoTrabajo?.perfil, Validators.required),
    });

    this.dataSource.data = this.group?.integrantes?.filter(member => member.rol == 3) ?? [];

    this.group?.integrantes?.filter(member => member.rol != 3).forEach(member => {
      //esto es el member
      console.log(member);
      this.groupDetailStep.get(MAP_PROFILE[member.rol])?.setValue(member.nit);
      this.groupDetailStep.get(`${MAP_PROFILE[member.rol]}Profile`)?.setValue(member.perfil);
      this.getEmployee(member.nit, member.rol, MAP_PROFILE[member.rol]);
    });
  }

  validateForm() {


    if (this.groupDetailStep.get('name')?.value) {
      if (this.groupDetailStep.get('name')?.value.trim().length == 0) {
        this.groupDetailStep.get('name')?.setValue(null);
      }
    }

    if (this.groupDetailStep.get('description')?.value) {
      if (this.groupDetailStep.get('description')?.value.trim().length == 0) {
        this.groupDetailStep.get('description')?.setValue(null);
      }
    }


    let componentNames: string[];
    componentNames = ['name',
      'description',
      'generalAuth',
      'generalAuthName',
      'generalAuthProfile',
      'auth',
      'authName',
      'authProfile',
      'approver',
      'approverName',
      'approverProfile',
      'intendente',
      'intendenteName',
      'intendenteProfile'];

    let errors = false;
    componentNames.forEach(item => {
      this.groupDetailStep.get(item)?.setValidators(Validators.required);
      this.groupDetailStep.get(item)?.updateValueAndValidity();
      this.groupDetailStep.get(item)?.markAsTouched();
    });


    this.groupDetailStep.updateValueAndValidity();




    if (this.groupDetailStep.valid) {
      this.stepper.next();
    } else {

      this.dialog.showSnackBar({
        icon: 'warning',
        title: 'IFI-002',
        text: 'Existen datos obligatorios no llenos, favor revisar.',
        duration: 3000
      })

    }


  }
}

const MAP_PROFILE: { [key: number]: string } = {
  8: 'generalAuth',
  1: 'auth',
  2: 'approver',
  4: 'verifier',
  12:'intendente'
}