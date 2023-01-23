import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { solicitudesAduanas } from 'src/app/general-module/componentes-comunes/interfaces/solicitudes.interface.ts';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { FormStructure, Button } from 'mat-dynamic-form';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { MatStep, MatStepperModule } from '@angular/material/stepper';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CasosDTEService } from 'src/app/general-module/componentes-comunes/servicios/casos-DTE.service';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';

interface Food {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-auditoria-posteriori-aduanas',
  templateUrl: './auditoria-posteriori-aduanas.component.html',
  styleUrls: ['./auditoria-posteriori-aduanas.component.scss']
})
export class AuditoriaPosterioriAduanasComponent implements OnInit {

  /* variables para permitir solo numero en un input*/
  key: any;
  teclado: any;
  numero: any;
  especiales: any;
  teclado_especial!: boolean;

  folder = '';
  generalFormGroup!: FormGroup;
  arancelarioDeclarado!: FormGroup;
  arancelarioDictaminado!: FormGroup;
  ajusteValorFromGrup!: FormGroup;
  requestList = new Array;
  structure!: FormStructure;
  validateActionsDefault: Button[] = [];
  stepper!: MatStepperModule
  formData = new FormData();

  //Cambiar el nombre solo esta de prueba
  @ViewChild('stepper') stepper1!: MatStep;

  @ViewChild('archivo') fileUpload!: UploadFileComponent


  constructor(private taxPayerService: ContribuyenteService,
    private dialogService: DialogService,
    private casosService: CasosService,
    private casosDte: CasosDTEService) {
    this.generalFormGroup = new FormGroup({
      No: new FormControl(null, Validators.required),
      audiencia: new FormControl(null, Validators.required),
      cargaArchivo: new FormControl(null, Validators.required),
      fechaAudiencia: new FormControl(null, Validators.required),
      NIT: new FormControl(null, Validators.required),
      nombre: new FormControl({ value: null, disabled: true }, Validators.required),
      noDuca: new FormControl({ value: null, disabled: true }, Validators.required),
      noDucaOrden: new FormControl(null, Validators.required),
      fechaAceptacion: new FormControl({ value: null, disabled: true }, Validators.required),
      regimen: new FormControl({ value: null, disabled: true }, Validators.required),
      selectivo: new FormControl({ value: null, disabled: true }, Validators.required),
      paisProveedor: new FormControl({ value: null, disabled: true }, Validators.required),
      tipoAjuste: new FormControl(null, Validators.required),
      expedientes: new FormControl(null, Validators.required),
      certificadoensayo: new FormControl(null, Validators.required),
      dictamenArancelaria: new FormControl(null, Validators.required),
      fechaDictamen: new FormControl(null, Validators.required),
      Descripcion: new FormControl(null, Validators.required)
    });

    this.arancelarioDeclarado = new FormGroup({
      capituloDeclarado: new FormControl({ value: null, disabled: true }, Validators.required),
      partidaDeclarada: new FormControl({ value: null, disabled: true }, Validators.required),
      incisosDeclarado: new FormControl({ value: null, disabled: true }, Validators.required),
      tasaDai: new FormControl({ value: null, disabled: true }, Validators.required),
      daiPagado: new FormControl({ value: null, disabled: true }, Validators.required),
      ivaPago: new FormControl({ value: null, disabled: true }, Validators.required),
      tratoArancelario: new FormControl(null, Validators.required)
    });

    this.arancelarioDictaminado = new FormGroup({
      capituloDictaminado: new FormControl(null, Validators.required),
      partidaDictaminado: new FormControl(null, Validators.required),
      incisoDictaminado: new FormControl(null, Validators.required),
      tasaDaiaDictaminado: new FormControl(null, Validators.required),
      tipoAlertivo: new FormControl(null),
      opinionDace: new FormControl(null, Validators.required),
      montoTotal: new FormControl(null, Validators.required),
      observaciones: new FormControl(null, Validators.required),
      unidadMedida: new FormControl({ value: null, disabled: true }, Validators.required),
      cantidad: new FormControl({ value: null, disabled: true }, Validators.required)
    });

    this.ajusteValorFromGrup = new FormGroup({
      valorDeclarado: new FormControl({ value: null, disabled: true }, Validators.required),
      valorAjustado: new FormControl(null, Validators.required),
      numeroOrden: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
  }

  getDuca() {
    let noOrdenDuca = this.generalFormGroup.get("noDucaOrden")?.value
    const data = {
      numeroOrden: noOrdenDuca
    }
    this.casosDte.getDucasData(data).toPromise().then(resul => {
      if (resul.data.length <= 0) {
        this.dialogService.show({
          title: 'IFI-404',
          text: `No ha encontrado información de la DUCA`,
          icon: 'info',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        });
        return;
      }
      const duca = resul.data[0];
      const duca2 = resul.data[1];
      console.log(duca);
      console.log(duca2);
      this.generalFormGroup.get("noDuca")?.setValue(duca.numeroDuca, Validators.required)
      this.generalFormGroup.get("fechaAceptacion")?.setValue(duca.fechaAceptacion, Validators.required)
      this.generalFormGroup.get("regimen")?.setValue(duca.regimen, Validators.required)
      if (duca.selectivo == 'R') {
        this.generalFormGroup.get("selectivo")?.setValue('Rojo', Validators.required)
      } else {
        this.generalFormGroup.get("selectivo")?.setValue('Verde', Validators.required)
      }
      this.generalFormGroup.get("paisProveedor")?.setValue(duca.paisProveedor, Validators.required)

      this.arancelarioDeclarado.get("capituloDeclarado")?.setValue(duca.capituloDeclarado, Validators.required)
      this.arancelarioDeclarado.get("partidaDeclarada")?.setValue(duca.partidaDeclarada, Validators.required)
      this.arancelarioDeclarado.get("incisosDeclarado")?.setValue(duca.incisoDeclarado, Validators.required)
      this.arancelarioDeclarado.get("tasaDai")?.setValue(duca.tasaDAI, Validators.required)
      this.arancelarioDeclarado.get("daiPagado")?.setValue(duca.valorTributo, Validators.required)
      this.arancelarioDeclarado.get("ivaPago")?.setValue(duca2.valorTributo, Validators.required)

      this.arancelarioDictaminado.get("unidadMedida")?.setValue(duca.unidadMedida, Validators.required)
      this.arancelarioDictaminado.get("cantidad")?.setValue(duca.cantidadUnidades, Validators.required)

      this.ajusteValorFromGrup.get("valorDeclarado")?.setValue(duca.valorUnitario, Validators.required)

    })
  }

  /**
 * @description Método para buscar un colaborador 
 * @author agaruanom (Gabriel Ruano)
 * @since 25/08/2022
 */
  searchTaxpayer() {
    let NIT = this.generalFormGroup.get('NIT')?.value
    this.taxPayerService.getGeneralTaxpayerInformation(NIT).toPromise().then(data => {
      const datos = data.data.attributes.datos;
      const detalle = datos.contribuyente?.persona ?? datos.empresa;

      const contribuyente = {
        nombre: this.parsearNombre(detalle),
      }

      this.generalFormGroup.get('nombre')?.setValue(contribuyente.nombre, Validators.required)
      this.generalFormGroup.get('nombre')?.disable()
      console.log(contribuyente.nombre);
    })
  }

  /**
* @description Método para agregar solicitud 
* @author agaruanom (Gabriel Ruano)
* @since 25/08/2022
*/
  addRequest() {
    console.log('agregar solicitud');
    const general = this.generalFormGroup.getRawValue()
    const declarado = this.arancelarioDeclarado.getRawValue()
    const dictaminado = this.arancelarioDictaminado.getRawValue()
    const ajuste = this.ajusteValorFromGrup.getRawValue()

    const request: solicitudesAduanas = {
      no: general.No,
      audiencia: general.audiencia,
      fechaAudiencia: general.fechaAudiencia,
      NIT: general.NIT,
      nombre: general.nombre,
      noDuca: general.noDuca,
      noDucaOrden: general.noDucaOrden,
      fechaAceptacion: general.fechaAceptacion,
      regimen: general.regimen,
      selectivo: general.selectivo,
      paisProveedor: general.paisProveedor,
      tipoAjuste: general.tipoAjuste,
      expedientes: general.expedientes,
      certificadoensayo: general.certificadoensayo,
      dictamenArancelaria: general.dictamenArancelaria,
      fechaDictamen: general.fechaDictamen,
      Descripcion: general.Descripcion,
      capituloDeclarado: declarado.capituloDeclarado,
      partidaDeclarada: declarado.partidaDeclarada,
      incisosDeclarado: declarado.incisosDeclarado,
      tasaDai: declarado.tasaDai,
      daiPagado: declarado.daiPagado,
      ivaPago: declarado.ivaPago,
      tratoArancelario: declarado.tratoArancelario,
      capituloDictaminado: dictaminado.capituloDictaminado,
      partidaDictaminado: dictaminado.partidaDictaminado,
      incisoDictaminado: dictaminado.incisoDictaminado,
      tasaDaiaDictaminado: dictaminado.tasaDaiaDictaminado,
      tipoAlertivo: dictaminado.tipoAlertivo,
      opinionDace: dictaminado.opinionDace,
      montoTotal: dictaminado.montoTotal,
      observaciones: dictaminado.observaciones,
      unidadMedida: dictaminado.unidadMedida,
      cantidad: dictaminado.cantidad,
      valorDeclarado: ajuste.valorDeclarado,
      valorAjustado: ajuste.valorAjustado,
      numeroOrden: ajuste.numeroOrden
    }
    console.log(request);

    this.requestList.push(request);
    console.log(this.requestList);

    this.formData.append('file', this.generalFormGroup.controls['cargaArchivo'].value);

  }

  /**
* @description Método para guardar solicitud
* @author agaruanom (Gabriel Ruano)
* @since 25/08/2022
*/
  saveRequest() {
    this.addRequest();
    this.formData.append('data', JSON.stringify(this.requestList));
    this.casosService.createCustomsRequest(this.formData).toPromise().then(res => {
      console.log('guardar solicitud');
      this.dialogService.show({
        title: 'Guardado exitoso.',
        text: `Solicitud guardada correctamente.`,
        icon: 'success',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      }).then(r=>{
        this.cancelar();
      });
    })
  }

  /**
  * @description Método para mostrar dialogo de confirmacion para agregar o guardar solicitud
  * @author ajsbatzmo (Jamier Batz)
  * @since 25/08/2022
  */
  showDialog() {
    console.log(this.requestList);
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [],
      validateActions: [
        new Button('add', 'Si, agregar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'add_circle'
        }),
        new Button('save', 'No, guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
      ]
    });
    this.dialogService.show({
      title: `¿Desea agregar otra solicitud?`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: false,
    })
  }

  /**
  * @description Metodo neceario para ejecutar el Callback en el structure, espesificamente en los botones
  */
  onEvent(id: string, value: any): void {
    console.log("este es el onevent", id, value)
  }

  /**
  * @description metodo neceasrio onClick implementado en structure, sirve para ejecutar las funciones del structure
  */
  onClick(actionId: string): void {
    if (actionId == 'add') {//opcion para agregar solicitud
      this.addRequest();
      //hacer que el stepper regrese al step 1
      this.generalFormGroup.reset()
      this.arancelarioDeclarado.reset()
      this.arancelarioDictaminado.reset()
      this.ajusteValorFromGrup.reset()
      this.stepper1.reset()
      this.dialogService.showSnackBar({
        title: 'IFI-200',
        text: `Solicitud agregada exitosamente.`,
        icon: 'success',
        duration: 3000
      })
      this.dialogService.close('primary');
    }
    else if (actionId == 'save') {//opcion para guardar solicitud
      this.saveRequest();
      this.dialogService.close('primary');
    }
    else if (actionId == 'cancelar') {
      this.dialogService.close('cancel');
    } else {
      this.dialogService.close('cancel');
    }
  }

  cancelar() {
    this.formData.delete('data');
    this.requestList = [];
    console.log('botonazo cancelar');
    this.fileUpload.removeFile();
    this.ajusteValorFromGrup.reset();
    this.arancelarioDeclarado.reset();
    this.arancelarioDictaminado.reset();
    this.generalFormGroup.reset();
    this.stepper1.reset();
  }

  //metodo que solo esta de prueba se tiene que eliminar 
  obtenerValor() {
    console.log(this.generalFormGroup.get('tipoAjuste')?.value);
    console.log(this.generalFormGroup.get('Descripcion')?.value);
  }

  /* Validar que solo se ingresen numeros*/
  public soloNumeros(e: any) {
    this.key = e.keyCode || e.which;
    this.teclado = String.fromCharCode(this.key);
    this.especiales = '8';
    this.numero = '0123456789';
    this.teclado_especial = false;
    for (const i in this.especiales) {
      if (this.key === this.especiales[i]) {
        this.teclado_especial = true;
      }
    }

    if (this.numero.indexOf(this.teclado) === -1 && !this.teclado_especial) {
      return false;
    }
    return true;
  }

  /* Metodo para subir el Documento */
  stateChange(state: FileChange): void {
    if (state.state == 'uploading') {
      console.log('uploading');
    }
    if (state.state == 'uploaded') {
      console.log('se cargo el archivo')
      let id = this.generalFormGroup.controls['cargaArchivo'].value
    }

    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
    }

  }

  /*   metodo para parsear el nombre del colaborador */
  parsearNombre(detalle: any) {
    return detalle.razonSocial ?? `${detalle.primer_Nombre ?? ''} ${detalle.segundo_Nombre ?? ''} ${detalle.primer_Apellido ?? ''} ${detalle.segundo_Apellido ?? ''}`.replace(/\s+/g, ' ').trim();
  }

  foods: Food[] = [
    { value: 1, viewValue: 'Verde' },
    { value: 2, viewValue: 'Rojo' }
  ];

}
