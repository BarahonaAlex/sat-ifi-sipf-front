/*
 * Superintendencia de Administracion Tributaria (SAT)
 * Gerencia de Informatica
 * Departamento de Desarrollo de Sistemas
 */

import { Catalog } from "../interfaces/Catalog.interface";


/**
* Clase de constantes del sistema
* 
* @author Rudy Culajay (ruarcuse)
* @since 11/02/2022
* @version 1.0
*/
export class Constantes {
    static CAT_ADMINISTRATIVE_UNITS = 26;
    static CAT_WORK_POSITIONS = 25;

    static CAT_SUPPLY_ORIGIN = 17;
    static CAT_REGIONAL = 9;
    static CAT_TAXES = 10;

    static CAT_FISCAL_PROGRAM_TYPE = 14;
    static CAT_FISCAL_PROGRAM_ROUTING = 15;
    static CAT_FISCAL_PROGRAM_COUNTRYSIDE_ROUTING = 16;
    static CAT_FISCAL_PROGRAM_PROGRAMER_DEPARTMENT = 39;
    static CAT_FISCAL_PROGRAM_STATUS = 19;

    static CAT_INGRESO_CASES_IMPUESTOS = 10;
    static CAT_INGRESO_CASES_GERENCIAS = 9;
    static CAT_INGRESO_CASES_TIPO = 13;
    static CAT_INGRESO_CASES_ORIGEN = 17;
    static CAT_INGRESO_CASES_DEPARTAMENTO = 39;

    static CAT_ESTADOS_GRUPOS_TRABAJO = 36;

    static CARGA_MASIVAS = 5;

    static CAT_TIPO_CASOS = 87;
    static CAT_TIPO_INSUMOS = 65;

    static CAT_INDICADORES_PLAN = 66;
    static CAT_TIPO_META = 67;

    // Constantes del contribuyente

    CODIGO_CAT_REGIMEN_IVA = '29';
    CODIGO_CAT_TIPO_CONTRIBUYENTE_IMPUESTOS = '30';
    CODIGO_CAT_AFILIACION_ISO_FORMA_CALCULO = '37';
    CODIGO_CAT_TIPO_PERSONERIA = '13';
    CODIGO_CAT_TIPO_RENTA = '34';
    CODIGO_CAT_TIPO_RENTA_EMP = '35';
    CODIGO_CAT_SISTEMA_INVENTARIO = '38';
    CODIGO_CAT_SISTEMA_CONTABLE = '39';
    CODIGO_CAT_SECTOR_ISR = "40";
    CODIGO_CAT_RENTA_IMPONIBLE_ISR = "41";
    CODIGO_CAT_TIPO_DOC_CONSTITUCION = '19';//'18'
    CODIGO_CAT_SECTOR_ECONOMICO = '15';//'19'
    CODIGO_CAT_TIPO_REPRESENTANTE_LEGAL = '24';
    CODIGO_CAT_TIPO_PRESTACION_SERVICIO = '23';
    CODIGO_CAT_REGISTROS_EXTERNOS = '21';
    CODIGO_CAT_TIPO_ESTABLECIMIENTO = "26"; // Catálogo Padre Tipo Establecimiento amoecheve.
    CODIGO_CAT_DATO_TIPO_ESTABLECIMIENTO = "27"; // Catálogo Dato Hijo Tipo Establecimiento amoecheve.
    CODIGO_CAT_TIPO_ESTABLECIMIENTO_AFECTO = "885"; // Catálogo Tipo Establecimiento Afecto.
    CODIGO_CAT_TIPO_ESTABLECIMIENTO_EXENTO_CONSTITUCIONAL = "887"; // Catálogo Tipo Establecimiento Exento.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO_AFECTO = "873"; // Catálogo clasificación establecimiento afecto.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO_EXENTO = "874"; // Catálogo clasificación establecimiento exento.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO = "22";
    // Catálogo Tipo Aviso
    CODIGO_CAT_TIPO_AVISO = "43";
    CODIGO_CAT_TIPO_DIRECCIONES = '16';
    CODIGO_CAT_OTROS_MEDIOS = '18';
    CODIGO_CAT_DEPARTAMENTOS = '2';
    CODIGO_CAT_ZONAS = '7';
    CODIGO_CAT_GRUPOS_HABITACIONALES = '8';
    CODIGO_CAT_VIALIDADES = '9';
    CODIGO_CAT_VALORES_EXCLUYENTES = '28';
    CODIGO_CAT_CODIGO_POSTAL = '46';
    CODIGO_CAT_BANCOS_ENTIDADES_FIDUCIARIAS = '47';
    CODIGO_CAT_PAISES = '10';


    CODIGO_CAT_TIPO_CONTRIBUYENTE = '31';
    CODIGO_CAT_REQUISITO_CONTRIBUYENTE = '48';
    CODIGO_CAT_CAMARAS_EMPRESARIALES = '49';
    CODIGO_CAT_GREMIALES = '50';

    //Constantes condiciones especiales     
    CODIGO_CONESPDATO_AFECTO_EXENTO = '2';
    CODIGO_CONESPDATO_FORMULARIOS = '3';
    CODIGO_CONESPDATO_INDICADOR_OBLIGACION_ISR = '10';//'103';
    CODIGO_CONESPDATO_FORMA_CALCULO_ISR = '9';//'101';
    CODIGO_CONESPDATO_FRECUENCIA_PAGO_ISR = '8';//'100';
    CODIGO_CONESPDATO_CODIGO_POSTAL_MUNICIPIO = '4';
    CODIGO_CONESPDATO_REGISTRO_EXTERNO = '5';

    //constantes variables     
    TIPO_REPRESENTANTE = '11';//'10';
    TIPO_PRESTACION_SERVICIO_ISR = '863';//'73';
    TIPO_PRESTACION_SERVICIO_IVA = '864';//'105';
    TIPO_CIIU_ISRA = '0004.40';
    TIPO_CIIU_ISRB = '0004.41';

    //Constantes para tipos de documentos de identificación
    CODIGO_DOCUMENTO_AGUA_LUZ_TELEFONO = '923';
    CODIGO_DOCUMENTO_REPRESENTACION_LEGAL = '881';

    //Personerías
    static OTRA_ENTIDAD_RELIGIOSA = '736';

    //Características Especiales
    static EMISOR_FEL = 2432;
    static CODIGO_PERITO_CONTADOR = 988;
    static CODIGO_CPA_EMISOR_DICTAMEN = 1076;
    static CODIGO_CONTADOR_PUBLICO_AUDITOR = 1018;

    //Tipos de Documentos para Extranjero
    static PASAPORTE_POR_DEFECTO = 0;
    static PASAPORTE = 1078;
    static SOLICITANTE_DEL_ESTATUTO_REFUGIADO = 1079;
    static RECONOCIDO_BAJO_EL_ESTATUTO_DE_REFUGIADO = 1080;

    //Codigo de afiliaciones

    static CODIGO_AFILIACION_IVA = 11;
    static NOMBRE_AFILIACION_IVA = 'IMPUESTO AL VALOR AGREGADO';
    static CODIGO_AFILIACION_ISR = 10;
    static NOMBRE_AFILIACION_ISR = 'IMPUESTO SOBRE LA RENTA';
    static CODIGO_AFILIACION_ISO = 27;
    static NOMBRE_AFILIACION_ISO = 'IMPUESTO DE SOLIDARIDAD';
    static CODIGO_AFILIACION_IDP = 21;
    static NOMBRE_AFILIACION_IDP = 'IMPUESTO DE IDP ';
    static CODIGO_AFILIACION_TABACO = 15;
    static NOMBRE_AFILIACION_TABACO = 'IMPUESTO DE TABACO ';
    static CODIGO_AFILIACION_IDB = 14;
    static NOMBRE_AFILIACION_IDB = 'IMPUESTO DE IDB ';
    static CODIGO_AFILIACION_IDC = 23;
    static NOMBRE_AFILIACION_IDC = 'IMPUESTO DE IDC ';
    static CODIGO_AFILIACION_CABLE = 43;
    static NOMBRE_AFILIACION_CABLE = 'IMPUESTO DE CABLE ';

    //regimen IVA
    //Codigo de afiliaciones

    static CODIGO_IVA_GENERAL = 817;
    static NOMBRE_IVA_GENERAL = 'GENERAL';
    static CODIGO_IVA_PEQUE = 818;
    static NOMBRE_IVA_PEQUE = ' PEQUEÑO CONTRIBUYENTE';
    static CODIGO_IVA_ELEC_AGRO = 2500;
    static NOMBRE_IVA_ELEC_AGRO = 'RÉGIMEN ELECTRÓNICO ESPECIAL DEL CONTRIBUYENTE AGROPECUARIO';
    static CODIGO_IVA_PEQUE_ELECTRONICO = 2501;
    static NOMBRE_IVA_PEQUE_ELECTRONICO = 'RÉGIMEN ELECTRÓNICO DE PEQUEÑO CONTRIBUYENTE';
    static CODIGO_IVA_ESPE_AGRO = 2499;
    static NOMBRE_IVA_ESPE_AGRO = 'RÉGIMEN ESPECIAL DE CONTRIBUYENTE AGROPECUARIO';

    //marca ganadero
    static CODIGO_GANADERO = 1000;
    static NOMBRE_GANADERO = 'GANADERO';

    //Tipo de direcciones
    static CODIGO_DIRECCION_FISCAL = 755;

    //Tipos de socios
    static CODIGO_SOCIO_DOMICILIADO = 2460;
    static CODIGO_SOCIO_NO_DOMICILIADO = 2461;
    static CODIGO_SOCIO_PARTES_REL_EXTRANJERO = 2462;
    static CODIGO_SOCIO_GRUPO_COORPORATIVO = 2463;
    static CODIGO_SOCIO_PARTICIPANTE = 1054;

    //Nacionalidades
    static GUATEMALTECO = 1385;
    static EXTRANJERO = 1386;
    static EXTRANJERO_DOMICILIADO = 1387;

    //Ratificacion
    static FA05 = 1;
    static FA17 = 2;
    static FA04 = 3;
    static FA06 = 4;
    static FA15 = 5;
    static FA16 = 6;
    static FA19 = 7;
    static FA08 = 8;
    static FA09 = 9;
    static FA11 = 10;
    static FA13 = 11;
    static FA14 = 12;
    static FA18 = 13;

    //
    static CODIGO_MARCA_AGENCIA_VIRTUAL = 918;
    static CODIGO_MARCA_RATIFICADO_ACTUALIZADO = 915;
    static CODIGO_MARCA_NO_RATIFICADO = 916;

    //
    static PersonaNegocio = 1;
    static EmpresaOrganizacion = 2;

    //Tipo de asociacio
    static NIT_DIPLOMATICO = 837;
    static NIT_EMBAJADA = 836;

    static DOMICILIO_FISCAL = "755";
    static DOMICILIO_COMERCIAL = "756"

    static USER_PROFILES: { [key: number]: string } = {
        8: 'AdministrativoSIPFAutorizadorGerencial',
        1: 'AdministrativoSIPFAutorizador',
        2: 'AdministrativoSIPFAprobador',
        4: 'AdministrativoSIPFVerificador',
        3: 'AdministrativoSIPFOperador',
        12: 'AdministrativoSIPFAutorizadorGerencialIntendente'
    };
    static ESTADO_INSUMO_CORREGIR = 179;
    static ESTADO_CASO_CORREGIR = 17;
    static ESTADO_CASO_RECHAZADO_OP = 16;
    static ESTADO_CASO_RECHAZADO_DEFINITIVO = 1040
    static ESTADO_CASO_PENDIENTE_DOCUMENTAR = 183
    static ESTADO_CASO_PENDIENTE_PUBLICAR = 184
    static ESTADO_CASO_PUBLICADO = 185
    static ESTADO_CASO_DOCUMENTADO = 186

    static ESTADO_INSUMO_NUEVO = 177;
    static ESTADO_INSUMO_PENDIENTE_PUBLICAR = 1081;
    static ESTADO_INSUMO_DOCUMENTAR = 178;
    static ESTADO_INSUMO_RECHAZO_DEF = 440;
    static ESTADO_INSUMO_SUSPENDIDO = 439;


    //Tipo de Plantillas
    static DENUNCIA = 4;
    static SELECTIVO = 2;
    static MASIVO = 5;

    // Meses del año
    static MONTHS_MAP: Catalog[] = [
        { codigo: 1, nombre: 'Enero' },
        { codigo: 2, nombre: 'Febrero' },
        { codigo: 3, nombre: 'Marzo' },
        { codigo: 4, nombre: 'Abril' },
        { codigo: 5, nombre: 'Mayo' },
        { codigo: 6, nombre: 'Junio' },
        { codigo: 7, nombre: 'Julio' },
        { codigo: 8, nombre: 'Agosto' },
        { codigo: 9, nombre: 'Septiembre' },
        { codigo: 10, nombre: 'Octubre' },
        { codigo: 11, nombre: 'Noviembre' },
        { codigo: 12, nombre: 'Diciembre' },
    ];

    // Formatos de fecha
    static DATE_FORMATS = {
        parse: {
            dateInput: 'YYYY',
        },
        display: {
            dateInput: 'YYYY',
            monthYearLabel: 'YYYY',
            monthYearA11yLabel: 'YYYY',
        },
    };
}
