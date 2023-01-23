import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { CustomNode, FormStructure } from 'mat-dynamic-form';
import { BadRequestComponent } from 'src/app/general-module/componentes-comunes/bad-request/bad-request.component';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { environment } from 'src/environments/environment';
import { ErrorMapper } from './error-mapper';
import { ErrorResponse } from './error-response';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private injector: Injector,
    private ngZone: NgZone
  ) { }

  handleError(error: any) {
    const dialog = this.injector.get(DialogService);
    console.error(error);

    if (!(error instanceof Error) && !(error instanceof HttpErrorResponse)) return;

    if (error instanceof HttpErrorResponse) {
      (error as any).message = `Uncaught (in promise): x: ${JSON.stringify(error)}`
    }

    try {
      const httperror = JSON.parse(error.message.replace(/Uncaught\s\(in\spromise\):\s[a-zA-Z]+:\s/g, ""))
      const errorResponse: ErrorResponse = httperror.error;
      const url = environment.production || 401 != httperror.status ? '' : ` ("${httperror.url})"`;
      const errorMessage = `${errorResponse.userMessage || ErrorMapper.HTTP_ERROR_MAP[httperror.status]}${url}`;

      if (httperror.status == 400) {
        this.ngZone.run(() => {
          dialog.show({
            title: `IFI-${this.zFill(httperror.status, 3)}`,
            text: errorMessage,
            icon: 'error',
            showConfirmButton: false,
            disableClose: false,
            showCloseButton: true,
            width: '70%',
            formStructure: this.createFormStructure(errorResponse)
          });
        });
      } else {
        this.ngZone.run(() => {
          dialog.show({
            title: `IFI-${this.zFill(httperror.status, 3)}`,
            text: errorMessage,
            icon: 'error',
            showConfirmButton: true,
            disableClose: false,
          });
        });
      }
    } catch (error) {
      console.log("Error Inesperado");
      this.ngZone.run(() => {
        dialog.show({
          title: `IFI-001`,
          text: "Ocurrió un error inesperado",
          icon: 'error',
          showConfirmButton: true,
          disableClose: false,
        });
      });
    }
  }

  private zFill(number: number, width: number) {
    return '0'.repeat(width - number.toString().length) + number;
  }

  private createFormStructure(error: ErrorResponse): FormStructure {
    const formStructure = new FormStructure();
    formStructure.showTitle = false;

    formStructure.nodes = [
      new CustomNode<BadRequestComponent>("bad-request", BadRequestComponent, {
        error: error
      }).apply({
        singleLine: true
      })
    ];

    formStructure.validateActions = [];

    return formStructure;
  }
}