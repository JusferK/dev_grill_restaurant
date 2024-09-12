import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IUser } from '../models/user.model';
import { UserApiService } from '../services/user-api.service';
import { DatePipe } from '@angular/common';

const todaysDate = new Date();

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, DatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  displayedColumns: string[] = ['name', 'last name', 'email', 'nit', 'sign date'];
  userList = signal<IUser[]>([]);
  private _userApiService = inject(UserApiService);

  ngOnInit(): void {
    this._userApiService.getAllUsers().subscribe({
      next: (data: IUser[]) => {
        this.userList.set(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
