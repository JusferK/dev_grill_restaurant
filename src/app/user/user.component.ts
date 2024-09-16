import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IUser } from '../models/user.model';
import { UserApiService } from '../services/user-api.service';
import { DatePipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const todaysDate = new Date();

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, DatePipe, NgIf, MatProgressSpinnerModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  displayedColumns: string[] = ['name', 'last name', 'email', 'nit', 'sign date'];
  isLoading = signal<boolean>(true);
  returnedError = signal<boolean>(false);
  userList = signal<IUser[]>([]);
  private _userApiService = inject(UserApiService);

  ngOnInit(): void {
    this._userApiService.getAllUsers().subscribe({
      next: (data: IUser[]) => {
        this.userList.set(data);

        setTimeout(() => {
          this.isLoading.set(false);
        }, 1000);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.returnedError.set(true);
      }
    })
  }

}
