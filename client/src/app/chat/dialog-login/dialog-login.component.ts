import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {WebsocketService} from "../shared/services/websocket.service";

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit {

  login: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(private wsService: WebsocketService,
              public dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {
  }

  ngOnInit() {

    this.wsService.on('login').subscribe((value) => {
      console.log(value);
      if(value['success']) {
          this.dialogRef.close({

          });
      }
      else {
        this.errorMessage = value['errorMessage'];
      }
    });

    if (localStorage.getItem("login") !== undefined) {
      this.wsService.send('login', {
        'login': localStorage.getItem("login"),
        'password': localStorage.getItem("password")
      });
    }
    else {
      this.wsService.send('whoami', {});
    }
  }

  sendLogin() {
    localStorage.setItem("login", this.login);
      localStorage.setItem("password", this.password);
    this.wsService.send('login', {
      'login': this.login,
      'password': this.password
    })
  }
}
