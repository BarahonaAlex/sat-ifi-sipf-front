import { HttpHeaders, HttpParams } from "@angular/common/http";

export class Param {
  [key: string]: any;
}

export class Options {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: string;
  withCredentials?: boolean;
}