import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { root } from '../../../constants/Routes';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ApiService } from '../../services/api/api.service';
import { apiPaths } from '../../../constants/apiRoutes';
import { IApiResponse } from '../../../constants/Interfaces';
import Swal from 'sweetalert2';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'ticket-booth-page',
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
  templateUrl: './ticket-booth.component.html',
  styleUrl: './ticket-booth.component.css'
})

export class TicketBoothPage {
  constructor (private router:Router, private apiService:ApiService) {}

  userLogged:boolean = false;
  ticketId:number = 0;
  showSpinner:boolean = false;
  spinnerMessage:string = '';
  errorMessage:string = "";

  ngOnInit(): void {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey) && localStorage.getItem(roleKey) === "1"){
      this.userLogged = true;
    }
    else{
      this.router.navigateByUrl(root.path);
    }
  }

  async redeemTicket(){
    this.showSpinner = true;
    this.spinnerMessage = 'Redimiento el tiquete...';
    const jwtToken = localStorage.getItem(tokenKey);

    this.apiService.put(apiPaths.root, `${apiPaths.endpoints.tickets.root}/${apiPaths.endpoints.tickets.redeemTicket}/${this.ticketId}`, null, jwtToken).subscribe({
      next: (registerTravelResponse:IApiResponse) => {
        if(registerTravelResponse.httpCode === HttpStatusCode.Ok && registerTravelResponse.success){
          Swal.fire({
            icon: 'success',
            title: `Tiquete redimido`,
          });
        }
        this.showSpinner = false;
      },
      error: (error) => {
        this.showSpinner=false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo redimir el tiquete',
          text: `${error.error.message}`,
        });
      }
    });
  }
}
