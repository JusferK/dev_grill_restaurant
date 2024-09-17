import { Component, inject, input, OnChanges, OnDestroy, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { INews } from '../../models/news.model';
import { Subscription } from 'rxjs';
import { NewsApiService } from '../../services/news-api.service';
import { NgIf } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { IAdministrator } from '../../models/administrator.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../menu/new-menu/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogNewsComponent } from './confirmation-dialog-news/confirmation-dialog-news.component';


@Component({
  selector: 'all-news',
  standalone: true,
  imports: [
    SkeletonModule,
    NgIf,
    PanelModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    DatePipe,
    TitleCasePipe,
    MatButtonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmationDialogNewsComponent
  ],
  templateUrl: './all-news.component.html',
  styleUrl: './all-news.component.css',
  providers: [MessageService]
})
export class AllNewsComponent implements OnInit, OnDestroy, OnChanges {

  items: { label?: string; icon?: string; separator?: boolean, command?: () => void }[] = [];
  imagePreview = signal<string>('');
  profile!: Signal<IAdministrator>;
  isLoading = signal<boolean>(true);
  returnedError = signal<boolean>(false);
  updateActive = signal<boolean[]>([]);
  newsList = signal<INews[]>([]);
  newPost = input<INews | undefined>(undefined);
  newsListSuscription?: Subscription;
  updateNewForm: FormGroup;
  private _newsApiService = inject(NewsApiService);
  private _messageService = inject(MessageService);
  private _dialog = inject(MatDialog);

  constructor(private fb: FormBuilder) {
    this.updateNewForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(45), Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      text: ['', [Validators.required, Validators.maxLength(300), Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      photo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.newsListSuscription = this._newsApiService.getAllNews().subscribe({
      next: (data: INews[]) => {
        this.newsList.set(data);
        
        data.forEach(() => this.updateActive.update((prev) => [...prev, false]));

        setTimeout(() => {
          this.isLoading.set(false);
        }, 3500)
      },
      error: () => {
        this.isLoading.set(false);
        this.returnedError.set(true);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['newPost'] && this.newPost()) {
      this.newsList.update((prev) => [...prev, this.newPost()!])
      this.updateActive.update((prev) => [...prev, false]);
    }
  }

  ngOnDestroy(): void {
    this.newsListSuscription?.unsubscribe();
  }

  onClickHandler(newsItem: INews, index: number) {
    this.items = [];

    this.items.push({
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => this.onUpdateUp(newsItem, index)
    });

    this.items.push({
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => this.onDelete(newsItem, index)
    });
  }

  cancelUpdate(index: number) {
    this.updateActive()[index] = false;
  }

  onFileSelected(event: any) {
    const file: File | null = event.target.files[0] as File | null;

    if(file) {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.updateNewForm.get('photo')?.setValue(e.target?.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  onUpdateUp(new_item: INews, index: number) {
    this.updateActive()[index] = true;
    this.imagePreview.set(new_item.photo);

    this.updateNewForm.get('title')?.setValue(new_item.title);
    this.updateNewForm.get('text')?.setValue(new_item.text);
    this.updateNewForm.get('photo')?.setValue(new_item.photo);
  }

  onUpdate(new_item: INews, index: number) {
    const evaluation = this.noChange(new_item);

    if(evaluation.includes(false) && !evaluation.includes(true)) {
      this._messageService.add({severity: 'warn', summary: 'Warn', detail: 'No update were made due no changes were made.'});
    } else {
      evaluation[0] && (new_item.title = this.updateNewForm.get('title')?.value);
      evaluation[1] && (new_item.text = this.updateNewForm.get('text')?.value);
      evaluation[2] && (new_item.photo = this.updateNewForm.get('photo')?.value);

      this._dialog.open(ConfirmationDialogComponent, {
        data: {
          menuInfo: null,
          showLoad: true
        },
        disableClose: true
      });

      this._newsApiService.updateNew(new_item).subscribe({
        next: (data: INews) => {
          this.newsList()[index] = data;
          this.newsList.set([...this.newsList()]);
          setTimeout(() => {
            this._dialog.closeAll();
            this._messageService.add({severity: 'success', summary: 'Success', detail: 'New was updated successfully.'});
            this.updateActive()[index] = false;
            this.updateNewForm.reset();
          }, 3000)
        }
      })
    }
  }

  onDelete(new_item: INews, index: number) {

    this._dialog.open(ConfirmationDialogNewsComponent).afterClosed().subscribe((answer => {
      if(answer) {
        console.log(new_item);

        this._dialog.open(ConfirmationDialogComponent, {
          data: {
            menuInfo: null,
            showLoad: true
          },
          disableClose: true
        });

        if(new_item.idNewsItem) {
          this._newsApiService.deleteNew(new_item.idNewsItem)

          setTimeout(() => {
            this._dialog.closeAll();
            this._messageService.add({severity: 'success', summary: 'Success', detail: 'New was deleted successfully.'});
            this.updateActive()[index] = false;

            this.newsList.update((prev) => prev.filter((item) => item.idNewsItem !== new_item.idNewsItem));
            this.updateActive.set([]);
            this.newsList().forEach(() => this.updateActive.update(prev => [...prev, false]));
          }, 3000)
        }

      }
    }))

  }

  noChange(news_item: INews) {

    const sameValue = [false, false, false];

    this.updateNewForm.get('title')?.value !== news_item.title && (sameValue[0] = true);
    this.updateNewForm.get('text')?.value !== news_item.text && (sameValue[1] = true);
    this.updateNewForm.get('photo')?.value !== news_item.photo && (sameValue[2] = true);

    return sameValue;
  }

}
