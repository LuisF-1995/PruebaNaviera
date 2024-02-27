import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { ApiService } from '../../services/api/api.service';
import { apiPaths } from '../../../constants/apiRoutes';
import { QrCodeService } from '../../services/qr-code/qr-code.service';
import { IApiResponse, ITicket, ITravel, IUser } from '../../../constants/Interfaces';
import { HttpStatusCode } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { root } from '../../../constants/Routes';

@Component({
  selector: 'ticket-widget',
  standalone: true,
  imports: [],
  templateUrl: './ticket-widget.component.html',
  styleUrl: './ticket-widget.component.css'
})
export class TicketWidgetComponent implements OnInit, OnChanges {
  constructor(private apiService:ApiService, private qrCodeService: QrCodeService, private router:Router){}

  @Input() reloadWidget: boolean = false;
  @Input() userInfo:IUser = {
    id:0,
    name: "",
    email: "",
    password: "",
    documentNumber: "",
    phone: "",
    isRegistered: false,
    role:2
  };
  userSigned:boolean = false;
  qrCodeDataURL: string | null = null;
  ticketInfo:ITicket = {
    id:0,
    userId: 0,
    travelId: 0,
    ticket: "default",
    returns: false,
    redeemed: false
  };
  travelInfo:ITravel = {
    id:0,
    destination: "",
    shipId: 0,
    departureDateTime: "",
    cost: 0,
    passengersLimit: 0,
    availableSeatsNumber: 0,
  };

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
      next: (response:IApiResponse) => {
        if(response.httpCode === HttpStatusCode.Ok && response.success){
          this.ticketInfo = response.objectResponse;
          this.generateQRCode(this.ticketInfo.id, 150);
          this.getTravelInfo(token, this.ticketInfo.travelId);
        }
      },
      error: (error) => {
        this.ticketInfo = {
          userId: 0,
          travelId: 0,
          ticket: "default",
          returns: false,
          redeemed: false
        };
        console.error(error);
      }
    })
  }

  async getTravelInfo(token:string|null, travelId:number){
    if(token && token.length > 0)
      this.apiService.get(apiPaths.root, `${apiPaths.endpoints.travels.root}/${travelId}`, token).subscribe({
        next: (response:IApiResponse) => {
          if(response.httpCode === HttpStatusCode.Ok && response.success){
            this.travelInfo = response.objectResponse;
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

  async generateQRCode(text:number|undefined, width:number) {
    const qrText:string = text && text != undefined ? text.toString() : "";
    try {
      this.qrCodeDataURL = await this.qrCodeService.generateQRCodeAsDataURL(qrText, width);
    } catch (error) {
      console.error('Error al generar el código QR:', error);
    }
  }
}
