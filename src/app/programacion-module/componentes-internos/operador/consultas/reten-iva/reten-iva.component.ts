import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-reten-iva',
  templateUrl: './reten-iva.component.html',
  styleUrls: ['./reten-iva.component.css']
})


export class RetenIVAComponent implements OnInit {

  @Input('nit') NIT!: string;//VARIABLE NIT QUE SE RECIBE DEL COMPONENTE PADRE


  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.retenIVA.paginator = mp1;
  }

  retenciones = [
    { codigo: 1, nombre: "IVA" },
  ];

  estados = [
    { codigo: "", nombre: "TODOS" },
    { codigo: "IMPRESA", nombre: "IMPRESA" },
    { codigo: "ANULADA", nombre: "ANULADA" },
    { codigo: "IMPRESA/ASIGNADA", nombre: "IMPRESA/ASIGNADA" },
    { codigo: "IMPRESA/PAGADA", nombre: "IMPRESA/PAGADA" },

  ];

  regimenes = [
    { codigo: 1, nombre: "TODOS" },
    { codigo: 2, nombre: "PEQUEÑO CONTRIBUYENTE" },
    { codigo: 3, nombre: "GENERAL" },
    { codigo: 4, nombre: "AGROPECUARIO" },
  ];

  tipoExcel = [
    { codigo: 1, nombre: "CONSOLIDADO" },
    { codigo: 2, nombre: "DETALLADO" },
  ];


  retenIVA = new MatTableDataSource();
  displayedColumns: string[] = [
    'seleccion',
    'nit',
    'nombreRetenido',
    'cantidadFactura',
    'concepto',
    'constancia',
    'fechaConstancia',
    'estado',
    'totalFactura',
    'importeNeto',
    'afectoRetencion',
    'retencion',
    //'accion'
  ];

  /*******************************VARIABLES********************************/
  generalFormGroup!: FormGroup;
  claveResumen!: string;
  retencionesTotal!: Contribuyente.RetenIVATotalResponse
  retencion!: Contribuyente.RetenIVAParentResponse
  listRetention = new Array;
  respuestaExcel!: Contribuyente.ExcelMasivoRespuesta
  selection = new SelectionModel<Contribuyente.RetenIVAResponse>(true, []);
  totalConstancias!: number;
  totalPaginas: number = 0;
  numeroPagina: number = 0;
  contadorBusqueda: number = 0;
  mostrar = false;
  retenUser!: Contribuyente.RetenIVAUserResponse[]
  prueba!: Contribuyente.RetenIVAUserResponse;
  disableNext = true;
  dateActual = new Date();
  dateActual2 = new Date();
  btnFirst: boolean = false;
  btnBack: boolean = false;
  btnNext: boolean = false;
  btnLast: boolean = false;
  btnAll: boolean = false;



  constructor(private contribuyenteService: ContribuyenteService,
    private dialogService: DialogService) {
    this.claveResumen = " ";
  }

  ngOnInit() {
    this.generalFormGroup = new FormGroup({
      retencion: new FormControl('', Validators.required),
      periodoDel: new FormControl('', Validators.required),
      periodoAl: new FormControl('', Validators.required),
      estado: new FormControl(''),
      regimen: new FormControl('', Validators.required),
      tipoExcel: new FormControl('', Validators.required),
      nitRetenido: new FormControl(''),
      constancia: new FormControl(''),
    });
    this.getUserByNit()//inicia el metodo que obtiene el usuario por el nit

  }

  /**
     * @description ***************Metodo para obtener usuario por medio de nit*****************
     * @author Jamier Batz (ajsbatzmo)
     * @since 10/07/2022
     */
  async getUserByNit() {
    console.log('NIT: ' + this.NIT)
    if (this.NIT == undefined) {
      this.dialogService.show({
        title: 'Validar NIT',
        text: `El NIT ingresado no es valido, por favor verificar.`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    } else {
      //constante de nit para mandar al servicio de reten iva user que traera el usuario del nit
      const RetenIVAUser: Contribuyente.RetenIVAUser = {
        nit: this.NIT
      }
      //servicio que devuelve info del usuario en base al nit
      this.contribuyenteService.getRetenIVAUser(RetenIVAUser).toPromise().then(res => {
        console.log(res)
        if (res.length == 0) {
          this.dialogService.show({
            title: 'Registro no encontrado',
            text: `El NIT ingresado no cuenta con registros.`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          })
        } else {
          this.retenUser = res
          console.log(this.retenUser)
        }
      }).catch(error => {
        console.log(error)
      });
    }
  }

  /**
      * @description ***************Funcion para obtener registros de retenciones*****************
      * @author Jamier Batz (ajsbatzmo)
      * @since 10/07/2022
      */
  async getRetention() {
    try {

      this.listRetention = []//limpia la lista antes de hacer una nueva busqueda
      this.mostrar = true

      //se debe de crear primero la constante de constancias que se enviara como objeto en el servicio para que devuelva el total de registros
      //de retenciones que tiene el agente retenedor*/
      const constanciasTotal: Contribuyente.RetenIVATotal = {//constante de retenciones totales para setear datos desde el formulario
        nitAgenteRetenedor: this.NIT,
        fechaInicio: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
        fechaFin: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
        nitRetenido: this.generalFormGroup.value.nitRetenido,
        estadoRetencion: this.generalFormGroup.value.estado,
        codigoEstado: " ",
        numeroConstancia: this.generalFormGroup.value.constancia,
        limite: "100",
        clavePaginaSiguiente: "",
        claveResumen: "",
        usuario: this.retenUser.pop()?.usuario!,
        concepto: this.generalFormGroup.value.regimen.nombre,
        fr: " ",
        tipo: this.generalFormGroup.value.retencion,
        codigoRenta: 0,
      };
      console.log(constanciasTotal)

      //Luego se ejecuta el servicio que trae la respuesta de los totales
      await this.contribuyenteService.getRetenIVATotal(constanciasTotal).toPromise().then(res => {
        console.log(res)
        this.retencionesTotal = res;
        this.totalConstancias = res.total;
        this.totalPaginas = Math.ceil(this.totalConstancias / 100)
      })
      console.log(this.retencionesTotal.claveResumen)///clave resumen de retenciones totales
      if (this.totalConstancias < 100) {
        this.btnNext = true
        this.btnAll = true
        this.btnBack = true
        this.btnFirst = true
        this.btnLast = true
      } else {
        this.btnNext = false
        this.btnAll = false
        this.btnBack = true
        this.btnFirst = true
        this.btnLast = true
      }
      if (this.totalConstancias == 0) {//valida si no hay constancias no realiza la siguiente consulta
        this.numeroPagina = 0
        this.dialogService.show({
          title: 'Registro no encontrado',
          text: `No existen registros para la consulta realizada`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: true
        })
      } else {
        this.numeroPagina = 1
        //Posterior se crea la constante de constancias que se envia como objeto al servicio para que retorne los primeros 100 registros
        //de retenciones 
        const constancias: Contribuyente.RetenIVA = {
          nitAgenteRetenedor: this.NIT,
          fechaInicio: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
          fechaFin: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
          nitRetenido: this.generalFormGroup.value.nitRetenido,
          estadoRetencion: this.generalFormGroup.value.estado,
          codigoEstado: " ",
          numeroConstancia: this.generalFormGroup.value.constancia,
          limite: "100",
          claveResumen: this.retencionesTotal.claveResumen,//se asigna la clave resumen obtenida de retenciones totales 
          usuario: this.retenUser.pop()?.usuario!,
          concepto: this.generalFormGroup.value.regimen.nombre,
          fr: " ",
          tipo: this.generalFormGroup.value.retencion,
          codigoRenta: 0,
        };
        console.log(constancias)

        //Por ultimo se manda el objeto al servicio para que retorne los primeros 100 registros
        this.contribuyenteService.getRetenIVA(constancias).toPromise().then(res => {
          console.log(res)
          this.retenIVA.data = res.data;
          this.retencion = res;
          this.listRetention.push(this.retenIVA.data)
          this.indice = this.listRetention.length - 1
        })
        console.log(this.listRetention)
      }
    } catch (error) {
      console.log(error)
      this.mostrar = false
      this.dialogService.show({
        title: 'Registro no encontrado',
        text: `El NIT ingresado no cuenta con registros.`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    }
  }


  /**
    * @description************** Metodo para obtener los proximos 100 registros de retenciones**************
    * @author Jamier Batz (ajsbatzmo)
    * @since 10/07/2022
    */
  getNewRetention() {
    const constancias: Contribuyente.RetenIVA = {
      nitAgenteRetenedor: this.NIT,
      fechaInicio: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
      fechaFin: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
      nitRetenido: this.generalFormGroup.value.nitRetenido,
      estadoRetencion: this.generalFormGroup.value.estado,
      codigoEstado: " ",
      numeroConstancia: this.generalFormGroup.value.constancia,
      limite: "100",
      claveResumen: this.retencion.claveResumenPaginaSiguiente,//se asigna la clave resumen obtenida de retencion
      usuario: this.retenUser.pop()?.usuario!,
      concepto: this.generalFormGroup.value.regimen.nombre,
      fr: " ",
      tipo: this.generalFormGroup.value.retencion,
      codigoRenta: 0,
    };
    console.log(constancias)

    this.contribuyenteService.getRetenIVA(constancias).toPromise().then(res => {
      console.log(res)
      this.retenIVA.data = res.data;
      this.retencion = res
      this.listRetention.push(this.retenIVA.data)
      this.indice = this.listRetention.length - 1
    })
    if(this.numeroPagina == 1)
    { console.log('entre al if de consulta')
      this.btnFirst = true
      this.btnBack = true
    }else if (this.numeroPagina == this.totalPaginas){
      console.log('entre al else if de consulta')
      this.btnNext = true
      this.btnLast = true
      this.btnAll = true
    }
    console.log(this.listRetention)
  }

  /**
   * @description **************etodo para ir a la primera pagina de 100 retenciones*****************
   * @author Jamier Batz (ajsbatzmo)
   * @since 10/07/2022
   */
  firstRetentions() {
    this.btnNext = false
    this.indice = 0
    console.log(this.indice)
    this.retenIVA.data = this.listRetention[this.indice]
    this.numeroPagina = 1
    if(this.numeroPagina == 1)
    {
      this.btnFirst = true
      this.btnBack = true
      this.btnLast = false
      this.btnAll = false
    }
  }

  /**
    * @description **************Metodo para regresear a las 100 retenciones anteriores*****************
    * @author Jamier Batz (ajsbatzmo)
    * @since 10/07/2022
    */
  indice: number = 0
  previousRetentions() {
    this.btnNext = false
    this.indice = this.indice - 1
    if (this.indice <= -1) {
      console.log('entre al primer if')
      this.indice = 0;
    }
    console.log(this.indice)
    if (this.indice == 0) {
      console.log('entre al segundo if')
      this.numeroPagina = 1
      this.btnBack = true
      this.btnFirst = true
      this.btnLast = false
      this.btnAll = false
    } else {
      console.log('entre al segundo else')
      this.numeroPagina--
      this.btnLast = false
      this.btnAll = false
    }
    this.retenIVA.data = this.listRetention[this.indice]
  }

  /**
    * @description **************Metodo para avanzar a las 100 retenciones siguientes*****************
    * @author Jamier Batz (ajsbatzmo)
    * @since 10/07/2022
    */
  nextRetention() {
    
    if (this.indice == (this.listRetention.length - 1)) {//si el indice llego a tope
      console.log('entre al primer if')
      this.btnNext = true
      if (this.totalConstancias > 100  && this.numeroPagina != this.totalPaginas) {
        console.log('entre al segundo if')
        this.btnNext = false
        this.btnBack = false
        this.btnFirst = false
        this.btnLast = false
        this.numeroPagina++;
        this.getNewRetention();
        this.indice = this.listRetention.length - 1;
      } else {
        console.log('entre al segundo else')
        this.indice = this.listRetention.length - 1;
        this.btnNext = true
        this.btnLast = true
        this.btnAll = true
      }
    } else {
      console.log('entre al primer else')
      this.indice = this.indice + 1
      this.numeroPagina++;
      this.btnNext = false
      this.btnFirst = false
      this.btnBack = false
    }
    if(this.numeroPagina == this.totalPaginas){
      console.log('entre al ultimo if')
      this.btnNext = true
      this.btnLast = true
      this.btnAll = true
    }
    console.log(this.indice)
    this.retenIVA.data = this.listRetention[this.indice]
  }

  /**
     * @description **************Metodo para ir a la ultima pagina de 100 retenciones *****************
     * @author Jamier Batz (ajsbatzmo)
     * @since 10/07/2022
     */
  lastRetention() {
    this.indice = this.listRetention.length - 1
    if(this.indice == (this.listRetention.length - 1))
    {
      console.log('entre al if')
      console.log(this.indice)
      this.btnLast = true
      this.btnBack = false
      this.btnFirst = false

      this.retenIVA.data = this.listRetention[this.indice]
      this.numeroPagina = this.listRetention.length
    }
    if(this.numeroPagina == this.totalPaginas){
      console.log('entre al segundo if')
      this.btnNext = true
    }
  }

  /**
    * @description *************Metodo para generar excel en base a retenciones seleccionadas****************
    * @author Jamier Batz (ajsbatzmo)
    * @since 12/07/2022
    */
  generateExcelMasive() {
    console.log(this.selection.selected)
    console.log(this.selection.selected.length)
    let numSelect = this.selection.selected.length
    if (numSelect == 0) {
      this.dialogService.show({
        title: 'Validar Información',
        text: `No se pudo generar reporte, validar la información seleccionada`,
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      })
    } else {
      this.dialogService.show({
        title: 'Confirmación',
        text: `¿Esta seguro que desea generar el reporte de ${numSelect} constancias?`,
        icon: 'question',
        showCancelButton: true,
        disableClose: true,
        showCloseButton: false
      }).then(result => {
        if (result !== 'primary') return;
        var selectRecords = this.selection.selected//se guarda en variable los registros que se seleccionan en el check
        var listRecords: string[] = []
        var totalFactura: number = 0;
        var totalImporteNeto: number = 0;
        var totalAfectoRetencion: number = 0;
        var totalRetencion: number = 0;

        selectRecords.forEach(record => {//forEach para obtener el numero de constancias y realizar calculos de registros seleccionado
          listRecords.push(record.numeroConstancia)//se insertan las constancias en la lista listRecords
          totalFactura += record.totalFacturas;// se realiza suma de total de facturas
          totalImporteNeto += record.totalImporteNeto;// se realiza suma de importe neto total
          totalAfectoRetencion += record.totalValorAfecto;// se realiza la suma de valor afecto total
          totalRetencion += record.totalRetencion;// se realiza la suma de retenciones total
        })

        const agente: Contribuyente.AgenteExcelMasivo = {
          nit: this.retencion.data.pop()?.nitAgenteRetenedor,
          id_tipo: this.generalFormGroup.value.regimen.codigo,
          nombre_agente: this.retencion.data.pop()?.entidad,
          codigo: " ",
          id_clasificacion: 0,
          nombre_unidad: " ",
          usuario: this.retencion.data.pop()?.usuarioAgenteRetenedor,
          estado: this.retenUser.pop()?.estado!,
          uc: " ",
          fr: " ",
          independiente: " ",
          manual: " ",
          nombre_tipo: this.retencion.data.pop()?.tipoAgenteRetencion,
          fecha_ini_retencion: " ",
          clasiRtu: "EG",
        }

        const excelMasivo: Contribuyente.ExcelMasivo = {
          cantSelec: listRecords.length.toString(),
          tipoDeUsuarioE: this.retencion.data.pop()?.entidad,
          unidadE: " ",
          tipoAgenteE: this.retencion.data.pop()?.tipoAgenteRetencion,
          codigoEstadoE: " ",
          nitAgentenRetencionE: this.retencion.data.pop()?.nitAgenteRetenedor,
          nombreAgenteRetencionE: this.retencion.data.pop()?.entidad,
          usuarioE: this.retencion.data.pop()?.usuarioAgenteRetenedor,
          fechaDelEx: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
          fechaAlEx: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
          estadoE: "",
          concepto: this.generalFormGroup.value.regimen.nombre,
          totalTotalFactura: totalFactura.toString(),
          totalImporteNeto: totalImporteNeto.toString(),
          totalAfectoRetencion: totalAfectoRetencion.toString(),
          totalRetencion: totalRetencion.toString(),
          totalTotalRentaImponible: "0.00",
          usuario: this.retencion.data.pop()?.usuarioAgenteRetenedor,
          registrosSinFEL: 0,
          agente: agente,//constante agente: Contribuyente.AgenteExcelMasivo
          tipoExcel: this.generalFormGroup.value.tipoExcel,
          varModoReg: this.generalFormGroup.value.retencion,//VARIABLE FIJA (1=IVA)
          constanciasGE: listRecords,//lista de registros insertados mediante el checbox
          usrAdmin: false,
        }

        try {
          this.contribuyenteService.getExcelMasive(excelMasivo).toPromise().then(res => {
            console.log(res)
            this.dialogService.show({
              title: 'Reporte Generado',
              text: `${res.resultado}`,
              icon: 'success',
              showCancelButton: false,
              disableClose: true,
              showCloseButton: false
            })
          })
        } catch (error) {
          console.error(error)
          this.dialogService.show({
            title: 'Reporte no Generado',
            text: `No se pudo generar reporte, verifique la informacion ingresada`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          })
        }
      });
    }
  }

  /**
    * @description************** Metodo para generar excel masivo en base a retenciones seleccionadas************
    * @author Jamier Batz (ajsbatzmo)
    * @since 12/07/2022
    */
  generateExcelMasiveTotal() {
    console.log(this.generalFormGroup.value.regimen.nombre)
    this.dialogService.show({
      title: 'Confirmación',
      text: `¿Esta seguro que desea generar el reporte de ${this.totalConstancias} constancias?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: false
    }).then(async result => {
      if (result !== 'primary') return;
      var retenIvaResponse: Contribuyente.RetenIVAResponse[] = []
      var listRecords: string[] = []
      var totalFactura: number = 0;
      var totalImporteNeto: number = 0;
      var totalAfectoRetencion: number = 0;
      var totalRetencion: number = 0;

      const constancias: Contribuyente.RetenIVA = {
        nitAgenteRetenedor: this.NIT,
        fechaInicio: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
        fechaFin: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
        nitRetenido: this.generalFormGroup.value.nitRetenido,
        estadoRetencion: this.generalFormGroup.value.estado,
        codigoEstado: " ",
        numeroConstancia: this.generalFormGroup.value.constancia,
        limite: "100000000",
        claveResumen: " ",//se asigna la clave resumen obtenida de retenciones totales 
        usuario: this.retenUser.pop()?.usuario!,
        concepto: this.generalFormGroup.value.regimen.nombre,
        fr: " ",
        tipo: this.generalFormGroup.value.retencion,
        codigoRenta: 0,
      };
      console.log(constancias)

      //Por ultimo se manda el objeto al servicio para que retorne los registros
      await this.contribuyenteService.getRetenIVA(constancias).toPromise().then(res => {
        console.log(res)
        this.retencion = res
        retenIvaResponse = res.data;
      })

      retenIvaResponse.forEach(record => {//forEach para obtener el numero de constancias y realizar calculos de registros seleccionado
        listRecords.push(record.numeroConstancia)//se insertan las constancias en la lista listRecords
        totalFactura += record.totalFacturas// se realiza suma de total de facturas
        totalImporteNeto += record.totalImporteNeto// se realiza suma de importe neto total
        totalAfectoRetencion += record.totalValorAfecto// se realiza la suma de valor afecto total
        totalRetencion += record.totalRetencion// se realiza la suma de retenciones total
      })

      console.log(listRecords.length.toString())
      console.log(listRecords)
      console.log(totalFactura)
      console.log(totalImporteNeto)
      console.log(totalAfectoRetencion)
      console.log(totalRetencion)

      const agente: Contribuyente.AgenteExcelMasivo = {
        nit: this.retencion.data.pop()?.nitAgenteRetenedor,
        id_tipo: this.generalFormGroup.value.regimen.codigo,
        nombre_agente: this.retencion.data.pop()?.entidad,
        codigo: " ",
        id_clasificacion: 0,
        nombre_unidad: " ",
        usuario: this.retencion.data.pop()?.usuarioAgenteRetenedor,
        estado: this.retenUser.pop()?.estado!,
        uc: " ",
        fr: " ",
        independiente: " ",
        manual: " ",
        nombre_tipo: this.retencion.data.pop()?.tipoAgenteRetencion,
        fecha_ini_retencion: " ",
        clasiRtu: "EG",
      }

      const excelMasivo: Contribuyente.ExcelMasivo = {
        cantSelec: this.totalConstancias.toString(),
        tipoDeUsuarioE: this.retencion.data.pop()?.entidad,
        unidadE: " ",
        tipoAgenteE: this.retencion.data.pop()?.tipoAgenteRetencion,
        codigoEstadoE: " ",
        nitAgentenRetencionE: this.retencion.data.pop()?.nitAgenteRetenedor,
        nombreAgenteRetencionE: this.retencion.data.pop()?.entidad,
        usuarioE: this.retencion.data.pop()?.usuarioAgenteRetenedor,
        fechaDelEx: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
        fechaAlEx: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
        estadoE: "",
        concepto: this.generalFormGroup.value.regimen.nombre,
        totalTotalFactura: totalFactura.toString(),
        totalImporteNeto: totalImporteNeto.toString(),
        totalAfectoRetencion: totalAfectoRetencion.toString(),
        totalRetencion: totalRetencion.toString(),
        totalTotalRentaImponible: "0.00",
        usuario: this.retencion.data.pop()?.usuarioAgenteRetenedor,
        registrosSinFEL: 0,
        agente: agente,
        tipoExcel: this.generalFormGroup.value.tipoExcel,
        varModoReg: this.generalFormGroup.value.retencion,//VARIABLE FIJA (1=IVA)
        constanciasGE: listRecords = [],//inserta nulo, EL SERVICIO INTERPRETA QUE SON TODOS LOS REG
        usrAdmin: false,
      }
      console.log(excelMasivo)

      try {
        this.contribuyenteService.getExcelMasive(excelMasivo).toPromise().then(res => {
          console.log(res)
          this.dialogService.show({
            title: 'Reporte Generado',
            text: `${res.resultado}`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: true
          })
        })
      } catch (error) {
        console.error(error)
        this.dialogService.show({
          title: 'Reporte no Generado',
          text: `No se pudo generar el reporte, verifique la informacion ingresada`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: true
        })
      }
    });
  }

  /**
    * @description************** Metodo para obtener los ultimos 100 registros************
    * @author Jamier Batz (ajsbatzmo)
    * @since 12/07/2022
    */
  getAllRecords() {
    
    var retenIvaResponse: Contribuyente.RetenIVAResponse[] = []
    retenIvaResponse = [];

    const constancias: Contribuyente.RetenIVA = {
      nitAgenteRetenedor: this.NIT,
      fechaInicio: this.generalFormGroup.get('periodoDel')?.value.format('YYYYMMDD'),
      fechaFin: this.generalFormGroup.get('periodoAl')?.value.format('YYYYMMDD'),
      nitRetenido: this.generalFormGroup.value.nitRetenido,
      estadoRetencion: this.generalFormGroup.value.estado,
      codigoEstado: " ",
      numeroConstancia: this.generalFormGroup.value.constancia,
      limite: "1000000000",
      claveResumen: "",
      usuario: this.retenUser.pop()?.usuario!,
      concepto: this.generalFormGroup.value.regimen.nombre,
      fr: " ",
      tipo: this.generalFormGroup.value.retencion,
      codigoRenta: 0,
    };

    /**Por ultimo se manda el objeto al servicio para que retorne los primeros 100 registros */
    this.contribuyenteService.getRetenIVA(constancias).toPromise().then(res => {
      retenIvaResponse = res.data
      console.log(retenIvaResponse)
      console.log(retenIvaResponse.slice(-100, retenIvaResponse.length))
      this.retenIVA.data = retenIvaResponse.slice(-100, retenIvaResponse.length)//se obtiene los ultimos 100 registros
      this.numeroPagina = this.totalPaginas//se iguala el numero de pagina al total de paginas
    })
    this.btnAll = true
    this.btnLast = true
    this.btnNext = true
    this.btnBack = false
    this.btnFirst = false
  }
}
