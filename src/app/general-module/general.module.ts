import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatDynamicFormModule } from 'mat-dynamic-form';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from 'src/environments/environment';
import { MetaPresenciasComponent } from '../administracion-module/componentes-internos/plan-anual/metas/meta-presencias/meta-presencias.component';
import { MetaPublicacionesComponent } from '../administracion-module/componentes-internos/plan-anual/metas/meta-publicaciones/meta-publicaciones.component';
import { MaterialModule } from '../material.module';
import { AlertDialogComponent } from './componentes-comunes/alert-dialog/alert-dialog.component';
import { BadRequestComponent } from './componentes-comunes/bad-request/bad-request.component';
import { HomeComponent } from './componentes-comunes/home/home.component';
import { RichTextComponent } from './componentes-comunes/rich-text/rich-text.component';
import { SnackbarComponent } from './componentes-comunes/snackbar/snackbar.component';
import { TablaDinamicaComponent } from './componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { UploadFileComponent } from './componentes-comunes/upload-file/upload-file.component';
import { VisorComponent } from './componentes-comunes/visor/visor.component';
import { HcaptchaComponent } from './componentes-seguridad/hcaptcha/hcaptcha.component';

@NgModule({
  declarations: [
    VisorComponent,
    UploadFileComponent,
    AlertDialogComponent,
    SnackbarComponent,
    BadRequestComponent,
    HomeComponent,
    TablaDinamicaComponent,
    MetaPresenciasComponent,
    MetaPublicacionesComponent,
    RichTextComponent,
    HcaptchaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxExtendedPdfViewerModule,
    MatDynamicFormModule,
    EditorModule,
    NgHcaptchaModule.forRoot({ siteKey: environment.SITE_KEY_HCAPTCHA }),
  ],
  exports: [
    VisorComponent,
    UploadFileComponent,
    MatDynamicFormModule,
    TablaDinamicaComponent,
    MetaPresenciasComponent,
    MetaPublicacionesComponent,
    RichTextComponent,
    EditorModule
  ]
})
export class GeneralModule { }
