import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '../../services/api/api.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Observable, map, startWith } from 'rxjs';
import { IApiResponse, ITicket, ITravel, IUser } from '../../../constants/Interfaces';
import { Router } from '@angular/router';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { root } from '../../../constants/Routes';
import { apiPaths } from '../../../constants/apiRoutes';
import Swal from 'sweetalert2';
import { HttpStatusCode } from '@angular/common/http';
import { TicketWidgetComponent } from '../../components/ticket-widget/ticket-widget.component';

@Component({
  selector: 'user-page',
  standalone: true,
  imports: [
    MatGridListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule, MatTooltipModule, MatIconModule, MatCheckboxModule,
    SpinnerComponent, TicketWidgetComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserPage implements OnInit {
  constructor(private apiService:ApiService, private router:Router){}

  ngOnInit(): void {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey) && localStorage.getItem(roleKey) === "2"){
      this.userLogged = true;
      const jwtToken = localStorage.getItem(tokenKey);
      const userId = localStorage.getItem(userIdKey);
      this.initializeEnvData(jwtToken, userId);
    }
    else{
      this.router.navigateByUrl(root.path);
    }
  }

  userLogged:boolean = false;
  showSpinner:boolean = false;
  spinnerMessage:string = '';
  reloadWidget: boolean = false;
  myControl = new FormControl('');
  filteredOptions: Observable<ITravel[]> | undefined;
  travelsArray:ITravel[] = [];
  travelSelected:ITravel = {
    id:0,
    destination: "",
    shipId: 0,
    departureDateTime: "",
    cost: 0,
    passengersLimit: 0,
    availableSeatsNumber: 0,
  };
  userInfo:IUser = {
    id:0,
    name: "",
    email: "",
    password: "",
    documentNumber: "",
    phone: "",
    isRegistered: false,
    role:3
  };
  ticketForm:ITicket = {
    userId: 0,
    travelId: 0,
    ticket: "default",
    returns: false,
    redeemed: false
  }
  errorMessage:string = "";


  private async initializeEnvData(token:string|null, userId:string|null){
    try {
      const travelResponse: ITravel[] = await this.getTravels();
      this.travelsArray = travelResponse;
      await this.getUserInfo(token, userId);
    } catch (error) {
      console.error("Error fetching travels:", error);
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value:any) => {
        const filtered = typeof value === 'string' ? this._filter(value) : this._filter(value.destination);
        this.travelSelected = filtered && filtered.length === 1 ?
          filtered[0]
          :
          {
            id:0,
            destination: "",
            shipId: 0,
            departureDateTime: "",
            cost: 0,
            passengersLimit: 0,
            availableSeatsNumber: 0,
          };
        return filtered;
      }),
    );
  }

  async getTravels(): Promise<ITravel[]>{
    return new Promise<ITravel[]>((resolve, reject) => {
      this.apiService.get(apiPaths.root, apiPaths.endpoints.travels.root).subscribe({
        next: (response:ITravel[]) => {
          resolve(response);
        },
        error: (error) => {
          if(error.status != 200){
            console.error(error);
            resolve([]);
          }
        }
      })
    })
  }

  async getUserInfo(token:string|null, userId:string|null){
    if(token && token.length > 0)
      this.apiService.get(apiPaths.root, `${apiPaths.endpoints.users.root}/${userId}`, token).subscribe({
        next: (response:IApiResponse) => {
          if(response.httpCode === HttpStatusCode.Ok && response.success){
            this.userInfo = response.objectResponse;
          }
        },
        error: (error) => {
          if(error.status != 200){
            console.error(error);
          }
        }
      })
    else{
      Swal.fire({
        title: "La sesión ha caducado",
        icon: 'info',
        text: 'Su sesión ha caducado, debe iniciar sesión'
      })
      .then(action => {
        if(action.isConfirmed)
          this.router.navigateByUrl(root.path);
      })
    }
  }

  private _filter(value: string): ITravel[] {
    const filterValue = value.toLowerCase();
    return this.travelsArray.filter(option =>
      option.destination.toLowerCase().includes(filterValue)
    );
  }

  async registerTicket(){
    this.showSpinner = true;
    this.spinnerMessage = 'Separando tu tiquete...';
    const jwtToken = localStorage.getItem(tokenKey);
    this.ticketForm.userId = this.userInfo.id ? this.userInfo.id : 0;
    this.ticketForm.travelId = this.travelSelected.id ? this.travelSelected.id : 0;

    this.apiService.post(apiPaths.root, apiPaths.endpoints.tickets.root, this.ticketForm, jwtToken).subscribe({
      next: (registerTicketResponse:IApiResponse) => {
        if(registerTicketResponse.httpCode === HttpStatusCode.Ok && registerTicketResponse.success){
          if(this.travelSelected.availableSeatsNumber)
            this.travelSelected.availableSeatsNumber -= 1;
          this.reloadWidget = true;
          this.travelSelected = {
            id:0,
            destination: "",
            shipId: 0,
            departureDateTime: "",
            cost: 0,
            passengersLimit: 0,
            availableSeatsNumber: 0,
          };
          Swal.fire({
            icon: 'success',
            title: `Viaje reservado exitosamente con el tiquete: ${registerTicketResponse.objectResponse.ticket}`,
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
