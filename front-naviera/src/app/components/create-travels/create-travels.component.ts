import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IApiResponse, IShip, ITravel } from '../../../constants/Interfaces';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ApiService } from '../../services/api/api.service';
import { apiPaths } from '../../../constants/apiRoutes';
import Swal from 'sweetalert2';
import { HttpStatusCode } from '@angular/common/http';
import { tokenKey } from '../../../constants/localStorageKeys';

@Component({
  selector: 'create-travels',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule, MatTooltipModule, MatIconModule, MatCheckboxModule,
    SpinnerComponent,
    MatDatepickerModule
  ],
  templateUrl: './create-travels.component.html',
  styleUrl: './create-travels.component.css',
  providers: [provideNativeDateAdapter()]
})
export class CreateTravelsComponent implements OnInit {
  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.getShips();
  }

  showSpinner:boolean = false;
  spinnerMessage:string = '';
  registerTravelForm:ITravel = {
    destination:"",
    shipId: 0,
    departureDateTime: "",
    cost: 0,
    passengersLimit:0
  };
  errorMessage:string = "";
  ships: IShip[] = [];

  async getShips(){
    await this.apiService.get(apiPaths.root, apiPaths.endpoints.ships.root).subscribe({
      next: (response:IShip[]) => {
        this.ships = response;
      },
      error: () => {
        this.ships = [];
      }
    })
  }

  async createTravel(){
    this.showSpinner = true;
    this.spinnerMessage = 'Registrando un nuevo viaje...';
    const shipId = parseInt(this.registerTravelForm.shipId.toString());
    this.registerTravelForm.shipId = shipId;
    const cost = parseFloat(this.registerTravelForm.cost.toString());
    this.registerTravelForm.cost = cost;
    const jwtToken = localStorage.getItem(tokenKey);

    this.apiService.post(apiPaths.root, apiPaths.endpoints.travels.root, this.registerTravelForm, jwtToken).subscribe({
      next: (registerTravelResponse:IApiResponse) => {
        if(registerTravelResponse.httpCode === HttpStatusCode.Ok && registerTravelResponse.success){
          Swal.fire({
            icon: 'success',
            title: `Viaje registrado exitosamente`,
          });
        }
        this.showSpinner = false;
      },
      error: (error) => {
        this.showSpinner=false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar el viaje',
          text: `${error}`,
        });
      }
    });
  }
}
