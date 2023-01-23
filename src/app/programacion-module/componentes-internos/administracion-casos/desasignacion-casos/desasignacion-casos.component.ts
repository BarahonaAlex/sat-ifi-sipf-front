import { async } from '@angular/core/testing';
import { filter, switchMap, map } from 'rxjs/operators';
//////////////////////////////*IMPORT FILES AND METHODS*//////////////////////////////
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { casosCantidad, Professional, ProfessionalDesasignar, ProfessionalGeneral, ProfessionalReasignar, UnassignAndReassign } from 'src/app/general-module/componentes-comunes/interfaces/desasignacion-casos';
import { DesasignacionCasosService } from 'src/app/general-module/componentes-comunes/servicios/desasignacion-caso.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { UserService } from 'src/app/general-module/componentes-comunes/servicios/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { PerfilService } from 'src/app/general-module/componentes-comunes/servicios/perfil.service';
import { Button, Dropdown, FormStructure, TextArea, OptionChild, CustomNode } from 'mat-dynamic-form';
import { ThrowStmt } from '@angular/compiler';
//////////////////////////////*@COMPONENT INFORMATION*//////////////////////////////
@Component({
  selector: 'app-desasignacion-casos',
  templateUrl: './desasignacion-casos.component.html',
  styleUrls: ['./desasignacion-casos.component.scss']
})
//////////////////////////////*CLASS METHODS*////////////////////////////////////
export class DesasignacionCasosComponent implements OnInit {
  /**
   * @description  Variables globales
   *               "selectionProfessionalUnassign"
   *               "selectionProfessionalReassign"
   *               serviran para seleccionar los casos que se desasignen o reasignen.
   */
  selectionProfessionalUnassign = new SelectionModel<ProfessionalDesasignar>(true, []);
  selectionProfessionalReassign = new SelectionModel<ProfessionalReasignar>(true, []);
  generalFormGroup!: FormGroup;
  numerito!: number;
  /**
   * @description  Variables globales
   *               "professionalInformation"
   *               "professionalInformationReassign"
   *               "professionalInformationUnassign"
   *               contienen los valores de las columnas en base a sus respectivas interfaces. 
   */
  professionalInformation: string[] = ['nitProfesional', 'nombreProfesional', 'nombreInsumo', 'nombreEstado', 'accion'];
  professionalInformationReassign: string[] = ['idCaso', 'nitContribuyente','nombreContribuyente', 'nitProfesional', 'nombreProfesional', 'nombreEstado', 'seleccion'];
  professionalInformationUnassign: string[] = ['idCaso', 'nitContribuyente', 'nombreEstado', 'seleccion'];
  professionalInformationCasesUnassign: string[] = ['idCaso', 'cantidadCaso'];
  /**
  * @description Variables globales
  *              "dataProfessionalInformation"
  *              "dataProfessionalInformationReassign"
  *              "dataProfessionalInformationUnassign"
  *              almacenaran los valores que se le asignan por medio de la interfaz y el servicio res. 
  */
  dataProfessionalInformationCasesUnassign = new MatTableDataSource<any>();
  dataProfessionalInformationCasesReassign = new MatTableDataSource<casosCantidad>();
  dataProfessionalInformation = new MatTableDataSource<ProfessionalGeneral>();
  dataProfessionalInformationReassign = new MatTableDataSource<ProfessionalReasignar>();
  dataProfessionalInformationUnassign = new MatTableDataSource<ProfessionalDesasignar>();
  /**
   * @description Variables globales
   *              "viewUnassign"
   *              Sirve para poder cambiar de formulario dentro del mismo componente utilizando la directriz *ngIf.
   */
  viewUnassign: boolean = false;
  /**
   * @description La variable global "ShowInformationProfessional" es llamada desde el componente html para mostrar información de la interfaz.
   */
  showInformationProfessional!: Professional[];
  reasignProfessionals!: Professional[];
  getProfessionalNit!: string;
  getProfessionalNitReassign!: string;
  getIdCases: Param[] = []
  getProfess: UnassignAndReassign[] = []
  UnassignList!: UnassignAndReassign[]
  getProfessional!: ProfessionalGeneral[]
  getProfessionalUnassign!: ProfessionalDesasignar[]
  buttonDesasignar: boolean = false;
  buttonReasignar: boolean = false;
  autocompleteData: any[] = [];
  estructura!: FormStructure;
  validateActionsDefault!: Button[];
  mostrar: boolean = false;
  constructor(
    private servicesComponentUnassign: DesasignacionCasosService,
    private dialogService: DialogService,
    private perfilService: PerfilService,
    private serviceLoggin: UserService
  ) {
    /**
     * @description Creacion de formulario por medio de la instruccion FormGroup
     * @author alfvillag (Luis Villagrán)
     * @since 16/06/2022
     */
    this.generalFormGroup = new FormGroup({
      idCaso: new FormControl(''),
      nitProfesinal: new FormControl(''),
      nitContribuyente: new FormControl('')
    });

    this.validateActionsDefault = [
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
    ];
  }
  ngOnInit(): void {

    this.dataProfessionalInformationReassign.data = []
    this.servicesComponentUnassign.getProfetionals().toPromise().then(res => {
      if(res.length > 0){
        console.log(res);
        
        this.autocompleteData = res;
      }
      else{
        this.dialogService.show({
          title: 'No se encontraron profesionales',
          text: 'No se encontraron profesionales para reasignar',
          icon: 'warning',
        })

        this.generalFormGroup.get('nitProfesinal')?.disable();
        this.generalFormGroup.get('nitContribuyente')?.disable();
        this.generalFormGroup.get('idCaso')?.disable();
      }
      
      //console.log(res);
    })
    this.buttonDesasignar = false
  }
  @ViewChild('Mat1') set matPaginatorUnassing(mp: MatPaginator) {
    this.dataProfessionalInformationUnassign.paginator = mp;

  }
  @ViewChild('Mat2') set matPaginator(mp: MatPaginator) {
    this.dataProfessionalInformationReassign.paginator = mp;
  }


  search() {
    this.mostrar = true;
    /* aqui tenemos el metodo para buscar */
  }

  actionRevision(action: Number) {
    //console.log(this.selectionProfessionalReassign.selected);

    if (this.selectionProfessionalReassign.selected.length == 0) {
      this.dialogService.show({
        title: 'Acción no permitida',
        text: 'Debe seleccionar al menos un caso para desasignar',
        icon: 'warning',
        disableClose: true,
        showCloseButton: true
      })

    } else {
      //console.log(this.selectionProfessionalReassign.selected);

      const options = this.autocompleteData.filter(collab => !this.selectionProfessionalReassign.selected.map(k => k.nitProfesional).includes(collab.nit));

      this.estructura = new FormStructure().apply({
        appearance: 'standard',
        globalValidators: Validators.required,
        showTitle: false,
        nodes: [
          new Dropdown('profesional', 'Profesional', options.map(k => {
            return new OptionChild(k.nombre, k.nit)
          })).apply({
            singleLine: true, maxCharCount: 400
          })
        ],
        validateActions: this.validateActionsDefault
      });
      switch (action) {
        case 2:
          this.dialogService.show({
            title: `Reasignar Casos`,
            formStructure: this.estructura,
            showCancelButton: false,
            showConfirmButton: false,
            disableClose: false,
          }).then(result => {
            if (result !== 'primary') return;
            //console.log("entro");
            let nitNuevo: any = this.estructura.getValue()
            let formulario: UnassignAndReassign[] = []
            let idCasos: Param[] = []
            this.selectionProfessionalReassign.selected.forEach(element => {
              formulario.push({ idCaso: element.idCaso, nitAnterior: element.nitProfesional + "", nit: nitNuevo.profesional })
              idCasos.push({ idCaso: element.idCaso });
            });
            //console.log(formulario);
            //console.log(idCasos);
            this.servicesComponentUnassign.ReassignColaborator(idCasos, formulario).toPromise().then(res => {
              this.dialogService.show({
                title: 'Reasignación exitosa',
                text: 'Los casos se han reasignado correctamente',
                icon: 'success',
                disableClose: true,
                showCloseButton: true
              })
              this.selectionProfessionalReassign.clear();
              this.getCaseByCollaborators();
            })
          });
          break;
      }
    }
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogService.close('primary');
    } else {
      this.dialogService.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }





  /**
  * @description Metodo que obtiene el nombre y nit del profesional que tiene acargo un Autorizador o Aprobador.
  * @author alfvillag (Luis Villagrán)
  * @since 15/06/2022
  */
  /* getProfessionalByBossPerfil(professionalBoolean: boolean) {
    this.servicesComponentUnassign.getProfetionals().toPromise().then(res => {
      //console.log(this.generalFormGroup.get('professional')?.value);
      if (!professionalBoolean) {
        this.showInformationProfessional = res
      }
      else {
        this.reasignProfessionals = res.filter(item => item.nitContribuyente != this.generalFormGroup.get('professional')?.value)

        if (this.generalFormGroup.get('profesionalReassign')?.disabled) {
          this.generalFormGroup.get('profesionalReassign')?.enable()
        }

        if (this.reasignProfessionals.length == 0) {
          this.reasignProfessionals = [{
            nombreContribuyente: "No hay profesionales para reasignar",
            idRol: 0,
            nitContribuyente: "",
            nombreEstado: "",
          }]

          this.generalFormGroup.get('profesionalReassign')?.disable()
        }
      }

      //console.log(res)
    })
  } */
  /**
  * @description Metodo que trae la información de un profesional escogido previamente. 
  * @author alfvillag (Luis Villagrán)
  * @since 15/06/2022
  */
  getProfessionalGeneral(event: any) {
    //console.log(event);

    this.getProfessionalNit = event
    this.viewUnassign = false;
    this.getUnassignProfessional()
    if (this.numerito == 1) {
      this.master(true);
    } else {
      /* this.getProfessionalByBossPerfil(true) */
    }
  }
  /**
    * @description Metodo que obtiene la información del profesional para poder desasignar.
    * @author alfvillag (Luis Villagrán)
    * @since 15/06/2022
    */
  getUnassignProfessional() {

    this.servicesComponentUnassign.getProfessionalUnassign(this.getProfessionalNit).toPromise().then(async res => {
      //console.log(res)
      this.getProfessionalUnassign = res
      if (this.getProfessionalUnassign.length == 0) {

        this.dataProfessionalInformationUnassign.data = []
        this.dataProfessionalInformation.data = []
        await this.dialogService.show({
          title: 'Profesional',
          text: 'Este profesional no tiene casos asignados',
          icon: 'warning',
          disableClose: true,
          showCloseButton: true
        })
      } else {
        this.viewUnassign = true
        this.dataProfessionalInformationUnassign.data = res
        this.buttonDesasignar = true
      }
    })
    this.getReassignProfessional()
  }
  /**
    * @description Metodo que obtiene la información del profesional para poder reasignar.
    * @author alfvillag (Luis Villagrán)
    * @since 15/06/2022
    */
  getReassignProfessional() {
    this.servicesComponentUnassign.getProfessionalReasign(this.getProfessionalNit).toPromise().then(res => {


      this.dataProfessionalInformationReassign.data = res.map(t => {
        const impuesto = t.impuesto ? JSON.parse(t.impuesto) : [];
        //console.log(impuesto);

        t.nombreImpuesto = impuesto.map((t: any) => t.nombreimpuesto).join(', ');
        return t
      })
    })
  }
  closeUnassign() {
    // this.getProfessionalGeneral(this.getProfessionalNit)
    this.viewUnassign = false;
  }
  saveUnassignCasestoProfessional() {
    if (this.selectionProfessionalUnassign.selected.length == 0) {
      this.dialogService.show({
        title: 'Acción no permitida',
        text: 'Debe seleccionar al menos un caso para desasignar',
        icon: 'warning',
        disableClose: true,
        showCloseButton: true
      })

    } else {
      this.dialogService.show({
        title: 'Desasignación de Casos',
        text: `¿Está seguro de desasignar este caso del colaborador?`,
        icon: 'question',
        showCancelButton: true,
        disableClose: true,
        showCloseButton: true
      }).then(async resultado => {
        if (resultado == 'primary') {
          this.selectionProfessionalUnassign.selected.forEach(Unassign => {
            this.getIdCases.push({
              idCaso: Unassign.idCaso
            })
          })
          const UnassignBody: UnassignAndReassign = {
            nit: this.getProfessionalNit,
            nitAnterior: this.getProfessionalNit
          }
          if (UnassignBody == null) {
            //console.log("")
          } else {
            this.servicesComponentUnassign.UnassignColaborator([...new Set(this.getIdCases)], UnassignBody).toPromise().then(res => {
              //console.log(res)
              this.viewUnassign = true
              this.getUnassignProfessional()
              this.dialogService.showSnackBar({
                title: 'IFI-200',
                text: `Se desasigno el caso de forma correcta.`,
                icon: 'success',
                duration: 3000
              })
            })
          }
        }
      })
    }

    /*     this.selectionProfessionalUnassign.selected.forEach(Unassign => {
          this.getIdCases.push({
            idCaso: Unassign.idCaso
          })
        })
        const UnassignBody: UnassignAndReassign = {
          nit: this.getProfessionalNit,
          nitAnterior: this.getProfessionalNit
        }
        this.servicesComponentUnassign.UnassignColaborator(this.getIdCases, UnassignBody).toPromise().then(res => {
          //console.log(res)
          this.servicesComponentUnassign.getProfessionalReasign(this.getProfessionalNit).toPromise().then(res => {
            //console.log(res)
            this.dataProfessionalInformationReassign.data = res
          })
        }) */
  }

  getIdCasesForUnassign(event: string) {
    this.getProfessionalNitReassign = event
  }

  saveReassignCasestoProfessional() {
    //console.log(this.selectionProfessionalReassign.selected);

    if (this.selectionProfessionalReassign.selected.length == 0) {
      this.dialogService.show({
        title: 'Acción no permitida',
        text: 'Debe seleccionar al menos un caso para reasignar',
        icon: 'warning',
        disableClose: true,
        showCloseButton: true
      })

    } else {
      this.dialogService.show({
        title: 'Reasignación de Casos',
        text: `¿Esta seguro de reasignar este caso del colaborador?`,
        icon: 'question',
        showCancelButton: true,
        disableClose: true,
        showCloseButton: true
      }).then(resultado => {
        //console.log(resultado);

        if (resultado == 'primary') {
          this.selectionProfessionalReassign.selected.forEach(Reassign => {
            this.getIdCases.push({
              idCaso: Reassign.idCaso
            })
          })
          //linea de codigo que se debe recolectar una cantidad de listas y mandarla. por el momento solo captura y remplaza la que estaba antes.
          // ver la posibilidad de tener la lista y mandarlo, el microservicio ya funciona.
          this.getProfess = [{
            nit: this.getProfessionalNitReassign,
            nitAnterior: this.getProfessionalNit
          }]
          //console.log(this.getIdCases)
          //console.log(this.getProfess)
          this.servicesComponentUnassign.ReassignColaborator(this.getIdCases, this.getProfess).toPromise().then(res => {
            //console.log(res)
            this.servicesComponentUnassign.getProfessionalReasign(this.getProfessionalNit).toPromise().then(res => {
              //console.log(res)
              this.dataProfessionalInformationReassign.data = res
              this.selectionProfessionalReassign.clear()
              this.dialogService.showSnackBar({
                title: 'IFI-200',
                text: `Se reasigno el caso de forma correcta.`,
                icon: 'success',
                duration: 5000
              })
            })
          })
        }
        if (resultado == 'cancel') {
          this.dialogService.closeAll()
        }

      })
      /* this.selectionProfessionalReassign.selected.forEach(Reassign => {
        this.getIdCases.push({
          idCaso: Reassign.idCaso
        })
      })
      //linea de codigo que se debe recolectar una cantidad de listas y mandarla. por el momento solo captura y remplaza la que estaba antes.
      // ver la posibilidad de tener la lista y mandarlo, el microservicio ya funciona.
      this.getProfess = [{
        nit: this.getProfessionalNitReassign,
        nitAnterior: this.getProfessionalNit
      }]
      //console.log(this.getIdCases)
      //console.log(this.getProfess)
      this.servicesComponentUnassign.ReassignColaborator(this.getIdCases, this.getProfess).toPromise().then(res => {
        //console.log(res)
        this.servicesComponentUnassign.getProfessionalReasign(this.getProfessionalNit).toPromise().then(res => {
          //console.log(res)
          this.dataProfessionalInformationReassign.data = res
        })
      }) */
    }
  }

  isAllSelectedCasesForReassign() {
    const numSelected = this.selectionProfessionalReassign.selected.length;
    const numRows = this.dataProfessionalInformationReassign.data?.length;
    return numSelected === numRows;
  }

  masterToggleCasesForReassign() {

    this.isAllSelectedCasesForReassign()
      ? this.selectionProfessionalReassign.clear()
      : this.dataProfessionalInformationReassign.data?.forEach((row) =>
        this.selectionProfessionalReassign.select(row)
      );
  }

  isAllSelectedCasesForUnassign() {

    const numSelected = this.selectionProfessionalUnassign.selected.length;
    const numRows = this.dataProfessionalInformationUnassign.data?.length;
    return numSelected === numRows;
  }

  masterToggleCasesForUnassign() {

    this.isAllSelectedCasesForUnassign()
      ? this.selectionProfessionalUnassign.clear()
      : this.dataProfessionalInformationUnassign.data?.forEach((row) =>
        this.selectionProfessionalUnassign.select(row)
      );
  }

  master(professionalBoolean: boolean) {
    this.servicesComponentUnassign.getMaster().toPromise().then(res => {
      //console.log(this.generalFormGroup.get('professional')?.value);
      if (!professionalBoolean) {
        this.showInformationProfessional = [...new Set(res)]
      }
      else {
        this.reasignProfessionals =
          [...new Set(res.filter(item => item.nitContribuyente != this.generalFormGroup.get('professional')?.value))]
        if (this.generalFormGroup.get('profesionalReassign')?.disabled) {
          this.generalFormGroup.get('profesionalReassign')?.enable()
        }

        if (this.reasignProfessionals.length == 0) {
          this.reasignProfessionals = [{
            nombreContribuyente: "No hay profesionales para reasignar",
            idRol: 0,
            nitContribuyente: "",
            nombreEstado: "",
          }]

          this.generalFormGroup.get('profesionalReassign')?.disable()
        }
      }

      //console.log(res)
    })
  }

  getCaseByCollaborators() {
    this.selectionProfessionalReassign.clear();
    const entidadValue = this.generalFormGroup.getRawValue();
    if (entidadValue.idCaso == "" && entidadValue.nitProfesinal == "" && entidadValue.nitContribuyente == "") {
      this.dialogService.show({
        icon: 'warning',
        title: 'Validar',
        text: 'No ingreso  parametros de los campos indicados, por favor verificar',
        showCloseButton: true,
      })
    } else {
      const params: Param[] = [
        { pNitProfesional: this.generalFormGroup.get('nitProfesinal')?.value },
        { pNitContribuyente: this.generalFormGroup.get('nitContribuyente')?.value },
        { idCaso: parseInt(this.generalFormGroup.get('idCaso')?.value) }
      ]
      this.servicesComponentUnassign.getProfessionalReasign("1", params).toPromise().then(res => {

        //console.log("esto es el resultado de la busqueda");
        //console.log(res);

        if (this.generalFormGroup.get('nitContribuyente')?.value && this.generalFormGroup.get('nitProfesinal')?.value
          || parseInt(this.generalFormGroup.get('idCaso')?.value) && this.generalFormGroup.get('nitProfesinal')?.value) {
          res = res.filter(item => item.nitProfesional?.match(this.generalFormGroup.get('nitProfesinal')?.value))
        }
        if (this.generalFormGroup.get('nitContribuyente')?.value && parseInt(this.generalFormGroup.get('idCaso')?.value)) {
          res = res.filter(l => l.idCaso == parseInt(this.generalFormGroup.get('idCaso')?.value)).filter(x => x.nitContribuyente.match(this.generalFormGroup.get('nitContribuyente')?.value))
          //console.log("entro");

        }

        this.dataProfessionalInformationReassign.data = parseInt(this.generalFormGroup.get('idCaso')?.value) ? res.filter(k => k.idCaso == parseInt(this.generalFormGroup.get('idCaso')?.value)) :
          this.generalFormGroup.get('nitContribuyente')?.value ? res.filter(k => k.nitContribuyente.match(this.generalFormGroup.get('nitContribuyente')?.value)) : res

        if (this.dataProfessionalInformationReassign.data.length == 0) {
          this.dialogService.showSnackBar({
            title: 'IFI-200',
            text: `No se encontraron casos para desasignar.`,
            icon: 'success',
            duration: 5000
          })
          this.dataProfessionalInformationReassign.data = []
        }
      })
    }
  }

}