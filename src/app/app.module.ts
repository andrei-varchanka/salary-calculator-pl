import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatCheckboxModule, MatRadioModule, MatInputModule, MatButtonModule, MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
