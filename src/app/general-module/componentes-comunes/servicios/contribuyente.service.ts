import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { environment } from 'src/environments/environment';
import { Param } from '../clases/Params';
import { Catalog } from '../interfaces/Catalog.interface';
import { vehiculos } from '../interfaces/Contribuyente';
import { Fel } from '../interfaces/fel.interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ContribuyenteService {

  API_IFI_SIPF = environment.API_IFI_SIPF;

  constructor(
    private generalService: GeneralService
  ) { }

  /**
     * @description Metodo para obtener la información de un contribuyente
     * @author Rudy Culajay (ruarcuse)
     * @since 10/06/2022
     * @param nit Número de Identificación Tributaria
     */
  getGeneralTaxpayerInformation(nit: string): Observable<Contribuyente.Respuesta> {
    return this.generalService.getData<Contribuyente.Respuesta>(`${this.API_IFI_SIPF}/tax/payer/${nit}`);
  }

  /**
     * @description Metodo para obtener la información de un contribuyente (Empresa/Negocio)
     * @author Rudy Culajay (ruarcuse)
     * @since 10/06/2022
     * @param nit Número de Identificación Tributaria (Empresa/Negocio)
     */
  getTypeLegalService(nit: string): Observable<Contribuyente.EntidadJuridica[]> {
    return this.generalService.getData<Contribuyente.EntidadJuridica[]>(`${this.API_IFI_SIPF}/tax/payer/legal/service/${nit}`);
  }

  /**
* @description Método para consultar de vehiculo
* @author agaruanom (Gabriel Ruano)
* @since 30/06/2022
* @param nit indentificador tributario del colaborador
*/
  getVehiclesConsultation(nit: string): Observable<vehiculos[]> {
    return this.generalService.getData<vehiculos[]>(`${this.API_IFI_SIPF}/tax/payer/vehiculos/${nit}`);
  }

  /**
     * @description Metodo para obtener los voncenios de pago del contribuyente
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     * @param nit Número de Identificación Tributario
     */
  getPaymentAgreementByNit(nit: string): Observable<Contribuyente.PaymentAgreement[]> {
    return this.generalService.getData<Contribuyente.PaymentAgreement[]>(`${this.API_IFI_SIPF}/tax/payer/convenio/${nit}`);
  }

  /**
    * @description Metodo para obtener el detalle de los convenios de pago del contribuyente
    * @author Jamier Batz (ajsbatzmo)
    * @since 30/06/2022
    * @param nit Número de Identificación Tributario
    */
  getPaymentAgreementDetailByNitFormAndDoc(pNit: string, pForm: string, pDoc: string): Observable<Contribuyente.PaymentAgreementDetail[]> {
    return this.generalService.getData<Contribuyente.PaymentAgreementDetail[]>(`${environment.API_IFI_SIPF}/tax/payer/convenio/detalle`, [{ pNit: String(pNit) }, { pForm: String(pForm) }, { pDoc: String(pDoc) }]);
  }

  /**
  * @description Metodo para obtener el detalle de los convenios de pago del contribuyente
  * @author Jamier Batz (ajsbatzmo)
  * @since 30/06/2022
  * @param retenIVA cuerpo del servicio
  */
  getRetenIVA(retenIVA: Contribuyente.RetenIVA) {
    return this.generalService.postData<Contribuyente.RetenIVAParentResponse, Contribuyente.RetenIVA>(`${environment.API_IFI_SIPF}/tax/payer/reten/IVA`, retenIVA);
  }

  /**
* @description Metodo para obtener el detalle de los convenios de pago del contribuyente
* @author Jamier Batz (ajsbatzmo)
* @since 30/06/2022
* @param retenIVATotal cuerpo del servicio
*/
  getRetenIVATotal(retenIVATotal: Contribuyente.RetenIVATotal) {
    return this.generalService.postData<Contribuyente.RetenIVATotalResponse, Contribuyente.RetenIVATotal>(`${environment.API_IFI_SIPF}/tax/payer/reten/IVA/total`, retenIVATotal);
  }

  /**
* @description Metodo para generar Excel masivo de registros de retenciones
* @author Jamier Batz (ajsbatzmo)
* @since 30/06/2022
* @param excelMasive cuerpo del servicio
*/
  getExcelMasive(excelMasive: Contribuyente.ExcelMasivo) {
    return this.generalService.postData<Contribuyente.ExcelMasivoRespuesta, Contribuyente.ExcelMasivo>(`${environment.API_IFI_SIPF}/tax/payer/reten/excel/masivo`, excelMasive);
  }

  /**
   * @description Metodo para obtener el detalle de los convenios de pago del contribuyente
   * @author Jamier Batz (ajsbatzmo)
   * @since 30/06/2022
   * @param retenIVAUser cuerpo del servicio
   */
  getRetenIVAUser(retenIVAUser: Contribuyente.RetenIVAUser) {
    return this.generalService.postData<Contribuyente.RetenIVAUserResponse[], Contribuyente.RetenIVAUser>(`${environment.API_IFI_SIPF}/tax/payer/reten/IVA/user`, retenIVAUser);
  }

  /**
   * @description Metodo para obtener el detalle de las compras del contribuyente
   * @author Débora Top (adftopvar)
   * @since 30/06/2022
   * @param body cuerpo del servicio
   */
  getReporteCompras(body: Contribuyente.AsisteLibrosComprasParams) {
    return this.generalService.postData<Contribuyente.AsisteLibrosComprasResponse, Contribuyente.AsisteLibrosComprasParams>(`${environment.API_IFI_SIPF}/tax/payer/asistelibros/purchases`, body)
  }

  /**
   * @description Metodo para obtener el detalle de las compras del contribuyente por medio de un excel
   * @author Débora Top (adftopvar)
   * @since 30/06/2022
   * @param body cuerpo del servicio
   */
  getExcelReporteCompras(body: Contribuyente.AsisteLibrosComprasParams): Observable<Contribuyente.ExcelReporte[]> {
    return this.generalService.postData<Contribuyente.ExcelReporte[], Contribuyente.AsisteLibrosComprasParams>(`${environment.API_IFI_SIPF}/tax/payer/asistelibros/purchases/report`, body)
  }

  /**
   * @description Metodo para obtener el detalle de las ventas del contribuyente
   * @author Débora Top (adftopvar)
   * @since 30/06/2022
   * @param body cuerpo del servicio
   */
  getReporteVentas(body: Contribuyente.AsisteLibrosVentasParams): Observable<Contribuyente.AsisteLibrosVentasResponse> {
    return this.generalService.postData<Contribuyente.AsisteLibrosVentasResponse, Contribuyente.AsisteLibrosVentasParams>(`${environment.API_IFI_SIPF}/tax/payer/asistelibros/sales`, body)
  }

  /**
   * @description Metodo para obtener el detalle de las compras del contribuyente por medio de un excel
   * @author Débora Top (adftopvar)
   * @since 30/06/2022
   * @param body cuerpo del servicio
   */
  getExcelReporteVentas(body: Contribuyente.AsisteLibrosVentasParams): Observable<Contribuyente.ExcelReporte[]> {
    return this.generalService.postData<Contribuyente.ExcelReporte[], Contribuyente.AsisteLibrosVentasParams>(`${environment.API_IFI_SIPF}/tax/payer/asistelibros/sales/report`, body)
  }

  getImportacion(importacionSIVEPA: Contribuyente.ImportacionSIVEPA): Observable<Object[]> {
    return this.generalService.postData<Object[], Contribuyente.ImportacionSIVEPA>(`${environment.API_IFI_SIPF}/tax/payer/importacion/exportacion`, importacionSIVEPA);
  }

  getImportacionDetalle(importacionSIVEPA: Contribuyente.ImportacionSIVEPA): Observable<Object[]> {
    return this.generalService.postData<Object[], Contribuyente.ImportacionSIVEPA>(`${environment.API_IFI_SIPF}/tax/payer/importacion/exportacion/detalle`, importacionSIVEPA);
  }

  /**
 * @description Metodo para obtener los DTE emitidos en base al ´nit´
 * @author Rudy Culajay (ruarcuse)
 * @since 17/06/2022
 * @param queryParameters paramentros de consulta
 */
  getDETFELByTaxPayer(queryParameters: Fel.queryParameters): Observable<Fel.DET> {
    return this.generalService.postData<Fel.DET, Fel.queryParameters>(`${environment.API_IFI_SIPF}/tax/payer/consulta/fel`, queryParameters);
  }
  getDeclarationConsolidate(pNit: string, pAnio: number[], pCodigo: number[]){
    const data: Contribuyente.DeclarationParams = {
      pNit: pNit,
      pAnio: pAnio,
      pCodigo: pCodigo
    }
    return this.generalService.postData<Contribuyente.Declaration[], Object>(`${environment.API_IFI_SIPF}/tax/payer/declaraciones`, data)
  }

  getDeclarationResume(pNit: string, pAnio: number[]): Observable<Contribuyente.DeclarationResume[]>{
    const data: Contribuyente.DeclarationParams = {
      pNit: pNit,
      pAnio: pAnio,
      pCodigo: []
    }
    return this.generalService.postData<Contribuyente.DeclarationResume[], Object>(`${environment.API_IFI_SIPF}/tax/payer/resumen/declaracion`, data)
  }

  /**
     * @description Metodo para obtener la gerencia
     * @author Gabriel Ruano (agaruanom)
     * @since 10/08/2022
     * @param classification .departmentNúmero de Identificación Tributaria
     */
   getGerencyTaxpayerInformation(classification: number, department: number): Observable<Catalog> {
    const params: Param[] =[
      {clasificacion: classification},
      {departamento: department}
    ]
    return this.generalService.getData<Catalog>(`${this.API_IFI_SIPF}/tax/payer/gerency`,params);
  }

   /**
 * @description Metodo para obtener los duas y ducas´
 * @author Jamier Batz (ajsbatzmo)
 * @since 06/09/2022
 * @param queryParameters paramentros de consulta
 */
    getDuasDucas(queryParameters: Contribuyente.ParamsDuasDucas): Observable<Contribuyente.DuasDucasResponse> {
      return this.generalService.postData<Contribuyente.DuasDucasResponse, Contribuyente.ParamsDuasDucas>(`${environment.API_IFI_SIPF}/tax/payer/consulta/dua/duca`, queryParameters);
    }

     /**
   * @description Metodo para obtener datos para la consulta de efa
   * @author Débora Top (adftopvar)
   * @since 01/09/2022
   * @param body cuerpo del servicio
   */

   getEfa(body: Contribuyente.EfaParams):Observable<Contribuyente.EfaRespose[]>{
    return this.generalService.postData<Contribuyente.EfaRespose[], Contribuyente.EfaParams>(`${environment.API_IFI_SIPF}/tax/payer/efa`, body)
  }
  
}
