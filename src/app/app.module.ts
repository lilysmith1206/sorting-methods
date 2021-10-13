import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { IndexDecoratorDirective } from './index-decorator.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    IndexDecoratorDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
