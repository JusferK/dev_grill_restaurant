import { Component, inject, output, signal } from '@angular/core';
import { MessageService} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../menu/new-menu/confirmation-dialog/confirmation-dialog.component';
import { NewsApiService } from '../../services/news-api.service';
import { INews } from '../../models/news.model';

@Component({
  selector: 'post-new',
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    FileUploadModule,
    NgClass,
    MatButtonModule,
    ReactiveFormsModule,
    ConfirmationDialogComponent
  ],
  templateUrl: './post-new.component.html',
  styleUrl: './post-new.component.css',
  providers: [MessageService]
})
export class PostNewComponent {

  imagePreview = signal<string>('preview_icon.svg');
  newPost: FormGroup;
  newPostOutput = output<INews>();
  private _dialog = inject(MatDialog);
  private _newsApiService = inject(NewsApiService);
  private _messageService = inject(MessageService);

  constructor(private fb: FormBuilder) {
    this.newPost = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(45), Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      text: ['', [Validators.required, Validators.maxLength(300), Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      photo: ['', [Validators.required]],
      publicationDate: ['']
    })
  }

  onFileSelected(event: any) {
    const file: File | null = event.target.files[0] as File | null;

    if(file) {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.newPost.get('photo')?.setValue(e.target?.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  sendNewPost(post: INews) {
    this.newPostOutput.emit(post);
  }

  onSubmit(): void {

    this.newPost.get('publicationDate')?.setValue(new Date());

    this._dialog.open(ConfirmationDialogComponent, {
      data: {
        menuInfo: null,
        showLoad: true
      },
      disableClose: true
    });
    
    this._newsApiService.postNew(this.newPost.value).subscribe({
      next: (data: INews) => {
        this.sendNewPost(data);
        
        setTimeout(() => {
          this._dialog.closeAll();
          this._messageService.add({severity: 'success', summary: 'Success', detail: 'Post was made successfully'});
          this.newPost.reset();
          this.imagePreview.set('preview_icon.svg');
        }, 1000);
      }
    });
    
  }

}
