export class TextUtil {

  /**
   * Devuelve el nombre completo del estado
   * @param code codigo de estado
   */
  static getFullText(code: any)
  {
    if (code==="A")
    {
      return "Activo";
    }
    if (code==="I")
    {
      return "Inactivo";
    }
    if (code===true)
    {
      return "Si";
    }
    if (code===false)
    {
      return "No";
    }
    return code;
  }

  /**
   * Devuelve el nombre a ser mostrado al usuario en pantalla
   * @param code codigo de estado
   */
  static getUserText(code: string)
  {
    if (code==="tamanio")
    {
      return "tamaño";
    }
    return code;
  }

}
