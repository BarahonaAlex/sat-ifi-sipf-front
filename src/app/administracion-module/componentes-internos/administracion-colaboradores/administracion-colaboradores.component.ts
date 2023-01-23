import { CatalogosService } from './../../../general-module/componentes-comunes/servicios/catalogos.service';
import { Button, FormListener, FormStructure, Input, Dropdown, OptionChild, DatePicker, Checkbox, CustomNode } from 'mat-dynamic-form';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { ColaboradorFromProsis, collaboratorHistory, CollaboratorResponse, createCollaborator, updateCollaborator } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import * as moment from 'moment';
import { EmailValidator, Validators } from '@angular/forms';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';

@Component({
  selector: 'app-administracion-colaboradores',
  templateUrl: './administracion-colaboradores.component.html',
  styleUrls: ['./administracion-colaboradores.component.scss']
})
export class AdministracionColaboradoresComponent implements OnInit, FormListener {
  formStructure!: FormStructure;
  updating: boolean = false;
  estadoColabo: Catalog[] = [];
  mobNumberPattern = "/^\d+\.\d+$/";
  nodeId!: string;

  newCollaboratorGerencia: number = 0;

  constructor(
    public dialog: MatDialog,
    private dialogService: DialogService,
    private admonColaboradoresService: ColaboradoresService,
    private alert: DialogService, private catalogService: CatalogosService,) {
    this.catalogService.getCatalogDataByIdCatalog(3).toPromise().then(res => {
      console.log(res)


      this.formStructure = new FormStructure();
      this.formStructure.appearance = 'standard';
      this.formStructure.showTitle = false;
      this.formStructure.globalValidators = Validators.required;
      this.formStructure.nodes = [
        new Input('nit', 'NIT').apply({
          singleLine: false,
          maxCharCount: 16,
          action: { callback: this, type: 'blur' },
        }),
        new Input('nombre', 'Nombre').apply({
          singleLine: false,
          disabled: true,
        }),
        new Input('usuario', 'Usuario').apply({
          singleLine: false,
          disabled: true,
        }),
        new Input('puesto', 'Puesto de trabajo').apply({
          singleLine: false,
          disabled: true,
        }),
        new Dropdown('state', 'Estado', res.filter(t => t.codigo != 407).map((s: Catalog) =>
          new OptionChild(s.nombre.toString(), s.codigo.toString())
        )).apply({
          action: {
            type: 'valueChange', onEvent: (value: any) => {
              const nodes = [
                new DatePicker('fechaFin', 'Fecha de fin'),
                new DatePicker('fechaInicio', 'Fecha de inicio'),
                new CustomNode('doc', UploadFileComponent, {
                  label: 'Documento de respaldo',
                  accept: ['pdf'],
                  folder: this.nodeId,
                  saveOnLoad: false,
                }).apply({ singleLine: true, require: false })
              ];
              const checkNodes = nodes.map(t => this.formStructure.getControlById(t.id));

              if (this.updating && value.event == "4") {
                this.formStructure.removeNodes(nodes);
              }
              else if (this.updating && value.event != "4" && checkNodes[0] == null) {

                this.formStructure.createNodes(4, nodes);
              }

            }
          },
        }),
        new Input('correo', 'Correo Electrónico').apply({
          singleLine: false
          ,
          action: {
            callback: this, type: 'blur'
          },


        }),
      ];
      this.formStructure.validateActions = [
        new Button('cancel', 'Cancelar', { callback: this, style: 'warn' }).apply({
          icon: 'close',
        }),
        new Button('save', 'Guardar', { callback: this, style: 'primary' }).apply({
          icon: 'save',
          validateForm: true
        }),
      ]

    })
  }

  ngOnInit() {
    this.admonColaboradoresService.getCollaborators().toPromise().then(res => {
      this.collaboratorTable.data = res;
      console.log(res)
    })


    this.collaboratorTable.filterPredicate = function (item, filter) {


      return item.login.includes(filter.trim().toLowerCase()) ||
        item.nombres.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.nit.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.puesto_trabajo.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.nombreUnidadAdministrativa.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.nombreTipoProgramacion.trim().toLowerCase().includes(filter.trim().toLowerCase()) ||
        item.nombreEstado.trim().toLowerCase().includes(filter.trim().toLowerCase())

    }

  }

  /**
   * @description Método para eliminar colaboradores en base al `NIT`
   * @author agaruanom (Gabriel Ruano)
   * @since 17/01/2022
   * @param nit indentificador tributario del colaborador
   */
  deleteCollaborator(nit: string) {
    this.alert.show({
      title: "Eliminar colaborador",
      text: "¿Está seguro que desea eliminar al colaborador?",
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      const deleteCola: collaboratorHistory = {
        fechaFin: moment().format('YYYY-MM-DD'),
        fechaInicio: moment().format('YYYY-MM-DD'),
        idEstado: 5,
        nitColaborador: nit,
      }
      if (result == 'primary') {
        console.log(nit)
        console.log(deleteCola)
        this.admonColaboradoresService.deleteCollaborator(nit).subscribe(res => {
          console.log(res)
          this.admonColaboradoresService.getCollaborators().subscribe(re => {
            this.dialog.closeAll();
            console.log(re)
            //
            this.dialogService.show({
              title: "Eliminar colaborador",
              text: "El colaborador ha sido eliminado exitosamente",
              icon: 'success',
              showConfirmButton: true,
            }).then((result) => {
              if (result == 'primary') {
                this.collaboratorTable.data = re;
              }
            })
            //
          })
        })

      }
    })
  }

  updateJobPositionCollaborator(nit: string) {
    this.alert.show({
      title: "Actualizar información",
      text: "¿Está seguro que desea actualizar la información?",
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result == 'primary') {
        this.admonColaboradoresService.updateJobPosition(nit).toPromise().then(res => {
          //console.log(res)
          this.admonColaboradoresService.getCollaborators().subscribe(re => {
            this.collaboratorTable.data = re;
            console.log(re)
            this.dialog.closeAll();
          })
        }, err => { console.error(err) })
      }
    })
  }


  /* Paginador para la tabla de  colaboradores */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.collaboratorTable.paginator = this.paginator;
  }

  /* Filtro para busqueda de colaboradores */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.collaboratorTable.filter = filterValue.trim().toLowerCase();
    if (this.collaboratorTable.paginator) {
      this.collaboratorTable.paginator.firstPage();
    }
  }

  /* Para mostrar las columnas y los campos de la tabla de colaborador */
  displayedColumns1: string[] = ['nit', 'nombre', 'usuario', 'puesto', 'unidad', 'nombreTipoProgramacion', 'estado', 'acciones'];
  collaboratorTable = new MatTableDataSource<CollaboratorResponse>();

  onEvent(id: string, value: any): void {

    if (id === 'correo') {

      this.formStructure.getNodeById('correo').apply(
        { errorMessage: value ? `Formato de correo, incorrecto.` : `` }
      );

      this.formStructure.getControlById('correo')?.setValidators([Validators.email, Validators.required]);
      this.formStructure.getControlById('correo')?.updateValueAndValidity();
    }

    if (id == 'nit') {
      console.log(isNaN(value))
      if (value == '' || value == undefined || value == null || RegExp(/^\s+$/).test(value)) {
      }
      else {
        this.admonColaboradoresService.getCollaboradorInfoByNit(value.toString()).toPromise().then(res => {
          console.log("esto es el res")
          console.log(res)

          if (res) {
            this.formStructure.getControlById('nombre')?.setValue(res.nombre);
            this.formStructure.getControlById('usuario')?.setValue(res.login);
            this.formStructure.getControlById('puesto')?.setValue(res.nombrePuesto);
            this.formStructure.getControlById('correo')?.setValue(res.correo);
            this.newCollaboratorGerencia = res.codigoUnidad;
          }

        })
      }
    }

    /*  if (id == 'state') { //#modificacion se agregan y quitan los nodos en funcion del estado
       const nodes = [
         new DatePicker('fechaFin', 'Fecha de fin'),
         new DatePicker('fechaInicio', 'Fecha de inicio'),
       ]
       const checkNodes = nodes.map(t => this.formStructure.getControlById(t.id))
 
       if (this.updating && value == "4") {
         this.formStructure.removeNodes(nodes)
       }
       else if (this.updating && value != "4" && checkNodes[0] == null) {
         this.formStructure.createNodes(4, nodes)
       }
 
     } */
  }
  onClick(actionId: string): void {
    if (actionId.match('cancel')) {
      this.dialog.closeAll();
    }

    if (actionId.match('save')) {


      let componentNames: string[];
      componentNames = ['correo', 'usuario'];

      let errors = false;
      componentNames.forEach(item => {
        if (this.formStructure.getControlById(item)?.value.trim().length === 0) {
          this.formStructure.getFormGroup().get(item)?.setValue(null);
          this.formStructure.getFormGroup().get(item)?.updateValueAndValidity();
          this.formStructure.getFormGroup().get(item)?.markAsTouched();
          this.formStructure.getFormGroup().updateValueAndValidity();
          errors = true;

        }
      });


      if (errors) {

        this.dialogService.showSnackBar({
          title: 'IFI-200',
          text: `Existen campos requeridos vacíos, favor revisar.`,
          icon: 'warning',
          duration: 3000
        })
        return;
      }



      /*if (this.formStructure.getControlById('correo')!.value.trim().length == 0) {
        this.formStructure.getControlById('correo')!.setValue(null);
        this.formStructure.getControlById('correo')?.markAsTouched();
        this.formStructure.getControlById('correo')?.updateValueAndValidity();
        return;
      }

      if (this.formStructure.getControlById('usuario')!.value.trim().length == 0) {
        this.formStructure.getControlById('usuario')!.setValue(null);
        this.formStructure.getControlById('usuario')?.markAsTouched();
        this.formStructure.getControlById('usuario')?.updateValueAndValidity();
        return;
      }*/


      if (this.updating) { //actualizar el colaborador
        const state = parseInt(this.formStructure.getControlById('state')!.value)
        const updateColab: updateCollaborator = {
          correo: this.formStructure.getControlById('correo')!.value,
          idColaborador: this.formStructure.getControlById('nit')!.value,
          nombresColaborador: this.formStructure.getControlById('nombre')!.value,
          loginColaborador: this.formStructure.getControlById('usuario')!.value,
          idEstado: state,
          puestoTrabajo: this.formStructure.getControlById('puesto')!.value,
          idGerencia: this.newCollaboratorGerencia,
          fechaInicio: state == 4 ?
            new Date() : this.formStructure.getControlById('fechaInicio')!.value,
          fechaFin: state == 4 ?
            new Date() : this.formStructure.getControlById('fechaFin')!.value,
        }
        console.log(updateColab);
        const save = new FormData();
        save.append('file', (this.formStructure.getControlById('doc')) ? this.formStructure.getControlById('doc')!.value : null);
        save.append('data', JSON.stringify(updateColab));
        this.admonColaboradoresService.updateCollaboratorMultipar(save).toPromise().then(res => {
          //
          this.dialog.closeAll();
          this.dialogService.show({
            title: 'Colaborador actualizado',
            text: 'Colaborador actualizado correctamente',
            icon: 'success',
            showConfirmButton: true,
          }).then((result) => {
            if (result == 'primary') {
              //
              this.admonColaboradoresService.getCollaborators().toPromise().then(res => {
                this.collaboratorTable.data = res;
                this.dialog.closeAll();
              })
              //
            }
          })
          //
        })

      } else { //crear un nuevo colaborador
        const colaborador: createCollaborator = {
          correo: this.formStructure.getControlById('correo')!.value,
          fechaModifica: moment().format('YYYY-MM-DD'),
          idColaborador: this.formStructure.getControlById('nit')!.value,
          idEstado: parseInt(this.formStructure.getControlById('state')!.value),
          idGerencia: this.newCollaboratorGerencia,
          puestoTrabajo: this.formStructure.getControlById('puesto')!.value,
          nombresColaborador: this.formStructure.getControlById('nombre')!.value,
          loginColaborador: this.formStructure.getControlById('usuario')!.value,
        }
        console.log(colaborador)
        this.admonColaboradoresService.createCollaborator(colaborador).toPromise().then(res => {
          //
          this.dialog.closeAll();
          this.dialogService.show({
            title: 'Colaborador agregado',
            text: 'Colaborador agregado exitosamente',
            icon: 'success',
            showConfirmButton: true,
          }).then((result) => {
            if (result == 'primary') {
              //
              this.admonColaboradoresService.getCollaborators().toPromise().then(res => {
                this.collaboratorTable.data = res;
                this.dialog.closeAll();
              })
              //
            }
          })
          //
        })
      }
    }
  }

  showDialog(element?: CollaboratorResponse) {



    const nodes = [
      new DatePicker('fechaFin', 'Fecha de fin'),
      new DatePicker('fechaInicio', 'Fecha de inicio'),
      new CustomNode('doc', UploadFileComponent, {
        label: 'Documento de respaldo',
        accept: ['pdf'],
        folder: this.nodeId,
        saveOnLoad: false,
      }).apply({ singleLine: true, require: false })
    ]

    this.formStructure.removeNodes(nodes);

    if (element) {
      this.updating = true;


      this.formStructure.getNodeById('nit').value = element.nit;
      this.formStructure.getNodeById('nombre').value = element.nombres;
      this.formStructure.getNodeById('usuario').value = element.login;
      this.formStructure.getNodeById('puesto').value = element.puesto_trabajo;
      this.formStructure.getNodeById('correo').value = element.correo;

      if (element.id_estado != 4) {

        const nodes2 = [
          new DatePicker('fechaFin', 'Fecha de fin'),
          new DatePicker('fechaInicio', 'Fecha de inicio')

        ]

        this.formStructure.createNodes(4, nodes2);
        this.formStructure.getNodeById('fechaFin').value = element.fechaFin.toString();
        this.formStructure.getNodeById('fechaInicio').value = element.fechaInicio.toString();
      }
      //this.formStructure.getNodeById('correo').apply({validator:Validators.email,errorMessage:'formato de correo, incorrecto'});
      //preguntar por lo del estado
      console.log(element.id_estado.toString());

      this.formStructure.getNodeById<Dropdown>('state').selectedValue = element.id_estado.toString();

      this.newCollaboratorGerencia = element.id_gerencia;
      this.formStructure.getNodeById('nit').apply({
        disabled: true,
      })
      this.formStructure.getNodeById('usuario').apply({
        disabled: false
      })
      /*if (element.id_estado != 4) {
        this.formStructure.createNodes(4, nodes)
      }*/
    }

    else if (!element) {
      this.updating = false;

      this.newCollaboratorGerencia = 0;
      this.formStructure.getNodeById('nit').value = "";
      this.formStructure.getNodeById('nombre').value = "";
      this.formStructure.getNodeById('usuario').value = "";
      this.formStructure.getNodeById('puesto').value = "";
      this.formStructure.getNodeById('correo').value = "";
      //this.formStructure.getNodeById('correo').apply({validator:Validators.email,errorMessage:'formato de correo, incorrecto'});
      this.formStructure.getNodeById('nit').apply({
        disabled: false
      })
      this.formStructure.getNodeById('usuario').apply({
        disabled: true
      })
      this.formStructure.getNodeById<Dropdown>('state').selectedValue = "";
      this.formStructure.removeNodes(nodes)
    }
    this.dialogService.show({
      title: `${!this.updating ? 'Crear Colaborador' : 'Actualizar Colaborador'}`,
      showConfirmButton: false,
      formStructure: this.formStructure
    })
  }



}
