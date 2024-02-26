import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { ApiService } from '../../services/api/api.service';
import { apiPaths } from '../../../constants/apiRoutes';

@Component({
  selector: 'ticket-widget',
  standalone: true,
  imports: [],
  templateUrl: './ticket-widget.component.html',
  styleUrl: './ticket-widget.component.css'
})
export class TicketWidgetComponent implements OnInit, OnChanges {
  @Input() reloadWidget: boolean = false;
  userSigned:boolean = false;

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.validateLocalStorageVars();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadWidget'] && changes['reloadWidget'].currentValue === true) {
      this.validateLocalStorageVars();
    }
  }

  async validateLocalStorageVars () {
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey)){
      const jwtToken = localStorage.getItem(tokenKey);
      const userId = localStorage.getItem(userIdKey);
      this.userSigned = true;
      await this.getTicketInfo(jwtToken, userId);
    }
    else{
      this.userSigned = false;
    }
  }

  async getTicketInfo(token:string|null, userId:string|null){
    this.apiService.get(apiPaths.root, `${apiPaths.endpoints.tickets.root}/${apiPaths.endpoints.tickets.getByUserId}/${userId}`, token).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
