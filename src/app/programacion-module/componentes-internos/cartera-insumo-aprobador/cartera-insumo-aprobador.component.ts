import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, Injector, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button, Dropdown, FormStructure, InputNumber, Input, OptionChild, TextArea, CustomNode } from 'mat-dynamic-form';
import { DialogIcon } from 'src/app/general-module/componentes-comunes/clases/dialog';
import { CaseDetail } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { ColaboratorDto } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { InputInterface } from 'src/app/general-module/componentes-comunes/interfaces/Input.interface';
import { ParametroAsignaCasoDto } from 'src/app/general-module/componentes-comunes/interfaces/ParametroAsignaCasoDto';
import { UnidadesAdministrativas } from 'src/app/general-module/componentes-comunes/interfaces/unidades-administrativas.inteface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { InputService } from 'src/app/general-module/componentes-comunes/servicios/input.service';
import { UnidadesAdministrativasService } from 'src/app/general-module/componentes-comunes/servicios/unidades-administrativas.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';

@Component({
  selector: 'app-cartera-insumo-aprobador',
  templateUrl: './cartera-insumo-aprobador.component.html',
  styleUrls: ['./cartera-insumo-aprobador.component.scss']
})
export class CarteraInsumoAprobadorComponent implements OnInit {

  structure!: FormStructure;

  showInput = false;
  showDetail = false;
  showCase = false;
  showPrincipal = true;
  selectedInput!: InputInterface;
  listAdministrativeUnits!: UnidadesAdministrativas[];
  listaCasosPendientesAsignar!: CaseDetail[];
  listColaboratores!: ColaboratorDto[];
  assignmentParam: ParametroAsignaCasoDto = {};
  dataSource = new MatTableDataSource();
  dataSourceDetail = new MatTableDataSource();
  displayedColumns: string[] = ['idinsumo','nombreInsumo', 'nombreGerencia', 'cantidadCasosInsumo','cantidadCasosXasignar', 'posibleRecaudo', 'descripcion', 'fechaPublica','usuarioPublica','acciones'];
  displayedColumnsDetails: string[] = ['nit', 'nombre', 'recaudo'];
  inputFormGroup!: FormGroup;
  detailFormGroup!: FormGroup;
  caseFormGroup!: FormGroup;
  cont: number = 0

  @ViewChild('MatPrincipal') paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorDetail!: MatPaginator;
  @ViewChild('MatPrincipal') set matPaginatorPrincipal(mp5: MatPaginator) {
    this.dataSource.paginator = mp5
  }
  @ViewChild('MatDetail') set matPaginatorDetail(mp5: MatPaginator) {
    this.dataSourceDetail.paginator = mp5
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSourceDetail.paginator = this.paginatorDetail;
  }

  options = {
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help charmap emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit insert format table',
    toolbar: 'undo redo | bold italic underline strikethrough | formatselect fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen preview print | charmap image table',
    toolbar_sticky: true,
    content_style: '* { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; }',
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    resize: false,
    importcss_append: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.style.display = 'none';
      if (meta.filetype === 'image') {
        input.accept = 'image/*';
      } else if (meta.filetype === 'media') {
        input.accept = 'video/*';
      } else input.accept = '*/*';
      /*input.onchange = (event: Event) => {

        // Crear ruta pre-firmada para el archivo desde S3
        const file = (event.target as HTMLInputElement).files?.item(0);
        this.gestorService.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.ngZone)
          errorHandler.handleError(error)
        })
      }*/
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image quicktable table",
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };

  constructor(private inputService: InputService,
    private unitService: UnidadesAdministrativasService,
    private colaboratorService: ColaboradoresService,
    private dialog: DialogService,
    private casosService: CasosService,
    private dialogService: DialogService) {
    this.inputFormGroup = new FormGroup({
      nombreInsumo: new FormControl('', Validators.required),
      unidadResponsable: new FormControl('', Validators.required),
    });
    this.detailFormGroup = new FormGroup({
      nombreInsumo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      gerencia: new FormControl('', Validators.required),
      recaudo: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
    });
    this.caseFormGroup = new FormGroup({
      nombreInsumo: new FormControl('', Validators.required),
      cantidadCasos: new FormControl(''),
      cantidadCasosInsumo: new FormControl('', Validators.required),
      nitResponsable: new FormControl('', Validators.required),
    });
  }


  onClick(actionId: string): void {
    if (actionId === 'guardarCase') {
      if (this.structure.getValue<any>().cantidadAsignar < 1) {
        this.goMsgAlert('La cantidad de casos a asingar tiene que ser mayor a 0', 'Advertencia', 'warning');
      }
      else if (this.listaCasosPendientesAsignar.length < this.structure.getValue<any>().cantidadAsignar) {
        this.goMsgAlert('No hay suficientes casos pendientes de asignar en el insumo.', 'Advertencia', 'error');
      }
      else {
        this.assignmentParam.pnit = this.structure.getValue<any>().colaborador;
        this.assignmentParam.pcantidad = this.structure.getValue<any>().cantidadAsignar;
        this.goUpdateCase();
      }
    } else if (actionId === 'guardarInput') {
      this.selectedInput.idUnidadAdministrativa = this.structure.getValue<any>().unidadAdministrativa;
      this.goUpdateInsumo();
    }
    else if (actionId === 'guardar') {
      this.dialog.close('primary');
    }
    else {
      this.dialog.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.goUpdateInputList();
    this.unitService.getAdministrativeUnitByNitAndRol(1).toPromise().then(resultado => {
      this.listAdministrativeUnits = resultado;
    });
    this.colaboratorService.getSubcolaboratoresByLevel(1).toPromise().then(resultado => {

      this.listColaboratores = resultado;
    });
  }

  goUpdateInputList(): void {
    //codigo estado 180
    this.inputService.getAllInputApprover(180).toPromise().then(result => {
      console.log(result)
      if (result.length == 0) {
        this.dialogService.show({
          title: 'Atenci??n',
          text: `No cuenta con Insumos Asignados.`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        })
      } else {
        this.dataSource.data = result;
      }

    }).catch((error: HttpErrorResponse) => {
      if (error.status != 404) throw error;
      this.dialogService.show({
        title: 'Verifique Informacion',
        text: `Verifique la Informacion ingresada`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    })
  }

  goInput(): void {
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('Nombre del insumo', 'Nombre del insumo').apply({
          singleLine: true,
          value: this.selectedInput.nombreInsumo,
          readOnly: true
        }),
        new Dropdown('unidadAdministrativa', 'Unidad').apply({
          value: this.listAdministrativeUnits.map(res => new OptionChild(res.nombre, String(res.id)))
        })
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardarInput', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.dialog.show({
      title: `Trasladar insumo.`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }

  goDetail(pInputInterface: InputInterface): void {
    this.selectedInput = pInputInterface;
    this.detailFormGroup.controls.nombreInsumo.setValue(pInputInterface.nombreInsumo);
    this.detailFormGroup.controls.descripcion.setValue(pInputInterface.descripcion);
    this.detailFormGroup.controls.gerencia.setValue(pInputInterface.nombreGerencia);
    this.detailFormGroup.controls.recaudo.setValue(`Q. ${new Intl.NumberFormat('en-En').format(pInputInterface.montoRecaudo)}`);
    this.detailFormGroup.controls.estado.setValue(pInputInterface.nombreEstado);
    this.casosService.getCaseByIdInputStatus(pInputInterface.idInsumo, Constantes.ESTADO_CASO_PUBLICADO).toPromise().then(result => {
      this.dataSourceDetail.data = result;
      this.listaCasosPendientesAsignar = result;
      /*  console.log(this.listaCasosPendientesAsignar); */
    });
    /*  this.casosService.getCaseByIdInputStatus(pInputInterface.idInsumo, 177).toPromise().then(result => {
       this.listaCasosPendientesAsignar = result;
       console.log(result);
       
     }); */
    this.showDetail = true;
    this.showPrincipal = false;
  }


  goCase(): void {

    //this.caseFormGroup.controls.nombreInsumo.setValue(this.selectedInput.nombreInsumo);
    //this.caseFormGroup.controls.cantidadCasosInsumo.setValue(this.selectedInput.cantidadCasos);
    //this.lista = 
    /*if (this.aprobador) {

      this.dataSourceDetail.data = await this.casosService.getCaseByIdInputStatus(this.selectedInput.idInsumo, 177).toPromise();
    }*/
    //this.showCase = true;
    //this.showPrincipal = false;


    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('Nombre del insumo', 'Nombre del insumo').apply({
          singleLine: true,
          disabled: true,
          value: this.selectedInput.nombreInsumo,
        }),
        new InputNumber('Cantidad de casos del insumo', 'Cantidad de casos del insumo').apply({
          value: this.selectedInput.cantidadCasos,
          disabled: true
        }),
        new InputNumber('Cantidad de casos pendientes de asignar del insumo', 'Cantidad de casos pendientes de asignar del insumo').apply({
          value: this.listaCasosPendientesAsignar.length,
          disabled: true
        }),
        new InputNumber('cantidadAsignar', 'Cantidad de casos a asignar'),
        new Dropdown('colaborador', 'Colaborador').apply({
          value: this.listColaboratores.map(res => new OptionChild(res.nombres, String(res.nit)))
        })
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardarCase', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.dialog.show({
      title: `Asignar casos`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    });
  }

  goCancel() {
    this.showInput = false;
    this.showCase = false;
    this.showDetail = false;
    this.showPrincipal = true;
  }

  goUpdateInsumo() {
    this.dialog.show({
      icon: 'question',
      title: 'IFI-100',
      text: '??Desea trasladar el insumo?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        console.log(this.selectedInput);
        //this.selectedInput.idUnidadAdministrativa = this.inputFormGroup.controls.unidadResponsable.value;

        this.inputService.putInput(this.selectedInput.idInsumo, this.selectedInput).toPromise().then(resultPut => {
          this.goCancel();
          this.goUpdateInputList();
          this.dialog.closeAll();
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha realizado la asignacion de insumo, exitosamente.`,
            duration: 3000
          });
        });
      }
    });
  }

  goMsgAlert(pText: string, pTitle: string, pIcon: DialogIcon) {
    this.dialog.show({
      icon: pIcon,
      title: pTitle,
      text: pText,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Entendido',
      disableClose: true,
    });
  }

  goUpdateCase() {
    this.dialog.show({
      icon: 'question',
      title: 'IFI-100',
      text: '??Desea asignar los casos?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then(resultado => {
      if (resultado === 'primary') {
        /*this.assignmentParam.pnit = this.caseFormGroup.controls.nitResponsable.value;
        this.assignmentParam.pcantidad = this.caseFormGroup.controls.cantidadCasos.value;
        this.assignmentParam.pinput = this.selectedInput.idInsumo;*/
        console.log(this.assignmentParam);
        this.inputService.postAssignment(this.assignmentParam, this.selectedInput.idInsumo).toPromise().then(resultPut => {
          this.goCancel();
          this.goUpdateInputList();
          this.ngOnInit();
          this.dialog.closeAll();
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha realizado la asignacion de casos, exitosamente.`,
            duration: 3000
          });
        });
      }
    });
  }

  goRejection(): void {
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Justificaci??n del rechazo').apply({
          singleLine: true
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.dialog.show({
      title: `Solicitar rechazo`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(resutl => {

      if (resutl === 'primary') {
        this.assignmentParam.comentario = this.structure.getValue<any>().comentarios;
        this.inputService.putRejection(this.assignmentParam, this.selectedInput.idInsumo).toPromise().then(resultPut => {

          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha ejecutado el rechazo, exitosamente.`,
            duration: 3000
          });
          window.location.reload();
        });
      }
    });


  }

  goDefinitiveRejection(): void {
    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Justificaci??n del rechazo definitivo.').apply({
          singleLine: true
        }),
      ],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.dialog.show({
      title: `Solicitar rechazo definitivo`,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(resutl => {

      if (resutl === 'primary') {
        this.assignmentParam.comentario = this.structure.getValue<any>().comentarios;
        this.inputService.putDefinitiveRejection(this.assignmentParam, this.selectedInput.idInsumo).toPromise().then(resultPut => {

          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha realizado el rechazo definitivo, exitosamente.`,
            duration: 3000
          });
          window.location.reload();
        });
      }
    });
  }

  goSuspend(): void {

    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('comentarios', RichTextComponent).apply({
          singleLine: true,
          options: this.options,
          outputFormat: "html"
        })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.structure = this.structure

    this.dialog.show({
      title: `Solicitar suspensi??n `,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.structure.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        this.assignmentParam.comentario = this.structure.getValue<any>().comentarios;
        this.inputService.putSuspend(this.assignmentParam, this.selectedInput.idInsumo).toPromise().then(resultPut => {
          this.goCancel();
          this.goUpdateInputList();
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha realizado la suspensi??n, exitosamente.`,
            duration: 3000
          });
        });
      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vac??o",
          icon: "error"
        });

      }
    });
  }

  goCorrect(): void {

    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('comentarios', RichTextComponent).apply({
          singleLine: true,
          options: this.options,
          outputFormat: "html"
        })],
      validateActions: [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.structure = this.structure

    this.dialog.show({
      title: `Rechazar Insumo `,
      formStructure: this.structure,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.structure.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        this.assignmentParam.comentario = this.structure.getValue<any>().comentarios;
        this.inputService.putCorrect(this.assignmentParam, this.selectedInput.idInsumo).toPromise().then(resultPut => {
          this.goCancel();
          this.goUpdateInputList();
          this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `Se ha rechazado el insumo exitosamente.`,
            duration: 3000
          });
          window.location.reload();
        });
      }
      else {
        this.dialog.close('primary');
        this.dialog.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vac??o",
          icon: "error"
        });

      }
    });

  }


}
