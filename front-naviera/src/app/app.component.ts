import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { admin, root, ticketBooth, user } from '../constants/Routes';
import { RouterOutlet, RouterLink, Router, NavigationEnd} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { roleKey, tokenKey, userIdKey } from '../constants/localStorageKeys';
import { IApiResponse, IUser } from '../constants/Interfaces';
import { ApiService } from './services/api/api.service';
import { apiPaths } from '../constants/apiRoutes';
import { HttpStatusCode } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FontAwesomeModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private router:Router, private apiService:ApiService){}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Forzar el renderizado del componente padre cuando se completa la navegación a una nueva ruta
        // Puedes agregar alguna lógica adicional aquí según tus necesidades
        this.validateCredentials();
      }
    });
    this.validateCredentials();
  }

  title = 'Naviera Sea Around';
  rootPath = root.path;
  adminPath = admin.path;
  ticketBoothPath = ticketBooth.path;
  faUser = faUser;
  userSigned = false;
  userInfo:IUser = {
    name: "",
    email: "",
    documentNumber: "",
    phone: "",
    isRegistered: false,
    role:3
  };

  private validateCredentials(){
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey)){
      const userRole = localStorage.getItem(roleKey);
      const jwtToken = localStorage.getItem(tokenKey);
      const userId = localStorage.getItem(userIdKey);
      this.getUserInfo(jwtToken, userId);
      this.userSigned = true;

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

  closeSession(){
    localStorage.clear();
    this.userSigned = false;
    this.router.navigateByUrl(root.path);
  }
}
