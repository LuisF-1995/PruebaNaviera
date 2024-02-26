import { HttpStatusCode } from "@angular/common/http";

export interface IUser {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  documentNumber?: string;
  phone?: string;
  isRegistered?: boolean;
  role: 0|1|2|3;
}

export interface IUserLogin {
  email: string;
  password: string;
  documentNumber?: string;
  role: 0|1|2|3;
}

export interface IUserLoginResponse {
  id:number;
  role: 0|1|2|3;
  token: string;
  success: boolean;
  message: string;
  httpCode: HttpStatusCode
}

export interface IShip {
  id?:number;
  name: string;
  model: string;
  image?: string;
}

export interface ITicket {
  id?: number;
  userId: number;
  travelId: number;
  ticket: string;
  returns: boolean;
  seat?: string;
  redeemed: boolean;
}

export interface ITravel {
  id: number;
  destination: string;
  shipId: number;
  departureDateTime: string;
  cost: number;
  passengersLimit: number;
  availableSeatsNumber: number;
}

export interface IApiResponse {
  success: boolean;
  message: string;
  httpCode: HttpStatusCode;
  objectResponse: any;
  id?:number;
  role?:number;
  token?:string;
}
