import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatDialog, MatDialogRef, MatList, MatListItem} from '@angular/material';

import {Action} from './shared/model/action';
import {Message} from './shared/model/message';
import {WebsocketService} from './shared/services/websocket.service';
import {DialogUserComponent} from './dialog-user/dialog-user.component';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";


class User {

  id : number;
  is_active: boolean;

}

export interface IMessage {
    id: number;
    text: string;
}

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  chat_id: number;
  messages: Message[] = [];
  messageContent: string;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Upload image'
    }
  };


  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(private wsService: WebsocketService,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
    console.log(this.wsService.status);
  }

  ngOnInit(): void {
    this.chat_id = +this.route.snapshot.paramMap.get("user_id");

    this.initIoConnection();
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages

    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  sendImage() {
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openImageSendPopup(this.defaultDialogUserParams);
    }, 0)
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }


  private initIoConnection(): void {
    this.wsService.on("message_" + this.chat_id.toString())
      .subscribe((value) => {
        console.log(value as Message);
        this.messages.push({
          'message_id': value['message_id'],
          'from': value['from'],
          'content': value['content']
        });
      });
    this.wsService.send("chat_ready", {
      "chat_id": this.chat_id
    });
  }

  private openImageSendPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (paramsDialog['photo_id'] === -1) {
        return;
      }
      this.wsService.send("message", {
        'chat_id': this.chat_id,
        'type': 'image',
        'message': paramsDialog['photo_id']
      });

    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.wsService.send("message", {
      'chat_id': this.chat_id,
      'type': 'text',
      'message': message
    });
    this.messageContent = null;

  }
}
