import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({url: 'https://chat.monstrofil.xyz/admin/upload_image/', itemAlias: 'file'});

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if(status !== 200) {
        alert('Problem during file upload');
        this.dialogRef.close({
          photo_id: -1
        });
        return;
      }
      console.log('ImageUpload:uploaded:', item, status, response);
      this.dialogRef.close({
        photo_id: JSON.parse(response)['photo_id']
      });
    };
  }

}
