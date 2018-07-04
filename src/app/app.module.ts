import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app.routing.module';
import {AuthModule} from './auth/auth.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    // AuthModule,
    FormsModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
