import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DialogOptions, DialogResult, SnackBarOptions } from '../clases/dialog';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRefs: MatDialogRef<AlertDialogComponent>[] = [];
  snabarRefs: MatSnackBarRef<SnackbarComponent>[] = [];

  lastDialogRef?: MatDialogRef<AlertDialogComponent>;
  lastSnabarRefs?: MatSnackBarRef<SnackbarComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Este método muestra un diálogo de alerta en base a las configuaracion proveidas en {@link options}.
   *
   * Ejemplo de uso:
   * ```
   * ...
   * constructor(
   *   private dialog: DialogService,
   * ) {
   *    ...
   * }
   *
   * this.dialog.show({
   *   title: 'Advertencia',
   *   text: 'Esta acción no se puede deshacer.',
   *   icon: 'warning',
   * })
   * ```
   *
   * @author Carlos Ramos (crramosl)
   * @param options Son todas las posibles configuraciones ({@link DialogOptions}) del dialogo que se desea mostrar.
   * @returns Una promesa que se resuelve con el resultado del dialogo
   */
  public show(options: DialogOptions): Promise<DialogResult> {
    return new Promise((resolve, reject) => {
      this.lastDialogRef = this.dialog.open(AlertDialogComponent, {
        data: options,
        autoFocus: false,
        panelClass: 'dialog-panel',
        width: options.width,
        height: options.height,
        maxWidth: options.maxWidth ?? '95vw',
        maxHeight: options.maxHeight ?? '95vh',
        disableClose: options.disableClose
      });

      this.lastDialogRef.disableClose = options.disableClose;

      this.lastDialogRef.afterClosed().subscribe((result: DialogResult) => {
        console.log('afterClosed', result);
        
        this.dialogRefs.pop();
        this.lastDialogRef = this.dialogRefs[this.dialogRefs.length - 1];
        resolve(result);
      });

      this.dialogRefs?.push(this.lastDialogRef);
    });
  }


  /**
   * Este método muestra una notificación en base a las configuaracion proveidas en {@link options}.
   *
   * Ejemplo de uso:
   * ```
   * ...
   * constructor(
   *   private dialog: DialogService,
   * ) {
   *    ...
   * }
   *
   * this.dialog.showSnackBar({
   *   title: 'Notificación',
   *   text: 'Ha recibido un nuevo mensaje.',
   *   icon: 'info',
   *   duration: 3000
   * })
   * ```
   *
   * @author Carlos Ramos (crramosl)
   * @param options Son todas las posibles configuraciones ({@link SnackBarOptions}) de la notificación que se desea mostrar.
   * @returns Una promesa que se resuelve con el resultado de la notificación.
   */
  public showSnackBar(options: SnackBarOptions) {
    this.lastSnabarRefs = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: options.duration,
      data: options,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snackbar-panel'
    });

    this.lastSnabarRefs?.afterDismissed().subscribe(() => {
      this.snabarRefs.pop();
      this.lastSnabarRefs = this.snabarRefs[this.snabarRefs.length - 1];
    })

    this.snabarRefs?.push(this.lastSnabarRefs);
  }

  close(dialogResult?: DialogResult) {
    this.lastDialogRef?.close(dialogResult);
    this.lastSnabarRefs?.dismiss();
  }

  closeAll() {
    this.dialog?.closeAll();
    this.snackBar?.dismiss();
  }
}
