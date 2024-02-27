import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { IApiResponse, IUserLogin } from '../../../constants/Interfaces';
import { apiPaths } from '../../../constants/apiRoutes';
import Swal from 'sweetalert2';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { HttpStatusCode } from '@angular/common/http';
import { admin, ticketBooth, user } from '../../../constants/Routes';

@Component({
  selector: 'login',
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router:Router, private apiService: ApiService){}

  showSpinner:boolean = false;
  spinnerMessage:string = '';
  loginUserForm:IUserLogin = {
    email: "",
    password: "",
    documentNumber: "",
    role:2
  };
  errorMessage:string = "";
  hidePassword = true;

  async login(){
    this.showSpinner = true;
    this.spinnerMessage = 'Verificando usuario ...';

    this.apiService.post(apiPaths.root, `${apiPaths.endpoints.users.root}/${apiPaths.endpoints.users.login}`, this.loginUserForm).subscribe({
      next: (registerUserResponse:IApiResponse) => {
        if(registerUserResponse.httpCode === HttpStatusCode.Ok && registerUserResponse.success && registerUserResponse.token && registerUserResponse.token.length > 0){
          localStorage.clear();
          localStorage.setItem(tokenKey, registerUserResponse.token);
          localStorage.setItem(userIdKey, registerUserResponse.id ? registerUserResponse.id.toString() : "");
          if(registerUserResponse.role === 0){
            let rolString = "";
            rolString = registerUserResponse.role?.toString();
            localStorage.setItem(roleKey, rolString);
          }
          else{
            localStorage.setItem(roleKey, registerUserResponse.role ? registerUserResponse.role.toString() : "");
          }
          this.showSpinner = false;

          switch (registerUserResponse.role) {
            case 0:
              this.router.navigateByUrl(admin.path);
              break;
            case 1:
              this.router.navigateByUrl(ticketBooth.path);
              break;
            case 2:
              this.router.navigateByUrl(user.path);
              break;

            default:
              break;
          }
        }
      },
      error: (error) => {
        this.showSpinner = false;
        if(error.error.httpCode === 401){
          Swal.fire({
            icon: 'error',
            title: `Credenciales erroneas`,
            text: `${error.error.message}. Codigo: ${error.error.httpCode}`,
          })
        }
        else if (error.error.httpCode === 404){
          Swal.fire({
            icon: 'info',
            title: `Usuario no registrado`,
            text: `${error.error.message}. Codigo: ${error.error.httpCode}`,
          })
        }
      }
    })
  }
}
