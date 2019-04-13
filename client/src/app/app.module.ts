import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from  '@angular/common/http';

import { IndexComponent } from './index/index.component';
import {DialogLoginComponent} from "./chat/dialog-login/dialog-login.component";
import {FormsModule} from "@angular/forms";
import {DialogUserComponent} from "./chat/dialog-user/dialog-user.component";

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DialogLoginComponent
  ],
  entryComponents: [DialogLoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChatModule,
    SharedModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
