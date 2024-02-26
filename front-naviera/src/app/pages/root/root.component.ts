import { Component, OnInit, inject } from '@angular/core';
import { roleKey, tokenKey, userIdKey } from '../../../constants/localStorageKeys';
import { Router, RouterLink } from '@angular/router';
import { admin, root, ticketBooth, user } from '../../../constants/Routes';
import { ApiService } from '../../services/api/api.service';
import { ITravel } from '../../../constants/Interfaces';
import { apiPaths } from '../../../constants/apiRoutes';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// MATERIAL-UI COMPONENTS
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'root-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule, MatTooltipModule, MatIconModule
  ],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})

export class RootPage implements OnInit {

  constructor(private router:Router, private apiService: ApiService){}

  myControl = new FormControl('');
  filteredOptions: Observable<ITravel[]> | undefined;
  travelsArray:ITravel[] = [];
  travelSelected:ITravel | undefined;
  private modalService = inject(NgbModal);

  ngOnInit(){
    if(typeof(window) !== 'undefined' && localStorage && localStorage.length > 0 && localStorage.getItem(tokenKey) && localStorage.getItem(userIdKey) && localStorage.getItem(roleKey)){
      const userRole = localStorage.getItem(roleKey);
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
    this.initializeEnvData();
  }

  private async initializeEnvData(){
    try {
      const travelResponse: ITravel[] = await this.getTravels();
      this.travelsArray = travelResponse;
    } catch (error) {
      console.error("Error fetching travels:", error);
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value:any) => {
        const filtered = typeof value === 'string' ? this._filter(value) : this._filter(value.destination);
        this.travelSelected = filtered && filtered.length === 1 ? filtered[0] : undefined;
        return filtered;
      }),
    );
  }

  async getTravels(): Promise<ITravel[]>{
    return new Promise<ITravel[]>((resolve, reject) => {
      this.apiService.get(apiPaths.root, apiPaths.endpoints.travels.root).subscribe({
        next: (response:ITravel[]) => {
          resolve(response);
        },
        error: (error) => {
          if(error.status != 200){
            console.error(error);
            resolve([]);
          }
        }
      })
    })
  }

  private _filter(value: string): ITravel[] {
    const filterValue = value.toLowerCase();
    return this.travelsArray.filter(option =>
      option.destination.toLowerCase().includes(filterValue)
    );
  }

  openModal(longContent: any){
    this.modalService.open(longContent, { scrollable: true });
  }

  async registerTicket () {

  }
}
