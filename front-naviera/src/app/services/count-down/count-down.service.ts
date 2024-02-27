import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountDownService {

  constructor() { }

  getCountdownTimer(targetDate: string): Observable<number> {
    const targetTime = new Date(targetDate).getTime();
    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const currentTime = new Date().getTime();
        const remainingTime = targetTime - currentTime;
        return Math.max(0, remainingTime);
      })
    );
  }
}
