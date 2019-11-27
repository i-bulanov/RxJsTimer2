import {Component, OnDestroy, OnInit} from '@angular/core';
import {CountdownService} from '../../services/countdown.service';
import {TimerActionEnum} from '../../enums/timer-action.enum';
import {Observable, Subscription, timer} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

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
    timer(300).pipe(finalize(() => this.isTimerOpened = false)).subscribe();
  }

  stopTimer() {
    this.countdownService.setTimerAction(TimerActionEnum.Stop);
  }

  resetTimer() {
    this.countdownService.setTimerAction(TimerActionEnum.Reset);
  }

}
