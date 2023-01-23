import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { crearPerfil, PerfilInterface } from 'src/app/general-module/componentes-comunes/interfaces/Perfil.interface';
import { ColaboradoresService } from 'src/app/general-module/componentes-comunes/servicios/colaboradores.service';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { PerfilService } from 'src/app/general-module/componentes-comunes/servicios/perfil.service';


@Component({
  selector: 'app-asignar-perfil',
  templateUrl: './asignar-perfil.component.html',
  styleUrls: ['./asignar-perfil.component.css']
})
export class AsignarPerfilComponent implements OnInit {

  scope!: FormGroup;
  generalFormGroup!: FormGroup;
  perfiles!: PerfilInterface[];
  DisplayedColumns: string[] = ['No.', 'perfil', 'acciones'];
  dataSource = new MatTableDataSource();
  profile: any;
  nit: any;
  Perfil!: number;
  mostrar: boolean = false;
  validacion!: PerfilInterface[];



  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  constructor(
    private recordScope: FormBuilder,
    private perfilServices: PerfilService,
    private colaboradorService: ColaboradoresService,
    private dialog: DialogService
  ) {
    this.scopeForm()
  }

  ngOnInit(): void {

    this.generalFormGroup = new FormGroup({
      nombre: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      perfil: new FormControl('', Validators.required),
    });

  }

  scopeForm() {
    this.scope = this.recordScope.group({
      Nit: ['', Validators.required],
    })
  }

  getPerfil(id: string) {
    console.log(id);
    setTimeout(() => {
      this.perfilServices.getPerfilXRol(id).subscribe(res => {
        console.log(res);
        this.perfiles = res;
      })
    });
  }


  /* Metodo para abrir dialogo de guardar perfil a colaborador */
  /**
   * @description Método que trae la informacion del colaborador de porsis
   * @author ajsbatzmo (Jamier Batz) agaruanom (Gabriel Ruano)
   * @since modif 21/07/2022
   * @param id indentificador tributario del colaborador
   */
  async getPerfilNit(id: string) {

    await this.colaboradorService.getCollaborator(id).toPromise().then(res => {
      console.log(res);

      this.generalFormGroup.get('nombre')?.setValue(res.nombres);
      this.generalFormGroup.get('nombre')?.disable();
      this.generalFormGroup.get('estado')?.setValue(res.nombreEstado);
      this.generalFormGroup.get('estado')?.disable();
      this.getPerfil(res.login);

      this.mostrar = true;
      this.nit = id;
      console.log(id);
      this.perfilServices.getPerfilXNitCollaborator(id).subscribe(res => {
        console.log(res);
        this.validacion = res;
        this.dataSource.data = res;
        this.generalFormGroup.patchValue({
          perfil: res.shift()?.idPerfil
        })

      })
    })

  }

  /* Metodo para abrir dialogo de guardar perfil a colaborador */
  /**
   * @description Método para asignar un perfil
   * @author ajsbatzmo (Jamier Batz) agaruanom (Gabriel Ruano)
   * @since modif 21/07/2022
   * @param data
   */
  openDialogCreateProfile(data: any) {
    console.log(data)
    this.profile = data;
    this.dialog.show({
      title: 'Confirmación',
      text: `¿Está seguro que desea asignar el perfil al colaborador?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(resultado => {

      if (resultado == 'cancel') {
        console.log('No se guarda la informacion');
      }

      if (resultado == 'primary') {
        const guardarPerfil: crearPerfil = {
          estado: 161,
          idPerfil: this.profile.perfil,
          nit: this.nit,
        }
        console.log(guardarPerfil)
        this.perfilServices.postCrearPerfil(guardarPerfil).subscribe(res => {
          console.log(res)
          if (res) {
            this.dialog.show({
              title: 'IFI-200',
              text: `Perfil Asignado Correctamente`,
              icon: 'success',
            })
          } else {
            this.dialog.show({
              title: 'IFI-500',
              text: `El Perfil ya se Encuentra Asignado`,
              icon: 'warning',
            })
          }
          this.getPerfilNit(this.nit);
        })
      }
    })
  }

  /* Metodo para mostrar el dialogo de eliminacion */
  /**
   * @description Método para remover un perfil
   * @author ajsbatzmo (Jamier Batz)
   * @since 21/07/2022
   * @param id identificador unico del perfil
   */
  openDialogDeleteProfile(id: number) {
    console.log(id)
    this.Perfil = id;
    this.dialog.show({
      title: 'Confirmación',
      text: `¿Está seguro que desea eliminar el perfil al colaborador?`,
      icon: 'question',
      showCancelButton: true,
      disableClose: true,
      showCloseButton: true
    }).then(resultado => {

      if (resultado == 'cancel') {
        console.log('No se guarda la informacion');
      }

      if (resultado == 'primary') {
        const guardarPerfil: crearPerfil = {
          estado: 162,
          idPerfil: this.Perfil,
          nit: this.nit,
        }

        this.perfilServices.deletePerfil(guardarPerfil).subscribe(res => {


          this.dialog.show({
            title: 'IFI-200',
            text: `Perfil Removido Correctamente`,
            icon: 'success',
          });

          this.getPerfilNit(this.nit);
        });
      }
    })
  }



}
