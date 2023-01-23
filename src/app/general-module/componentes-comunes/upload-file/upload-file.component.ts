import { AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import * as moment from 'moment';

import { FileChange, FileState } from '../interfaces/FileChange.interface';
import { Metadata } from '../interfaces/Metadata.interface';
import { DialogService } from '../servicios/dialog.service';
import { GestorService } from '../servicios/gestor.service';
import { FileUtils } from '../util/file-utils';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  /**
   * @description Propiedades que se almacenaran en los metadata del archivo.
   * @see Metadata interface para mas informacion.
   */
  @Input("metadata") metadata?: Metadata;
  /**
   * @description Id de la carpeta donde se almacenarán los archivos (Requerido).
   */
  @Input("folder") folder!: string;
  /**
   * @description Nombre del archivo sin extensión con el que se cargará y se mostrara en el input (Ej.: Documento).
   */
  @Input("filename") filename?: string;
  /**
   * @description Extensiones de archivos permitidos para cargar (Ej.: ['pdf', 'doc']) (Requerido).
   */
  @Input("accept") accept: string[] = [];
  /**
   * @description Tamaño del archivo en megabytes  no mayor a 10.
   */
  @Input("maxSize") @MaxValue(10) maxSize: number = 10;
  /**
   * @description Texto que se muestra como nombre del input file.
   */
  @Input("label") label: string = "Documento";
  /**
  * @description Bandera que indica si el documento se debe subir a ACS al cargar al input file.
  */
  @Input("saveOnLoad") saveOnLoad: boolean = true;
  /**
   * @description Se ejecuta cuando el estado de la carga cambia.
   */
  @Output() onStateChange: EventEmitter<FileChange> = new EventEmitter();
  private fileState: FileState;
  set emiter(emiter: (value: FileChange) => void) {
    this.onStateChange.emit = emiter;
  }

  fileType: string = 'upload';
  controlName: string = "file";
  currentFile?: File;
  control!: FormControl;

  constructor(
    @Self() @Optional() private ngControl: NgControl,
    private gestorService: GestorService,
    private dialog: DialogService,
  ) {
    this.fileState = 'none';

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

    this.controlName = this.ngControl?.name as string ?? Date.now().toString();
    this.getControl().valueChanges.subscribe(value => {
      if (!value || value.length == 0) {
        this.fileState = 'none';
        this.fileType = 'upload';
      }
    });
  }

  ngAfterViewInit() {
    const parent = document.getElementById(`${this.controlName}-parent`);
    if (!parent) return;

    this.addListener(parent, 'dragover dragenter', _ => parent.classList.add('dragover'));
    this.addListener(parent, 'dragleave dragend drop', _ => parent.classList.remove('dragover'));
    this.addListener(parent, 'drag dragstart dragend dragover dragenter dragleave drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    parent.addEventListener('drop', (event) => {
      const file = (document.getElementById(`innerFile${this.controlName}`) as HTMLInputElement);

      file.files = event.dataTransfer?.files as FileList;
      this.getControl().setValue(file.files);
      file.dispatchEvent(new Event('change'));
    });
  }

  handleFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList) {
      this.handleInputFile(fileList[0]);
    }
  }

  saveFile() {
    this.uploadFileToServer(this.currentFile!);
  }

  removeFile() {
    this.getControl().setValue(null);
    const input = document.querySelector(`#innerFile${this.controlName}`) as HTMLInputElement;

    input.value = '';
    input.files = null;

    this.currentFile = undefined;
    this.fileState = 'none';
    this.fileType = 'upload';
    return this.onStateChange.emit({ state: this.fileState })
  }

  getState() {
    return this.fileState;
  }

  getControl(): FormControl {
    return this.control;
  }

  getAccept(): string {
    return this.accept.length == 0 ? '*/*' : this.accept.map(item => '.' + item).join(',');
  }

  downloadFile() {
    if (this.fileState != 'none') {
      const link = document.createElement('a');
      const url = URL.createObjectURL(this.currentFile!);
      link.href = url;
      link.download = this.filename ?? this.currentFile!.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  private handleInputFile(file: File) {
    if (!this.accept || this.accept.length == 0) {
      throw new Error('You must specify the accepted file types.');
    }
    this.currentFile = file;
    this.fileState = 'preparing';
    this.onStateChange.emit({ state: this.fileState });
    const fileStatus = FileUtils.isValidFile(file, this.accept, this.maxSize);
    if (!fileStatus.isValid) {
      this.fileState = 'error';
      this.getControl().setValue(null);
      this.getControl().setErrors({ 'error': true });
      this.onStateChange.emit({ state: this.fileState, error: fileStatus.error?.toString() });
      return this.dialog.showSnackBar({
        title: `IFI-${fileStatus.status}`,
        text: fileStatus.message,
        duration: 3000,
        icon: 'error'
      });
    }

    this.fileType = FileUtils.getFileExtension(file.type);

    if (!this.saveOnLoad) {
      this.fileState = 'valid';
      this.getControl().setValue(file);
      this.getControl().setErrors(null);
      return this.onStateChange.emit({ state: this.fileState });
    }

    this.uploadFileToServer(file)
  }

  private uploadFileToServer(loadedFile: File) {
    if (!this.folder || this.folder.length == 0) {
      throw new Error('You must provide a folder id.');
    }

    const file = FileUtils.changeFileName(loadedFile, this.filename);
    const formData = new FormData();
    formData.append('file', file);
    if (this.metadata) formData.append('nodeDataDto', JSON.stringify(this.metadata));

    this.uploadOrUpdateFile(formData);
  }

  private async uploadOrUpdateFile(formData: FormData) {
    const nodes = await this.gestorService.contentSitesFolderByIdNodesChildren(this.folder).toPromise();
    const id = nodes?.list?.entries?.find(node => FileUtils.removeExtension(node.entry.name) == this.filename)?.entry?.id;

    if (id) {
      this.updateFile(id, formData);
    } else {
      this.uploadFile(formData);
    }
  }

  private uploadFile(formData: FormData) {
    this.gestorService.contentSitesFoldersByNodeIdfiles(this.folder, formData).toPromise().then((response) => {
      this.fileState = 'uploaded';
      this.getControl().setErrors(null);
      this.getControl().setValue(response.id);
      this.onStateChange.emit({ state: this.fileState, file: { id: response.id, name: this.filename ?? this.currentFile!.name } });
      this.dialog.showSnackBar({
        title: 'IFI-200',
        text: 'Archivo subido correctamente',
        duration: 3000,
        icon: 'success'
      });
    }).catch((error: any) => {
      this.dialog.showSnackBar({
        title: 'IFI-500',
        text: 'Error al subir el archivo',
        duration: 3000,
        icon: 'error'
      });
      this.fileState = 'error';
      this.onStateChange.emit({ state: this.fileState, error: 'Error al cargar el archivo' });
      this.fileType = 'error';
    });
  }

  private updateFile(id: string, formData: FormData) {
    this.gestorService.contentSitesNodeByIdUpdate(id, formData).toPromise().then((response) => {
      this.fileState = 'uploaded';
      this.getControl().setErrors(null);
      this.getControl().setValue(response.id);
      this.onStateChange.emit({ state: this.fileState, file: { id: response.id, name: this.filename ?? this.currentFile!.name } });
      this.dialog.showSnackBar({
        title: 'IFI-200',
        text: 'Archivo subido correctamente',
        duration: 3000,
        icon: 'success'
      });
    }).catch(_ => {
      this.dialog.showSnackBar({
        title: 'IFI-500',
        text: 'Error al subir el archivo',
        duration: 3000,
        icon: 'error'
      });
      this.fileState = 'error';
      this.onStateChange.emit({ state: this.fileState, error: 'Error al cargar el archivo' });
      this.fileType = 'error';
    });
  }

  private addListener<K extends keyof HTMLElementEventMap>(element: HTMLElement, events: string, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
    events.split(' ').forEach(event => element.addEventListener(event as K, listener, options));
  }

  registerOnChange(_: any): void { }
  writeValue(_: any) { }
  registerOnTouched(_: any) { }
}

function MaxValue(max: number) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[`_${propertyKey}`];
      },
      set: function (value: number) {
        if (value > max) {
          this[`_${propertyKey}`] = max;
        } else {
          this[`_${propertyKey}`] = value;
        }
      }
    });
  };
}
