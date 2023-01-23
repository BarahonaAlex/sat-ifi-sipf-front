import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Catalog } from 'src/app/general-module/componentes-comunes/interfaces/Catalog.interface';
import { DenunciaGrabada } from 'src/app/general-module/componentes-comunes/interfaces/DenunciaGrabada';
import { DynamicDataTable } from 'src/app/general-module/componentes-comunes/interfaces/dynamic-table';
import { FileChange } from 'src/app/general-module/componentes-comunes/interfaces/FileChange.interface';
import { TablaDinamicaComponent } from 'src/app/general-module/componentes-comunes/tabla-dinamica/tabla-dinamica.component';
import { UploadFileComponent } from 'src/app/general-module/componentes-comunes/upload-file/upload-file.component';
import { DialogService } from 'src/app/general-module/componentes-comunes/servicios/dialog.service';
import { docPdf } from 'src/app/general-module/componentes-comunes/interfaces/alcances.interface.ts';
import { UtilidadesService } from 'src/app/general-module/componentes-comunes/servicios/utilidades.service';
import { PublicService } from 'src/app/general-module/componentes-comunes/servicios/Public.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-formulario-denuncia-portal',
  templateUrl: './formulario-denuncia-portal.component.html',
  styleUrls: ['./formulario-denuncia-portal.component.scss']
})
export class FormularioDenunciaPortalComponent implements OnInit {

  @ViewChild('archivo') archivo!: UploadFileComponent;
  @ViewChild('table') table!: TablaDinamicaComponent<File>;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('stepper') stepper2!: MatStep;
  stepperModule!: MatStepperModule;
  detailFormGroup!: FormGroup;
  complainantFormGroup!: FormGroup;
  disabledComplaint = false;
  denouncedFormGroup!: FormGroup;
  disabledDenounced = false;
  data!: DynamicDataTable<File>;
  documento!: Blob;
  showVisor: boolean = false;
  arrayProperties: { name: string, key: string }[] = [];

  typeList!: Catalog[];
  typeGeograficalDepartment!: Catalog[];
  typeGeograficalMunicipality!: Catalog[];
  typeGeograficalMunicipalitySelected!: Catalog[];
  subTypeList!: Catalog[];
  subTypeListBySelectedFather!: Catalog[];
  regionList!: Catalog[];
  paymentMethodList!: Catalog[];
  typeGeograficalHousing!: Catalog[];
  typeGeograficalWay!: Catalog[];
  typeGeograficalZone!: Catalog[];

  showFraud = false;
  showNoBilling = false;
  showNoRegistered = false;
  showPaymentDocumentation = false;
  showEvidenceFileUploader = true;

  folder!: string;



  constructor(
    private dialog: DialogService,
    private utilidades: UtilidadesService,
    private publicService: PublicService) { }

  goBack() {

    this.utilidades.forcedNavigate(["/det-sel/formulario/denuncia"]);

  }

  ngOnInit(): void {




    this.data = {
      data: [],
      header: [
        { id: 'name', nameColum: 'nombre del archivo' },
        {
          id: 'actions', nameColum: '', actions: [
            { btnKey: 'delete', btnName: 'Quitar archivo', btnIcon: 'delete', onClick: item => this.removeFileFromList(item) },

          ]
        }

      ],
      noColum: [5, 10, 15]
    };


    //187
    //typeGeograficalDepot

    //vialidad 



    this.publicService.getCatalogs().toPromise().then(
      result => {

        //vialidad 
        this.typeGeograficalWay = result.filter(item => item.codigoCatalogo === 81);
        // zona
        this.typeGeograficalZone = result.filter(item => item.codigoCatalogo === 80);
        // grupo habitacional
        this.typeGeograficalHousing = result.filter(item => item.codigoCatalogo === 79);
        //municipio 
        this.typeGeograficalMunicipality = result.filter(item => item.codigoCatalogo === 78);
        //departamento
        this.typeGeograficalDepartment = result.filter(item => item.codigoCatalogo === 77);
        //concepto 
        this.typeList = result.filter(item => item.codigoCatalogo === 74);
        //subconvcepto
        this.subTypeList = result.filter(item => item.codigoCatalogo === 76);
        //metodo de pago 
        this.paymentMethodList = result.filter(item => item.codigoCatalogo === 75);
        // region
        this.regionList = result.filter(item => item.codigoCatalogo === 9).filter(item2 => item2.codigo < 44);
      }
    );


    /*this.catalogosService.getCatalogDataByIdCatalog(191).toPromise().then(result => {
      this.typeGeograficalWay = result;

    });*/
    // zona 
    /*this.catalogosService.getCatalogDataByIdCatalog(190).toPromise().then(result => {
      this.typeGeograficalZone = result;

    });*/
    // grupo habitacional
    /*this.catalogosService.getCatalogDataByIdCatalog(189).toPromise().then(result => {
      this.typeGeograficalHousing = result;

    });*/
    //municipio
    /*this.catalogosService.getCatalogDataByIdCatalog(188).toPromise().then(result => {
      this.typeGeograficalMunicipality = result;

    });*/
    //departamento 
    /*this.catalogosService.getCatalogDataByIdCatalogStatusSpecialConditionName(187, 'gerencia').toPromise().then(result => {
      this.typeGeograficalDepartment = result;
      console.log(this.typeGeograficalDepartment);
    });*/
    /*this.catalogosService.getCatalogDataByIdCatalog(184).toPromise().then(result => {
      this.typeList = result;

    });*/

    /*this.catalogosService.getCatalogDataByIdCatalog(186).toPromise().then(result => {
      this.subTypeList = result;

    });*/

    /*this.catalogosService.getCatalogDataByIdCatalog(185).toPromise().then(result => {
      this.paymentMethodList = result;

    });*/


    /*this.catalogosService.getCatalogDataByIdCatalog(9).toPromise().then(result => {
      this.regionList = result.filter(item => item.codigo < 44);

    });*/

    this.detailFormGroup = new FormGroup({
      paymentMethod: new FormControl(''),
      paymentDocumentation: new FormControl(''),
      purchaseDate: new FormControl(''),
      product: new FormControl(''),
      productValue: new FormControl(''),
      comment: new FormControl(''),
      cargaArchivo: new FormControl('')
    });

    this.complainantFormGroup = new FormGroup({
      idTaxPayer: new FormControl(''),
      nameTaxPayer: new FormControl(''),
      telephone: new FormControl(''),
      emailTaxPayer: new FormControl(''),
      argumentTaxPayer: new FormControl(''),
      subArgumentTaxPayer: new FormControl(''),
    });

    this.denouncedFormGroup = new FormGroup({
      idTaxPayer: new FormControl(''),
      nameTaxPayer: new FormControl(''),
      telephone: new FormControl(''),
      fiscalAddres: new FormControl(''),
      establishmentName: new FormControl(''),
      establishementAddress: new FormControl(''),
      department: new FormControl(''),
      regionTaxPayer: new FormControl(''),
      municipality: new FormControl(''),
      zone: new FormControl(''),
      housing: new FormControl(''),
      suburb: new FormControl(''),
      way: new FormControl(''),
      strRegion: new FormControl('')

    });
  }

  changeDepartment(): void {


    this.typeGeograficalMunicipalitySelected = this.typeGeograficalMunicipality.filter(
      item => item.codigoDatoPadre === this.denouncedFormGroup.get('department')?.value);

    console.log(this.denouncedFormGroup.get('department')?.value);
    console.log(this.typeGeograficalDepartment);
    this.typeGeograficalDepartment.filter(depto => depto.codigo === this.denouncedFormGroup.get('department')?.value)
      .map(mp => {

        console.log('mp')
        console.log(mp)
        this.denouncedFormGroup.get('regionTaxPayer')?.setValue(Number(mp.valor));


      });



  }

  changeArgument(): void {
    this.disabledDenounced = false;

    this.subTypeListBySelectedFather = this.subTypeList.filter(item => item.codigoDatoPadre === this.complainantFormGroup.get('argumentTaxPayer')?.value);

    this.complainantFormGroup.get('subArgumentTaxPayer')?.setValue(null);
    this.complainantFormGroup.get('subArgumentTaxPayer')?.clearValidators();

    this.complainantFormGroup.get('subArgumentTaxPayer')?.setErrors(null);
    this.complainantFormGroup.get('subArgumentTaxPayer')?.markAsUntouched();
    this.complainantFormGroup.get('subArgumentTaxPayer')?.updateValueAndValidity();

    this.complainantFormGroup.updateValueAndValidity();

    this.clearFormGroupControls(this.denouncedFormGroup);

  }

  clearFormGroupControls(pFormGroup: FormGroup): void {
    Object.keys(pFormGroup.controls).forEach(key => {
      pFormGroup.get(key)?.clearValidators();
      pFormGroup.get(key)?.setValue(null);
      pFormGroup.get(key)?.markAsUntouched();
      pFormGroup.get(key)?.updateValueAndValidity();
    }

    );
    pFormGroup.updateValueAndValidity();
  }

  goDenounced(): void {




    console.log(this.complainantFormGroup.get('argumentTaxPayer')?.value);

    this.complainantFormGroup.get('argumentTaxPayer')?.setValidators(Validators.required);
    this.complainantFormGroup.get('argumentTaxPayer')?.markAsTouched();
    this.complainantFormGroup.get('argumentTaxPayer')?.updateValueAndValidity();

    if (this.subTypeListBySelectedFather && this.subTypeListBySelectedFather.length > 0) {

      this.complainantFormGroup.get('subArgumentTaxPayer')?.setValidators(Validators.required);
      this.complainantFormGroup.get('subArgumentTaxPayer')?.markAsUntouched();
      this.complainantFormGroup.get('subArgumentTaxPayer')?.updateValueAndValidity();
    }

    // this.setAllValuesDenouncedToNull();
    //
    if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 502) {
      // fraude 
      this.showFraud = true;
      this.showNoBilling = false;
      this.showNoRegistered = false;
      this.complainantFormGroup.get('subArgumentTaxPayer')?.markAsTouched();


      // this.configFraudRequired();

    } else if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 497) {
      // no facturacion 
      this.showFraud = false;
      this.showNoBilling = true;
      this.showNoRegistered = false;
      this.complainantFormGroup.get('subArgumentTaxPayer')?.markAsTouched();


      // this.configNoBillingRequired();

    } else if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 496) {
      // no registrado
      this.showFraud = false;
      this.showNoBilling = false;
      this.showNoRegistered = true;
      // this.configNoRegistered();

    }

    this.complainantFormGroup.updateValueAndValidity();
    if (this.complainantFormGroup.valid) {
      this.stepper.next();
    } else {
      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-200',
        text: `Hace falta campos que llenar, favor revise.`,
        duration: 3000
      });
    }


  }

  goBackInformer(): void {

    this.complainantFormGroup.clearValidators();
    this.complainantFormGroup.updateValueAndValidity();
    this.stepper.previous();

  }

  goBackDenounced(): void {

    this.denouncedFormGroup.clearValidators();
    this.denouncedFormGroup.updateValueAndValidity();
    this.stepper.previous();
  }

  goDenouncementDetail(): void {

    if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 502) {
      // fraude
      this.configFraudRequired();

    } else if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 497) {
      // no facturacion
      this.configNoBillingRequired();

    } else if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 496) {
      // no registrado
      this.configNoRegistered();

    }
    this.denouncedFormGroup.updateValueAndValidity();

    if (this.denouncedFormGroup.valid) {

      this.stepper.next();
    }
    else {

      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-200',
        text: `Hace falta campos que llenar, favor revise.`,
        duration: 3000
      });
    }

  }



  configFormGroupControls(pFormGroup: FormGroup, pListControlNames: string[]): void {
    pListControlNames.forEach(key => {
      pFormGroup.get(key)?.setValidators(Validators.required);
      pFormGroup.get(key)?.markAsTouched();
      pFormGroup.get(key)?.updateValueAndValidity();
    });

    pFormGroup.updateValueAndValidity();

  }


  configNoBillingRequired(): void {
    console.log('no facturacion');

    const controlNames: string[] = [];
    controlNames.push('establishmentName');
    controlNames.push('establishementAddress');
    controlNames.push('department');
    controlNames.push('municipality');
    this.configFormGroupControls(this.denouncedFormGroup, controlNames);

  }


  configFraudRequired(): void {
    console.log('fraude');
    const controlNames: string[] = [];
    controlNames.push('idTaxPayer');
    //controlNames.push('telephone');
    this.configFormGroupControls(this.denouncedFormGroup, controlNames);


  }


  configNoRegistered(): void {
    console.log('no registrado');

    const controlNames: string[] = [];
    controlNames.push('establishmentName');
    controlNames.push('establishementAddress');
    controlNames.push('department');
    controlNames.push('municipality');
    this.configFormGroupControls(this.denouncedFormGroup, controlNames);

  }



  blurFindDenounced(): void {
    //console.log(this.denouncedFormGroup.get('idTaxPayer')?.value);

    if (this.denouncedFormGroup.get('idTaxPayer')?.value != null) {

      this.denouncedFormGroup.get('idTaxPayer')?.setValue(this.denouncedFormGroup.get('idTaxPayer')?.value.trim());
      if (this.denouncedFormGroup.get('idTaxPayer')?.value != '') {

        this.findTaxPayerInfo(this.denouncedFormGroup.get('idTaxPayer')?.value, this.denouncedFormGroup.controls['nameTaxPayer']);
        this.disabledDenounced = true;
      }
    }

  }

  blurFindComplainant(): void {
    //console.log(this.complainantFormGroup.get('idTaxPayer')?.value)
    this.complainantFormGroup.get('idTaxPayer')?.setValue(this.complainantFormGroup.get('idTaxPayer')?.value.trim());
    if (this.complainantFormGroup.get('idTaxPayer')?.value !== '') {
      this.findTaxPayerInfo(this.complainantFormGroup.get('idTaxPayer')?.value, this.complainantFormGroup.controls['nameTaxPayer']);
      this.disabledComplaint = true;
    }
  }

  private findTaxPayerInfo(pNit: string, control: AbstractControl): void {


    this.publicService.getGeneralTaxpayerInformation(pNit).
      toPromise().then(resultado => {
        console.log(resultado);
        if (resultado.data.attributes.datos.contribuyente) {

          let vTaxPayerName = resultado.data.attributes.datos.contribuyente.persona?.primer_Nombre;
          vTaxPayerName = vTaxPayerName.concat(' ');
          vTaxPayerName = vTaxPayerName.concat(resultado.data.attributes.datos.contribuyente.persona?.segundo_Nombre);
          vTaxPayerName = vTaxPayerName.concat(' ');
          vTaxPayerName = vTaxPayerName.concat(resultado.data.attributes.datos.contribuyente.persona?.primer_Apellido);
          vTaxPayerName = vTaxPayerName.concat(' ');
          vTaxPayerName = vTaxPayerName.concat(resultado.data.attributes.datos.contribuyente.persona?.segundo_Apellido);
          if (resultado.data.attributes.datos.contribuyente.persona?.apellido_Casada != null) {
            vTaxPayerName = vTaxPayerName.concat(' DE ');
            vTaxPayerName = vTaxPayerName.concat(resultado.data.attributes.datos.contribuyente.persona?.segundo_Apellido);
          }
          control.setValue(vTaxPayerName);



        } else if (resultado.data.attributes.datos.empresa) {
          control.setValue(resultado.data.attributes.datos.empresa.razonSocial);

        }
        if (this.complainantFormGroup.get('argumentTaxPayer')?.value === 502) {


          if (resultado.data.attributes.datos.ubicacion.ubicaciones!.length > 0) {


            this.denouncedFormGroup.get('fiscalAddres')?.setValue(resultado.data.attributes.datos.ubicacion.ubicaciones![0].vistaPrevia);


            if (resultado.data.attributes.datos.ubicacion.ubicaciones![0].lineaFijaNumero) {
              this.denouncedFormGroup.get('telephone')?.setValue(resultado.data.attributes.datos.ubicacion.ubicaciones![0].lineaFijaNumero);
            }
            else if (resultado.data.attributes.datos.ubicacion.ubicaciones![0].celularNumero) {
              this.denouncedFormGroup.get('telephone')?.setValue(resultado.data.attributes.datos.ubicacion.ubicaciones![0].celularNumero);
            }

          }
        }

      });

  }


  stateChangePayment(state: FileChange): void {

    if (state.state === 'valid') {
      console.log(' the file is valid');
    }
    if (state.state === 'uploading') {
      console.log('uploading');
    }
    if (state.state === 'uploaded') {
      console.log('se cargo el archivo');
    }

    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
    }

  }


  stateChange(state: FileChange): void {

    if (state.state === 'valid') {
      this.data.data.push(this.detailFormGroup.get('cargaArchivo')?.value);
      this.table.dataSource.data = this.data.data;
      this.detailFormGroup.get('cargaArchivo')?.setValue(null);
      this.showEvidenceFileUploader = !(this.data.data.length === 3);
    }
    if (state.state === 'uploading') {
      console.log('uploading');
    }
    if (state.state === 'uploaded') {
      console.log('se cargo el archivo');
    }

    if (['uploaded', 'error'].includes(state.state)) {
      console.log(state);
    }

  }




  configDenouncedDetail(): void {


    const controlNames: string[] = [];

    if (this.showPaymentDocumentation) {

      controlNames.push('paymentDocumentation');
    }

    controlNames.push('paymentMethod');
    controlNames.push('purchaseDate');
    controlNames.push('product');
    controlNames.push('productValue');
    controlNames.push('comment');
    this.configFormGroupControls(this.detailFormGroup, controlNames);

  }

  goPdf(data: DenunciaGrabada) {

    let encabezado = `<!DOCTYPE html><html><head> <style>
    .header {
        position: running(header);
        
    }
    .footerRight{
      position: running(footerRight);
      text-align: right;
      font-size:12pt;
  }
  
    @page {
        size: A4;
        margin: 20mm;
        margin-top: 150px;
        @top-left {
            content: element(header);
            border-bottom:2px solid #434190;
        }
        @bottom-center {
          content: element(footer);
       }
       @bottom-right {
        content: element(footerRight);
        margin-left: -100px;
        
    }

    @bottom-center{
        content: counter(page);
        font-size:12pt;
    }   

    }
   
 
</style></head>
<div class="header"> 

`;

    let texto: string = `
    
   `;


    console.log(this.complainantFormGroup.get('argumentTaxPayer')?.value);

    const textArgument: Catalog[] = this.typeList.filter(item => item.codigo === this.complainantFormGroup.get('argumentTaxPayer')?.value);


    texto += `<ol>
    <li>Datos del denunciante
        <table>`  ;
    if (this.complainantFormGroup.get('idTaxPayer')?.value) {

      texto += `      <tr>
            <td>NIT</td>
            <td>${this.complainantFormGroup.get('idTaxPayer')?.value}</td>
          </tr>`  ;
    }


    if (this.complainantFormGroup.get('nameTaxPayer')?.value) {
      texto += `   <tr>
            <td>Nombre</td>
            <td>${this.complainantFormGroup.get('nameTaxPayer')?.value}</td>
          </tr>`  ;
    }

    if (this.complainantFormGroup.get('telephone')?.value) {
      texto += `  <tr>
            <td>Teléfono</td>
            <td>${this.complainantFormGroup.get('telephone')?.value}</td>
          </tr>`  ;
    }
    if (this.complainantFormGroup.get('emailTaxPayer')?.value) {
      texto += `  <tr>
            <td>Correo electrónico</td>
            <td>${this.complainantFormGroup.get('emailTaxPayer')?.value}</td>
          </tr>`  ;
    }

    texto += `  <tr>
            <td>Razón de la denuncia</td>
            <td>${textArgument[0].nombre}</td>
          </tr>
          

          <tr>
            <td>Sub razon de la denuncia</td>
          
            `  ;
    if (this.complainantFormGroup.get('subArgumentTaxPayer')?.value) {
      const textSubArgument: Catalog[] = this.subTypeListBySelectedFather.filter(item => item.codigo === this.complainantFormGroup.get('subArgumentTaxPayer')?.value);
      texto += `<td>${textSubArgument[0].nombre}</td>`
    }
    else {
      texto += `<td></td>`
    }


    texto += `
            </tr>
      
          </table>
    
    </li>
    <li>Datos del contribuyente denunciado
            <table>
              
              `;
    if (this.denouncedFormGroup.get('idTaxPayer')?.value) {


      texto += `
                                    <tr>
                                      <td>Nombre</td> 
                                      <td>${this.denouncedFormGroup.get('idTaxPayer')?.value}</td>
                                    </tr>
                                    `;
    }

    if (this.denouncedFormGroup.get('nameTaxPayer')?.value) {


      texto += `
                          <tr>
                            <td>Nombre</td> 
                            <td>${this.denouncedFormGroup.get('nameTaxPayer')?.value}</td>
                          </tr>
                          `;
    }


    if (this.denouncedFormGroup.get('fiscalAddres')?.value) {


      texto += `
                <tr>
                  <td>Dirección fiscal</td> 
                  <td>${this.denouncedFormGroup.get('fiscalAddres')?.value}</td>
                </tr>
                `;
    }

    if (this.denouncedFormGroup.get('establishementAddress')?.value) {


      texto += `
                                            <tr>
                                              <td>Dirección del establecimiento</td> 
                                              <td>${this.denouncedFormGroup.get('establishementAddress')?.value}</td>
                                            </tr>
                                            `;
    }


    if (this.denouncedFormGroup.get('telephone')?.value) {


      texto += `
                                  <tr>
                                    <td>Teléfono</td> 
                                    <td>${this.denouncedFormGroup.get('telephone')?.value}</td>
                                  </tr>
                                  `;
    }

    if (this.denouncedFormGroup.get('establishmentName')?.value) {


      texto += `
                                  <tr>
                                    <td>Nombre del establecimiento</td> 
                                    <td>${this.denouncedFormGroup.get('establishmentName')?.value}</td>
                                  </tr>
                                  `;
    }



    if (this.denouncedFormGroup.get('department')?.value) {

      const depot: Catalog[] = this.typeGeograficalDepartment.filter(reg => reg.codigo === this.denouncedFormGroup.get('department')?.value);
      texto += `
                        <tr>
                          <td>Departamento</td> 
                          <td>${depot[0].nombre}</td>
                        </tr>
                        `;
    }


    if (this.denouncedFormGroup.get('municipality')?.value) {

      const muni: Catalog[] = this.typeGeograficalMunicipalitySelected.filter(reg => reg.codigo === this.denouncedFormGroup.get('municipality')?.value);
      texto += `
                        <tr>
                          <td>Municipio</td> 
                          <td>${muni[0].nombre}</td>
                        </tr>
                        `;
    }

    if (this.denouncedFormGroup.get('zone')?.value) {

      const zone: Catalog[] = this.typeGeograficalZone.filter(reg => reg.codigo === this.denouncedFormGroup.get('zone')?.value);
      texto += `
                        <tr>
                          <td>Zona</td> 
                          <td>${zone[0].nombre}</td>
                        </tr>
                        `;
    }

    if (this.denouncedFormGroup.get('housing')?.value) {


      const housing: Catalog[] = this.typeGeograficalHousing.filter(reg => reg.codigo === this.denouncedFormGroup.get('housing')?.value);
      texto += `
                        <tr>
                          <td>Grupo habitacional</td> 
                          <td>${housing[0].nombre}</td>
                        </tr>
                        `;
    }

    if (this.denouncedFormGroup.get('suburb')?.value) {


      texto += `
                        <tr>
                          <td>Nombre de Colonia, Edificio, Comunidad  u otros</td> 
                          <td>${this.denouncedFormGroup.get('suburb')?.value}</td>
                        </tr>
                        `;
    }

    if (this.denouncedFormGroup.get('way')?.value) {

      const way: Catalog[] = this.typeGeograficalWay.filter(reg => reg.codigo === this.denouncedFormGroup.get('way')?.value);
      texto += `
                        <tr>
                          <td>Departamento</td> 
                          <td>${way[0].nombre}</td>
                        </tr>
                        `;
    }

    texto += ` 
            <tr>
              <td>Región</td>`;


    if (this.denouncedFormGroup.get('regionTaxPayer')?.value) {

      const regions: Catalog[] = this.regionList.filter(reg => reg.codigo === this.denouncedFormGroup.get('regionTaxPayer')?.value);
      texto += ` <td>${regions[0].nombre}</td>`;
    } else {
      texto += ` <td></td>`;
    }

    texto += `  
              </tr>
             
            </table>
              
    </li>
    <li>Detalle de la denuncia
            <table>`;


    if (this.detailFormGroup.get('paymentMethod')?.value) {


      /* 
       product: new FormControl(''),
       productValue: new FormControl(''),
       comment: new FormControl(''),
       cargaArchivo: new FormControl('')*/

      const pay: Catalog[] = this.paymentMethodList.filter(reg => reg.codigo === this.detailFormGroup.get('paymentMethod')?.value);
      texto += `
                                <tr>
                                  <td>Forma de pago</td> 
                                  <td>${pay[0].nombre}</td>
                                </tr>
                                `;
    }

    if (this.detailFormGroup.get('purchaseDate')?.value) {

      const datepipe: DatePipe = new DatePipe('en-US')
      let formattedDate = datepipe.transform(this.detailFormGroup.get('purchaseDate')?.value, 'dd/MM/YYYY')

      texto += `
                                 <tr>
                                   <td>Fecha de compra</td> 
                                   <td>${formattedDate}</td>
                                 </tr>
                                 `;
    }

    if (this.detailFormGroup.get('product')?.value) {


      /* 
       : new FormControl(''),
       productValue: new FormControl(''),
       comment: new FormControl(''),
       cargaArchivo: new FormControl('')*/


      texto += `
                                 <tr>
                                   <td>Producto o servicio</td> 
                                   <td>${this.detailFormGroup.get('product')?.value}</td>
                                 </tr>
                                 `;
    }

    if (this.detailFormGroup.get('productValue')?.value) {


      /* 
       : new FormControl(''),
       : new FormControl(''),
       comment: new FormControl(''),
       cargaArchivo: new FormControl('')*/


      texto += `
                                 <tr>
                                   <td>Valor de compra o servicio</td> 
                                   <td>${this.detailFormGroup.get('productValue')?.value}</td>
                                 </tr>
                                 `;
    }

    if (this.detailFormGroup.get('comment')?.value) {

      texto += `
                                 <tr>
                                   <td>Observaciones</td> 
                                   <td>${this.detailFormGroup.get('comment')?.value}</td>
                                 </tr>
                                 `;
    }



    texto += `
        
              
            </table>
    </li>
    </ol>`;
    texto += `</div>`

    texto += "</body></html>"



    let piePagina = `<body><div class="footerRight"> </div>`;

    console.log(encabezado + piePagina + texto);

    let docPdf: docPdf;



    this.publicService.getTemplate(6).toPromise().then(
      text => {

        let contenido = text.encabezado.match(/<([^}]*)>/g);
        let variables = text.encabezado.match(/{([^}]*)}/g);
        contenido.forEach((element: any, index: number) => {
          encabezado += element
          if (index <= variables.length) {
            switch (variables[index]) {
              case "{correlativo}":
                encabezado += data.correlativo;
                break;
              case "{fecha}":
                encabezado += new Date().toLocaleDateString()
                break;
            }
          }
        })

        encabezado += "</div> ";

        docPdf = { datos: encabezado + piePagina + texto, idCaso: 0, idEstado: 0 };

        this.publicService.generationPdf(docPdf).toPromise().then(result => {
          this.documento = result;
          this.showVisor = true;
          this.publicService.deletePdf();
        });
      }
    );

    this.stepper.next();

  }

  goSave(): void {

    if (this.detailFormGroup.get('productValue')?.value < 0) {

      this.dialog.showSnackBar({
        icon: 'error',
        title: 'IFI-200',
        text: `El valor del producto o servicio no puede ser negativo, favor revise.`,
        duration: 3000
      });

      this.detailFormGroup.get('productValue')?.setValidators([Validators.required, Validators.min(0)]);
      this.detailFormGroup.get('productValue')?.markAsTouched();
      this.detailFormGroup.get('productValue')?.updateValueAndValidity();

      return;
    }




    this.configDenouncedDetail();

    if (this.detailFormGroup.valid) {



      const save = new FormData();
      const data: DenunciaGrabada = {};
      data.nitDenunciante = this.complainantFormGroup.get('idTaxPayer')?.value;
      data.nombreDenunciante = this.complainantFormGroup.get('nameTaxPayer')?.value;
      data.telefonoDenunciante = this.complainantFormGroup.get('telephone')?.value;
      data.email = this.complainantFormGroup.get('emailTaxPayer')?.value;
      data.idMotivo = this.complainantFormGroup.get('argumentTaxPayer')?.value;
      if (this.complainantFormGroup.get('subArgumentTaxPayer')?.value) {
        data.idSubConceptoDenuncia = this.complainantFormGroup.get('subArgumentTaxPayer')?.value;
      }


      data.nitDenunciado = this.denouncedFormGroup.get('idTaxPayer')?.value;
      data.nombreDenunciado = this.denouncedFormGroup.get('nameTaxPayer')?.value;
      data.direccionFiscalDenunciado = this.denouncedFormGroup.get('fiscalAddres')?.value;
      data.telefonoDenunciado = this.denouncedFormGroup.get('telephone')?.value;
      data.establecimientoDenunciado = this.denouncedFormGroup.get('establishmentName')?.value;
      data.direccionEstDenunciado = this.denouncedFormGroup.get('establishementAddress')?.value;
      data.departamento = this.denouncedFormGroup.get('department')?.value;
      data.municipio = this.denouncedFormGroup.get('municipality')?.value;
      data.region = this.denouncedFormGroup.get('regionTaxPayer')?.value;
      data.idZona = this.denouncedFormGroup.get('zone')?.value;
      data.idGrupoHabitacional = this.denouncedFormGroup.get('housing')?.value;
      data.nombreColonia = this.denouncedFormGroup.get('suburb')?.value;
      data.idVialidad = this.denouncedFormGroup.get('way')?.value;

      data.formaPago = this.detailFormGroup.get('paymentMethod')?.value;
      data.fechaCompra = this.detailFormGroup.get('purchaseDate')?.value;
      data.productoServicio = this.detailFormGroup.get('product')?.value;
      data.valorCompraServicio = this.detailFormGroup.get('productValue')?.value;
      data.observaciones = this.detailFormGroup.get('comment')?.value;


      //data.correlativo = 'd-1-1-2022';


      const items: Catalog[] = this.typeList.filter(item => item.codigo === this.complainantFormGroup.get('argumentTaxPayer')?.value);
      data.correlativo = items[0].codigoIngresado;

      console.log(this.detailFormGroup.get('cargaArchivo')?.value);
      //save.append('archivo', this.detailFormGroup.get('cargaArchivo')?.value);
      this.data.data.forEach(file => {
        save.append('file', file);
      });
      const aux: File = this.detailFormGroup.controls['paymentDocumentation'].value;
      if (aux) {
        console.log('si hay archivo y lo agrega')
        save.append('filePay', aux);
      }

      //save.append('archivo', this.detailFormGroup.get('cargaArchivo2')?.value);
      save.append('data', JSON.stringify(data));



      this.publicService.postComplaint(save).toPromise(

      ).then(
        result => {


          //console.log(result);
          //this.archivo.saveFile();
          //this.stepper.reset();
          //this.complainantFormGroup.reset();

          data.correlativo = result.correlativo;

          /* this.dialog.showSnackBar({
            icon: 'success',
            title: 'IFI-200',
            text: `se ha creado la denuncia ${result.correlativo}, exitosamente.`,
            duration: 3000
          }); */
          this.dialog.show({
            title: 'IFI-200',
            text: `se ha creado la denuncia ${result.correlativo}, exitosamente.`,
            icon: 'success',
            showCancelButton: false,
            disableClose: true,
            showCloseButton: false,
            showConfirmButton: true
          })

          this.goPdf(data);

        }
      );

    }
    else {

      console.log(this.detailFormGroup.valid);
      if (this.showPaymentDocumentation) {
        if (!this.detailFormGroup.controls['paymentDocumentation'].value) {
          this.dialog.showSnackBar({
            icon: 'error',
            title: 'IFI-200',
            text: `Hace falta cargar el archivo de documentacion del pago.`,
            duration: 3000
          });
        }
      } else {

        this.dialog.showSnackBar({
          icon: 'error',
          title: 'IFI-200',
          text: `Hace falta campos que llenar, favor revise.`,
          duration: 3000
        });
      }


    }

  }

  changePaymentMethod(): void {
    this.showPaymentDocumentation = this.detailFormGroup.get('paymentMethod')?.value === 505
      || this.detailFormGroup.get('paymentMethod')?.value === 959;

    if (!this.showPaymentDocumentation) {
      this.detailFormGroup.controls.paymentDocumentation.clearValidators();
      this.detailFormGroup.controls.paymentDocumentation.updateValueAndValidity();
      this.detailFormGroup.updateValueAndValidity();

    }


  }

  removeFileFromList(pItem: File): void {

    console.log(pItem);

    const index = this.data.data.findIndex(item => item === pItem);
    if (index != -1) {
      this.data.data.splice(index, 1);
    }

    this.table.updateData(this.data.data);

    this.showEvidenceFileUploader = !(this.data.data.length === 3);


  }

}
