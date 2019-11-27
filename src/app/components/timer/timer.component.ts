import {Component, OnInit} from '@angular/core';
import {interval, Observable, of, Subscription, timer} from 'rxjs';
import {CountdownService} from '../../services/countdown.service';
import {TimerActionEnum} from '../../enums/timer-action.enum';
import {finalize, takeUntil} from 'rxjs/operators';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractClassPart} from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass']
})
export class TimerComponent implements OnInit {

  timerValuesForm = this.fb.group({
    hours: [ 0, Validators.required ],
    minutes: [ 0, Validators.required ],
    seconds: [ 0, Validators.required ],
  });

  ticks = null;
  leftTime;
  intervalTime = 1000;
  intervalSubscription: Subscription;
  interval: Observable<number>;

  shouldApplyTime = true;

  isTimerStarted = false;

  displayHours = 0;
  displayMinutes = 0;
  displaySeconds = 0;

  constructor(
    private countdownService: CountdownService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.applyTime();
    this.getTimeToShow();
    this.countdownService.setTimerAction(TimerActionEnum.Start);
    this.countdownService.timerAction$.subscribe(res => {
      switch (res) {
        case TimerActionEnum.Start:
          this.startTimer();
          break;
        case TimerActionEnum.Wait:
          this.waitTimer();
          break;
        case TimerActionEnum.Reset:
          this.resetTimer();
          break;
        case TimerActionEnum.Stop:
          this.stopTimer();
          break;
      }
    });

    this.timerValuesForm.valueChanges.subscribe(() => this.shouldApplyTime = true);
  }

  applyTime(): void {
    this.leftTime = +this.hoursCtrl.value * 60 * 60 + +this.minutesCtrl.value * 60 + +this.secondsCtrl.value;
    this.ticks = this.leftTime;
    this.getTimeToShow();

    if (this.isTimerStarted) {
      this.stopTimer();
    }
  }

  get secondsCtrl(): AbstractControl {
    return this.timerValuesForm.get('seconds');
  }

  get minutesCtrl(): AbstractControl {
    return this.timerValuesForm.get('minutes');
  }

  get hoursCtrl(): AbstractControl {
    return this.timerValuesForm.get('hours');
  }

  private startTimer() {
    if (this.shouldApplyTime) {
      this.applyTime();
    }
    this.shouldApplyTime = true;
    this.isTimerStarted = true;
    timer(this.leftTime * 1000 + 1000).pipe(
      finalize(() => {
        this.intervalSubscription.unsubscribe();
        this.isTimerStarted = false;
      }),
    ).subscribe();
    this.interval = interval(this.intervalTime);
    this.intervalSubscription = this.interval.subscribe( time => {
          this.ticks = this.leftTime - (time + 1);
          this.getTimeToShow();
        }
      );
  }

  private waitTimer(): void {
    this.intervalSubscription.unsubscribe();
    this.leftTime = this.ticks;
    this.shouldApplyTime = false;
  }

  private resetTimer(): void {
    this.intervalSubscription.unsubscribe();
    this.isTimerStarted = false;
    this.ticks = 0;
    this.leftTime = 0;
    this.getTimeToShow();
  }

  private stopTimer(): void {
    this.intervalSubscription.unsubscribe();
    this.isTimerStarted = false;
    this.applyTime();
  }

  private getTimeToShow(): void {
    this.displayHours = this.getHours(this.ticks);
    this.displayMinutes = this.getMinutes(this.ticks);
    this.displaySeconds = this.getSeconds(this.ticks);
  }

  private getHours(ticks: number) {
    return this.padding(Math.floor((ticks / 60) / 60));
  }

  private getMinutes(ticks: number) {
    return this.padding((Math.floor(ticks / 60)) % 60);
  }

  private getSeconds(ticks: number) {
    return this.padding(ticks % 60);
  }

  private padding(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

}
