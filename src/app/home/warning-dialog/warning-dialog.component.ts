import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'mifos-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent implements OnInit {

  title: string;
  content: string;
  buttonText: string;

  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>) {
    this.title = environment.warningDialog.title;
    this.content = environment.warningDialog.content;
    this.buttonText = environment.warningDialog.buttonText;
  }

  ngOnInit() {
  }

}