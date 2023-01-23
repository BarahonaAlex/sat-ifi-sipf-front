import { async } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { Gerencias, GetDetailDenuncias, ProcesosMasivos, StatusDenuncia, StatusDenunciaNAP } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../administracion-alcances/elaboracion-alcance/elaboracion-alcance.component';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { DatePipe } from '@angular/common';
import { ContribuyenteService } from 'src/app/general-module/componentes-comunes/servicios/contribuyente.service';
@Component({
  selector: 'app-detalle-bandeja-denuncia',
  templateUrl: './detalle-bandeja-denuncia.component.html',
  styleUrls: ['./detalle-bandeja-denuncia.component.css']
})
export class DetalleBandejaDenunciaComponent implements OnInit {
  /**
  * @author lfvillag (Luis Villagrán)
  * @description Metodo que obtiene las denuncias asignadas a un operador en base a su NIT con estado INICIADO
  */
  @Input('envio') correlativo!: number;
  /**
  * @author lfvillag (Luis Villagrán)
  * @description Asignación de variables para obtener el detalle de una denuncia en base a su Correlativo.
  */
  getDetailComplaints: string[] = ['nitDenunciante', 'nombreDenunciante', 'email', 'telDenunciante'];
  detailComplaints = new MatTableDataSource<GetDetailDenuncias>();
  getDetailComplaintsTwo: string[] = ['nitDenunciado', 'nombreDenunciado', 'establecimiento'];
  detailComplaintsTwo = new MatTableDataSource<GetDetailDenuncias>();
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Variable global donde se almacenara el Formulario
   */
  generalFormGroup!: FormGroup
  editarDenuncia: number = 1
  gestionarDenuncia: number = 1
  observacionDenuncia!: string
  seleccion: any
  global!: GetDetailDenuncias[]
  valor: any = ''
  rtu: any = 6
  gerencias!: Gerencias[]
  tipos!: ProcesosMasivos[]
  seleccionDireccion: boolean = false
  vista!: number
  procesoMasivo!: number
  regionSet!: number
  region!: string
  RtuAddres!: any
  addresRtu!: string
  colaboradorRTU!: string
  mostrar: boolean = false;
  nombreRegion!: string
  nitDenunciado!: string
  constructor(
    private dialogService: DialogService,
    private services: DenunciasService,
    private RTUservices: ContribuyenteService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DetalleBandejaDenunciaComponent>,
    @Inject(MAT_DIALOG_DATA) public edit: any, public dialogEdit: MatDialogRef<DetalleBandejaDenunciaComponent>,) {
    this.generalFormGroup = new FormGroup({
      nombreEstablecimiento: new FormControl(''),
      direecionEstablecimiento: new FormControl(''),
      region: new FormControl('', Validators.required),
      municipio: new FormControl(''),
      tipo: new FormControl('', Validators.required),
      //inputs para el detalle de la denuncia
      motivoDenuncia: new FormControl(''),
      estadoDenuncia: new FormControl(''),
      formaPago: new FormControl(''),
      fechaPago: new FormControl(''),
      valorDenuncia: new FormControl(''),
      departamento: new FormControl(''),
      //inputs para denunciaste
      NIT: new FormControl(''),
      nombre: new FormControl(''),
      telefono: new FormControl(''),
      direDenunciado: new FormControl(''),
    });
  }
  ngOnInit(): void {
    console.log(this.data);
    this.dComplaints()
    this.getAdress()
    this.setAdress()
    this.getObservation()
    this.getCatalogRegion()
    this.getProcessMasive()
  }

prueba(){
console.log(this.nitDenunciado);

}
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que obtiene los proceso de programación Masiva
   */
  getProcessMasive() {
    this.services.getProces().toPromise().then(res => {
      this.tipos = res
      console.log(res);
      
    })
  }
  getSelectProcess(event: any) {
    console.log(event)
    this.procesoMasivo = event
    if(event == 962 && this.nitDenunciado == null){
      this.dialogService.show({
        title: 'Detalle denuncia',
        text: 'No se puede asignar de tipo gabinete por que no cuenta con el NIT del denunciado',
        icon: 'warning',
        showCancelButton: false,
        disableClose: true,
        showCloseButton: true
      })
      this.valor= 0;
    }
  }

  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que obtiene las regiones disponibles.
   */
  getCatalogRegion() {
    this.services.getManagaments().toPromise().then(res => {
      console.log(res);
      this.gerencias = res;
    })
  }
  /**
   * @author lfvillag (Luis Villagran)
   * @description Metodo que obtiene el detalle de una denuncia en base a su Correlativo.
   */
  dComplaints() {
    this.services.getDetailComplaints(this.data.correlativo).toPromise().then(res => {
      console.log(res);
      this.nombreRegion = res[0].nregion
      this.nitDenunciado = res[0].nit
      
      const datePipe = new DatePipe('es')
      let fecha = `${datePipe.transform(res[0].compra, 'dd/MM/YYYY')}`
      this.generalFormGroup.get('motivoDenuncia')?.setValue(res[0].motivo, Validators.required)
      this.generalFormGroup.get('formaPago')?.setValue(res[0].formaPago, Validators.required)
      this.generalFormGroup.get('fechaPago')?.setValue(fecha, Validators.required)
      this.generalFormGroup.get('valorDenuncia')?.setValue(res[0].valor, Validators.required)
      this.generalFormGroup.get('estadoDenuncia')?.setValue(res[0].estado, Validators.required)
      this.generalFormGroup.get('departamento')?.setValue(res[0].departamento, Validators.required)
      this.generalFormGroup.get('region')?.setValue(res[0].region,Validators.required)
      this.regionSet = res[0].region
      if (res[0].idMotivo == 502) {
        this.mostrar= true
        this.generalFormGroup.get('NIT')?.setValue(res[0].nit,Validators.required)
        this.generalFormGroup.get('nombre')?.setValue(res[0].nombre,Validators.required)
        this.generalFormGroup.get('telefono')?.setValue(res[0].telefono,Validators.required)
        this.generalFormGroup.get('direDenunciado')?.setValue(res[0].direccion,Validators.required)

      } else {
        this.mostrar=false
        this.generalFormGroup.get('nombreEstablecimiento')?.setValue(res[0].establecimiento, Validators.required)
        this.generalFormGroup.get('direecionEstablecimiento')?.setValue(res[0].direDenunciado, Validators.required)
        //this.generalFormGroup.get('direecionEstablecimiento')?.setValue(res[0].direccion, Validators.required)
        this.generalFormGroup.get('municipio')?.setValue(res[0].municipio, Validators.required)
      }
    })

  }
  /**
   * @author lfvillag (Luis Villagran)
   * @descritpion Metodo que setea el nombre de cada región en base a su id.
   * @param event 
   */
  getRegion(event: any) {
    this.regionSet = event
  }

  cancel() {
    this.dialogService.closeAll();
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @descripion Metodo que setea las observaciones que trea el servicio.
   */
  getObservation() {
    this.services.getDetailComplaints(this.data.correlativo).toPromise().then(res => {
      this.observacionDenuncia = res.pop()?.observaciones!
    })
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que setea la dirección de una denuncia en el input de un formulario en base al servicio obtenido.
   */
  getAdress() {
    this.services.getDetailComplaints(this.data.correlativo).toPromise().then(res => {
      this.generalFormGroup.get('direccionFiscal')?.setValue(res.pop()?.direccion)
    })
  }
  /**
   * @author lfvillag (Luis Villagrán)
   * @description Metodo que setea la dirección en la variable global "seleccion "
   */
  setAdress() {
    this.services.getDetailComplaints(this.data.correlativo).toPromise().then(res => {
      this.seleccion = res.pop()?.direccion
    })
  }
  getAddresRtu(event: any) {
    this.addresRtu = event
  }
  async guardarDenuncia() {
      this.dialogService.show({
        title: 'Guardar gestión',
        text: `¿Esta seguro de guardar los cambios realizados??`,
        icon: 'question',
        showCancelButton: true,
        disableClose: true,
        showCloseButton: true
      }).then(async resultado => {
        if (resultado == 'cancel') {
          console.log("pos nel")
        }
        if (resultado == 'primary') {
            const BODY: StatusDenuncia = {
              direccion: this.addresRtu,
              estado: 957,
              idproceso: this.procesoMasivo,
              idregion: this.regionSet
            }
            console.log(BODY);
            this.services.putApplyManagementsComplaints(BODY, this.data.correlativo).toPromise().then(res => {
              this.dialogService.show({
                icon: 'success',
                title: 'IFI-200',
                text: 'Denuncia aplicada correctamente',
                showCloseButton: false,
                disableClose: true,
                showConfirmButton: true
              }).then(async result => {
                if (result !== 'primary') return;
                this.dialogService.closeAll();
              });
            })
        }
      })
  }
  guardarDenunciaNAP() {
    this.dialogService.show({
      title: 'Guardar gestión',
      text: `¿Esta seguro de guardar los cambios realizados??`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(async resultado => {
      if (resultado == 'cancel') {
        console.log("pos nel")
      }
      if (resultado == 'primary') {
        const BODY: StatusDenunciaNAP = {
          estado: 958,
          idProceso: this.procesoMasivo,
          idregion: this.regionSet
        }
        console.log(BODY)
        this.services.putRejectedManagementsComplaints(BODY, this.data.correlativo).toPromise().then(res => {
          console.log(res)
          this.dialogService.show({
            icon: 'success',
            title: 'IFI-200',
            text: 'Rechazo de denuncia correctamente',
            showCloseButton: false,
          }).then(async result => {
            if (result !== 'primary') return;
            this.dialogService.closeAll();
          });
        })
        /* this.dialogRef.close();
        window.location.reload() */
      }
    })
  }
}
const REGIONES: { [key: number]: string } = {
  40: 'CENTRAL', 41: 'SUR', 42: 'OCCIDENTE', 43: 'NORORIENTE', 44: 'MEDIANOS ESPECIALES', 45: 'GRANDES ESPECIALES'
}