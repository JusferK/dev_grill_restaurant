import { Component, signal, Signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AllNewsComponent } from './all-news/all-news.component';
import { PostNewComponent } from './post-new/post-new.component';
import { INews } from '../models/news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    MatTabsModule,
    AllNewsComponent,
    PostNewComponent
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

  newPostReceived =  signal<undefined | INews>(undefined);

  newPostHandler(newPost: INews) {
    this.newPostReceived = signal<INews>(newPost);
  }

}
