import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IApiResponse, IShip } from '../../../constants/Interfaces';
import { ApiService } from '../../services/api/api.service';
import { tokenKey } from '../../../constants/localStorageKeys';
import { apiPaths } from '../../../constants/apiRoutes';
import Swal from 'sweetalert2';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'create-ships',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule, MatTooltipModule, MatIconModule, MatCheckboxModule,
    SpinnerComponent,
  ],
  templateUrl: './create-ships.component.html',
  styleUrl: './create-ships.component.css'
})

export class CreateShipsComponent {
  constructor (private apiService:ApiService){}

  shipForm:IShip = {
    name: "",
    model: "",
    image: ""
  }
  showSpinner:boolean = false;
  spinnerMessage:string = '';
  errorMessage:string = "";

  convertImgToBase64(event: any){
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result && reader.result.toString().split(',')[1];
      const base64Image: string = 'data:image/' + file.type.split('/')[1] + ';base64,' + base64String;
      this.shipForm.image = base64Image;
    };

    reader.readAsDataURL(file);
  }

  async createShip(){
    this.showSpinner = true;
    this.spinnerMessage = 'Registrando una nueva nave...';
    const jwtToken = localStorage.getItem(tokenKey);

    this.apiService.post(apiPaths.root, apiPaths.endpoints.ships.root, this.shipForm, jwtToken).subscribe({
      next: (registerTravelResponse:IApiResponse) => {
        if(registerTravelResponse.httpCode === HttpStatusCode.Ok && registerTravelResponse.success){
          Swal.fire({
            icon: 'success',
            title: `Nave registrada exitosamente`,
          });
        }
        this.showSpinner = false;
      },
      error: (error) => {
        this.showSpinner=false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar la nave',
          text: `${error}`,
        });
      }
    });

  }
}
