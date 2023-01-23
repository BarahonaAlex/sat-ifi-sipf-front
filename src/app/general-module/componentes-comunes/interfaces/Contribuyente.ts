import { NodeCompatibleEventEmitter } from "rxjs/internal/observable/fromEvent";

export interface Contribuyente {
    nombreContribuyente: string;
    nit: string;
    programa: string;
}

export interface vehiculos {
    nit: String;
    ultimo_propietario: String;
    anio: number;
    nombre: String;
    prefijoPlaca: String;
    placa: String;
    descripcion: String;
    estatus: String;
    exento: String;
    fechaTraspado: Date;
    modelo: String;
    marca: String;
    color: String;
    combustible: String;
    poliza: String;
    fechaPoliza: Date;
    motor: String;
    chasis: String;
}

export interface tablePeque {

    anio: number;
    pa: number;
    hp: number;
    total: number;
}