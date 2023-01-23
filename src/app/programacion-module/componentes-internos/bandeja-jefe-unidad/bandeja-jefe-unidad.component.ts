import { Component, OnInit, ViewChild, Injector, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button, FormStructure, TextArea,CustomNode } from 'mat-dynamic-form';
import { generalalcance } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { EntryNodoAcs } from 'src/app/general-module/componentes-comunes/interfaces/nodos-ACS.interface';
import { AlcancesService } from 'src/app/general-module/componentes-comunes/servicios/alcances.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { GestorService } from 'src/app/general-module/componentes-comunes/servicios/gestor.service';
import { createUID } from 'src/app/general-module/componentes-comunes/util/general-utils';
import { GlobalErrorHandler } from 'src/app/general-module/componentes-seguridad/interceptors/error/global-error-handler';
import { RichTextComponent } from 'src/app/general-module/componentes-comunes/rich-text/rich-text.component';

@Component({
  selector: 'app-bandeja-jefe-unidad',
  templateUrl: './bandeja-jefe-unidad.component.html',
  styleUrls: ['./bandeja-jefe-unidad.component.scss']
})
export class BandejaJefeUnidadComponent implements OnInit {

  showVisor: Boolean = true;
  node: EntryNodoAcs | any;
  idAlcance!: number;
  validateActionsDefault!: Button[];
  estructura!: FormStructure;

  /*  para mostrar las columnas y los comapos de la tabla 2 de vehiculos */
  displayedColumns2: string[] = ['id', 'tipo', 'estado', 'acciones'];
  bandejaJefDepartamento = new MatTableDataSource();

  @ViewChild('MatPaginator2') set matPaginator2(mp2: MatPaginator) {
    this.bandejaJefDepartamento.paginator = mp2;
  }

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
        this.gestorService.uploadToS3(`${this.idAlcance}/${createUID()}`, file as Blob).toPromise().then(res => {
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

  constructor(private alcanceService: AlcancesService,
    private gestorService: GestorService,
    private injector: Injector,
    private ngZone: NgZone,
    private dialogo: DialogService) {
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

  ngOnInit() {
    this.getCabinet();
    this.getPoint();
    this.getPresence();
  }

  getVisor(e: any) {
    this.idAlcance = e.idAlcance
    /*console.log(e.idProceso);
    console.log(e.idAlcance);
    console.log(e.idPresencia);
    console.log(e.idCaso);
    console.log(e.tipo);*/

    this.gestorService.contentSitesBasePathByParams('ALCANCEMASIVO', { id: parseInt(e.idAlcance) }).toPromise().then(res => {
      console.log("id")
      console.log(res.id)
      this.gestorService.contentSitesFolderByIdNodesChildren(res.id).toPromise().then(data => {
        console.log("data")
        console.log(data)
        if(data){
        this.node = data.list?.entries?.find(res => res.entry.name === 'Alcances.pdf')?.entry ?? {};
        this.showVisor = this.node?.isFile != undefined ? false : true;
       }
        if (!data) {
          this.dialogo.show({
            icon: 'error',
            title: 'IFI-404',
            text: "No se ha encontrado el archivo Alcance",
          });
        }
        if (data && !this.node?.isFile) {
          this.dialogo.show({
            icon: 'error',
            title: 'IFI-404',
            text: "No se ha encontrado el archivo Alcance",
          });
        }
      })
    })

  }

  regresar() {
    this.showVisor = true;
  }

  Approve() {
    console.log(this.idAlcance);
    this.alcanceService.ApproveJu(this.idAlcance).toPromise().then(res => {
      console.log(res);
      this.dialogo.show({
        icon: 'success',
        title: 'IFI-200',
        text: "Se aprobó el alcance correctamente",
      });
      this.showVisor = true;
      this.ngOnInit();
    })

  }


  decline(id: number, comentario: string) {
    console.log(this.idAlcance);
    this.alcanceService.declineJu(id, comentario).toPromise().then(res => {
      console.log(res);
      this.dialogo.show({
        icon: 'success',
        title: 'IFI-200',
        text: "Se ha solicitado la corrección del alcance correctamente",
      });
      this.showVisor = true;
      this.ngOnInit();
    })
  }

  getCabinet() {
    this.bandejaJefDepartamento.paginator?.firstPage();
    this.alcanceService.getCabinet(976).toPromise().then(res => {
      console.log(res);
      const key = 'idAlcance';
      const unique = [...new Map(res.map(item => [item[key], item])).values()]
      console.log(unique);

      this.bandejaJefDepartamento.data = unique;
    })
  }

  getPresence() {
    this.bandejaJefDepartamento.paginator?.firstPage();
    this.alcanceService.getPresence(973).toPromise().then(res => {
      console.log(res);
      const key = 'idAlcance';
      const unique = [...new Map(res.map(item => [item[key], item])).values()]
      console.log(unique);
      this.bandejaJefDepartamento.data = unique;
    })
  }

  getPoint() {
    this.bandejaJefDepartamento.paginator?.firstPage();
    this.alcanceService.getPoint(975).toPromise().then(res => {
      console.log(res);
      const key = 'idAlcance';
      const unique = [...new Map(res.map(item => [item[key], item])).values()]
      console.log(unique);
      this.bandejaJefDepartamento.data = unique;
    })
  }

  actionRevision() {
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
        new Button('guardarCorreccion', 'Guardar', {
          callback: this, style: 'primary',
        }).apply({
          validateForm: true,
          icon: 'save'
        }),
      ]
    });

    this.estructura = this.estructura

    this.dialogo.show({
      title: `Corrección de Alcance `,
      formStructure: this.estructura,
      showCancelButton: false,
      showConfirmButton: false,
      disableClose: true,
    }).then(result => {
      if (result !== 'primary') return;
      let comentario = this.estructura.getControlById('comentarios')?.value
      if (comentario.replace(/<p>|<\/p>|&nbsp;|\s/g, "").length > 0) {
        this.decline(this.idAlcance, this.estructura.getControlById('comentarios')?.value);
        console.log(this.estructura.getControlById('comentarios')?.value);
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
  }

  onClick(actionId: string): void {
    if (actionId == 'guardar') {
      this.dialogo.close('primary');
    }else if (actionId == 'guardarCorreccion') {
      this.dialogo.close('primary');
    } else {
      this.dialogo.close('cancel');
    }
  }

  onEvent(id: string, value: any): void {
    throw new Error('Method not implemented.');
  }


}
