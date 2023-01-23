import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import * as moment from 'moment';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

/**
     * @description COMPONENTE HIJO PARA MOSTRAR LOS CONVENIOS DE PAGO DEL CONTRIBUYENTE
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
@Component({
  selector: 'app-convenio-pago',
  templateUrl: './convenio-pago.component.html',
  styleUrls: ['./convenio-pago.component.css']
})
export class ConvenioPagoComponent implements OnInit {

  @Input('nit') NIT!: string;//VARIABLE NIT QUE SE RECIBE DEL COMPONENTE PADRE

  //****************TABLA RESUMEN**************** */
  paymentAgreementSummary = new MatTableDataSource();
  displayedColumnsSummary: string[] = [
    'registro',
    'montoAutorizado',
    'montoCuotas',
    'saldoTotal',];

  //****************TABLA CONVENIOS DE PAGO**************** */
  paymentAgreementSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'formulario',
    'expediente',
    'estado',
    'fecha',
    'total',
    'plazo',
    'cuotas',
    'monto',
    'saldo',
    'accion'];

  mostrarTablaPadre = true;

  //****************TABLA DETALLE RESUMEN**************** */
  paymentAgreementDetailSummary = new MatTableDataSource();
  displayedColumnsDetailSummary: string[] = [
    'totalAutorizadoDetalle',
    'cuotasAutorizadasDetalle',
    'cuotasCanceladasDetalle',
    'montoCuotasPagadas',
    'saldoTotal',];

  //****************TABLA DETALLE CONVENIOS DE PAGO**************** */
  detailDataSource = new MatTableDataSource();
  displayedColumnsSon: string[] = [
    'cuota',
    'numeroFormulario',
    'fechaRecaudo',
    'impuesto',
    'interes',
    'multaOmision',
    'multaFormal',
    'multaRectificativa',
    'cuotaPagar',
    'saldoPagar',
    'recargoInteres',
    'recargoMora',
    'totalRecargo',
    'totalPagado'];

  mostrarTablaHijo = false;

  FORM!: string//VARIABLE GLOBAL FORMULARIO
  DOC!: string//VARIABLE GLOBAL DOCUMENTO

  //***********************VARIABLES TABLA RESUMEN CONVENIO DE PAGO GENERAL************************ */
  registro: number = 0//VARIABLE TOTAL DE REGISTROS
  totalMontoAutorizado: number = 0//VARIABLE MONTO AUTORIZADO
  totalCuotaPagada: number = 0//VARIABLE CUOTA PAGADA
  totalSaldo: number = 0//VARIABLE SALDO TOTAL
  lista: Contribuyente.PaymentAgreementSummary[] = [];// LISTA TIPO INTERFAZ PaymentAgreementSummary

  //***********************VARIABLES TABLA RESUMEN DETALLE CONVENIO DE PAGO************************ */
  totalAutorizadoDetalle: number = 0//VARIABLE GLOBAL TOTAL AHUTORIZADO 
  cuotasAutorizadasDetalle: number = 0//VARIABLE GLOBAL CUOTAS AUTORIZADAS
  cuotasCanceladasDetalle: number = 0//VARIABLE GLOBAL CUOTAS CANCELADAS
  montoCuotasPagadasDetalle: number = 0//VARIABLE GLOGAL MONTO PAGADO
  saldoTotalDetalle: number = 0//VARIBLE GLOBAL SALDO TOTAL
  listaDetalle: Contribuyente.PaymentAgreementDetailSummary[] = [];// LISTA TIPO INTERFAZ PaymentAgreementDetailSummary

  //*************PAGINATOR TABLA CONVENIOS DE PAGO************** */
  @ViewChild('MatPaginator1') set matPaginator(mp1: MatPaginator) {
    this.paymentAgreementSource.paginator = mp1;
  }

  //*************PAGINATOR TABLA DETALLE CONVENIOS DE PAGO************** */
  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.detailDataSource.paginator = mp2;
  }

  constructor(private contribuyenteService: ContribuyenteService,
    private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.registro = 0//VARIABLE TOTAL DE REGISTROS SE VACIA (=0)
    this.totalMontoAutorizado = 0//VARIABLE MONTO AUTORIZADO SE VACIA (=0)
    this.totalCuotaPagada = 0//VARIABLE CUOTA PAGADA SE VACIA (=0)
    this.totalSaldo = 0//VARIABLE SALDO TOTAL SE VACIA (=0)
    this.lista = []//SE VACIA LISTA 
    this.getPaymentAgreementByNit();
  }

  /**
* @description Metodo para obtener convenios de pago del contribuyente por NIT
* @author ajsbatzmo (Jamier Batz)
* @since 01/07/2022
*/
  getPaymentAgreementByNit() {
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
      this.contribuyenteService.getPaymentAgreementByNit(this.NIT).toPromise().then(res => {
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
          this.paymentAgreementSource.data = res.map(k => {
            k.fechaPresentacion = moment(k.fechaPresentacion, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')
            return k;
          });
          this.registro = res.filter(T => T.numeroFormulario).length//CALCULO TOTAL REGISTROS
          res.forEach(total => {
            this.totalMontoAutorizado += total.totalAutorizado//CALCULO TOTAL MONTO AUTORIZADO
            if (total.montoPagado != null) {
              this.totalCuotaPagada += total.montoPagado//CALCULO TOTAL CUOTAS PAGADAS
            }
          })
          this.totalSaldo = this.totalMontoAutorizado - this.totalCuotaPagada;//CALCULO SALDO TOTAL
          this.lista.push({//SE SETEA EN LOS ELEMENTOS DE LA INTERFAZ EL VALOR DEL TOTAL DE LAS VARIABLES
            registros: this.registro,
            totalAutorizado: this.totalMontoAutorizado,
            totalMontoPagado: this.totalCuotaPagada,
            totalSaldo: this.totalSaldo
          })
          this.paymentAgreementSummary.data = this.lista
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }

  /**
  * @description Metodo para obtener detalle de convenios de pago del contribuyente por NIT, FORMULARIO y EXPEDIENTE
  * @author ajsbatzmo (Jamier Batz)
  * @since 01/07/2022
  */
  getPaymentAgreementDetail(pForm: string,
    pDoc: string,
    pMontoAutorizado: number,
    pCuotasAutorizadas: number,
    pCuotasPagadas: number,
    pMontoPagado: number,
    pSaldo: number) {

    this.totalAutorizadoDetalle = pMontoAutorizado;
    this.cuotasAutorizadasDetalle = pCuotasAutorizadas;
    this.cuotasCanceladasDetalle = pCuotasPagadas;
    this.montoCuotasPagadasDetalle = pMontoPagado,
      this.saldoTotalDetalle = pSaldo;

    this.listaDetalle.push({//SE SETEA EN LOS ELEMENTOS DE LA INTERFAZ EL VALOR DEL TOTAL DE LAS VARIABLES
      totalAutorizadoDetalleI: this.totalAutorizadoDetalle,
      cuotasAutorizadasDetalleI: this.cuotasAutorizadasDetalle,
      cuotasCanceladasDetalleI: this.cuotasCanceladasDetalle,
      montoCuotasPagadasDetalleI: this.montoCuotasPagadasDetalle,
      saldoTotalDetalleI: this.saldoTotalDetalle,
    })

    this.paymentAgreementDetailSummary.data = this.listaDetalle
    this.FORM = pForm
    this.DOC = pDoc
    this.contribuyenteService.getPaymentAgreementDetailByNitFormAndDoc(this.NIT, this.FORM, this.DOC).toPromise().then(res => {
      this.detailDataSource.data = res;
      console.log(this.detailDataSource)
    })

    this.mostrarTablaPadre = false;//OCULTAR TABLA CONVENIOS DE PAGO
    this.mostrarTablaHijo = true;//MOSTRAR TABLA DETALLE CONVENIOS DE PAGO
  }

  /**
* @description Metodo para retornar a la tabla general donde se muestran los convenios de pago
* @author ajsbatzmo (Jamier Batz)
* @since 01/07/2022
*/
  returnMaster() {

    this.ngOnInit();
    this.listaDetalle = [] //LIMPIA LA LISTA DEL RESUMEN DEL DETALLE
    this.mostrarTablaPadre = true;//MOSTRAR TABLA CONVENIOS DE PAGO
    this.mostrarTablaHijo = false;//OCULTAR TABLA DETALLE CONVENIOS DE PAGO
  }

}
