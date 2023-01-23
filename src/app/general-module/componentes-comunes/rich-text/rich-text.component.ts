import {Component, Input, OnInit, Optional, Self, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {EditorComponent} from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css']
})
export class RichTextComponent implements OnInit, ControlValueAccessor {

  @ViewChild('editor') editor!: EditorComponent;

  control!: FormControl;
  @Input("initialValue")
  initialValue?: string;
  @Input("viewing")
  viewing = false;
  @Input("options")
  options!: any;
  @Input("label")
  label?: string;
  @Input("outputFormat")
  outputFormat: "html" | "text" | undefined = 'html';

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (!this.control) {
      this.control = this.ngControl.control as FormControl;
    }

    if (!this.control && this.ngControl.control) {
      this.control = this.ngControl.control as FormControl;
    }
    this.control.setValue(this.initialValue);
  }

  validateText() {
    this.control.setValue(this.editor.editor.getContent());
  }

  registerOnChange(_: any): void {
  }

  writeValue(_: any) {
  }

  registerOnTouched(_: any) {
  }
}
