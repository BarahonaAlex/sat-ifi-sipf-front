import { Byte } from "@angular/compiler/src/util";
import { Moment } from "moment";

export declare module Contribuyente {

    export interface Respuesta {
        data: Data;
        meta: Meta;
    }
    export interface Data {
        attributes: Attributes;
        id: string;
        type: string;
    }
    export interface Attributes {
        datos: Datos;
        id: string;
    }
    export interface Datos {
        accionista?: (AccionistaEntity)[] | null;
        actividadEconomica: ActividadEconomica;
        afiliacionImpuesto: AfiliacionImpuesto;
        apoderados?: (ApoderadosEntity)[] | null;
        caracteristicasEspeciales?: (CaracteristicasEspecialesEntity)[] | null;
        entidadJuridica?: (EntidadJuridica)[] | null;
        contador: Contador;
        contribuyente: Contribuyente;
        empresa: Empresa;
        establecimiento?: (EstablecimientoEntity)[] | null;
        historicoApoderados?: (HistoricoRepresentanteYapoderado)[] | null;
        historicoContador?: (HistoricoContadorEntity)[] | null;
        historicoRepresentante?: (HistoricoRepresentanteYapoderado)[] | null;
        historicoSocio?: (HistoricoSocioEntity)[] | null;
        representante?: (RepresentanteEntity)[] | null;
        socios?: (SociosEntity)[] | null;
        tipoContribuyente: TipoContribuyente;
        ubicacion: Ubicacion;
        fechaUltimaActualizacionRatificacion: Date | null;
    }
    export interface AccionistaEntity {
        col_0: col;
        col_1: col;
        col_2: col;
        col_3: col;
        col_4: col;
        col_5: col;
        col_6: col;
        col_7: number;
    }
    export interface col {
        isText: boolean;
        val: Val;
    }
    export interface Val {
        value: string;
        viewValue: string;
    }
    export interface ActividadEconomica {
        estado: string;
        id: Id;
        nombre: string;
    }
    export interface Id {
        ciiu: string;
        codigo: number;
        subTipo: number;
        tipoActividad: number;
        tipoNit: number;
        tipoPersona: number;
    }
    export interface AfiliacionImpuesto {
        bebidas?: (OtroImpuesto)[] | null;
        cable?: (OtroImpuesto)[] | null;
        cemento?: (OtroImpuesto)[] | null;
        iso: Iso;
        isr: Isr;
        iva: Iva;
        petroleo?: (OtroImpuesto)[] | null;
        tabaco?: (OtroImpuesto)[] | null;
    }
    export interface OtroImpuesto {
        codigoImpuesto: number;
        codigoImpuestoDesc: string;
        codigoRegimen: number;
        codigoRegimenDesc: string;
        frecuenciaPago: FormaCalculo;
        historicoAfiliacion?: (HistoricoAfiliacionEntity)[] | null;
        nombreEstablecimiento: string;
        numeroEstablecimiento: number;
        periodoImpositivo: string;
        periodoImpositivoDesc: string;
        tipoContribuyente: string;
        tipoContribuyenteDesc: string;
        obligaciones: any[] | null;
        estado: number;
        estadoDesc: string;
        fechaDesde: string;
    }
    export interface FormaCalculo {
        id: IdFC;
        valor: string;
    }
    export interface IdFC {
        codigoCondicionEspecial: number;
        codigoDato: number;
    }
    export interface HistoricoAfiliacionEntity {
        codigoRegimen: number;
        fechaAdicion: string;
        fechaCambioRegimen: string;
        nombreCodRegimen: string;
    }
    export interface Iso {
        codigoImpuesto: string;
        formaAcreditamiento: number;
        formaAcreditamientoDesc: string;
        frecuenciaPago: FormaCalculo;
        historicoAfiliacion?: (HistoricoAfiliacionEntity)[] | null;
        nombreImpuesto: string;
        periodoImpositivo: string;
        periodoImpositivoDesc: string;
        tipoContribuyente: string;
        tipoContribuyenteDesc: string;
        obligaciones: any[] | null;
        estatusDeAfiliacion: number;
        estatusDeAfiliacionDesc: string;
        fechaDesde: string;
    }
    export interface Isr {
        codigoFormulario: number;
        codigoImpuesto: number;
        estatusDeAfiliacion: number;
        estatusDeAfiliacionDesc: string;
        formaCalculo: number;
        formaCalculoDesc: string;
        frecuenciaPago: FormaCalculo;
        historicoAfiliacion?: (HistoricoAfiliacionEntity)[] | null;
        indicadorObligacion: number;
        indicadorObligacionDesc: string;
        nombreImpuesto: string;
        obligacionesEstablecimiento: ObligacionesEstablecimiento;
        periodoImpositivo: string;
        periodoImpositivoDesc: string;
        regimen: number;
        regimenDesc: string;
        rentaImponible: number;
        rentaImponibleDesc: string;
        sector: number;
        sectorDesc: string;
        sistemaContable: number;
        sistemaContableDesc: string;
        sistemaInventario: number;
        sistemaInventarioDesc: string;
        tipoContribuyente: number;
        tipoContribuyenteDesc: string;
        tipoRenta: number;
        tipoRentaDesc: string;
        obligaciones: any[] | null;
        resolucion: string;
        fechaDesde: string;
    }
    export interface ObligacionesEstablecimiento {
        codigo_eCAI: number;
        codigo_eCAI_desc: string;
        codigo_exenIVA: number;
        codigo_exenIVA_desc: string;
        estado_eCai: number;
        estado_eCai_desc: string;
        estado_exenIva: number;
        estado_exenIva_desc: string;
    }
    export interface Iva {
        codigoFormulario: string;
        codigoImpuesto: string;
        codigoRegimen: string;
        codigoRegimenDesc: string;
        estatusDeAfiliacion: number;
        estatusDeAfiliacionDesc: string;
        estimadoIngresos: string;
        exento: boolean;
        formaCalculo: number;
        formaCalculoDesc: string;
        frecuenciaPago: FormaCalculo;
        historicoAfiliacion?: (HistoricoAfiliacionEntity)[] | null;
        nombreImpuesto: string;
        periodoImpositivo: string;
        periodoImpositivoDesc: string;
        tipoContribuyente: string;
        tipoContribuyenteDesc: string;
        tipoEstablecimiento: number;
        tipoEstablecimientoDesc: string;
        obligaciones: any[] | null;
        resolucion: string;
        fechaDesde: string;
    }
    export interface ApoderadosEntity {
        estado: string;
        fechaDeNombramiento: string;
        fechaVencimiento: string;
        nitDelRepresentado: string;
        nombreDelRepresentado: string;
    }
    export interface CaracteristicasEspecialesEntity {
        codigoCaracteristica: number;
        nombreCaracteristica: string;
        estado: number;
        fechaEstado: string;
        fechaDesde: string;
        fechaHasta: string;
        nombreEstado: string;
        tipoContador: string;
        tipoServicio: number;
        fechaTribunalHonor: Date;
        nitNotarioDeclaJurada: string;
        fechaDeclaJurada: Date;
    }
    export interface EntidadJuridica {
        codigoTipoServicio: number;
        descripcionTipoServicio: string;
        direccion: string;
        nitJuridico: string;
        nombreORazonSocial: string;
    }

    export interface Contador {
        codigoActEconomica: string;
        codigoImpuestoAfiliacion: string;
        establecimientosActivos: boolean;
        estado: string;
        estadoDesc: string;
        estadoNIT: boolean;
        facturasAutVigentes: boolean;
        fechaCambioContador: string;
        fechaFallecimiento: boolean;
        fechaInscripcionRegistro: string;
        fechaNombramiento: string;
        nitContador: string;
        nombresApellidos: string;
        omisoIVA: boolean;
        tipoPrestacionServicio: string;
        tipoPrestacionServicioDesc: string;
    }
    export interface Contribuyente {
        persona: Persona;
    }
    export interface Persona {
        actividadEconomicaPrincipal: ActividadEconomicaPrincipal;
        apellido_Casada: string;
        camarasEmpresariales?: (CamarasEmpresarialesEntity)[] | null;
        categoria: number;
        categoria_Desc: string;
        codigo_Clasificacion: number;
        codigo_Clasificacion_Desc: string;
        codigo_Titulo: number;
        codigo_Titulo_Desc: string;
        comunidad_Linguistica: number;
        comunidad_Linguistica_Desc: string;
        departamento_Nacimiento: number;
        departamento_Nacimiento_Desc: string;
        dpi: string;
        dpimadre: string;
        dpipadre: string;
        ente_Inscriptor: string;
        estado_Civil: number;
        estado_Civil_Desc: string;
        estado: number;
        estadoDesc: string;
        fecha_Colegiado: string;
        // fecha_Emision_DPI: string;
        fecha_Expira_Pasaporte: string;
        fecha_Fallecimiento: string;
        fecha_Nacimiento: string | Moment;
        fecha_Vencimiento_DPI: string;
        fechaInscripcionRTU: string;
        genero: number;
        genero_Desc: string;
        gremiales?: (GremialesEntity)[] | null;
        marcas?: (MarcasEntity)[] | null;
        municipio_Emision_Cedula: number;
        municipio_Emision_Cedula_Desc: string;
        municipio_Nacimiento: number;
        municipio_Nacimiento_Desc: string;
        nacionalidad: number;
        nacionalidad_Desc: string;
        nit_Madre: string;
        nit_Padre: string;
        nitconyuge: string;
        nombresConyuge: string;
        nombres_Madre: string;
        nombres_Padre: string;
        numero_Colegiado: number;
        numero_Orden_Cedula: number;
        numero_Registro_Cedula_Desc: string;
        numero_Registro_Cedula: string;
        otros_Nombres: string;
        pais_Origen: number;
        pais_Origen_Desc: string;
        participacionEmpresarial: boolean;
        participacionGremial: boolean;
        pasaporte: string;
        poblacion: number;
        poblacion_Desc: string;
        primer_Apellido: string;
        primer_Nombre: string;
        sectorEconomico: SectorEconomico;
        segundo_Apellido: string;
        segundo_Nombre: string;
        tipoDocumento: number;
        tipoDocumento_Desc: string;
        tipoNit: string;
        tipoNitDesc: string;
        tipoPasaporte: number;
        listaColegiados: (ColegiadoEntity)[] | null;
        datosEmbajada: any;
    }
    export interface ActividadEconomicaPrincipal {
        ciiu: string;
        nombreActividadEconomica: string;
    }
    export interface CamarasEmpresarialesEntity {
        camaraEmpresarial: number;
        camaraEmpresarialDesc: string;
        estado: number;
        estadoDesc: string;
        fechaAdiciono: string;
        fechaEstado: string;
        fechaFin: string;
        fechaInicio: string;
        fechaModifico: string;
        nit: string;
        usuarioAdiciono: string;
        usuarioModifico: string;
    }
    export interface GremialesEntity {
        estado: number;
        estadoDesc: string;
        fechaAdiciono: string;
        fechaEstado: string;
        fechaFin: string;
        fechaInicio: string;
        fechaModifico: string;
        gremial: number;
        gremialDesc: string;
        nit: string;
        usuarioAdiciono: string;
        usuarioModifico: string;
    }
    export interface MarcasEntity {
        codigoMarca: number;
        estado: string;
        fechaCreacion: string;
        fechaEstado: string;
        fechaModifico: string;
        nombreCodigoMarca: string;
        usuarioAdiciono: string;
        usuarioModifico: string;
        vigenciaDesde: string;
        vigenciaHasta: string;
    }
    export interface SectorEconomico {
        estado: number;
        estadoDesc: string;
        fechaAdiciono: string;
        fechaEstado: string;
        fechaFin: string;
        fechaInicio: string;
        fechaModifico: string;
        nit: string;
        sectorEconomico: number;
        sectorEconomicoDesc: string;
        usuarioAdiciono: string;
        usuarioModifico: string;
    }
    export interface ColegiadoEntity {
        numeroColegiado: number;
        fechaColegiado: string;
        codTitulo: number;
        codTituloDesc: string;
        estado: number;
        estadoDesc: string;
        correlativo: number;
        codProfesion: number;
        codProfesionDesc: string;
    }
    export interface Empresa {
        actividadEconomicaPrincipal: ActividadEconomicaPrincipal;
        anioDoctoConstitucion: number;
        camarasEmpresariales?: (CamarasEmpresarialesEntity)[] | null;
        categoria: number;
        categoria_Desc: string;
        codigo_Clasificacion: number;
        codigo_Clasificacion_Desc: string;
        descPersoneria: string;
        descTipoFiduciaria: string;
        documentoConstitucion: DocumentoAdjunto;
        documentoPatente: DocumentoAdjunto;
        ente_Inscriptor: string;
        estado: number;
        estadoDesc: string;
        fechaCambioRazon: string;
        fechaCancelacion: string;
        fechaConstitucion: string;
        fechaInscripcion: string;
        fechaInscripcionRTU: string;
        gremiales?: (GremialesEntity)[] | null;
        marcas?: (MarcasEntity)[] | null;
        nitNotario: string | null;
        nombreNotario: string | null;
        numeroDoctoConstitucion: number;
        participacionEmpresarial: boolean;
        participacionGremial: boolean;
        razonSocial: string;
        registroExterno: number;
        sectorEconomico: SectorEconomico;
        tipoDoctoConstitucion: number;
        tipoDoctoConstitucionDesc: string;
        tipoNit: string;
        tipoNitDesc: string
        nitBancoFinancieraFiduciaria: string;
        tipoPersoneria: number;
    }
    export interface DocumentoAdjunto {
        cargado: boolean;
        carpetaArchivo: string;
        documento: Documento;
        idDocumento: string;
        identificador: string;
        nombre: string;
        tipoDocumento: string;
    }
    export interface Documento {
        absolute: boolean;
        absolutePath: string;
        canonicalPath: string;
        directory: boolean;
        file: boolean;
        freeSpace: number;
        hidden: boolean;
        name: string;
        parent: string;
        path: string;
        totalSpace: number;
        usableSpace: number;
    }
    export interface EstablecimientoEntity {
        direccionCompleta: string;
        documentoResolucionExento: DocumentoAdjunto;
        fechaFinalBeneficioFiscal: string;
        fechaInicialBeneficioFiscal: string;
        fechaInicioExento: string;
        fechaInicioOperaciones: string;
        historicoCambioDomicilio?: (HistoricoCambioDomicilioEntity)[] | null;
        idActividadComercial: string;
        idActividadEconomica: string;
        idClasificacionEstablecimento: string;
        idTipoEstablecimiento: string;
        lineaFija: string;
        nombreActividadComercial: string;
        nombreActividadEconomica: string;
        nombreClasificacionEstablecimiento: string;
        nombreEstablecimiento: string;
        nombreTipoEstablecimiento: string;
        numeroSecuenciaEstablecimiento: number;
        obligacionesEstablecimiento: ObligacionesEstablecimiento;
        telefonoCelular: string;
        ubicacion: UbicacionEntity;
        estado: number;
        estadoDesc: string;
        fechaCambioDomicilioComercial: string;
        fechaEstado: string;
        fechaCancelacion: string;
        motivo: string;
        fechaCambioNombreComercial: string;
        fechaCambioActividadComercial: string;
        fechaCambioActividadEconomica: string;
        numeroResolucionBeneficioFiscal: string;
        fechaResolucionBeneficioFiscal: string;
    }

    export interface HistoricoCambioDomicilioEntity {
        direccion: Direccion;
        fechaCambioActividadComercial: string;
        fechaCambioDomicilioComercial: string;
        fechaCambioNombreComercial: string;
        nombreComercial: string;
        numeroDeSecuencia: number;
    }
    export interface Direccion {
        apartamentoLetra: string;
        apartamentoNumero: string;
        casaLetra: string;
        casaNumero: string;
        departamento: number;
        departamentoDesc: string;
        descripcionGrupoHabitacional: number;
        grupoHabitacionalDesc: string;
        municipio: number;
        municipioDesc: string;
        viabilidadDNumeroDesc: string;
        vialidadNombre: string;
        vialidadNumero: number;
        vialidadDesc: string;
        zonaDesc: string;
        vistaPrevia: string;
    }
    export interface UbicacionEntity {
        apartadoPostal: string;
        apartamentoLetra: string;
        apartamentoNumero: string;
        casaLetra: string;
        casaNumero: string;
        celularArea: string;
        celularCompania: string;
        celularCompaniaDesc: string;
        celularNumero: string;
        correoElectronico: string;
        correoNotificaciones: string;
        departamento: number;
        departamentoDesc: string;
        descTipoDireccion: string;
        documentoAdjunto: DocumentoAdjunto;
        grupoHabitacional: number;
        grupoHabitacionalDesc: string;
        descripcionGrupoHabitacional: string;
        lineaFijaArea: string;
        lineaFijaCompania: string;
        lineaFijaCompaniaDesc: string;
        lineaFijaNumero: string;
        localizada: boolean;
        municipio: number;
        municipioDesc: string;
        otros: string;
        pais: number;
        paisDesc: string;
        tipoDireccion: number;
        vialidad: number;
        vialidadDesc: string;
        vialidadNombre: string;
        vialidadNumero: string;
        vistaPrevia: string;
        zona: string;
        zonaDesc: string;
        estado: number;
        estadoDesc: string;
    }
    export interface HistoricoRepresentanteYapoderado {
        estado: number;
        estadoDesc: string;
        fechaDesde: string;
        fechaHasta: string;
        fechaEstado: string;
        fechaNombramiento: string;
        fechaVigencia: string;
        nit: string;
        nombre: string;
    }
    export interface HistoricoContadorEntity {
        fechaDesde: string;
        fechaHasta: string;
        fechaNombramiento: string;
        nitContador: string;
        nombresApellidos: string;
    }
    export interface HistoricoSocioEntity {
        cantidadAcciones: number;
        fechaDesde: string;
        fechaHasta: string;
        nitSocio: string;
        porcentajeParticipacion: number;
    }
    export interface RepresentanteEntity {
        aniosRepresentacion: number;
        correlativo: number;
        correoElectronico: string;
        descEstado: string;
        documentoAdjunto: DocumentoAdjunto;
        estado: string;
        fechaCancelacion: string;
        fechaInscripcion: string;
        fechaNombramiento: string;
        fechaVigenteHasta: string;
        nit: string;
        nombre: string;
        tipo: number;
        tipoDesc: string;
    }
    export interface SociosEntity {
        cantidadAcciones: number;
        correlativo: number;
        fechaStatus: string;
        nitEmpresa: string;
        nitSocio: string;
        nombreSocio: string;
        numeroId: string;
        paisOrigen: number;
        paisOrigenDesc: string;
        porcentajeParticipacion: number;
        razonSocial: string;
        status: string;
        tipoDocumentoDesc: string;
        tipoDocumentoId: number;
        tipoSocio: number;
        tipoSocioDesc: string;
        nitRepresentante: string;
        nombreRepresentante: string;
        ubicacionFiscal: string;
    }
    export interface TipoContribuyente {
        value: string;
        valueDesc: string;
    }
    export interface Ubicacion {
        confContra: string;
        contraseña: string;
        correoAdicional: string;
        correoNotificaciones: string;
        correoPrincipal: string;
        historicoCambioDomicilio?: (HistoricoCambioUbicacion)[] | null;
        tipoMedio: string;
        tipoMedioDesc: string;
        ubicaciones?: (UbicacionEntity)[] | null;
        usuario: string;
        fechaCambioDomicilioFiscal: string | null;
    }
    export interface HistoricoCambioUbicacion {
        direccion: Direccion;
        fechaDesde: string;
        fechaHasta: string;
    }
    export interface Meta {
        fechaCreacion: string;
    }
    //************************************************CONVENIOS DE PAGO*************************************************/
    /**
       * @description Interfaz para obtener los convenios de pago del contribuyente
       * @author Jamier Batz (ajsbatzmo)
       * @since 30/06/2022
       */
    export interface PaymentAgreement {
        numeroFormulario: string
        numeroExpediente: string
        estadoConvenio: string
        fechaPresentacion: string
        totalAutorizado: number
        plazoOtorgado: number
        cuotasPagadas: number
        montoPagado: number
        saldo: number
    }

    /**
      * @description Interfaz para obtener el detalle del convenio de pago
      * @author Jamier Batz (ajsbatzmo)
      * @since 30/06/2022
      */
    export interface PaymentAgreementDetail {
        cuota: number
        numeroFormulario: string
        fechaRecaudo: string
        impuesto: number
        interes: number
        mora: number
        multaOmision: number
        multaFormal: number
        multaRectificativa: number
        cuotaPagar: number
        saldoPagar: number
        recargoInteres: number
        recargoMora: number
        totalRecargo: number
        totalPagado: number
    }

    /**
     * @description Interfaz para obtener el resumen del convenio de pago
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface PaymentAgreementSummary {
        registros: number
        totalAutorizado: number
        totalMontoPagado: number
        totalSaldo: number
    }

    /**
     * @description Interfaz para obtener el detalle del resumen del convenio de pago
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface PaymentAgreementDetailSummary {
        totalAutorizadoDetalleI: number
        cuotasAutorizadasDetalleI: number
        cuotasCanceladasDetalleI: number
        montoCuotasPagadasDetalleI: number
        saldoTotalDetalleI: number
    }

    //************************************************RETENCIONES IVA*************************************************/

    /**
     * @description Interfaz para enviar parametros de retenedor y recibir registro de retenciones
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface RetenIVA {
        nitAgenteRetenedor: string;
        fechaInicio: string;
        fechaFin: string;
        nitRetenido: string;
        estadoRetencion: string;
        codigoEstado: string;
        numeroConstancia: string;
        limite: string;
        claveResumen: string;
        usuario: string;
        concepto: string;
        fr: string;
        tipo: number;
        codigoRenta: number;
    }

    /**
     * @description Interfaz para enviar paramentros de agente retenedor y recibir total de retenciones
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface RetenIVATotal {
        nitAgenteRetenedor: string;
        fechaInicio: string;
        fechaFin: string;
        nitRetenido: string;
        estadoRetencion: string;
        codigoEstado: string;
        numeroConstancia: string;
        limite: string;
        clavePaginaSiguiente: string;
        claveResumen: string;
        usuario: string;
        concepto: string;
        fr: string;
        tipo: number;
        codigoRenta: number;
    }


    /**
     * @description Interfaz para obtener el total de registros de retenciones
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface RetenIVATotalResponse {

        total: number;
        clavePagina?: number;
        claveResumen: string;
    }

    /**
     * @description Interfaz padre para obtener lista de registros de reten IVA
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */

    export interface RetenIVAParentResponse {
        pagina?: number;
        total?: number;
        totalPagina: number;
        data: RetenIVAResponse[];
        clavePaginaSiguiente: string;
        claveResumenPaginaSiguiente: string;
        nitPaginaSiguiente?: string;
        facturaValida?: boolean;
        sujetaRetencion: string;
        sujetaRetencionIsr: string;
        mensaje: string;

    }

    /**
     * @description Interfaz para obtener registro de reten iva
     * @author Jamier Batz (ajsbatzmo)
     * @since 30/06/2022
     */
    export interface RetenIVAResponse {

        nitAgenteRetenedor: string;
        tipoAgenteRetencion: string;
        usuarioAgenteRetenedor: string;
        ordenFechaNitcConstancia: string;
        nitEmisorFactura: string;
        fechaEmision: string;
        numeroConstancia: string;
        estadoRetencion: string;
        nombreEmisorFactura: string;
        entidad: string;
        concepto: string;
        fechaTransaccion: string;
        cantidadFacturas: number;
        totalFacturas: number;
        totalImporteNeto: number;
        totalRetencion: number;
        totalValorAfecto: number;
        numeroDeclaracion?: string;
        codigoConcepto?: number;
        codigoRenta: number;
    }

    /**
    * @description Interfaz para mandar data de generacion excel masivo
    * @author Jamier Batz (ajsbatzmo)
    * @since 10/07/2022
    */
    export interface AgenteExcelMasivo {
        nit?: string;
        id_tipo: number;
        nombre_agente?: string;
        codigo: string;
        id_clasificacion: number;
        nombre_unidad: string;
        usuario?: string;
        estado: string;
        uc: string;
        fr: string;
        independiente: string;
        manual: string;
        nombre_tipo?: string;
        fecha_ini_retencion: string;
        clasiRtu: string;
    }

    export interface ExcelMasivo {
        cantSelec: string;
        tipoDeUsuarioE?: string;
        unidadE: string;
        tipoAgenteE?: string;
        codigoEstadoE: string;
        nitAgentenRetencionE?: string;
        nombreAgenteRetencionE?: string;
        usuarioE?: string;
        fechaDelEx: string;
        fechaAlEx: string;
        estadoE: string;
        concepto: string;
        totalTotalFactura: string;
        totalImporteNeto: string;
        totalAfectoRetencion: string;
        totalRetencion: string;
        totalTotalRentaImponible: string;
        usuario?: string;
        registrosSinFEL: number;
        agente: AgenteExcelMasivo;
        tipoExcel: string;
        varModoReg: number;
        constanciasGE?: string[];
        usrAdmin: boolean;
    }

    export interface ExcelMasivoRespuesta {
        resultado: string;
    }

    /**
    * @description Interfaces para obetener datos de usuario en base a nit
    * @author Jamier Batz (ajsbatzmo)
    * @since 10/07/2022
    */
    export interface RetenIVAUser {
        nit: string;
    }
    export interface RetenIVAUserResponse {
        usuario: string;
        nit: string;
        estado: string;
    }

    export interface AsisteLibrosComprasResponse {
        nitReceptor: string;
        nombreReceptor: string;
        habilitacionFEL: string;
        compras: AsisteLibrosCompraDetalleResponse[];
        sumaIVA: number;
        sumaCantDoc: number;
        sumaValorDoc: number;
        error?: any;
    }

    export interface AsisteLibrosCompraDetalleResponse {
        tipo: string;
        estado: string;
        totaliva: string;
        cantidad_documentos: string;
        totaldoc: string;
    }

    export interface AsisteLibrosComprasParams {
        anio: number;
        establecimiento: string;
        estado: string;
        mes: string;
        nitReceptor: string;
        tipoDocumento: string;
        tipo: string;
    }

    export interface AsisteLibrosVentasParams {
        anio: number;
        establecimiento: string;
        estado: string;
        mes: number;
        nitEmisor: string;
        tipoDocumento: string;
        tipo: string;
    }

    export interface AsisteLibrosVentasResponse {
        nitEmisor: string;
        nombreEmisor: string;
        habilitacionFEL: string;
        ventasV: AsisteLibrosVentasDetalleResponse[];
        ventasI: AsisteLibrosVentasDetalleResponse[];
        sumaIVA: number;
        sumaCantDoc: number;
        sumaValorDoc: number;
        error?: any;
    }

    export interface AsisteLibrosVentasDetalleResponse {
        tipo: string;
        estado: string;
        totaliva: string;
        cantidad_documentos: string;
        totaldoc: string;
    }

    export interface ExcelReporte {
        fecha: string;
        establecimiento_tipotransaccion: string;
        tipotransaccion_tipofyduca: string;
        tipofyduca_tipoduca: string;
        tipo_de_documento: string;
        estado: string;
        valor_iva_bienes: string;
        valor_iva_servicios: string;
        valor_gravado_bienes: string;
        valor_gravado_servicios: string;
        valor_exento_bienes: string;
        valor_exento_servicios: string;
        valoridp: string;
        valorith: string;
        valoritp: string;
        valortdp: string;
        valorifb: string;
        valormun: string;
        valorcem: string;
        valoridb: string;
        valoribn: string;
        valortab: string;
        valortap: string;
        valor_total_documento: string;
    }

    /**
     * Luis Villagran
     */
    export interface ImportacionSIVEPA {
        nit: string;
        fecha: string;
        fechaDos: string;
    }
    /**
         * Luis Villagran
         */
    export interface ImportacionSIVEPARespuesta {
        descripcion: String;
        identificador_DECLARACION: String;
        fecha_DECLARACION: String;
        nit_contnit_CONTRIBUYENTE: String;
        aduana: String;
        regimen: String;
        valor_CIF: String;
        valor_DAI: String;
        correlativo_ENC: String;
    }

    export interface DeclarationParams {
        pNit: string
        pAnio: number[]
        pCodigo: number[]
    }

    export interface Declaration {
        mes_DESDE: string;
        declaraciones: string;
        mes: string;
        anio: string;
        valor: string;
        numero_CASILLA: string;
        concepto_INTEGRADO: string;
        descripcion_CONCEPTO: string;
    }

    export interface DeclarationResume {
        declaraciones: string;
        idresumen: string;
        anio: string;
        impuesto: string;
        posicion: string;
        tipoimpuesto: string;
        formularios: string;
        selectedYear?: string;
    }

    /**
* @description Interfaces para obetener datos de duas y ducas
* @author Jamier Batz (ajsbatzmo)
* @since 10/07/2022
*/
export interface DataDuasDucas {
	numeroOrden: string;
	numeroDua: string;
	codigoSAC: string;
	fechaAceptacion: string;
	docImpoExpo: string;
	razonSocialImpoExpo: string;
	tipoCambio: number;
	docAgente: string;
	razonSocialAgente: string;
	regimenModalidad: string;
	claseDeclaracion: string;
	paisProceDestino: string;
	fobDolares: number;
	fleteDolares: number;
	seguroDolares: number;
	otrosGastos: number;
	numeroBultos: number;
	pesoNeto: number;
	unidadesFisicas: number;
	selectivo: string;
	modoTransporte: string;
	proveedorDestinatario: string;
	formaPago: string;
	totalValorAduanaMPI: number;
	tributo: string;
	valorTributo: number;
	cantidadBultosFR: number;
	pesoBrutoFR: number;
	pesoNetoFR: number;
	tipoUnidad: string;
	cantidadUnidadesFR: number;
	descripMercaFR: string;
	paisOrigen: string;
	valorAduanaFR: number;
	fobDolaresFR: number;
	fleteDolaresFR: number;
	seguroDolaresFR: number;
	valorCIFQ: number;
	cantidadUnidadesDVA: number;
	idComercialMercaDVA: string;
	descripMercaDVA: string;
	marcaDVA: string;
	modeloDVA: string;
	valorUnitarioDVA: number;
}


/**
* @description Interfaces para obetener datos de duas y ducas
* @author Jamier Batz (ajsbatzmo)
* @since 10/07/2022
*/
export interface DuasDucasResponse {
	message: string;
	code: number;
	type: string;
	data: DataDuasDucas[];
}

/**
* @description Interfaces para parametros de envio para duas y ducas
* @author Jamier Batz (ajsbatzmo)
* @since 10/07/2022
*/
export interface ParamsDuasDucas {
	nit: string;
	fecha: string;
	codigo: string;
}


//interfaces para la consulta EFA
export interface EfaParams {
    pDocFirmado: string;
    pNit: string;
    pPeriodoDesde: string;
    pPeriodoHasta: string;
}

export interface EfaRespose {
    id: string;
    nit: string;
    periodoDesde: string;
    periodoHasta: string;
    nombreArchivo: string;
    dataArchivo: Byte[];
    tipoArchivo: string;
    estado: string;
    fechaPresentacion: string;
    fechaActualizacion: string;
    anio: string;
    docFirmado: string;
    tipoObligacion: string;
}


}