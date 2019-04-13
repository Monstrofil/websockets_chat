import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { WebsocketService } from './shared/services/websocket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { OrderModule } from 'ngx-order-pipe';
import {DialogLoginComponent} from "./dialog-login/dialog-login.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    OrderModule
  ],
  declarations: [
    ChatComponent,
    DialogUserComponent,
    FileSelectDirective
  ],
  providers: [WebsocketService],
  entryComponents: [DialogUserComponent]
})
export class ChatModule { }
