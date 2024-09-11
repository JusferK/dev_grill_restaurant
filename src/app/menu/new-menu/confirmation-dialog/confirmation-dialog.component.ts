import { Component, inject, OnInit, signal } from '@angular/core';
import { IMenu } from '../../../models/menu.model';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    NgIf,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CurrencyPipe,
    UpperCasePipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent implements OnInit {

  showLoading = signal<boolean>(false);
  menuInfoReceived = signal<IMenu | null>(null);
  readonly dataReceived = inject(MAT_DIALOG_DATA);
  
  ngOnInit(): void {
    this.menuInfoReceived.set(this.dataReceived.menuInfo);
    this.showLoading.set(this.dataReceived.showLoad);
  }

}
