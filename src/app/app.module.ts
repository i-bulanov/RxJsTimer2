import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TimerComponent } from './components/timer/timer.component';
import {CountdownService} from './services/countdown.service';
import { ButtonsComponent } from './components/buttons/buttons.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    ButtonsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [CountdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
