import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-news',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions, 
    MatDialogContent, 
    MatDialogClose
  ],
  templateUrl: './confirmation-dialog-news.component.html',
  styleUrl: './confirmation-dialog-news.component.css'
})
export class ConfirmationDialogNewsComponent {

}
