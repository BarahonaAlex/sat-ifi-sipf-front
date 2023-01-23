import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, FormStructure, Input, TextArea,CustomNode } from 'mat-dynamic-form';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';

@Component({
  selector: 'app-revision-alcance-aprobador',
  templateUrl: './revision-alcance-aprobador.component.html',
  styleUrls: ['./revision-alcance-aprobador.component.scss']
})
export class RevisionAlcanceAprobadorComponent implements OnInit {
  idCase!: number;
  node!: EntryNodoAcs | any;
  arrayProperties: { name: string, key: string }[] = [];
  structure!: FormStructure;
  validateActionsDefault!: Button[];
  userEncargado!:string
  userRevisado!:string
  options = {
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor advlist lists wordcount help charmap emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit insert format table',
    toolbar: 'undo redo | bold italic underline strikethrough | formatselect fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen preview print | charmap image table',
    toolbar_sticky: true,
    content_style: '* { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; }',
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    resize: false,
    importcss_append: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.style.display = 'none';
      if (meta.filetype === 'image') {
        input.accept = 'image/*';
      } else if (meta.filetype === 'media') {
        input.accept = 'video/*';
      } else input.accept = '*/*';
      input.onchange = (event: Event) => {

        // Crear ruta pre-firmada para el archivo desde S3
        const file = (event.target as HTMLInputElement).files?.item(0);
        this.gestorService.uploadToS3(`${this.idCase}/${createUID()}`, file as Blob).toPromise().then(res => {
          callback(res.url, { title: res.key });
        }).catch(error => {
          const errorHandler = new GlobalErrorHandler(this.injector, this.ngZone)
          errorHandler.handleError(error)
        })
      }
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image quicktable table",
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };

  constructor(private activatedRoute: ActivatedRoute,
    private gestorService: GestorService,
    private dialogService: DialogService,
    private caseService: CasosService,
    private injector: Injector,
    private ngZone: NgZone,
    private router: Router) {
    this.arrayProperties.push({ name: 'Autor', key: 'cm:author' });
    this.validateActionsDefault = [
      new Button('cancelar', 'Cancelar', {
        callback: this, style: 'warn'
      }).apply({
        icon: 'close'
      }),
      new Button('guardar', 'Guardar', {
        callback: this, style: 'primary',
      }).apply({
        validateForm: true,
        icon: 'save'
      }),
    ];
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(async params => {
      this.idCase = parseInt(params.get('id') ?? '0');

      this.gestorService.contentSitesBasePathByParams('RUTA_BASE_CASO', { caso: this.idCase }).toPromise().then(
        res => {
          if (res != null) {
            this.gestorService.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(data => {
              this.caseService.getResponsibleCase(this.idCase).toPromise().then(res => {
                res.forEach(element => {
                  this.userEncargado = element.nombreColaborador
                  this.userRevisado = element.nombreUsuarioModifica
                });
              })
              this.node = data?.list?.entries?.find(res => res.entry.name === 'Alcances.pdf')?.entry
              if (!this.node) {
                this.dialogService.show({
                  icon: 'error',
                  title: 'IFI-404',
                  text: "No se ha encontrado el archivo Alcance",
                }).then(() => {
                  this.router.navigate(['/programacion/aprobador/bandeja/casos']);
                });
              }
            })
          } else {
            this.dialogService.show({
              icon: 'error',
              title: 'IFI-404',
              text: "No se ha encontrado el archivo Alcance",
            });
          }
        }
      )
    })
  }

  actionRevision(action: Number) {

    this.structure = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Comentarios', '').apply({
          singleLine: true, maxCharCount: 400
        })
      ],
      validateActions: this.validateActionsDefault
    });

    switch (action) {
      case 1:
        this.dialogService.show({
          icon: 'question',
          title: 'Aprobar',
          text: "¿ Está seguro de aprobar el Alcance ?",
          showCancelButton: true
        }).then(res => {
          if (res == 'primary') {
            this.caseService.approveScopeCases(this.idCase).toPromise().then(res => {
              this.dialogService.show({
                icon: 'success',
                title: 'IFI-200',
                text: "Aprobación de alcance exitosa."
              }).then(result => {
                this.router.navigate(['/programacion/aprobador/bandeja/casos']);
              });
            });
          }
        })
        break;

      case 2:
        this.structure = new FormStructure().apply({
          appearance: 'standard',
          globalValidators: Validators.required,
          showTitle: false,
          nodes: [
            new CustomNode<RichTextComponent>('comentarios', RichTextComponent).apply({
              singleLine: true,
              options: this.options,
              outputFormat: "html"
            })],
          validateActions: [
            new Button('cancelar', 'Cancelar', {
              callback: this, style: 'warn'
            }).apply({
              icon: 'close'
            }),
            new Button('guardarSolicitud', 'Guardar', {
              callback: this, style: 'primary',
            }).apply({
              validateForm: true,
              icon: 'save'
            }),
          ]
        });
    
        this.structure = this.structure
    
        this.dialogService.show({
          title: `Solicitar Correcciones `,
          formStructure: this.structure,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        }).then(result => {
          if (result !== 'primary') return;
          let comentario = this.structure.getControlById('comentarios')?.value
          if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
            this.caseService.approverRequestFixesCases(this.idCase,
              this.structure.getControlById('comentarios')?.value).toPromise().then(res => {
                this.dialogService.show({
                  icon: 'success',
                  title: 'IFI-200',
                  text: "Se ha solicitado la corrección del alcance correctamente"
                }).then(result => {
                  this.router.navigate(['/programacion/aprobador/bandeja/casos']);
                });
              });
          }
          else {
            this.dialogService.close('primary');
            this.dialogService.show({
              title: "IFI-400",
              text: "No se puede agregar un comentario vacío",
              icon: "error"
            });
    
          }
        });
        break;

      case 3:
        this.structure = new FormStructure().apply({
          appearance: 'standard',
          globalValidators: Validators.required,
          showTitle: false,
          nodes: [
            new CustomNode<RichTextComponent>('comentarios', RichTextComponent).apply({
              singleLine: true,
              options: this.options,
              outputFormat: "html"
            })],
          validateActions: [
            new Button('cancelar', 'Cancelar', {
              callback: this, style: 'warn'
            }).apply({
              icon: 'close'
            }),
            new Button('guardarRechazo', 'Guardar', {
              callback: this, style: 'primary',
            }).apply({
              validateForm: true,
              icon: 'save'
            }),
          ]
        });
    
        this.structure = this.structure
    
        this.dialogService.show({
          title: `Rechazar Caso `,
          formStructure: this.structure,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        }).then(result => {
          if (result !== 'primary') return;
          let comentario = this.structure.getControlById('comentarios')?.value
          if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
            this.caseService.approverDeclineCases(this.idCase,
              this.structure.getControlById('comentarios')?.value).toPromise().then(res => {
                this.dialogService.show({
                  icon: 'success',
                  title: 'IFI-200', 
                  text: "Se ha rechazado el alcance correctamente"
                }).then(result => {
                  this.router.navigate(['/programacion/aprobador/bandeja/casos']);
                });
              });
          }
          else {
            this.dialogService.close('primary');
            this.dialogService.show({
              title: "IFI-400",
              text: "No se puede agregar un comentario vacío",
              icon: "error"
            });
    
          }
        });
        break;
    }
  }

  /*   confirmTransaction() {
      this.dialogService.show({
        icon: 'success',
        title: 'IFI-200',
        text: "Aprobación de alcance exitosa."
      }).then(result => {
        this.router.navigate(['/programacion/aprobador/bandeja/casos']);
      });
    }
  
    confirmTransactionRechazar() {
      this.dialogService.show({
        icon: 'success',
        title: 'IFI-200',
        text: "Rechazo de alcance exitoso"
      }).then(result => {
        this.router.navigate(['/programacion/aprobador/bandeja/casos']);
      });
    }
  
    confirmTransactionCorregir() {
      this.dialogService.show({
        icon: 'success',
        title: 'IFI-200',
        text: "Correción de alcance exitoso"
      }).then(result => {
        this.router.navigate(['/programacion/aprobador/bandeja/casos']);
      });
    } */

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogService.close('primary');
    } else if (actionId == 'guardarSolicitud') {
      this.dialogService.close('primary');
    }else if (actionId == 'guardarRechazo') {
      this.dialogService.close('primary');
    }
    else {
      this.dialogService.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }
}
