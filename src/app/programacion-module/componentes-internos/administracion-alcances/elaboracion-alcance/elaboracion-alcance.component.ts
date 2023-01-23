
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Button, Dropdown, FormListener, FormStructure, Input, OptionChild } from 'mat-dynamic-form';
import { GetSectionCase, SeccionCaso } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { addProgram } from 'src/app/general-module/componentes-comunes/interfaces/AlcancesInterface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';
import { FiscalProgramInterface } from 'src/app/general-module/componentes-comunes/interfaces/FiscalProgram.interface';

/**
 * @description interfaz que se utiliza en la tabla que muestra la seccion del contribuyente
 * @author alfvillag (Luis Villagran)
 * @since 18/01/2022
 */
export interface Anexos {
  Nseccion: string;
  Dseccion: string;
  comentario: string;
  SCJefe: string;
  Acciones: string;
  Estado: String;

}
/**
  * @description Interfaz para almacenar el campo 'idCasos' receptor del parametro en la ruta. 
  * @author alfvillag (Luis Villagrán)
  * @since 21/01/2022
  */
export interface DialogData {
  idCasos: any;
}
@Component({
  selector: 'app-elaboracion-alcance',
  templateUrl: './elaboracion-alcance.component.html',
  styleUrls: ['./elaboracion-alcance.component.css']
})
export class ElaboracionAlcanceComponent implements OnInit, FormListener {
  programasTipos!: FiscalProgramInterface[]
  DatosComplementarios!: string
  DatosGenerales!: any
  displayedColumns: string[] = ['Nseccion', 'Dseccion', 'comentario', 'SCJefe', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource<any>();
  FormularioComplementario!: any
  /**
   * @description la variable global "idCasos" es un capturador del parametro que se envia por medio del path
   */
  idCasos!: any;
  callback!: FormListener;
  contribuyenteform !: FormGroup
  estructura!: FormStructure
  getSection!: SeccionCaso
  idTipo!: any
  pruebaSeccion!: GetSectionCase[]
  constructor(
    private aRoute: ActivatedRoute,
    public alert: MatDialog,
    private dialog: DialogService,
    private SeccionServicio: AlcancesService,
    private soupService: AlcancesService,
    private utilidades: UtilidadesService,
  ) {
    /**
     * @description función para crear un formulario dinamico que muestre datos en base a un id
     */
    this.contribuyenteform = new FormGroup({
      nit: new FormControl(''),
      contribuyente: new FormControl(''),
      periodo: new FormControl(''),
    })
  }
  ngOnInit(): void {
    /**
      * @description Funcion para capturar el parametro provisto por la ruta, variable receptora 'idCasos', conectado al servicio.. 
      * @author alfvillag (Luis Villagrán)
      * @since 20/01/2022
      */
    this.aRoute.paramMap.subscribe(async res => {
      if (res.has('idCasos')) {
        this.idCasos = res.get('idCasos')
      }
    });
    this.GetSection()
  }
  /**
      * @description Metodo para mostrar las secciones que tiene el contribuyente en base al id capturado en 'idCasos', conectado al servicio.. 
      * @author alfvillag (Luis Villagrán)
      * @since 20/01/2022
      */
  GetSection() {
    this.soupService.getSection(this.idCasos).subscribe(res => {
      if(res[0].comentarioTipo == 158){
        const COMENTARIO_JEFE = res[0].comentarioTipo        
      }else if (res[0].comentarioTipo == 157){
        const COMENTARIO_SUPER = res[0].comentarioTipo
      };
      if(res[1].comentarioTipo == 158){
        const COMENTARIO_JEFE = res[1].comentarioTipo
      }else if (res[1].comentarioTipo == 157){
        const COMENTARIO_SUPER = res[1].comentarioTipo
      }
      if(res.length == 0){
        this.dataSource.data
      }else{
        const jsonSecciones = JSON.parse(res[0].jsonSection)
        res.forEach(seccionJson=> {
          const seccion = jsonSecciones.find((seccion: any) => seccionJson.registro.split(',')?.includes(seccion.tipo.toString()))
          seccion.comentario = seccionJson.comentario

        })
          this.dataSource.data = jsonSecciones
      }
    });
  }
  /**
   * @description Metodo para mostrar los datos del contribuyente en base a un id "idinsumo", conectado al servicio
   * @author alfvillag (Luis Villagran)
   * @since 25/01/2022
   */
  contribuyente() {
    const datePipe = new DatePipe('es')
    this.SeccionServicio.obtenerColaborador(this.idCasos).subscribe(data => {
      this.contribuyenteform.get('nit')?.setValue(data.nit);
      this.contribuyenteform.get('contribuyente')?.setValue(data.contribuyente);
      this.contribuyenteform.get('periodo')?.setValue(`${datePipe.transform(data.periodoDel, 'dd/MM/yyyy')}   al   ${datePipe.transform(data.periodoAl, 'dd/MM/yyyy')}`);
    }
    )
  } 
  /**
    * @description Metodo para eliminar una sección en base al id capturado en la variable 'idCasos', despues de una alerta de confirmación
    * extendiendo del metodo 'EliminarSeccion' del service, conectado al servicio.
    * @author alfvillag (Luis Villagrán)
    * @since 21/01/2022
    */
  openEliminar(element: any) {
    this.dialog.show({
      title: 'Eliminar Seccion',
      text: '“La definición será borrada, ¿Desea continuar?”.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'warn',
      confirmButtonText: 'Si',
      disableClose: true
    }).then((result) => {
      /**
         * @description Esta validación sirve para saber a que tabla se hara la eliminación de la sección
         * @author alfvillag (Luis Villagran)
         * @since 20/01/2022
         */
      if (result == 'primary') {
        if (element.seccionNombre == 'Datos Generales') {
          this.SeccionServicio.EliminarSeccionGenerales(this.idCasos).subscribe(res => {
            //Función que permite recargar la pagina mostrando los cambios realizados por el servicio
            this.utilidades.forcedNavigate(['/programacion/elaboracion/alcance/', this.idCasos])
          }, err => { console.error(err) })
        } else {
          this.SeccionServicio.EliminarSeccion(this.idCasos).subscribe(res => {
            //Función que permite recargar la pagina mostrando los cambios realizados por el servicio
            this.utilidades.forcedNavigate(['/programacion/elaboracion/alcance/', this.idCasos])
          }, err => { console.error(err) })
        }
      }
    })
  }
  /**
   * @description onEvent tiene funcion de mostrar el id de programa una vez se cumpla la condición "if", este metodo desciende de FormListener
   * @author alfvillag (Luis Villagrán)
   * @since 25/01/2022
   * @param id 
   * @param value 
   */
  onEvent(id: string, value: any): void {
    if (id == 'programa') {
    }
  }
  /**
   * @author alfvillag (Luis Villagran)
   * @since 25/01/2022
   * @param actionId 
   */
  onClick(actionId: string): void {
    if (actionId == 'agregarForm') {
      var Complementario = ((this.estructura.getValue<any>()))
      Complementario.tipo = 1
      Complementario.idCaso = parseInt(this.idCasos)
      Complementario.idEstado = 1
      Complementario.Estado = "Activo"
      Complementario.Nseccion = "Datos Complementarios"
      Complementario.Dseccion = "Esta es una seccion de complementarios"
      const lista = [...this.dataSource.data];
      lista.push((Complementario))
      if (lista.find(section => section.tipo == 1)) {
        const section: SeccionCaso = {
          idCaso: this.idCasos,
          jsonSeccion: JSON.stringify(lista),
        }
        this.soupService.createScopeSection(section).subscribe(res => {
          this.GetSection()
        })
      } else {
        const section: SeccionCaso = {
          idCaso: this.idCasos,
          jsonSeccion: JSON.stringify(lista),
        }
        this.soupService.createScopeSection(section).subscribe(res => {
          this.GetSection()
        })
      }
    }
    if (actionId == 'agregarGeneral') {
      var General = ((this.estructura.getValue<any>()));
      General.idCaso = parseInt(this.idCasos)
      General.tipo = 2
      General.idEstado = 1
      General.Estado = "Activo"
      General.Nseccion = "Datos Generales"
      General.Dseccion = "Esta es una seccion de Generales"
      const lista = [...this.dataSource.data];
      lista.push((General))
      if (lista.find(section => section.tipo == 2)) {
        const section: SeccionCaso = {
          idCaso: this.idCasos,
          jsonSeccion: JSON.stringify(lista),
        }
        this.soupService.createScopeSection(section).subscribe(res => {
          this.GetSection()
        })
      } else {
        const section: SeccionCaso = {
          idCaso: this.idCasos,
          jsonSeccion: JSON.stringify(lista),
        }
        this.soupService.createScopeSection(section).subscribe(res => {
          this.GetSection()
        })
      }
    }
    if (actionId == 'agregar') {
      const agregarContribuyente: addProgram = {
        idCaso: (parseInt(this.idCasos)),
        idPrograma: this.estructura.getControlById('programa')?.value,
      }
      //Funcion para agregar contribuyente
      this.soupService.addFiscalProgram(agregarContribuyente, this.idCasos).subscribe(res => {
      });
    }
    if (actionId == 'save') {
      const lista = [...this.dataSource.data];
      const seccion = lista.find(section => section.tipo == this.idTipo);
      seccion.idEstado = this.estructura.getControlById('estado')?.value;
      seccion.Estado = ESTADO_MAP[seccion.idEstado];
      const section: SeccionCaso = {
        idCaso: this.idCasos,
        jsonSeccion: JSON.stringify(lista),
      }
      this.soupService.createScopeSection(section).subscribe(res => {
      })
    }
  }
  /**
   * @description Metodo para crear una seccion de datos Generales
   * @author alfvillag (Luis Villagrán)
   * @since 27/01/2022
   */
  openFormGeneral() {
    //Creación de formulario para agregar utilizando mat-dinamyc-form
    this.estructura = new FormStructure().apply({
      globalValidators: Validators.required,
      appearance: 'standard',
      showTitle: false,
      disableClose: true,
      nodes: [
        new Input('nit', 'Nit'),
        new Input('nombre', 'Nombre/Razón'),
        new Input('periodo', 'Periodo'),
        new Input('impuestos', 'Impuestos'),
        new Input('regimen', 'Régimen'),
        new Input('programa', 'Programa'),
        new Input('plazo', 'Plazo'),
        new Input('iEspecial', 'Información Especial'),
        new Input('eAccionaria', 'Estructura Accionaria'),
        new Input('pContribuyente', 'Participación del Contribuyente'),
        new Input('dNarrativa', 'Descripción Narrativa'),
        new Input('iRelevante', 'Información Relevante'),
        new Input('eSolicitante', 'Ente Solicitante')
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'

        }),
        new Button('agregarGeneral', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.dialog.show({
      width: '1000px',
      height: '500px',
      title: 'FORMULARIO DE DATOS GENERALES',
      text: 'Llene los siguientes campos para crear una sección',
      formStructure: this.estructura,
      showConfirmButton: false,
    });
  }
  /**
     * @description Metodo para crear una seccion de datos Complementarios
     * @author alfvillag (Luis Villagrán)
     * @since 27/01/2022
     */
  openFormComplement() {
    this.estructura = new FormStructure().apply({
      globalValidators: Validators.required,
      appearance: 'standard',
      showTitle: false,
      disableClose: true,
      nodes: [
        new Input('antecedentes', 'Antecedentes'),
        new Input('rAuditorias', 'Resultados Auditorias'),
        new Input('objetivo', 'Objetivo'),
        new Input('inconsistencia', 'Inconsistencia'),
        new Input('hProgramacion', 'Hallazgos Programación'),
        new Input('rFiscalizar', 'Rubros a Fiscalizar'),
        new Input('justificacion', 'Justificación'),
        new Input('pEspecificos', 'Procedimientos Especificos'),
        new Input('territorio', 'Territorio'),
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'

        }),
        new Button('agregarForm', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.dialog.show({
      width: '1000px',
      height: '500px',
      title: 'FORMULARIO DE DATOS COMPLEMENTARIOS',
      text: 'Llene los siguientes campos para crear una sección',
      formStructure: this.estructura,
      showConfirmButton: false,
    });
  }
  openDesasociar() {
    this.dialog.show({
      icon: 'warning',
      title: 'Desasociar Programa',
      text: '¿“Esta seguro de descargar el caso del programa?”',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      disableClose: true,
    }).then((result) => {
      if (result == 'primary') {
        const agregarContribuyente: addProgram = {
          idCaso: (parseInt(this.idCasos)),
          idPrograma: 0,
        }
        //Funcion para desasociar/quitar un programa de la tabla insumos "idinsumo" 
        this.soupService.disassociateFiscalProgram(agregarContribuyente, this.idCasos).subscribe(res => {
        });
      }
    });
  }
  /**
   * @description Metodo para agregar un programa a un insumo
   * @author alfvillag (Luis Villagran)
   * @since 26/01/2022
   */
  openAgregarPrograma() {-
    /**
     * @description Función para obtener los tipos de programas que se encuentran en la base de datos y mostrarla en un dropDown
     * @author alfvillag (Luis Villagran)
     * @since 26/01/2022
     */
    this.soupService.getPrograms(107).subscribe(res => {
      this.programasTipos = res;
      //Creación de formulario para agregar utilizando mat-dinamyc-form
      this.estructura = new FormStructure().apply({
        globalValidators: Validators.required,
        appearance: 'standard',
        showTitle: false,
        disableClose: true,
        nodes: [
          new Dropdown('programa', 'Programas',
            //Funcion para mostrar el tipo de programa, nombre y su valor en id
            this.programasTipos.map((data: any) => new OptionChild(data.nombre, data.idPrograma))
          ).apply({
            action: { callback: this, type: 'change' },
            singleLine: true
          })
        ],
        validateActions: [
          new Button('agregar', 'Agregar contribuyente', {
            callback: this, style: 'primary',
          }).apply({
            validateForm: true,
            icon: 'playlist_add'
          })
        ]
      });
      this.dialog.show({
        title: 'AGREGAR CONTRIBUYENTE A UN PROGRAMA',
        text: 'Seleccione un programa',
        formStructure: this.estructura,
        showConfirmButton: false,
      }).then((result) => {
        if (result == 'primary') {
          this.dialog.show({
            title: 'Agregar a Programa',
            text: '“El contribuyente será incorporado al programa con nombre YY y código de identificación XX, ¿Desea continuar?”',
            icon: 'success',
          });
        }
      })
    });
  }
  /**
   * @description Metodo que genera el formulario para modificar la seccion
   * @author alfvillag (Luis Villagran)
   * @since 26/01/2022
   * @param data 
   */
  openModificar(data: any) {
    this.idTipo = data.tipo
    this.estructura = new FormStructure().apply({
      globalValidators: Validators.required,
      appearance: 'standard',
      style: 'width: 50%',
      showTitle: false,
      disableClose: true,
      nodes: [
        new Dropdown('estado', 'Cambiar estado', [
          { value: 1, title: 'Activo' },
          { value: 2, title: 'Inactivo' }
        ]).apply({
          singleLine: true,
          action: { type: 'change', callback: this }
        })
      ],
      validateActions: [
        new Button('cancel', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('save', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });
    this.dialog.show({
      title: 'MODIFICACION DE SECCION',
      text: 'Llene los siguientes campos para modificar la sección',
      formStructure: this.estructura,
      showConfirmButton: false,
    });
  }
}

const ESTADO_MAP: { [key: number]: string } = {
  1: 'Activo', 2: 'Inactivo'
}