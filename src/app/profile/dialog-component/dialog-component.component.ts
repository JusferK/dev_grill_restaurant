import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-component',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButtonModule],
  templateUrl: './dialog-component.component.html',
  styleUrl: './dialog-component.component.css'
})
export class DialogComponentComponent {

  dialogRef = inject(MatDialogRef<DialogComponentComponent>);

  okHandler(): void {
    this.dialogRef.close();
  }

}
