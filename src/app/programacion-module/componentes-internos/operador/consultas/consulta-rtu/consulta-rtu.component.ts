import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { Contribuyente } from '../../../../../general-module/componentes-comunes/interfaces/contribuyente.interface';
import { DialogUbicacion, DialogUbicacionHistorico, DialogEstablecimientos, DialogImpuestosHistorico } from './dialog-contribuyente.component';

@Component({
   selector: 'app-consulta-rtu',
   templateUrl: './consulta-rtu.component.html',
   styleUrls: ['./consulta-rtu.component.scss']
})
export class ConsultaRtuComponent implements OnInit {
   /* Las entradas son opcionales, si solo se conoce el NIT del contribuyente
    el componente consultará la información de este */
   @Input('datosContribuyente') datosContribuyentes!: Contribuyente.Respuesta;
   @Input('nit') NIT!: string;
   estadodebusqueda!: string;
   nitseleccionado!: string;
   nacionalidad!: number;

   //Biometrico
   urlFoto: any;
   urlHuella: any;
   consultaGeneral: FormGroup;

   // Grupos de formularios para llenar
   informacionContribuyenteFormGroup: FormGroup;
   informacionEmpresaFormGroup: FormGroup;
   formularioMarcasFormGroup: FormGroup;
   ubicacionFormGroup: FormGroup;
   establecimientosFormGroup: FormGroup;
   datosContadorFormGroup: FormGroup;
   datosEmbajadaFormGroup: FormGroup;
   afiliacionesFormGroup: FormGroup;
   caracteristicasFormGroup: FormGroup;
   //lista de colegiados
   listaColegiados: Contribuyente.ColegiadoEntity[] = [];

   //Socios o Accionistas
   accionistas!: (Contribuyente.SociosEntity)[] | null;
   listaDomiciliados: Contribuyente.SociosEntity[] = [];
   listaNoDomiciliados: Contribuyente.SociosEntity[] = [];
   listaPartRelacionExtranjero: Contribuyente.SociosEntity[] = [];
   listaGrupoCorporativo: Contribuyente.SociosEntity[] = [];

   //listas de obligaciones afiliaciones
   listaObsIVA: any[] = [];
   listaObsISR: any[] = [];
   listaObsISO: any[] = [];
   estadoIVA: any;
   estadoISR: any;
   estadoISO: any;

   //Participación en gremial y camara empresaril
   participacionEnGremial: boolean = false;
   participacionEnCamaraE: boolean = false;
   poseeSectorEconomico: boolean = false;
   poseeNotario: boolean = false;
   isGuatemalteco: boolean = false;
   isExtranjero: boolean = false;
   isDomiciliado: boolean = false;
   poseeCedula: boolean = false;


   tipoContri!: String;
   tipoContrides!: string;
   isPersonaNegocio: boolean = false;
   isEmpresaOrganizacion: boolean = false;
   cargandoDatos: boolean = false;
   labelTipoPasaporte!: string;

   poseeResolucionIva: boolean = false;
   poseeResolucionIsr: boolean = false;
   poseeRentaImponible: boolean = false;
   poseeEmbajada: boolean = false;
   nitBeneficiario: boolean = false;
   listaBeneeficiarios: any[] = [];

   //variables de datos de consulta
   CaracteristicasEspeciales!: Contribuyente.CaracteristicasEspecialesEntity[];
   EntidadJuridica!: Contribuyente.EntidadJuridica[];
   establecimientos!: Contribuyente.EstablecimientoEntity[] ;
   representantes: Contribuyente.RepresentanteEntity[] = [];
   historicoRepresentantes: Contribuyente.HistoricoRepresentanteYapoderado[] = [];
   afiliaciones!: Contribuyente.AfiliacionImpuesto;
   Contador!: Contribuyente.Contador;
   historicoContador: Contribuyente.HistoricoContadorEntity[] = [];
   Ubicaciones: Contribuyente.UbicacionEntity[] = [];
   fechaCambioDomFiscal!: string;
   HistoricoUbicacion: Contribuyente.HistoricoCambioUbicacion[] = [];
   Apoderados: Contribuyente.ApoderadosEntity[] = [];
   historicoApoderados: Contribuyente.HistoricoRepresentanteYapoderado[] = [];
   marcas: Contribuyente.MarcasEntity[] = [];

   //Sección de MatTable amoecheve
   @ViewChild('MatPaginator') paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;

   //Cosas que agrego gabo
   displayedColumns2: string[] = ['id', 'id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7'];
   bandejacasos2 = new MatTableDataSource();
   
   @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
      this.bandejacasos2.paginator = mp2;
      
   }
   displayedColumns1: string[] = ['id', 'id1', 'id2', 'id3', 'id4'];
   bandejaApoderado = new MatTableDataSource();

  
   @ViewChild('MatPaginator1') set matPaginator1(mp1: MatPaginator) {
    
      this.bandejaApoderado.paginator = mp1;
   }
   //

   //Variables para las tablas amoecheve
   displayedColumnsHistoricoRepresentante: string[] = ['nit', 'nombre', 'fechaNombramiento', 'fechaVigencia', 'estadoDesc', 'fechaDesde', 'fechaHasta'];
   dataSourceHistoricoRepresentante = new MatTableDataSource<any>(this.historicoRepresentantes);

   ngAfterViewInit() {
   }

   /**Caracteristicas Especiales*/
   esContadorPublicoAuditor: boolean = false;
   esEmisorDictamen: boolean = false;

   //Tablas de establecimientos
   columns = ['id', 'FrecuenciaDePago', 'NombreDeObligacion', 'CodigoDeFormulario', 'GeneraEtiqueta', 'ObligacionRequerida', 'Estado'];
   dataSourceIVA = new MatTableDataSource();
   dataSourceISR = new MatTableDataSource();
   dataSourceISO = new MatTableDataSource();
   constructor(
      private formBuilder: FormBuilder,
      private contribuyenteService: ContribuyenteService,
      public dialog: MatDialog
   ) {
      //INICIALIZA ESTADO DE BUSQUEDA
      this.estadodebusqueda = 'inicio';

      this.consultaGeneral = formBuilder.group({
         radioTipoBusqueda: new FormControl,
      });

      this.informacionContribuyenteFormGroup = formBuilder.group({
         estadoNit: new FormControl,
         fechaInscripcionRTU: new FormControl,
         txtNombre1: new FormControl,
         txtNombre2: new FormControl,
         txtNombre3: new FormControl,
         txtPrimerApellido: new FormControl,
         txtSegundoApellido: new FormControl,
         txtApellidoCasada: new FormControl,
         txtPersoneria: new FormControl,
         txtNitConyuge: new FormControl,
         txtNombreConyuge: new FormControl,
         txtDpi: new FormControl,
         //txtFecEmisionDpi: new FormControl,
         txtFecVencimientoDpi: new FormControl,
         txtCedulaVecindad: new FormControl,
         txtMunicipioEmision: new FormControl,
         txtPasaporteIndividual: new FormControl,
         txtFechaExpiraPasaporte: new FormControl,
         txtPaisOrigen: new FormControl,
         txtFecNacimiento: new FormControl,
         txtGenero: new FormControl,
         txtNacionalidad: new FormControl,
         txtEstadoCivil: new FormControl,
         txtMunNacimiento: new FormControl,
         txtDeptoNacimiento: new FormControl,
         txtPoblacion: new FormControl,
         txtComLinguistica: new FormControl,
         txtNitPadre: new FormControl,
         txtNombrePadre: new FormControl,
         txtNitMadre: new FormControl,
         txtNombreMadre: new FormControl,
         txtActividadEconomica: new FormControl,
         txtColegiado: new FormControl,
         txtFecColegiado: new FormControl,
         txtProfesion: new FormControl,
         txtFallecimiento: new FormControl,
         txtCategoria: new FormControl,
         txtEnteInscriptor: new FormControl,
         txtTipodeNIT: new FormControl,
         txtClasificacion: new FormControl,
         //Sector económico 
         sectorEconomico: new FormControl,
         //Fecha hasta: cuando exista actualización del campo sector económico 
         fechaDesdeSecEconomico: new FormControl,
         //Participación en Gremial o Cámara Empresarial 
         partGremial: new FormControl,
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeGremial: new FormControl,
         //Nombre de la Gremial o Cámara Empresarial 
         gremial: new FormControl,
         //Participacion Camara Empresarial
         partEmpresarial: new FormControl,
         //Fecha hasta: cuando exista actualización del Cámara Empresarial 
         fechaDesdeEmpresarial: new FormControl,
         //Nombre de la Gremial o Cámara Empresarial 
         empresarial: new FormControl,
      });

      this.informacionEmpresaFormGroup = formBuilder.group({
         estadoNit: new FormControl,
         fechaInscripcionRTU: new FormControl,
         //Razón o denominación social 
         txtRazonSocial: new FormControl,
         //Tipo de personería (catálogo) 
         nombrePersoneria: new FormControl,
         //Número de documento de constitución 
         numDocConstitucion: new FormControl,
         //Año de documento de constitución 
         anioDocConstitucion: new FormControl,
         //Fecha de constitución  
         fechaConstitucion: new FormControl,
         //Tipo documento de constitución
         tipoDocConstitucion: new FormControl,
         //Fecha de inscripción en el registro que corresponde 
         fechaInsRegistroC: new FormControl,
         //Actividad económica principal 
         activEconomicaP: new FormControl,
         //Sector económico 
         sectorEconomico: new FormControl,
         //Fecha hasta: cuando exista actualización del campo sector económico 
         fechaDesdeSecEconomico: new FormControl,
         //Participación en Gremial o Cámara Empresarial 
         partGremial: new FormControl,
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeGremial: new FormControl,
         //Nombre de la Gremial o Cámara Empresarial 
         gremial: new FormControl,
         //Participacion Camara Empresarial
         partEmpresarial: new FormControl,
         //Fecha hasta: cuando exista actualización del Cámara Empresarial 
         fechaDesdeEmpresarial: new FormControl,
         //Nombre de la Gremial o Cámara Empresarial 
         empresarial: new FormControl,
         //Fecha cambio de Razón o Denominación Social 
         fechaCamRazon: new FormControl,
         //Documento de modificación
         docModificacion: new FormControl,
         //Fecha cancelación 
         fechaCancelacion: new FormControl,
         //Categoría del contribuyente: Mostrar según clasificación CU Categoría del Contribuyente
         catContribuyente: new FormControl,
         //Ente inscriptor
         txtEnteInscriptor: new FormControl,
         //Tipo de NIT
         txtTipodeNIT: new FormControl,
         //Clasificación 
         txtClasificacion: new FormControl,
         //Nit notario
         nitNotario: new FormControl,
         //Nombre del notario
         nombreNotario: new FormControl
      });

      this.formularioMarcasFormGroup = formBuilder.group({

      });

      this.ubicacionFormGroup = formBuilder.group({
         emailPrincipal: new FormControl,
         emailNotificaciones: new FormControl,
         emailAdicional: new FormControl,
         txtTipoDireccion: new FormControl,
         txtUsuarioRed: new FormControl,
         nombreTipoDireccion: new FormControl,
      });

      this.establecimientosFormGroup = formBuilder.group({});

      this.datosContadorFormGroup = formBuilder.group({
         codigoActEconomica: new FormControl,
         codigoImpuestoAfiliacion: new FormControl,
         establecimientosActivos: new FormControl,
         estadoContador: new FormControl,
         estadoNit: new FormControl,
         facturasAutVigentes: new FormControl,
         fechaFallecimiento: new FormControl,
         fechaInscripcionRegistro: new FormControl,
         fechaNombramientoContador: new FormControl,
         nitContador: new FormControl,
         nombreContador: new FormControl,
         omisoIVA: new FormControl,
         tipoPrestacionServicio: new FormControl,
         fechaCambioContador: new FormControl,
         nitRepresentante: new FormControl,
         nombreRepresentante: new FormControl,
         fechaNombramientoRepresentante: new FormControl,
         aniosRepresentacion: new FormControl,
         fechaInsRegistroReLegal: new FormControl,
         fechaVencimientoRepresentacion: new FormControl,
         tipoRepresentacion: new FormControl,
         estadoRepresentacion: new FormControl,
         cancelacionRepresentacion: new FormControl,
      });

      this.datosEmbajadaFormGroup = formBuilder.group({
         tipoDiplomatico: new FormControl,
         nitDiplomatico: new FormControl,
         nombreDiplomatico: new FormControl,
         nitEmbajada: new FormControl,
         nombreEmbajada: new FormControl
      });

      this.afiliacionesFormGroup = formBuilder.group({
         codigoImpuesto: new FormControl,
         nombreImpuesto: new FormControl,
         contribuyenteTipo: new FormControl,
         clasificacionEstablecimiento: new FormControl,
         regimen: new FormControl,
         periodoImpositivo: new FormControl,
         ingresosAnuales: new FormControl,
         frecuenciaPago: new FormControl,
         vecimientoImpuesto: new FormControl,
         estatusAfiliacion: new FormControl,
         codigoImpuestoIsr: new FormControl,
         nombreImpuestoIsr: new FormControl,
         contribuyenteTipoIsr: new FormControl,
         rentaTipoIsr: new FormControl,
         regimenTipoRentaIsr: new FormControl,
         formaCalculoIsr: new FormControl,
         formaPagoIsr: new FormControl,
         evaluacionInventariosIsr: new FormControl,
         sistemaContableIsr: new FormControl,
         frecuenciaPagoIsr: new FormControl,
         statusAfiliacionIsr: new FormControl,
         otrasObligacionesIsr: new FormControl,
         formasAcreditamientoIso: new FormControl,
         estatusAfiliacionIso: new FormControl,
         isrAcreditadoIso: new FormControl,
         isoAcreditadoIsr: new FormControl,
         vencimientoIsr: new FormControl,
         formaCalculoIva: new FormControl,
         resolucionIva: new FormControl,
         resolucionIsr: new FormControl,
         fechaDesdeIva: new FormControl,
         fechaDesdeIsr: new FormControl,
         fechaDesdeIso: new FormControl,
         rentaImponible: new FormControl
      });

      this.caracteristicasFormGroup = formBuilder.group({});


      //this.consultaGeneral.disable();
      this.informacionContribuyenteFormGroup.disable();
      this.informacionEmpresaFormGroup.disable();
      this.formularioMarcasFormGroup.disable();
      this.ubicacionFormGroup.disable();
      this.establecimientosFormGroup.disable();
      this.datosContadorFormGroup.disable();
      this.datosEmbajadaFormGroup.disable();
      this.afiliacionesFormGroup.disable();
      this.caracteristicasFormGroup.disable();
     
   }

   public async ngOnInit() {
      if (!this.datosContribuyentes && this.NIT) {
         await this.contribuyenteService.getGeneralTaxpayerInformation(this.NIT).toPromise().then(res => {
            this.datosContribuyentes = res
           
         });
      }
      this.consultarPorNIT(this.NIT);
   }

   private consultarPorNIT(nit: string) {
      console.log('nit seleccionado: ' + nit);
      this.nitseleccionado = this.datosContribuyentes.data.id;
      this.NIT = this.datosContribuyentes.data.id;
      //tipo de contribuyente
      this.tipoContri = this.datosContribuyentes.data.attributes.datos.tipoContribuyente.value;
      console.log('DATOS -> ', this.datosContribuyentes.data.id);
      this.tipoContrides = this.datosContribuyentes.data.attributes.datos.tipoContribuyente.valueDesc;
      console.log(this.tipoContri)
      //cuando tipo de contribuyente sea individual
      if (this.tipoContri == "1" || this.tipoContri == '0') {  // 0 es Perona inividual pero el servicios cambia el 0 a 1
         //llenado de informacion para contribuyente individual
         this.isEmpresaOrganizacion = false;
         this.isPersonaNegocio = true;
         this.llenarIdentificacionContriIndividual();
         this.llenarApoderados();
         this.validarDatosEmbajada();
      } else { //cuando tipo de contribuyente sea empresa/organizacion
         //llenado de información para contribuyente Juridico
         this.isPersonaNegocio = false;
         this.isEmpresaOrganizacion = true;
         this.llenarIdentificacionContriJuridico();
         //Se quitan socios por actualización al caso de uso
         //this.llenarSocioAccionistas();
      }
      this.llenarMarcas();
      this.llenarCaracteristicasEspeciales();
      this.llenarUbicaciones();
      this.llenarEstablecimientos();
      this.llenarRepresentante();
      this.llenarAfiliaciones();
      this.llenarContador();
   }

   /**
    * llenado de campos en vista
    */
   public llenarIdentificacionContriIndividual() {

      let persona = this.datosContribuyentes.data.attributes.datos.contribuyente.persona;
      this.participacionEnGremial = persona.participacionGremial;
      this.participacionEnCamaraE = persona.participacionEmpresarial;
      this.listaColegiados = persona.listaColegiados ? persona.listaColegiados : [];
      this.poseeSectorEconomico = persona.sectorEconomico ? true : false;
      //fechas
      let fechaDesdeSectorEco = persona.sectorEconomico ? moment(persona.sectorEconomico.fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaDesdeCamara = persona.camarasEmpresariales?.length ? moment(persona.camarasEmpresariales[0].fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaDesdeGremial = persona.gremiales?.length ? moment(persona.gremiales[0].fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaInscripcionRTU = persona.fechaInscripcionRTU ? moment(persona.fechaInscripcionRTU).parseZone().format('YYYY-MM-DD') : '';
      //let fechaEmisionDpi = persona.fecha_Emision_DPI ? moment(persona.fecha_Emision_DPI).parseZone().format('YYYY-MM-DD') : '';
      let fechaVencimientoDpi = persona.fecha_Vencimiento_DPI ? moment(persona.fecha_Vencimiento_DPI).parseZone().format('YYYY-MM-DD') : '';
      let fechaColegiado = persona.fecha_Colegiado ? moment(persona.fecha_Colegiado).parseZone().format('YYYY-MM-DD') : '';
      let fechaExpiraPasaporte = persona.fecha_Expira_Pasaporte ? moment(persona.fecha_Expira_Pasaporte).parseZone().format('YYYY-MM-DD') : '';
      let fechaNacimiento = persona.fecha_Nacimiento ? moment(persona.fecha_Nacimiento).parseZone().format('YYYY-MM-DD') : '';
      let fechaFallecimiento = persona.fecha_Fallecimiento ? moment(persona.fecha_Fallecimiento).parseZone().format('YYYY-MM-DD') : '';
      this.validarNacionalidad(persona.nacionalidad);
      this.poseeCedula = persona.numero_Orden_Cedula ? true : false;

      this.informacionContribuyenteFormGroup.patchValue({
         //estado del NIT
         estadoNit: persona.estadoDesc,
         //fecha de inscripcion en RTU
         fechaInscripcionRTU: fechaInscripcionRTU,
         //Primer nombre 
         txtNombre1: persona.primer_Nombre,
         //Segundo nombre 
         txtNombre2: persona.segundo_Nombre,
         //Tercer nombre y otros
         txtNombre3: persona.otros_Nombres,
         //Primer apellido 
         txtPrimerApellido: persona.primer_Apellido,
         //Segundo apellido  
         txtSegundoApellido: persona.segundo_Apellido,
         //Apellido de casada  
         txtApellidoCasada: persona.apellido_Casada,
         //Tipo de personería (asigna automáticamente 0 individual)
         txtPersoneria: this.tipoContrides,
         //NIT cónyuge 
         txtNitConyuge: persona.nitconyuge,
         //Nombres y apellidos cónyuge 
         txtNombreConyuge: persona.nombresConyuge,
         // calculado abajo...

         //País de origen
         txtPaisOrigen: persona.pais_Origen_Desc,
         //Fecha de Nacimiento  
         txtFecNacimiento: fechaNacimiento,
         //Sexo
         txtGenero: persona.genero_Desc,
         //Nacionalidad 
         txtNacionalidad: persona.nacionalidad_Desc,
         //Estado civil 
         txtEstadoCivil: persona.estado_Civil_Desc,
         //Municipio de nacimiento 
         txtMunNacimiento: persona.municipio_Nacimiento_Desc,
         //Departamento de nacimiento 
         txtDeptoNacimiento: persona.departamento_Nacimiento_Desc,
         //Población
         txtPoblacion: persona.poblacion_Desc,
         //Comunidad lingüística 
         txtComLinguistica: persona.comunidad_Linguistica_Desc,
         //NIT o CUI del padre: Mostrar solo para ciudadano guatemalteco 
         txtNitPadre: persona.nit_Padre,
         //Nombre del padre: Mostrar solo para ciudadano guatemalteco 
         txtNombrePadre: persona.nombres_Padre,
         //NIT o CUI de la madre: Mostrar solo para ciudadano guatemalteco 
         txtNitMadre: persona.nit_Madre,
         //Nombre de la madre: Mostrar solo para ciudadano guatemalteco 
         txtNombreMadre: persona.nombres_Madre,
         //Actividad económica principal; Mostrar código y descripción
         txtActividadEconomica: persona.actividadEconomicaPrincipal ? persona.actividadEconomicaPrincipal.ciiu + ' - ' + persona.actividadEconomicaPrincipal.nombreActividadEconomica : 'No posee actividad económica',
         //Información del colegiado: Mostrar los campos 
         //No. Colegiado
         txtColegiado: persona.numero_Colegiado,
         //Fecha colegiado
         txtFecColegiado: fechaColegiado,
         //Profesión
         txtProfesion: persona.codigo_Titulo_Desc,
         //Fecha de fallecimiento
         txtFallecimiento: fechaFallecimiento,
         //Categoría del contribuyente: Mostrar según clasificación CU Categoría del Contribuyente 
         //Sector económico 
         sectorEconomico: persona.sectorEconomico ? persona.sectorEconomico.sectorEconomicoDesc : 'NO APLICA',
         //Fecha hasta sector economico
         fechaDesdeSecEconomico: fechaDesdeSectorEco,
         //Participación en Gremial o Cámara Empresarial 
         partGremial: persona.participacionGremial ? 'SI' : 'NO',
         //Nombre de la Gremial
         gremial: persona.gremiales?.length ? persona.gremiales[0].gremialDesc : '',
         //Participación en Gremial o Cámara Empresarial 
         partEmpresarial: persona.participacionEmpresarial ? 'SI' : 'NO',
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeGremial: fechaDesdeGremial,
         //Nombre de Cámara Empresarial 
         empresarial: persona.camarasEmpresariales?.length ? persona.camarasEmpresariales[0].camaraEmpresarialDesc : '',
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeEmpresarial: fechaDesdeCamara,
         //Fecha cambio de Razón o Denominación Social
         txtCategoria: persona.categoria_Desc,
         //Ente inscriptor
         txtEnteInscriptor: persona.ente_Inscriptor,
         //Tipo de NIT
         txtTipodeNIT: persona.tipoNitDesc,
         //Clasificación 
         txtClasificacion: persona.codigo_Clasificacion_Desc,
      });

      //DPI Y Pasaporte Segun nacionalidad.
      this.nacionalidad = persona.nacionalidad;
      if (this.nacionalidad == Constantes.GUATEMALTECO || this.nacionalidad == Constantes.EXTRANJERO_DOMICILIADO) { // Guatemalteco o Extranjero Domiciliado
         this.informacionContribuyenteFormGroup.patchValue({
            //Código Único de Identificación 
            txtDpi: persona.dpi,
            //Fecha de emisión
            //txtFecEmisionDpi: fechaEmisionDpi,
            //Fecha de vencimiento
            txtFecVencimientoDpi: fechaVencimientoDpi,
            //Cédula de vecindad: con los campos: No. De orden y  registro 
            txtCedulaVecindad: persona.numero_Registro_Cedula_Desc ? persona.numero_Registro_Cedula_Desc + ' ' + persona.numero_Orden_Cedula : '',
            //Municipio de emisión
            txtMunicipioEmision: persona.municipio_Emision_Cedula_Desc ? persona.municipio_Emision_Cedula_Desc : '',
         });
      }
      if (this.nacionalidad == Constantes.EXTRANJERO_DOMICILIADO || this.nacionalidad == Constantes.EXTRANJERO) { //Extranjero Domiciliado solo su pasaporte
         //Pasaporte: mostrar solo en los casos de ser extranjero, de lo contrario no mostrar
         switch (persona.tipoPasaporte) {
            case Constantes.PASAPORTE_POR_DEFECTO:
               this.labelTipoPasaporte = 'Pasaporte';
               break;
            case Constantes.PASAPORTE:
               this.labelTipoPasaporte = 'Pasaporte';
               break;
            case Constantes.RECONOCIDO_BAJO_EL_ESTATUTO_DE_REFUGIADO:
               this.labelTipoPasaporte = 'Documento Personal de Identificación Especial Reconocido Bajo el Estatuto de Refugiado (RR)';
               break;
            case Constantes.SOLICITANTE_DEL_ESTATUTO_REFUGIADO:
               this.labelTipoPasaporte = 'Documento Personal de Identificación Especial Solicitante del Estatuto Refugiado (SR)';
               break;
         }
         this.informacionContribuyenteFormGroup.get('txtPasaporteIndividual')?.patchValue(persona.pasaporte);
         this.informacionContribuyenteFormGroup.get('txtFechaExpiraPasaporte')?.patchValue(fechaExpiraPasaporte);
      }
      //Fin Contribuyente Individual
   }

   public validarNacionalidad(nacionalidad: any) {
      switch (nacionalidad) {
         case Constantes.GUATEMALTECO:
            this.isGuatemalteco = true;
            break;
         case Constantes.EXTRANJERO_DOMICILIADO:
            this.isDomiciliado = true;
            break;
         case Constantes.EXTRANJERO:
            this.isExtranjero = true;
            break;
      }
   }

   public llenarIdentificacionContriJuridico() {

      let empresa = this.datosContribuyentes.data.attributes.datos.empresa;
      //console.log('DATOS EMPRESA ---> ',empresa);
      this.participacionEnGremial = empresa.participacionGremial;
      this.participacionEnCamaraE = empresa.participacionEmpresarial;
      this.poseeSectorEconomico = empresa.sectorEconomico ? true : false;
      this.poseeNotario = empresa.nitNotario ? true : false;
      //Se le da formato a la fecha debido a que el componete (en el HTML) tien el tipo = date, por lo que sin el formato correcto no se visualizan las fechas
      let fechaConstitucion = empresa.fechaConstitucion ? moment(empresa.fechaConstitucion).parseZone().format('YYYY-MM-DD') : '';
      let fechaInscripcionRC = empresa.fechaInscripcion ? moment(empresa.fechaInscripcion).parseZone().format('YYYY-MM-DD') : '';
      let fecha_CambioRazon = empresa.fechaCambioRazon ? moment(empresa.fechaCambioRazon).parseZone().format('YYYY-MM-DD') : '';
      let fecha_Cancelacion = empresa.fechaCancelacion ? moment(empresa.fechaCancelacion).parseZone().format('YYYY-MM-DD') : '';
      let fechaDesdeSectorEco = empresa.sectorEconomico ? moment(empresa.sectorEconomico.fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaDesdeCamara = empresa.camarasEmpresariales?.length ? moment(empresa.camarasEmpresariales[0].fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaDesdeGremial = empresa.gremiales?.length ? moment(empresa.gremiales[0].fechaInicio).parseZone().format('YYYY-MM-DD') : '';
      let fechaInscripcionRTU = empresa.fechaInscripcionRTU ? moment(empresa.fechaInscripcionRTU).parseZone().format('YYYY-MM-DD') : '';
      //console.log('Fecha INS -----> ',fechaInscripcionRC);

      this.informacionEmpresaFormGroup.patchValue({
         //estado del NIT
         estadoNit: empresa.estadoDesc,
         //fecha de inscripcion en RTU
         fechaInscripcionRTU: fechaInscripcionRTU,
         //Razón o denominación social 
         txtRazonSocial: empresa.razonSocial,
         //Tipo de personería (catálogo) 
         nombrePersoneria: empresa.descPersoneria,
         //Número de documento de constitución 
         numDocConstitucion: empresa.numeroDoctoConstitucion,
         //Año de documento de constitución 
         anioDocConstitucion: empresa.anioDoctoConstitucion,
         //Fecha de constitución  
         fechaConstitucion: fechaConstitucion,
         //Tipo documento de constitución
         tipoDocConstitucion: empresa.tipoDoctoConstitucionDesc,
         //Fecha de inscripción en el registro que corresponde 
         fechaInsRegistroC: fechaInscripcionRC,
         //Actividad económica principal 
         activEconomicaP: empresa.actividadEconomicaPrincipal ? empresa.actividadEconomicaPrincipal.ciiu + ' - ' + empresa.actividadEconomicaPrincipal.nombreActividadEconomica : '',
         //Sector económico 
         sectorEconomico: empresa.sectorEconomico ? empresa.sectorEconomico.sectorEconomicoDesc : 'NO APLICA',
         //Fecha hasta sector economico
         fechaDesdeSecEconomico: fechaDesdeSectorEco,
         //Participación en Gremial o Cámara Empresarial 
         partGremial: empresa.participacionGremial ? 'SI' : 'NO',
         //Nombre de la Gremial
         gremial: empresa.gremiales?.length ? empresa.gremiales[0].gremialDesc : '',
         //Participación en Gremial o Cámara Empresarial 
         partEmpresarial: empresa.participacionEmpresarial ? 'SI' : 'NO',
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeGremial: fechaDesdeGremial,
         //Nombre de Cámara Empresarial 
         empresarial: empresa.camarasEmpresariales?.length ? empresa.camarasEmpresariales[0].camaraEmpresarialDesc : '',
         //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
         fechaDesdeEmpresarial: fechaDesdeCamara,
         //Fecha cambio de Razón o Denominación Social 
         fechaCamRazon: fecha_CambioRazon,
         //TODO: Documento de modificación
         docModificacion: '',
         //Fecha cancelación 
         fechaCancelacion: fecha_Cancelacion,
         //Categoría del contribuyente: Mostrar según clasificación CU Categoría del Contribuyente
         catContribuyente: empresa.categoria_Desc,
         //Ente inscriptor
         txtEnteInscriptor: empresa.ente_Inscriptor,
         //Tipo de NIT
         txtTipodeNIT: empresa.tipoNitDesc,
         //Clasificación 
         txtClasificacion: empresa.codigo_Clasificacion_Desc,
         //Nit notario
         nitNotario: empresa.nitNotario,
         //Nombre notario
         nombreNotario: empresa.nombreNotario,
      });
      //Fecha hasta: cuando exista actualización del campo sector económico 
      //TODO: obtener fecha hasta de sector economico
      //this.informacionEmpresaFormGroup.get('fechaHastaSecEconomico').patchValue(empresa.sectorEconomico?empresa.sectorEconomico.fechaFin:'');
      //Fecha hasta: cuando exista actualización del campo Participación en Gremial o Cámara Empresarial 
      //TODO: obtener fecha hasta de gremial
      //this.informacionEmpresaFormGroup.get('fechaHastaGremial').patchValue(empresa.gremiales?empresa.gremiales[0].fechaFin:'');
   }

   public llenarMarcas() {
      //Marcas
      console.log('Llenando Marca');

      if (this.tipoContri == '1') {
         this.marcas = this.datosContribuyentes.data.attributes.datos.contribuyente.persona.marcas ?? [];
         console.warn('marca en 1');
      } else {
         this.marcas = this.datosContribuyentes.data.attributes.datos.empresa.marcas ?? [];
         console.warn('marca en 2');
      }

   }

   /**CARACTERISTICAS ESPECIALES*/
   public llenarCaracteristicasEspeciales() {
      this.CaracteristicasEspeciales = this.datosContribuyentes.data.attributes.datos.caracteristicasEspeciales ?? [];
      /**For de codigos de Caracteristicas */
      let codigoCaracteristica;
      for (let i = 0; i < this.CaracteristicasEspeciales.length; i++) {
         codigoCaracteristica = this.CaracteristicasEspeciales[i].codigoCaracteristica;
         if (codigoCaracteristica == Constantes.CODIGO_CONTADOR_PUBLICO_AUDITOR) {
            this.esContadorPublicoAuditor = true;
         }
         // Entidad Juridica
         if (codigoCaracteristica == Constantes.CODIGO_CPA_EMISOR_DICTAMEN) {
            let nit_buscado: string = this.NIT;
            this.esEmisorDictamen = true;
            this.contribuyenteService.getTypeLegalService(nit_buscado)
               .subscribe(entidad => {
                  this.EntidadJuridica = entidad;
               }, (error) => {
                  this.cargandoDatos = false;
               });
         }
      }
      if (this.CaracteristicasEspeciales && this.tipoContri == Constantes.OTRA_ENTIDAD_RELIGIOSA) {
         this.CaracteristicasEspeciales.forEach(data => {
            if (data.codigoCaracteristica == Constantes.EMISOR_FEL) {
               data.nombreCaracteristica = 'EMISOR DE DOCUMENTOS TRIBUTARIOS ELECTRÓNICOS';
            }
         });
      }
   }

   public llenarUbicaciones() {
      let ubica = this.datosContribuyentes.data.attributes.datos.ubicacion;
      this.ubicacionFormGroup.patchValue({
         emailPrincipal: ubica.correoPrincipal,
         emailNotificaciones: ubica.correoNotificaciones,
         emailAdicional: ubica.correoAdicional,
         txtUsuarioRed: ubica.usuario,
         txtTipoDireccion: ubica.tipoMedioDesc,
      });
      //listado de ubicaciones
      this.Ubicaciones = ubica.ubicaciones ?? [];
      this.fechaCambioDomFiscal = ubica.fechaCambioDomicilioFiscal ?? '';
      // historico
      this.HistoricoUbicacion = ubica.historicoCambioDomicilio ?? [];
   }

   public llenarEstablecimientos() {
      this.establecimientos = this.datosContribuyentes.data.attributes.datos.establecimiento ?? [];
       console.log(this.establecimientos); 
      this.bandejacasos2.data = this.establecimientos      
      //console.log('Establecimientos ' + JSON.stringify(this.Establecimientos));
   }

   public llenarContador() {
      this.Contador = this.datosContribuyentes.data.attributes.datos.contador;//listado de contadores
      this.historicoContador = this.datosContribuyentes.data.attributes.datos.historicoContador ?? [];
      if (this.Contador) {
         console.log('**datos del contador ' + JSON.stringify(this.Contador));
         let FechaNombramiento = this.Contador.fechaNombramiento ? moment(this.Contador.fechaNombramiento).parseZone().format('YYYY-MM-DD') : '';
         let fechaCambioCont = this.Contador.fechaCambioContador ? moment(this.Contador.fechaCambioContador).parseZone().format('YYYY-MM-DD') : '';
         this.datosContadorFormGroup.patchValue({
            nitContador: this.Contador.nitContador,
            nombreContador: this.Contador.nombresApellidos,
            tipoPrestacionServicio: this.Contador.tipoPrestacionServicioDesc,
            estadoContador: this.Contador.estadoDesc,
            fechaNombramientoContador: FechaNombramiento,
            fechaCambioContador: fechaCambioCont,
         });
      } else {
         console.log('**no existe contador**');
      }
   }

   public llenarRepresentante() {
      this.representantes = this.datosContribuyentes.data.attributes.datos.representante ?? [];
      this.historicoRepresentantes = this.datosContribuyentes.data.attributes.datos.historicoRepresentante ?? [];
      this.dataSourceHistoricoRepresentante.data = this.historicoRepresentantes;

      setTimeout(() => {
         this.dataSourceHistoricoRepresentante.paginator = this.paginator;
         this.dataSourceHistoricoRepresentante.sort = this.sort;
      }, 3e3);
   }

   public llenarApoderados() {
      this.Apoderados = this.datosContribuyentes.data.attributes.datos.apoderados ?? [];
      this.historicoApoderados = this.datosContribuyentes.data.attributes.datos.historicoApoderados ?? [];
      this.bandejaApoderado.data = this.Apoderados
   }

   public validarDatosEmbajada() {
      let datosEmbajada = this.datosContribuyentes.data.attributes.datos.contribuyente.persona.datosEmbajada;
      if (datosEmbajada) {
         this.poseeEmbajada = true;
         if (datosEmbajada.tipoAsociacion == Constantes.NIT_EMBAJADA) {
            this.nitBeneficiario = false;
            this.datosEmbajadaFormGroup.patchValue({
               tipoDiplomatico: datosEmbajada.tipoDiplomaticoDesc,
               nitEmbajada: datosEmbajada.nitEmbajada,
               nombreEmbajada: datosEmbajada.nombreEmbajada
            });
            if (datosEmbajada.beneficiarios) {
               this.listaBeneeficiarios = datosEmbajada.beneficiarios;
            }
         } else {
            this.nitBeneficiario = true;
            this.datosEmbajadaFormGroup.patchValue({
               tipoDiplomatico: datosEmbajada.tipoDiplomaticoDesc,
               nitDiplomatico: datosEmbajada.nitDiplomatico,
               nombreDiplomatico: datosEmbajada.nombreDiplomatico,
               nitEmbajada: datosEmbajada.nitEmbajada,
               nombreEmbajada: datosEmbajada.nombreEmbajada
            });
         }

      } else {
         this.poseeEmbajada = false;
      }
   }

   public llenarAfiliaciones() {
      this.afiliaciones = this.datosContribuyentes.data.attributes.datos.afiliacionImpuesto;

      if (this.afiliaciones) {
         if (this.afiliaciones.iva) {
            let fechaDesdeIva = this.afiliaciones.iva.fechaDesde ? moment(this.afiliaciones.iva.fechaDesde).parseZone().format('YYYY-MM-DD') : '';
            this.afiliacionesFormGroup.patchValue({
               codigoImpuesto: this.afiliaciones.iva.codigoImpuesto,
               nombreImpuesto: this.afiliaciones.iva.nombreImpuesto,
               contribuyenteTipo: this.afiliaciones.iva.tipoContribuyenteDesc,
               clasificacionEstablecimiento: this.afiliaciones.iva.tipoEstablecimientoDesc,
               regimen: this.afiliaciones.iva.codigoRegimenDesc,
               periodoImpositivo: this.afiliaciones.iva.periodoImpositivoDesc,
               ingresosAnuales: this.afiliaciones.iva.estimadoIngresos,
               frecuenciaPago: (this.afiliaciones.iva.frecuenciaPago ? this.afiliaciones.iva.frecuenciaPago.valor : ''),
               // ya no va en el CU
               formaCalculoIva: this.afiliaciones.iva.formaCalculoDesc,
               estatusAfiliacion: this.afiliaciones.iva.estatusDeAfiliacionDesc,
               fechaDesdeIva: fechaDesdeIva
            });
            //Estado
            this.estadoIVA = this.afiliaciones.iva.estatusDeAfiliacion;
            //Resolucion IVA
            if (this.afiliaciones.iva.resolucion) {
               this.afiliacionesFormGroup.controls['resolucionIva'].setValue(this.afiliaciones.iva.resolucion);
               this.poseeResolucionIva = true;
            } else
               this.poseeResolucionIva = false;
            //seteo de las obligaciones
            this.listaObsIVA = this.afiliaciones.iva.obligaciones ?? [];
            this.dataSourceIVA.data=this.listaObsIVA
         }//fin llenado Iva General

         //IMPUESTO SOBRE LA RENTA
         if (this.afiliaciones.isr) {
            let fechaDesdeIsr = this.afiliaciones.isr.fechaDesde ? moment(this.afiliaciones.isr.fechaDesde).parseZone().format('YYYY-MM-DD') : '';
            //todo

            this.afiliacionesFormGroup.patchValue({
               codigoImpuestoIsr: this.afiliaciones.isr.codigoImpuesto,        //codigo
               nombreImpuestoIsr: this.afiliaciones.isr.nombreImpuesto,        //nombreImpuesto
               contribuyenteTipoIsr: this.afiliaciones.isr.tipoContribuyenteDesc,        //tipo contribuyente
               rentaTipoIsr: this.afiliaciones.isr.tipoRentaDesc,         //tipo de renta
               regimenTipoRentaIsr: this.afiliaciones.isr.regimenDesc,          //Regimen por tipo de renta
               formaCalculoIsr: this.afiliaciones.isr.formaCalculoDesc,         //forma de calculo
               // ya no va en el CU
               formaPagoIsr: '',        //forma de pago 
               evaluacionInventariosIsr: this.afiliaciones.isr.sistemaInventarioDesc,          //evaluacion de inventarios
               sistemaContableIsr: this.afiliaciones.isr.sistemaContableDesc,         //sistema contable
               frecuenciaPagoIsr: (this.afiliaciones.isr.frecuenciaPago ? this.afiliaciones.isr.frecuenciaPago.valor : ''), //frecuencia de pago 
               // ya no va en el CU
               vencimientoIsr: '',          //vencimiento para el pago del impuesto
               statusAfiliacionIsr: this.afiliaciones.isr.estatusDeAfiliacionDesc,          //estatus de afiliacion
               otrasObligacionesIsr: '',         //otras obligaciones por establecimiento y actividad economica
               //TODO: Usuarios de eCAI, exenIVA, no se a definido como aparecera ni como se almacenara
               fechaDesdeIsr: fechaDesdeIsr
            });
            //Estado
            this.estadoISR = this.afiliaciones.isr.estatusDeAfiliacion;
            //Resolucion ISR
            if (this.afiliaciones.isr.resolucion) {
               this.afiliacionesFormGroup.controls['resolucionIsr'].setValue(this.afiliaciones.isr.resolucion);
               this.poseeResolucionIsr = true;
            } else
               this.poseeResolucionIsr = false;
            if (this.afiliaciones.isr.rentaImponible) {
               this.afiliacionesFormGroup.controls['rentaImponible'].setValue(this.afiliaciones.isr.rentaImponibleDesc);
               this.poseeRentaImponible = true;
            } else
               this.poseeRentaImponible = false;

            //seteo de las obligaciones
            this.listaObsISR = this.afiliaciones.isr.obligaciones ?? [];
            this.dataSourceISR.data=this.listaObsISR
         }

         //TODO: QUEDA PENDIENTE POR NO ESTAR DEFINIDO EN EL MICROSERVICIO.
         if (this.afiliaciones.iso) {
            let fechaDesdeIso = this.afiliaciones.iso.fechaDesde ? moment(this.afiliaciones.iso.fechaDesde).parseZone().format('YYYY-MM-DD') : '';
            this.afiliacionesFormGroup.patchValue({
               formasAcreditamientoIso: this.afiliaciones.iso.formaAcreditamientoDesc,
               estatusAfiliacionIso: this.afiliaciones.iso.estatusDeAfiliacionDesc,
               isrAcreditadoIso: '',
               isoAcreditadoIsr: '',
               fechaDesdeIso: fechaDesdeIso
            });
            //Estado
            this.estadoISO = this.afiliaciones.iso.estatusDeAfiliacion;
            //seteo de las obligaciones
            this.listaObsISO = this.afiliaciones.iso.obligaciones ?? [];
            this.dataSourceISO.data=this.listaObsISO
         }
      }
   }

   public openDialogDetalleUbicacion(detalle: any, fechaCambioDomFiscal: string) {
      this.dialog.open(DialogUbicacion, {
         data: {
            detalle: detalle,
            fechaCambioDom: fechaCambioDomFiscal
         }
      });
   }

   public openDialogDetalleHistoricoUbicacion(detalle: any) {
      this.dialog.open(DialogUbicacionHistorico, {
         data: detalle,
      });
   }

   public openDialogdetalleEstable(establecimientos: any) {
      this.dialog.open(DialogEstablecimientos, {
         data: establecimientos,
         
      });
   }

   public openDialogHistoricoInpuesto(historico: any, Impuesto: string) {
      this.dialog.open(
         DialogImpuestosHistorico, {
         data: { historico, Impuesto }
      }
      );
   }
}


