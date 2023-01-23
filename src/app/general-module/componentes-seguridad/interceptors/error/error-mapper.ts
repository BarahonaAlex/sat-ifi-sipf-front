export class ErrorMapper {
    public static readonly HTTP_ERROR_MAP: { [key: number]: string } = {
        0: 'No se pudo establecer conexión con el servidor',
        401: 'Acceso no autorizado',
        403: 'No tiene permisos necesarios para acceder a la información',
        404: 'No se encuentra la ruta solicitada',
        500: 'Error interno del servidor',
        502: 'Servicio solicitado no es válido',
        503: 'Servicio no está disponible temporalmente',
        504: 'La operación ha demorado demasiado, por favor espere unos segundos y verifique si se completó'
    };
}