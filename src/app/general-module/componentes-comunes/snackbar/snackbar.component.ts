import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarOptions } from '../clases/dialog';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(
    private snackbarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarOptions,
  ) {
    this.data = this.setDefaultOptions(data);
  }

  setDefaultOptions(options: SnackBarOptions) {
    const defaultOptions: SnackBarOptions = {
      duration: 3000,
      showCloseButton: false
    };
    return { ...defaultOptions, ...options };
  }

  ngOnInit() {
  }

  close() {
    this.snackbarRef.dismiss()
  }
}
