import { Component, OnInit, inject } from '@angular/core';
import { registeredUserKey, roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { Router, RouterLink } from '@angular/router';
import { admin, root, ticketBooth, user } from '../../../constants/Routes';
import { ApiService } from '../../services/api/api.service';
import { IApiResponse, ITicket, ITravel, IUser } from '../../../constants/Interfaces';
import { apiPaths } from '../../../constants/apiRoutes';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TicketWidgetComponent } from '../../components/ticket-widget/ticket-widget.component';
import { HttpStatusCode } from '@angular/common/http';
import Swal from 'sweetalert2';
// MATERIAL-UI COMPONENTS
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';

@Component({
  selector: 'root-page',
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
    TicketWidgetComponent,
    MatGridListModule,
    LoginComponent, RegisterComponent
  ],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})

export class RootPage implements OnInit {

  constructor(private router:Router, private apiService: ApiService){}

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
  private modalService = inject(NgbModal);
  userTicketForm:IUser = {
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

  ngOnInit(){
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey)){
      const userRole = localStorage.getItem(roleKey);
      if(userRole && userRole.length > 0)
        switch (userRole) {
          case "0": // Role for admin
            this.router.navigateByUrl(admin.path);
            break;
          case "1": // Role for ticket booth
            this.router.navigateByUrl(ticketBooth.path);
            break;
          case "2": // Role for registered customer
            this.router.navigateByUrl(user.path);
            break;
          case "3": // Role for external user
            this.router.navigateByUrl(root.path);
            break;

          default:
            break;
        }
    }
    this.initializeEnvData();
  }

  private async initializeEnvData(){
    try {
      const travelResponse: ITravel[] = await this.getTravels();
      this.travelsArray = travelResponse;
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

  private _filter(value: string): ITravel[] {
    const filterValue = value.toLowerCase();
    return this.travelsArray.filter(option =>
      option.destination.toLowerCase().includes(filterValue)
    );
  }

  openModal(longContent: any){
    this.modalService.open(longContent, { scrollable: true });
  }

  async registerExternalUser(): Promise<any> {
    return new Promise<IApiResponse>((resolve, reject) => {
      this.apiService.post(apiPaths.root, `${apiPaths.endpoints.users.root}/${apiPaths.endpoints.users.register}`, this.userTicketForm).subscribe({
        next: (registerUserResponse:IApiResponse) => {
          resolve(registerUserResponse);
        },
        error: (error) => {
          resolve(error);
        }
      })
    })
  }

  async registerTicket(){
    this.apiService.post(apiPaths.root, apiPaths.endpoints.tickets.root, this.ticketForm).subscribe({
      next: (registerTicketResponse:IApiResponse) => {
        if(registerTicketResponse.httpCode === HttpStatusCode.Ok && registerTicketResponse.success){
          if(this.travelSelected.availableSeatsNumber)
            this.travelSelected.availableSeatsNumber -= 1;
          localStorage.setItem(userIdKey, registerTicketResponse.objectResponse.userId);
          localStorage.setItem(roleKey, this.userTicketForm.role.toString());
          localStorage.setItem(registeredUserKey, this.userTicketForm.isRegistered ? 'true':'false');
          this.reloadWidget = true;
          Swal.fire({
            icon: 'success',
            title: `Tiquete registrado exitosamente`,
            text: `Se registró el tiquete con referencia ${registerTicketResponse.objectResponse.ticket}`,
          });
        }
        this.showSpinner = false;
      },
      error: (error) => {
        this.showSpinner=false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar el tiquete',
          text: `${error}`,
        });
      }
    });
  }

  async submitForm () {
    this.showSpinner = true;
    try {
      const userResponse = await this.registerExternalUser();

      if(userResponse && userResponse.httpCode === HttpStatusCode.Ok && userResponse.success && userResponse.objectResponse){
        this.ticketForm.travelId = this.travelSelected.id ? this.travelSelected.id:0;
        this.ticketForm.userId = userResponse.objectResponse.id;
        await this.registerTicket();
      }
      else if(!userResponse.ok){
        this.showSpinner = false;
        Swal.fire({
          icon: 'info',
          title: 'No se pudo registrar el usuario',
          text: `${userResponse.error.message}`,
          confirmButtonText: 'Iniciar sesión'
        });
      }
      else{
        this.showSpinner = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo registrar el usuario',
          text: `${userResponse.message}`,
        });
      }
    } catch (error) {
      this.showSpinner = false;
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo enviar la solicitud al servidor',
      });
    }
  }
}
