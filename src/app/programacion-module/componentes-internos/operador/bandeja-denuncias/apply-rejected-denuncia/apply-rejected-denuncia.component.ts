import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { editComplaints, Gerencias, GetDetailDenuncias, ProcesosMasivos } from 'src/app/general-module/componentes-comunes/interfaces/denuncias.interface';
import { DenunciasService } from 'src/app/general-module/componentes-comunes/servicios/denuncias.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';

@Component({
  selector: 'app-apply-rejected-denuncia',
  templateUrl: './apply-rejected-denuncia.component.html',
  styleUrls: ['./apply-rejected-denuncia.component.css']
})
export class ApplyRejectedDenunciaComponent implements OnInit {
  generalFormGroup!: FormGroup
  generalFormGroup2!: FormGroup
  getDetailComplaints: string[] = ['nitDenunciante', 'nombreDenunciante', 'email', 'telDenunciante'];
  detailComplaints = new MatTableDataSource<GetDetailDenuncias>();
  getDetailComplaintsTwo: string[] = ['nitDenunciado', 'nombreDenunciado', 'establecimiento'];
  detailComplaintsTwo = new MatTableDataSource<GetDetailDenuncias>();
  region!: string
  tipos!: ProcesosMasivos[]
  estados!: Gerencias[]
  stateSelect!: number
  procesoMasivo!: number
  NIT!: string
  mostrar: boolean = false;
  constructor(private services: DenunciasService,
    private dialogo: DialogService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ApplyRejectedDenunciaComponent>,
  ) {
    this.generalFormGroup = new FormGroup({
      direccionFiscal: new FormControl(''),
      direccionRegistrada: new FormControl(''),
      region: new FormControl(''),
      rtu: new FormControl(''),
      tipo: new FormControl(''),
      motivoDenuncia: new FormControl(''),
      estadoDenuncia: new FormControl('', Validators.required),
      formaPago: new FormControl(''),
      fechaPago: new FormControl(''),
      valorDenuncia: new FormControl(''),
      departamento: new FormControl(''),
      observacion: new FormControl('')
    });

    this.generalFormGroup2 = new FormGroup({
      estadoDenuncia: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getStateComplaint();
    this.getProcessMasive();
    // this.dComplaints()
  }

  getProcessMasive() {
    this.services.getProces().toPromise().then(res => {
      this.tipos = res
      console.log(res);
    })
  }
  getSelectProcess(event: any) {
    console.log(event)
    this.procesoMasivo = event
  }

  getStateComplaint() {
    console.log(this.data);
    this.services.getStateComplaints().toPromise().then(data => {
      this.estados = data.filter(k => k.codigo == 957 || k.codigo == 958)
      console.log(this.estados)
      //this.estados = data
      const datePipe = new DatePipe('es')

      console.log(this.data)
      this.services.getDetailComplaints(this.data).toPromise().then(res => {
        console.log(res)
        let fecha = `${datePipe.transform(res[0].compra, 'dd/MM/YYYY')}`
        this.region = res[0].nregion
        this.detailComplaintsTwo.data = res
        this.detailComplaints.data = res
        this.procesoMasivo = res[0].tipo
        this.stateSelect = res[0].idEstado
        this.NIT = res[0].nit
        this.generalFormGroup.get('tipo')?.setValue(res[0].tipo, Validators.required)
        this.generalFormGroup2.get('estadoDenuncia')?.setValue(res[0].idEstado, Validators.required)
        if (res[0].idMotivo == 502) {
          this.mostrar = true
          this.generalFormGroup.patchValue({
            motivoDenuncia: res[0].motivo,
            estadoDenuncia: res[0].estado,
            formaPago: res[0].formaPago,
            fechaPago: fecha,
            valorDenuncia: res[0].valor,
            observacion: res[0].observaciones,
          })
        } else {
          this.mostrar = false
          this.generalFormGroup.patchValue({
            motivoDenuncia: res[0].motivo,
            estadoDenuncia: res[0].estado,
            formaPago: res[0].formaPago,
            fechaPago: fecha,
            valorDenuncia: res[0].valor,
            departamento: res[0].departamento,
            region: res[0].nregion,
            observacion: res[0].observaciones,
            direccionFiscal: res[0].direccion

          })
        }

      })
    })
  }
  dComplaints() {
    setTimeout(() => {
      const datePipe = new DatePipe('es')
      this.services.getDetailComplaints("D-000001-2019").toPromise().then(res => {
        console.log(res)
        this.region = res[0].nombreRegion
        this.detailComplaintsTwo.data = res
        this.detailComplaints.data = res
        this.generalFormGroup.patchValue({
          motivoDenuncia: res[0].motivoNombre,
          estadoDenuncia: res[0].estado,
          formaPago: res[0].formaPago,
          fechaPago: `${datePipe.transform(res[0].fechaPago, 'YYYY/MM/DD')}`,
          valorDenuncia: res[0].valor,
          departamento: res[0].departamentoNombre,
          observacion: res[0].observaciones,
          direccionFiscal: res[0].direccion
        })
      })
    })
  }
  getStateComplaintAction(event: any) {
    console.log(event)
    this.stateSelect = event
  }

  saveEdit() {
    const BODY = {
      estado: this.stateSelect,
      tipo: this.procesoMasivo
    }
    console.log(BODY)
    if (this.procesoMasivo == 962 && this.NIT != null) {
      console.log("si es tipo gabinete");
      this.services.putEditStateComplaints(BODY, this.data).toPromise().then(res => {
        this.dialogo.show({
          icon: 'success',
          title: 'IFI-200',
          text: "Se modifico la denuncia correctamente",
          disableClose: true,
          showConfirmButton: true
        }).then(async result => {
          if (result !== 'primary') return;
          this.dialog.closeAll();
        });
        console.log(res)
      })
    } else if (this.procesoMasivo == 962 && this.NIT == null) {
      this.dialogo.show({
        icon: 'warning',
        title: 'Validar.',
        text: "No puede ser de tipo Gabinete ya que no tiene nit del denunciado.",
        disableClose: true,
        showConfirmButton: true
      })
    } else {
      console.log("entro a los otros tipos");
      this.services.putEditStateComplaints(BODY, this.data).toPromise().then(res => {
        this.dialogo.show({
          icon: 'success',
          title: 'IFI-200',
          text: "Se modifico la denuncia correctamente",
          disableClose: true,
          showConfirmButton: true
        }).then(async result => {
          if (result !== 'primary') return;
          this.dialog.closeAll();
        });
        console.log(res)
      })
    }
  }

  cancel() {
    this.dialog.closeAll();
  }
}



const ESTADOS_DENUNCIA: { [key: number]: string } = {
  956: 'iniciado', 957: 'Aplica', 958: 'No aplica'
}