import {EventEmitter, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TimerActionEnum} from '../enums/timer-action.enum';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  timerAction$ = new Subject();

  constructor() {
  }

  setTimerAction(action: TimerActionEnum): void {
    this.timerAction$.next(action);
  }
}
