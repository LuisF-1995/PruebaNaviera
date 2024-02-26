import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { admin, root, ticketBooth, user } from '../constants/Routes';
import { RouterOutlet, RouterLink, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { roleKey, tokenKey, userIdKey } from '../constants/localStorageKeys';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FontAwesomeModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private router:Router){}

  title = 'Naviera Sea Around';
  rootPath = root.path;
  faUser = faUser;
  userSigned = false;

  ngOnInit(): void {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey)){
      const userRole = localStorage.getItem(roleKey);
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


}
