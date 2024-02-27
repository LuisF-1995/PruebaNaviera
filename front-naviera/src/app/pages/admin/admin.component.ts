import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CreateTravelsComponent } from '../../components/create-travels/create-travels.component';
import { CreateShipsComponent } from '../../components/create-ships/create-ships.component';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { Router } from '@angular/router';
import { root } from '../../../constants/Routes';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [
    MatGridListModule,
    CreateTravelsComponent, CreateShipsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminPage implements OnInit {
  constructor (private router:Router) {}
  userLogged:boolean = false;

  ngOnInit(): void {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey) && localStorage.getItem(roleKey) === "0"){
      this.userLogged = true;
    }
    else{
      this.router.navigateByUrl(root.path);
    }
  }

}
