import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { 
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogRef
 } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent],
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.css'
})

export class DialogConfirmationComponent {

  dialogData = inject(MAT_DIALOG_DATA);

  constructor(public dialog: MatDialogRef<DialogConfirmationComponent>) {

  }

  confirmHandler(): void {
    this.dialog.close({answer: true});
  }

  cancelHandler(): void {
    this.dialog.close({answer: false});
  }

}
