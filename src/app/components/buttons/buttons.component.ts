import {Component, OnDestroy, OnInit} from '@angular/core';
import {CountdownService} from '../../services/countdown.service';
import {TimerActionEnum} from '../../enums/timer-action.enum';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {buffer, filter, finalize, takeUntil, throttleTime} from 'rxjs/operators';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.sass']
})
export class ButtonsComponent implements OnInit, OnDestroy {

  private timerAction: any;
  private start: boolean;
  private doubleClickTimer: Observable<number>;
  private isTimerOpened: boolean;
  private click$ = fromEvent(document, 'click');

  constructor(
    private countdownService: CountdownService
  ) { }

  ngOnInit() {
    this.timerAction = this.countdownService.timerAction$.subscribe((res: any) => this.setStart(res));
  }

  ngOnDestroy() {
    this.timerAction.unsubscribe();
  }

  private setStart(res: any) {
    (res.start) ? this.start = true : this.start = false;
  }

  startTimer() {
    this.countdownService.setTimerAction(TimerActionEnum.Start);
  }

  waitTimer() {
    if (this.isTimerOpened) {
      this.countdownService.setTimerAction(TimerActionEnum.Wait);
    }
    this.isTimerOpened = true;
    this.click$.pipe(
      buffer(this.click$.pipe(throttleTime(300))),
      filter(clickArray => clickArray.length > 1)
    ).pipe(finalize(() => this.isTimerOpened = false)).subscribe();
    // timer(300).pipe(finalize(() => this.isTimerOpened = false)).subscribe();
  }

  stopTimer() {
    this.countdownService.setTimerAction(TimerActionEnum.Stop);
  }

  resetTimer() {
    this.countdownService.setTimerAction(TimerActionEnum.Reset);
  }

}
