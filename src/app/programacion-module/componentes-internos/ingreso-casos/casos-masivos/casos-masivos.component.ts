import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { CasosService } from 'src/app/general-module/componentes-comunes/servicios/casos.service';
import { CollaboratorResponse } from 'src/app/general-module/componentes-comunes/interfaces/Colaborador.interface';
import { MassiveCase } from 'src/app/general-module/componentes-comunes/interfaces/casos.interface';

@Component({
  selector: 'app-casos-masivos',
  templateUrl: './casos-masivos.component.html',
  styleUrls: ['./casos-masivos.component.css']
})

/**
   * @description Modulo Casos Msivos
   * @author ajsbatzmo (Jamier Batz)
   * @since 24/02/2022
   */
export class CasosMasivosComponent implements OnInit {

  generalFormGroup!: FormGroup;
  request: any;
  collaborator!: CollaboratorResponse[];
  correo!: any;

  datos = [
    { codigo: 40, nombre: "CENTRAL" },
    { codigo: 41, nombre: "SUR" },
    { codigo: 42, nombre: "OCCIDENTE" },
    { codigo: 43, nombre: "NORORIENTE" },
    { codigo: 44, nombre: "MEDIANOS ESPECIALES" },
    { codigo: 45, nombre: "GRANDES ESPECIALES" },
  ];

  constructor(
    public dialog: DialogService,
    private service: CasosService,
    private collaboratorService: ColaboradoresService) {
  }

  ngOnInit() {
    this.generalFormGroup = new FormGroup({
      nombreSolicitud: new FormControl('', Validators.required),
      objetivoSolicitud: new FormControl('', Validators.required),
      gerencia: new FormControl('', Validators.required),
      profesional: new FormControl('', Validators.required),
    });
  }

  /**
   * @description Funcion que obtiene colaborades en base a la Region
   */
  consultCollaborators(id: string) {
    setTimeout(() => {
      this.collaboratorService.getManagementCollaborator(id).subscribe(res => {
        console.log(res);
        this.collaborator = res;
      })
    });
  }

  /**
     * @description Dialogo donde se confirma el registro de una solicitud y se asigna directamente a un profesional
     */
  openDialog(request: any) {

    this.request = request;
    console.log(this.request);

    this.dialog.show({
      title: 'Esta seguro',
      text: `¿Esta seguro que desea asignar la request al profesional ${this.collaborator.find(collaborator => collaborator.nit == this.request.profesional)?.nombres}`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(resultado => {

      if (resultado == 'cancel') {
        console.log('No se guarda la informacion');
      }
      
      if (resultado == 'primary') {
        const mail = this.collaborator.find(collaborator => collaborator.nit == this.request.profesional)?.correo;
        this.correo = mail?.toString();
        console.log(mail?.toString());
        const shippingRequest: MassiveCase = {
          correoContacto: this.correo,
          proceso: 0,
          tipoAlcance: 120,
          gerencia: this.request.gerencia,
          nombreCaso: this.request.nombreSolicitud,
          nitColaborador: this.request.profesional,
          objetivoCasoMasiva: this.request.objetivoSolicitud
        }

        console.log(shippingRequest);
        this.service.createCase(shippingRequest).subscribe(res => {
          console.log(res);
          this.generalFormGroup.reset();
          this.dialog.showSnackBar({
            title: 'IFI-200',
            text: `Solicitud creada correctamente`,
            icon: 'success',
            duration: 1000
          })
        })
      }
    })
  }

}
