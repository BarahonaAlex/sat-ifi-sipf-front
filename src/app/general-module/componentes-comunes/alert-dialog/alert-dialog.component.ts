import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogOptions, DialogResult } from '../clases/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.data = this.setDefaultOptions(this.data);

    if (this.data.disableClose) {
      this.dialogRef.backdropClick().subscribe(() => {
        this.dialogRef.removePanelClass('shake');
        setTimeout(() => {
          this.dialogRef.addPanelClass('shake');
        }, 10);
      });
    }
  }

  setDefaultOptions(options: DialogOptions) {
    const defaultOptions: DialogOptions = {
      title: '',
      text: '',
      showConfirmButton: true,
      showSecondaryButton: false,
      showCancelButton: false,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'warn',
      confirmButtonText: 'Aceptar',
      secondaryButtonText: 'Secundario',
      cancelButtonText: 'Cancelar'
    };
    return { ...defaultOptions, ...options };
  }

  onActionClick(type: DialogResult): void {
    this.ngZone.run(() => this.dialogRef.close(type));
  }
}
