type Error = 'maxFileSize' | 'badFileFormat' | 'noFileFound' | 'corruptFileFormat' | null | undefined;
interface FileStatus {
    error: Error;
    isValid: boolean;
    message: string;
    status: string;
}
export class FileUtils {
    private static readonly MIME_TYPE_MAP: { [key: string]: string } = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/x-icon': 'ico',
        'image/svg+xml': 'svg',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.oasis.opendocument.text': 'odt',
        'application/vnd.oasis.opendocument.spreadsheet': 'ods',
        'application/vnd.oasis.opendocument.presentation': 'odp',
        'application/zip': 'zip',
        'application/x-rar-compressed': 'rar',
        'application/x-7z-compressed': '7z',
        'application/x-tar': 'tar',
        'application/x-gzip': 'gz',
        'application/x-bzip2': 'bz2',
        'application/x-compressed-tar': 'tar',
        'application/x-compressed': 'tgz',
        'text/plain': 'txt',
        'text/csv': 'csv'
    };

    private static readonly EXTENSIONS_MAP: { [key: string]: string } = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'ico': 'image/x-icon',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'odt': 'application/vnd.oasis.opendocument.text',
        'ods': 'application/vnd.oasis.opendocument.spreadsheet',
        'odp': 'application/vnd.oasis.opendocument.presentation',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        '7z': 'application/x-7z-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/x-gzip',
        'bz2': 'application/x-bzip2',
        'tgz': 'application/x-compressed',
        'txt': 'text/plain',
        'csv': 'text/csv',
    };

    /**
     * Determina la extensión de un archivo a partir de su `mimeType`.
     * 
     * @param mimeType tipo de archivo a obtener la extension (Ej: 'image/jpeg')
     * @returns Extension del archivo (Ej: 'jpg')
     */
    public static getFileExtension(mimeType: string): string {
        return this.MIME_TYPE_MAP[mimeType];
    }

    /**
     * Determina el tipo de un archivo a partir de su `extension`.
     * 
     * @param extension extension del archivo a convertir a mimeType (Ej: 'jpg')
     * @returns Tipo de archivo (Ej: 'image/jpeg')
     */
    public static getMimeType(extension: string): string {
        return this.EXTENSIONS_MAP[extension];
    }

    /**
     * Este metodo se encarga de validar el tipo de un archivo.
     * 
     * @param file archivo a validar
     * @param expectedFileType tipo del archivo esperado
     * @returns `true` si el archivo es del tipo esperado, `false` en caso contrario
     */
    public static isValidFile(file: File | Blob, expectedFileType: Array<string>, maxFileSize: number): FileStatus {
        console.log(file, expectedFileType);
        console.log(file.type, this.getFileExtension(file.type));
        if (!file) return {
            error: 'noFileFound',
            isValid: false,
            message: 'No se ha seleccionado ningún archivo.',
            status: '404'
        };

        if (file.size > (maxFileSize * 1024 * 1024)) return {
            isValid: false,
            error: 'maxFileSize',
            message: 'El archivo cargado excede el tamaño máximo permitido',
            status: '400'
        };

        if (!expectedFileType.includes(this.getFileExtension(file.type))) return {
            isValid: false,
            error: 'badFileFormat',
            message: `El archivo cargado no es de un tipo aceptado (${expectedFileType.join(', ')})`,
            status: '401'
        };

        if (file instanceof File && this.getFileExtension(file.type) != file.name.split(".").pop()) return {
            isValid: false,
            error: 'corruptFileFormat',
            message: `El tipo del archivo cargado no corresponde a la extención.`,
            status: '401'
        };

        return {
            isValid: true,
            error: null,
            message: 'El archivo cargado es válido',
            status: '200'
        };
    }

    /**
     * Cambia el nombre de un archivo.
     * 
     * @param file Archivo a cambiar nombre.
     * @param newName Nuevo nombre del archivo.
     * @returns El archivo con el nuevo nombre.
     */
    public static changeFileName(file: File, newName?: string): File {
        if (!newName) return file;
        const fileName: string = `${newName}.${this.getFileExtension(file.type)}`;
        return new File([file], fileName, { type: file.type });
    }

    /**
     * Remueve la extensión del nombre de un archivo.
     * 
     * @param fileName Nombre del archivo.
     * @returns El nombe del archivo sin la extensión.
     */
    public static removeExtension(fileName: string): string {
        return fileName.split('.').slice(0, -1).join('.');
    }

    /**
     * Descarga un archivo en base al nombre y objeto de tipo File o Blob.
     * 
     * @param file Objeto de tipo File o Blob del archivo a descargar.
     * @param fileName Nombre del archivo a descargar.
     */
    public static downloadFile(file: File | Blob, fileName: string) {
        const url: string = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    }
}