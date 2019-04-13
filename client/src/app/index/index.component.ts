import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WebsocketService} from "../chat/shared/services/websocket.service";
import {MatDialog, MatDialogRef} from "@angular/material";
import {DialogLoginComponent} from "../chat/dialog-login/dialog-login.component";

class Chat {

  id : number;
  name: string;
  avatar: string;

}

@Component({
  selector: 'tcc-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  chats : Chat[] = [];
  dialogRef: MatDialogRef<DialogLoginComponent> | null;

  constructor(
    private  httpClient:HttpClient,
    private wsService: WebsocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.wsService.on('whoami').subscribe((value) => {
      console.log(value);
    });
    this.wsService.on('chats').subscribe((value) => {
      console.log(value);
      this.chats = value as Chat[];
    });

    setTimeout(() => {
      this.dialogRef = this.dialog.open(DialogLoginComponent, {});
      this.dialogRef.afterClosed().subscribe(paramsDialog => {
        this.wsService.send("chats", {});
      });
    }, 0)

  }

}
