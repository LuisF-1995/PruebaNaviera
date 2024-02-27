import { Component } from '@angular/core';
import { IApiResponse, IUser } from '../../../constants/Interfaces';
import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
// MATERIAL UI
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { apiPaths } from '../../../constants/apiRoutes';
import Swal from 'sweetalert2';

@Component({
  selector: 'register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  constructor(private router:Router, private apiService: ApiService){}

  showSpinner:boolean = false;
  spinnerMessage:string = '';
  registerUserForm:IUser = {
    name: "",
    email: "",
    password: "",
    documentNumber: "",
    phone: "",
    isRegistered: true,
    role:2
  };
  errorMessage:string = "";
  hidePassword = true;
  passValidate = "";
  hidePassValidator = true;
  samePassword = false;

  validatePassword(){
    if(this.passValidate === this.registerUserForm.password){
      this.samePassword = true;
    }
    else{
      this.samePassword = false;
    }
  }

  async registerUser(){
    this.showSpinner = true;
    this.spinnerMessage = 'Verificando usuario ...';
    if(this.samePassword){
      const rol = parseInt(this.registerUserForm.role.toString());
      this.registerUserForm.role = rol;
      this.apiService.post(apiPaths.root, `${apiPaths.endpoints.users.root}/${apiPaths.endpoints.users.register}`, this.registerUserForm).subscribe({
        next: (registerUserResponse:IApiResponse) => {
          this.showSpinner = false;
          this.registerUserForm = {
            name: "",
            email: "",
            password: "",
            documentNumber: "",
            phone: "",
            isRegistered: true,
            role:2
          };
          this.passValidate = "";
          Swal.fire({
            icon: 'success',
            title: `Usuario registrado exitosamente`
          })
        },
        error: (error) => {
          this.showSpinner = false;
          Swal.fire({
            icon: 'info',
            title: `No se pudo registrar al usuario`,
            text: `${error.error.message}. Codigo: ${error.error.httpCode}`,
            confirmButtonText: "Iniciar sesion"
          })
          .then(event => {
            if(event.isConfirmed){
              this.router.navigateByUrl("#login-component");
            }
          })
        }
      })
    }
    else{
      this.showSpinner = false;
      this.errorMessage = "Las contraseñas no coinciden";
    }
  }
}
