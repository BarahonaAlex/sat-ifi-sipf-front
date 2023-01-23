import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Injector, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Button, Dropdown, FormStructure, Input, OptionChild, TextArea, CustomNode } from 'mat-dynamic-form';
import { Param } from 'src/app/general-module/componentes-comunes/clases/Params';
import { baseEncrypted } from 'src/app/general-module/componentes-comunes/interfaces/AcsRoot.interface';
import { DetalleAprobacionPrograma } from 'src/app/general-module/componentes-comunes/interfaces/Aprobacion-Programa';
import { CaseList } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';
import { CarteraAllCases } from 'src/app/general-module/componentes-comunes/interfaces/CasosDTE';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { walletPrograma } from 'src/app/general-module/componentes-comunes/interfaces/ProgramaFiscales.interface';
import { declineCase, WalletAppointments } from 'src/app/general-module/componentes-comunes/interfaces/WalletAppointments';
import { CarteraGerencialService } from 'src/app/general-module/componentes-comunes/servicios/cartera-gerencial.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CatalogosService } from 'src/app/general-module/componentes-comunes/servicios/catalogos.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { InsumosDTEService } from 'src/app/general-module/componentes-comunes/servicios/insumos-DTE.service';
import { Constantes } from 'src/app/general-module/componentes-comunes/util/constantes';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';

@Component({
  selector: 'app-cartera-casos-autoriazador-gerencial',
  templateUrl: './cartera-casos-autoriazador-gerencial.component.html',
  styleUrls: ['./cartera-casos-autoriazador-gerencial.component.scss']
})
export class CarteraCasosAutorizadorGerencialComponent implements OnInit {
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  columns = ['select', 'idAlcance', 'nombreTipoAlcance', 'nombreEstado', 'acciones'];
  dataSource = new MatTableDataSource<WalletAppointments>();
  listau?: any
  tamaño?: number
  estructura!: FormStructure;
  impuestos!: Catalog[];
  gerencia!: Catalog[];
  departamento!: Catalog[];
  selection = new SelectionModel<WalletAppointments>(true, []);
  showVisor: Boolean = true;
  arrayProperties: { name: string, key: string }[] = [];
  nodeId!: string
  idCaso: number = 0
  tipo!: number
  decline!: string
  comentario!: string
  itemSelect!: CarteraAllCases;

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
        this.gestor.uploadToS3(`${this.idCaso}/${createUID()}`, file as Blob).toPromise().then(res => {
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

  constructor(private router: Router,
    private micro: CarteraGerencialService,
    private catalogo: CatalogosService,
    private modal: DialogService,
    private gestor: GestorService,
    private caseService: CasosService,
    private injector: Injector,
    private ngZone: NgZone,) {

  }

  async ngOnInit() {
    //let state: Param[] = [{ pStates: '133' }]
    await this.caseService.getAllCasesManager().toPromise().then(res => {
      this.listau = res
    })
    this.dataSource.data = this.listau
    /* this.listau = await this.micro.getWallet().toPromise()
    console.log(this.listau) */
    console.log(this.listau);
    /* 
        this.dataSource.data = this.listau.map((t: any) => {
          const impuestos = t.impuestos ? JSON.parse(t.impuestos) : [];
    
          t.nombreImpuesto = impuestos.map((t: any) => t.nombreimpuesto).join(', ')
          t.idImpuesto = impuestos.map((t: any) => t.idimpuesto).join(', ')
          return t
        }) */

  }

  async AprobarCases() {
    this.micro.ApproveAllCases().toPromise().then(res => {
      console.log(res)
      this.modal.show({
        icon: 'success',
        title: 'Autorización Exitosa',
        text: "Se ha realizado la autorización de los insumos correctamente",

      });
      this.ngOnInit()
    })
  }

  Aprobar() {
    let post: walletPrograma[] = []
    let bandera = this.itemSelect?.idAlcance || 0
    if (this.itemSelect != null && bandera != 0) {
      console.log(this.itemSelect)
      if (this.itemSelect.tipoAlcance == 973) {
        if (this.itemSelect.idCaso == null && this.itemSelect.idFormulario == null) {
          post.push({
            idDenuncia: this.itemSelect.idDenuncia,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance
          })
        } else {
          post.push({
            idCaso: this.itemSelect.idFormulario,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance
          })
        }
      } else {
        if (this.itemSelect.idCaso == null && this.itemSelect.idFormulario == null) {
          post.push({
            idDenuncia: this.itemSelect.idDenuncia,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance
          })
        } else {
          post.push({
            idCaso: this.itemSelect.idCaso,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance
          })
        }
      }
    } else {
      console.log(this.selection.selected)
      this.selection.selected.forEach(element => {
        if (element.tipoAlcance == 973) {
          if (element.idCaso == null && element.idFormulario == null) {
            post.push({
              idDenuncia: element.idDenuncia,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance
            })
          } else {
            post.push({
              idCaso: element.idFormulario,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance
            })
          }

        } else {
          if (element.idCaso == null && element.idFormulario == null) {
            post.push({
              idDenuncia: element.idDenuncia,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance
            })
          } else {
            post.push({
              idCaso: element.idCaso,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance
            })
          }
        }


      })
    }
    console.log(post)

    this.micro.aprobarProgramas(post).toPromise().then(res => {
      this.modal.show({
        icon: 'success',
        title: 'Aprobacion Exitosa',
        text: "Se ha realizado la aprobacion del Caso correctamente",

      });
      this.ngOnInit()
      this.showVisor = true
      this.idCaso = 0
      this.selection.clear();

      this.itemSelect = {
        idAlcance: 0,
        tipoAlcance: 0,
        nombreTipoAlcance: "",
        estado: 0,
        nombreEstado: "",
        idCaso: 0,
        idDenuncia: "",
        idFormulario: 0
      };
    })

    console.log(this.itemSelect)
  }


  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data?.length;
    return numSelected === numRows;

  }

  masterToggle() {

    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data?.forEach((row) => this.selection.select(row));


  }

  regresar() {
    this.showVisor = true
  }

  VerAlcance(item: CarteraAllCases) {

    this.itemSelect = item
    let post!: baseEncrypted
    let TipoRuta!: string
    if (item.tipoAlcance != 969) {//masivos
      post = {
        id: item.idAlcance + "",
        carpeta: ""
      }
      TipoRuta = 'ALCANCEMASIVO'//Programacion/Masivos/Alcances/id
    } else {//selectivo
      post = {
        caso: item.idCaso + "",
        carpeta: ""
      }
      TipoRuta = 'CASOS'
    }
    console.log(post)
    console.log(TipoRuta)
    this.micro.getRuta(TipoRuta, post).toPromise().then(res => {
      console.log(res)
      this.gestor.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(result => {
        console.log(result)
        let resultados = result.list.entries
        resultados.forEach(element => {
          if (element.entry.name == "Alcances.pdf") {
            this.nodeId = element.entry.id
            this.showVisor = false
          }
        });

      })

    })

  }

  Rechazar(tipo: number) {
    console.log(this.selection.selected.length)
    this.tipo = tipo
    this.EstructuraInsumo()
    if (tipo == 1) {
      this.comentario = 'Rechazar'
      this.decline = 'Se ha realizado el rechazo del caso correctamente'
    } else {
      this.comentario = 'Solicitar Correcciones en '
      this.decline = 'Se ha solicitado la corrección del caso correctamente'
    }
    this.modal.show({
      title: `${this.comentario} Alcance `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.estructura.getControlById('comentario')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        this.RechazarCaso();
      }
      else {
        this.modal.close('primary');
        this.modal.show({
          title: "IFI-400",
          text: "No se puede agregar un comentario vacío",
          icon: "error"
        });

      }
    })
  }

  async EstructuraInsumo() {

    this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new CustomNode<RichTextComponent>('comentario', RichTextComponent).apply({
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
        new Button('guardar', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura
    /*this.estructura = new FormStructure().apply({
      appearance: 'standard',
      globalValidators: Validators.required,
      showTitle: false,
      nodes: [
        new TextArea('comentario', 'Comentarios').apply({
          singleLine: true
        }),
      ],
      validateActions: [
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
      ]
    });

    this.estructura = this.estructura*/
  }
  onEvent(id: string, value: any): void {
    console.log(id)
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      //this.RechazarCaso();
      this.modal.close('primary');
    }
    else {
      this.modal.close('cancel');
    }
  }

  async RechazarCaso() {
    let post: declineCase[] = []
    let bandera = this.itemSelect?.idAlcance || 0
    if (this.itemSelect != null && bandera != 0) {
      if (this.itemSelect.tipoAlcance == 973) {
        if (this.itemSelect.idCaso == null && this.itemSelect.idFormulario == null) {
          post.push({
            idDenuncia: this.itemSelect.idDenuncia,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance,
            comentario: this.estructura.getControlById("comentario")?.value,
          })
        } else {
          post.push({
            idCaso: this.itemSelect.idFormulario,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance,
            comentario: this.estructura.getControlById("comentario")?.value,
          })
        }
      } else {
        if (this.itemSelect.idCaso == null && this.itemSelect.idFormulario == null) {
          post.push({
            idDenuncia: this.itemSelect.idDenuncia,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance,
            tipo: this.tipo,
            comentario: this.estructura.getControlById("comentario")?.value,
          })
        } else {
          post.push({
            idCaso: this.itemSelect.idCaso,
            idEstado: this.itemSelect.estado,
            tipoCaso: this.itemSelect.tipoAlcance,
            idAlcance: this.itemSelect.idAlcance,
            tipo: this.tipo,
            comentario: this.estructura.getControlById("comentario")?.value,
          })
        }
      }

    } else {
      this.selection.selected.forEach(element => {
        if (element.tipoAlcance == 973) {
          if (element.idCaso == null && element.idFormulario == null) {
            post.push({
              idDenuncia: element.idDenuncia,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance,
              comentario: this.estructura.getControlById("comentario")?.value,
            })
          } else {
            post.push({
              idCaso: element.idFormulario,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance,
              comentario: this.estructura.getControlById("comentario")?.value,
            })
          }
        } else {
          if (element.idCaso == null && element.idFormulario == null) {
            post.push({
              idDenuncia: element.idDenuncia,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance,
              tipo: this.tipo,
              comentario: this.estructura.getControlById("comentario")?.value,
            })
          } else {
            post.push({
              idCaso: element.idCaso,
              idEstado: element.estado,
              tipoCaso: element.tipoAlcance,
              idAlcance: element.idAlcance,
              tipo: this.tipo,
              comentario: this.estructura.getControlById("comentario")?.value,
            })
          }
        }
      })
    }

    console.log(post)
    await this.micro.declineCase(post).toPromise().then(res => {
      this.modal.show({
        icon: 'success',
        title: `${this.comentario}`,
        text: `${this.decline}`,

      });
      this.ngOnInit()
      this.showVisor = true
      this.idCaso = 0
      this.selection.clear();
      this.itemSelect = {
        idAlcance: 0,
        tipoAlcance: 0,
        nombreTipoAlcance: "",
        estado: 0,
        nombreEstado: "",
        idCaso: 0,
        idDenuncia: "",
        idFormulario: 0
      };
    })
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
