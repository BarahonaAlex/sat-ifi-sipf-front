import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BlockUiService {

  blockers = 0;

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  block() {
    this.blockers++;
    this.spinner.show();
  }

  unblock() {
    if (--this.blockers <= 0) {
      this.spinner.hide();
      this.blockers = 0;
    }
  }
}
