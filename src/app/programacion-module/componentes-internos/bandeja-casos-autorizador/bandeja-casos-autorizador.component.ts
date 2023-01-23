import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, Injector, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button, FormListener, FormStructure, Input, TextArea, CustomNode } from 'mat-dynamic-form';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { DialogImpuestosHistorico } from '../operador/consultas/consulta-rtu/dialog-contribuyente.component';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';

@Component({
  selector: 'app-bandeja-casos-autorizador',
  templateUrl: './bandeja-casos-autorizador.component.html',
  styleUrls: ['./bandeja-casos-autorizador.component.scss']
})
export class BandejaCasosAutorizadorComponent implements OnInit, FormListener {

  /*  para mostrar las columnas y los comapos de la tabla 2 de vehiculos */
  displayedColumns2: string[] = ['id', 'nombre', 'nit', 'monto', 'impuesto', 'estado', 'acciones'];
  bandejacasos = new MatTableDataSource();

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.bandejacasos.paginator = mp2;
  }

  showVisor: Boolean = true;
  nodeId!: string
  arrayProperties: { name: string, key: string }[] = [];
  node: EntryNodoAcs | undefined;
  estructura!: FormStructure;
  validateActionsDefault!: Button[];
  validateActionsFixes!: Button[];
  idCase!: number;
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

  constructor(
    private dialogo: DialogService,
    private caseService: CasosService,
    private gestorService: GestorService,
    private injector: Injector,
    private ngZone: NgZone,
    private alcanceServices: AlcancesService,
  ) {

    this.validateActionsFixes =

      [
        new Button('cancelar', 'Cancelar', {
          callback: this, style: 'warn'
        }).apply({
          icon: 'close'
        }),
        new Button('guardar', 'Trasladar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ];

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
    let state: number[] = [1092]
    this.alcanceServices.getSelectScope(state).toPromise().then(res => {
      console.log(res);
      this.bandejacasos.data = res.map((t: any) => {
        const impuestosLista = t.impuestos ? JSON.parse(t.impuestos) : []
        t.nombreImpuesto = impuestosLista.map((t: any) => t.nombreimpuesto).join(', ')
        t.idImpuesto = impuestosLista.map((t: any) => t.idimpuesto).join(', ')
        return t
      });
      this.showVisor = true;
      this.nodeId = ""
    })
    /* this.bandejacasos.data.push(this.prueba) */
  }

  regresar() {
    this.showVisor = true;
    this.nodeId = ""
    /* this.ngOnInit()   */
  }

  hola(e: any) {
    this.idCase = e.idCaso    
    this.arrayProperties = [{
      name: "Identificador del caso: " + this.idCase.toString(),
      key: this.idCase.toString()
    }]
    /*  this.gestorService.contentSitesBasePathByParams('RUTA_BASE_CASO', { caso: parseInt(e.idCaso) }).toPromise().then(res => {
       console.log(res.id)
       this.gestorService.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(data => {
         console.log(data)
         this.node = data.list.entries.find(res => res.entry.name === "alcance.pdf")?.entry ?? {};
         console.log(this.node);
         this.showVisor = this.node.isFile ? false : true;
         if (!this.node) {
           this.dialogo.show({
             icon: 'error',
             title: 'IFI-404',
             text: "No se ha encontrado el archivo Alcance",
           });
         }
         if (!this.node.isFile) {
           this.dialogo.show({
             icon: 'error',
             title: 'IFI-404',
             text: "No se ha encontrado el archivo Alcance",
           });
         }
       })
     }) */
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
            this.showVisor = this.node?.isFile ? false : true;
            if (!this.node) {
              this.dialogo.show({
                icon: 'error',
                title: 'IFI-404',
                text: "No se ha encontrado el archivo Alcance",
              });
            }
          })
        } else {
          this.dialogo.show({
            icon: 'error',
            title: 'IFI-404',
            text: "No se ha encontrado el archivo Alcance",
          });
        }

      }
    )

  }


  prepareStructure(validateAccions: Button[]) {
    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentarios', 'Comentarios', '').apply({
          singleLine: true, maxCharCount: 400
        })
      ],
      validateActions: validateAccions
    });


  }

  actionRevision(action: Number) {



    switch (action) {
      case 1:
        this.prepareStructure(this.validateActionsDefault);
        this.dialogo.show({
          icon: 'question',
          title: 'Autorizar',
          text: "¿ Está seguro de Autorizar el Alcance ?",
          showCancelButton: true
        }).then(res => {
          if (res == 'primary') {
            this.caseService.authorizerScopeCases(this.idCase).toPromise().then(r => {
              this.ngOnInit()
              this.dialogo.show({
                icon: 'success',
                title: 'IFI-200',
                text: "Se autorizo el alcance correctamente",
              });
              /* this.regresar() */
            });

          }
        })
        break;

      case 2:
        this.estructura = new FormStructure().apply({
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

        this.estructura = this.estructura

        this.dialogo.show({
          title: `Solicitar Correcciones `,
          formStructure: this.estructura,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        }).then(result => {
          if (result !== 'primary') return;
          let comentario = this.estructura.getControlById('comentarios')?.value
          if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
            this.caseService.authorizerRequestFixesCases(this.idCase, this.estructura.getControlById('comentarios')?.value).toPromise().then(r => {
              this.ngOnInit()
              this.dialogo.show({
                icon: 'success',
                title: 'IFI-200',
                text: "Se ha solicitado la corrección del alcance correctamente",
              });
            });
          }
          else {
            this.dialogo.close('primary');
            this.dialogo.show({
              title: "IFI-400",
              text: "No se puede agregar un comentario vacío",
              icon: "error"
            });

          }
        });
        break;

      case 3:
        this.estructura = new FormStructure().apply({
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

        this.estructura = this.estructura

        this.dialogo.show({
          title: `Rechazar Caso `,
          formStructure: this.estructura,
          showCancelButton: false,
          showConfirmButton: false,
          disableClose: true,
        }).then(result => {
          if (result !== 'primary') return;
          let comentario = this.estructura.getControlById('comentarios')?.value
          if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
            this.caseService.authorizerDeclineCases(this.idCase, this.estructura.getControlById('comentarios')?.value).toPromise().then(r => {
              this.ngOnInit()
              this.dialogo.show({
                icon: 'success',
                title: 'IFI-200',
                text: "Se ha rechazado el alcance correctamente",
              });
            });
          }
          else {
            this.dialogo.close('primary');
            this.dialogo.show({
              title: "IFI-400",
              text: "No se puede agregar un comentario vacío",
              icon: "error"
            });

          }
        });
        break;
    }
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogo.close('primary');
    } else if (actionId == 'guardarSolicitud') {
      this.dialogo.close('primary');
    } else if (actionId == 'guardarRechazo') {
      this.dialogo.close('primary');
    }
    else {
      this.dialogo.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }

}

