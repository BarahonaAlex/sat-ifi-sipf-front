/**
 * Interfaz que contiene los datos de la metadata de una entidad
 * 
 * @author Carlos Ramos (crramosl)
 * @example
 * const metadata = {
 *   aspectNames: ['aspectName1', 'aspectName2'],
 *   nodeType: 'cm:content',
 *   properties: {
 *     'cm:title': "title"
 *   }
 * }
 */
export interface Metadata {
    aspectNames: string[];
    nodeType?: string;
    properties: { [key: string]: string };
}