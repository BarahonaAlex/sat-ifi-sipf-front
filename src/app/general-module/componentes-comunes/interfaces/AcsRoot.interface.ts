export interface acsRoot{
    createdAt: Date,
    id: string,
    idv: string,
    isFile: true,
    isFolder: true,
}
export interface baseEncrypted{
    caso?:string,
    carpeta:string,
    id?:string
}