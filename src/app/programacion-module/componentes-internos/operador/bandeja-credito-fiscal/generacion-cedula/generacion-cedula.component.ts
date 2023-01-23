import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { element } from 'protractor';
import { Contribuyente } from 'src/app/general-module/componentes-comunes/interfaces/contribuyente.interface';
import { BandejaIncosistenicasResponse, CreditoFiscalResponse, DataExtraResponse, InconsistenciasResponse, VariablesPlantilla } from 'src/app/general-module/componentes-comunes/interfaces/Credito-fiscal';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { CreditoFiscal } from 'src/app/general-module/componentes-comunes/servicios/credito-fiscal.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ReportesService } from 'src/app/general-module/componentes-comunes/servicios/reportes.service';
import { FileUtils } from 'src/app/general-module/componentes-comunes/util/file-utils';

@Component({
  selector: 'app-generacion-cedula',
  templateUrl: './generacion-cedula.component.html',
  styleUrls: ['./generacion-cedula.component.css']
})
export class GeneracionCedulaComponent implements OnInit {

  @Input('idSolicitud') idSolicitud!: number;
  @Input('inconsistencias') tablaInconsitencia!: BandejaIncosistenicasResponse[];
  @Input('taxPayerData') taxPayerData!:  Contribuyente.Respuesta;
  @Input('taxPayerCredito') taxPayerCredito!: CreditoFiscalResponse;
  @Input('idEstadoSolicitud') idEstadoSolicitud!: number;
  @Input('extraDataSolicitud') extraDataSolicitud!: DataExtraResponse;

  columns = ['periodoDesde',
             'periodoHasta',
              'nitProveedor', 
              'facturaSerie',
              'noFactura', 
              'inconsistencia', 
              'tipoRepetida',
              'repetidaEn',
              'observacion'
  ];

  showVisor: Boolean = true;
  dataSource = new MatTableDataSource;
  showVisorCedulaNoAdmision = false;
  showVisorCedulaVerifiacion = false;
  documentoNoAdmision!: Blob
  documentoVerificacion!: Blob
  verificarDocumentosRespaldo: Boolean = true;
  btnCedulaVerificación: Boolean = false;
  btnCedulaNoAdmision: Boolean = false;
  verificacion: boolean = true
  cantidadArchivos!: number;
  dataInconsistenciaArchivos: CreditoFiscalResponse[] = [];
  caracteristicas: number[] = []
  btnGenerarCedula!: Boolean;
  versionado: boolean = false;
  disableBtn: boolean = false;
  archivosRespaldoAprobados: CreditoFiscalResponse[] = [];
  totalArchivos!: number;

  variables : VariablesPlantilla = {
    noTramite: 'SAT-IFI-2022-0000000158 ',
    fecha: "27 de abril de 2022",
    noFormulario: 'SAT22512022100000XXXXX',
    fechaFormulario: new Date("27/04/2022"),
    representanteLegal: 'XXXXXXXXXXXXXXXXXXXXXX',
    nitRepresentante: 'XXXXX-X'
  }


  constructor( private creditoFiscalService: CreditoFiscal,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private reporteService: ReportesService) {
      this.route.paramMap.subscribe(async params => {
        this.idSolicitud = parseInt(params.get('id') ?? '-1');
      })
   }

  ngOnInit(): void {

    console.log(this.idEstadoSolicitud);
    console.log(this.extraDataSolicitud);
    

    this.verificarDocumentosRespaldo = true;   
    this.creditoFiscalService.getCreditoFiscalDocumentoById(this.idSolicitud,1055).toPromise().then(res =>{
    
      this.dataInconsistenciaArchivos = res     
    
    }) 
    this.versionado = this.idEstadoSolicitud === 1056 ? true : false;
  }


  regresar() {
    this.showVisorCedulaNoAdmision = false
    this.creditoFiscalService.deletePdf().toPromise().then()
    this.verificacion = true
  }
  regresarCedula(){
    this.verificacion = true
    this.showVisorCedulaVerifiacion = false
  }
  
  validacionGenerarCedula(){

    console.log(this.tablaInconsitencia);
    this.taxPayerData.data.attributes.datos.caracteristicasEspeciales?.map(element =>{
        this.caracteristicas.push(element.codigoCaracteristica)
        console.log(this.caracteristicas);
        
    })
    console.log(this.caracteristicas);

    if(this.tablaInconsitencia !== undefined){

      if(this.tablaInconsitencia.length >= 0 && this.dataInconsistenciaArchivos.length >= 0){
                
        this.generarCedulaNoAdmision()
        this.verificacion = false

      }else{
        this.creditoFiscalService.getCreditoFiscalDocumentoById(this.idSolicitud, 1054).toPromise().then(resultado =>{
          this.archivosRespaldoAprobados = resultado
          if(resultado.length >= 14){

            if(this.caracteristicas.find(element => element == 2432) && this.caracteristicas.find(u => u == 982)){
              this.getCedulaVerificacion()
            }else{
              this.generarCedulaNoAdmision()
            }
            
          }else{
            this.dialogService.show({
              title: 'Archivos de respaldo incompletos',
              text: `Los libros contables régimen electrónico, devolución IVA no están completos para proceder con la revisión de la solicitud`,
              icon: 'warning',
              showCancelButton: true,
              disableClose: false,
              showCloseButton: false,
              showConfirmButton: false,
              showSecondaryButton: false
            })
            
          }      
        })
      }
      
    }else {
      this.dialogService.show({
        title: 'Inconsistencias sin Agregar',
        text: `Las inconsistencias del Proceso Nocturno no fueron agregadas.`,
        icon: 'warning',
        showCancelButton: true,
        disableClose: false,
        showCloseButton: false,
        showConfirmButton: false,
        showSecondaryButton: false
      })
    }

    
    

  }

  async generarCedulaNoAdmision(){
    const fecha = new Date().toLocaleDateString('es-es', {year:"numeric", month:"short", day:"numeric"})
    console.log(fecha);
       
    let texto: string =  `<!DOCTYPE html><html><head> <style>
  
    @page {
        size: A4;
        margin: 25mm;
        margin-top: 100px;

    @bottom-center{
        content: counter(page);
        font-size:12pt;
    }   

    }
   
 
</style></head>
<body>
<div style="text-align: justify;">
    <p><strong>Aviso de No Admisión a Trámite No. `+ this.taxPayerCredito.formularioIva + `</strong></p>
		<br>
		<br>
		<p><strong>Guatemala, ` + fecha + `</strong></p>
		<br>
		<p>Estimado contribuyente, se le informa que su solicitud de Devolución de Crédito Fiscal del Impuesto al Valor Agregado, Régimen Especial Electrónico realizada en el formulario No.<strong>`+this.taxPayerCredito.numeroFormulario + ` </strong>, firmada por su representante legal: <strong>`+ this.extraDataSolicitud.nombreRepresentante + `</strong>, NIT:<strong> ` + this.extraDataSolicitud.nitRepresentante + `</strong>, fue rechazada a trámite debido a que no cumple con las validaciones que realiza la plataforma electrónica establecida en el artículo 25 bis, de la Ley del Impuesto al Valor Agregado.</p>
		<br>
		<p>Las inconsistencias consisten en:</p>
		<br>`
    if(this.tablaInconsitencia.length == 0){
      
        texto +=`<ul>
      <li>Sin inconsistencias en el Proceso Nocturno.</li></ul>`
    
    }else{
		texto +=`<ul>
		<li>Documento adjunto: <strong>INCONSISTENCIAS PROCESO NOCTURNO</strong>.</li></ul>
    <br>
			<table border="1.5" align="center" bordercolor="black" cellspacing="0" width="10%" height: 100px>

      <tr>
        <th style="text-align: center;" bgcolor="DarkBlue" height="40"><strong><font color="white" size=1>PERIODO DESDE</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>PERIODO HASTA</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>NIT PROVEEDOR</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>FACTURA SERIE</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>FACTURA NÚMERO</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>INCONSISTENCIA</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>TIPO REPETIDA</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>REPETIDA EN</font></strong></th>
				<th style="text-align: center;" bgcolor="DarkBlue"><strong><font color="white" size=1>OBSERVACIÓN</font></strong></th>
      </tr>`
      
      this.tablaInconsitencia.map(element =>{
        texto+=`<tr>
                  <td align="center" height="35"><font size=1>`+ element.periodoDesde +`</td>
                  <td align="center"><font size=1>`+element.periodoHasta +`</font></td>
                  <td align="center"><font size=1>`+ element.facturaProveedor +`</font></td>
                  <td align="center"><font size=1>`+ element.facturaSerie +`</font></td>
                  <td align="center"><font size=1>`+ element.noFactura +`</font></td>
                  <td align="center"><font size=1>`+ element.tipoInconsistencia +`</font></td>
                  <td align="center"><font size=1>`+ element.tipoRepetida +`</font></td>
                  <td align="center"><font size=1>`+ element.declaracionRepetida+`</font></td>
                  <td align="center"><font size=1>`+ element.observacion +`</font></td>
              </tr>`
      })
        texto+=`</table>`
    }
      texto +=`<br>`

      if(this.dataInconsistenciaArchivos.length == 0){
        this.dataInconsistenciaArchivos
        this.totalArchivos = this.archivosRespaldoAprobados.length + this.dataInconsistenciaArchivos.length
      if(this.totalArchivos < 14){
        texto +=`<ul>
      <li>Los libros contables del Régimen Electrónico, devolución IVA están incompletos.</li></ul>`
      }else{
        texto +=`<ul>
        <li>Sin inconsistencias en los archivos de respaldo de la solicitud.</li></ul>`
      }
        
      }else{
     texto += `<ul><li>Inconsistencias de documentos de respaldo cargados.</li>
			<ul>`
				

        this.dataInconsistenciaArchivos.map(elementDoc=>{
         texto+= `<li><p><strong>Nombre del documento: </strong>`+elementDoc.nombre+`</p>
				</li>
					<p><strong>Inconsistencia: </strong>`+elementDoc.comentario+`</p>
          <br>`          
        })
				
			texto += `</ul>
      <br>`
  
      }

      if(this.caracteristicas.find(element => element == 2432)){
        texto += `<li>El contribuyente no se encuentra inscrito en FEL (Factura Electrónica en Línea)</li>`
      } else if(this.caracteristicas.find(u => u == 982)){
        texto += `<li>El contribuyente no se encuentra inscrito en el Régimen Especial Electrónico</li>`
      }
    texto += `</ul>
    <br>
		<p><strong>REFERENCIA LEGAL:</strong>Reglamento de la Ley del Impuesto al Valor Agregado: "Artículo 25 bis. Régimen especial electrónico de devolución de crédito fiscal a los exportadores. De conformidad con el artículo 25 bis de la Ley, el contribuyente que solicite a la Administración Tributaria la devolución del cien por ciento (100%) del crédito fiscal susceptible de devolución del período impositivo mensual vencido en el régimen especial electrónico de devolución de crédito fiscal, deberá cumplir con los requisitos establecidos en la Ley debiendo acompañar del periodo solicitado de forma electrónica, en la plataforma que establezca la Administración Tributaria, lo siguiente:</p>
		<ul>
			<li>
				<p>Las operaciones registradas en los libros de inventarios, de primera entrada o diario, mayor o centralizador; de compras y servicios recibidos, de ventas y servicios prestados.</p>
			</li>
			<li>
				<p>Los estados financieros (balance general, resultados, flujo de efectivo, costo de producción cuando corresponda), libro auxiliar de bancos, detalle de las declaraciones de mercancías por exportación que indique la factura de venta de exportación a la que corresponde y su valor en moneda nacional del periodo impositivo solicitado, para el caso de exportación de servicios, la documentación que respalde que las divisas hayan sido negociadas en el territorio nacional conforme a la legislación vigente, los cuales deberán ser certificados por el contador inscrito y firmados por el Representante Legal que haya habilitado en el formulario electrónico de solicitud del Régimen Especial Electrónico de Devolución.</p>
			</li>
			<li>
				<p>Adicionalmente, todos los documentos que soporten las operaciones registradas del giro normal del negocio y del crédito fiscal reclamado. De conformidad con el artículo 25 bis de la Ley, la Administración Tributaria tendrá un plazo de treinta (30) días hábiles para resolver el fondo de la solicitud. Dicho plazo se computará a partir de la recepción electrónica de la solicitud. Asimismo, dentro de dicho plazo, la Administración Tributaria dispondrá de diez (10) hábiles para admitir o rechazar la solicitud." </p>
			</li>
		</ul>
		<p>Por lo que debe solventar las inconsistencias indicadas anteriormente y presentar nuevamente su solicitud de devolución de crédito fiscal en el Régimen Especial Electrónico. Previo a generar un nuevo formulario deberá cancelar o anular en su agencia virtual el formulario No.<strong>`+this.taxPayerCredito.formularioIva+`.</strong></p>
	</div>
</div>
</body></html>`



    await this.creditoFiscalService.generationCedula(texto).toPromise().then(res=>{
      console.log(res)
      this.documentoNoAdmision = res
      
      this.showVisorCedulaNoAdmision = true
      this.showVisorCedulaVerifiacion = false
    })
  }

  getCedulaVerificacion(){
    this.verificacion = false

    this.reporteService.getCedulaVerificacion(this.idSolicitud).toPromise().then(doc =>{
      
      this.documentoVerificacion = doc

      this.showVisorCedulaVerifiacion = true
      this.showVisorCedulaNoAdmision = false
    })
    
  }

  guardarCedulaVerificacion() {

    this.verificarDocumentosRespaldo = false;
    const formData = new FormData();

  const archivo: Blob = new Blob([this.documentoVerificacion], {type:'application/pdf'})
  const documento =  FileUtils.changeFileName(archivo as File, "Cédula de verificación")

    formData.append('file', documento);
    formData.append('data1',  this.idSolicitud.toString());
    formData.append('data2', "965");
    
    this.creditoFiscalService.updateStatusByProfetional(formData).toPromise().then(res=>{
      if(res){
      
          this.dialogService.show({
            title: 'Crédito Fiscal Aceptado',
            text: `Se acepto correctamente el Crédito Fiscal y se guardó la Cédula de Verificación`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          }).then(t =>{
            if(t== "primary"){
              this.router.navigate(['/programacion/operador/bandeja/credito/fiscal'])
            }
          })
        }else{
          this.dialogService.show({
            title: 'Error Crédito Fiscal',
            text: `No se pudo completar la transacción de la solicitud de crédito fiscal`,
            icon: 'warning',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false
          })
        }
        })
}

guardarCedulaNoAdmision(){

  this.verificarDocumentosRespaldo = false;
  const formData = new FormData();
  const archivo =  FileUtils.changeFileName(this.documentoNoAdmision as File, "Cédula de no admisión");
  formData.append('file', archivo);
  formData.append('data1',  this.idSolicitud.toString());
  formData.append('data2', "1057");

    
    this.creditoFiscalService.updateStatusByProfetional(formData).toPromise().then(res=>{

      if(res){
      this.dialogService.show({
        title: 'Crédito Fiscal Rechazado',
        text: `Se rechazo el Crédito Fiscal y se guardó la Cédula de No Admisión`,
        icon: 'success',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: false
      }).then(btn =>{
        if(btn == "primary"){
          this.router.navigate(['/programacion/operador/bandeja/credito/fiscal'])
        }
      })
      }else{
        this.dialogService.show({
          title: 'Error Crédito Fiscal',
          text: `No se pudo guardar el crédito fiscal`,
          icon: 'warning',
          showCancelButton: false,
          disableClose: true,
          showCloseButton: false
        }) 
      }
    })

}

componente(e: Boolean){
this.btnGenerarCedula = e
console.log("evento",this.btnGenerarCedula);

}

cantidadValidacion(e: any){
  if(e !== undefined){
    this.cantidadArchivos = e

  }else{
    this.cantidadArchivos = 0;
  }

  this.disableBtn = this.cantidadArchivos === 0 ? false : true;
  console.log("cantidad de archivos",e);
  
}



}

