import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageEvent$: Observable<Event>;

  constructor() {
    this.storageEvent$ = fromEvent(window, 'storage');
  }

  onChange(): Observable<Event> {
    return this.storageEvent$;
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear():void {
    localStorage.clear();
  }

  length():number {
    return localStorage.length;
  }
}
