export const deleteNullProperties = <T>(o: any): T => {
    Object.keys(o).forEach((k) => o[k] == null && delete o[k]);
    return o as T;
}

export const parsearNombre = (detalle: any) => {
    const name: string = detalle.razonSocial ?? `${detalle.primer_Nombre ?? ''} ${detalle.segundo_Nombre ?? ''} ${detalle.primer_Apellido ?? ''} ${detalle.segundo_Apellido ?? ''}`.replace(/\s+/g, ' ').trim();
    return name.toLocaleLowerCase();
}

export const createUID = () => {
    return (Date.now().toString(32) + Math.random().toString(32).replace('0.', '')).toLocaleUpperCase()
};