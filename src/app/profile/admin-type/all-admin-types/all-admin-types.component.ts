import { Component, inject, input, OnInit, signal } from '@angular/core';
import { IAdminType } from '../../../models/admin-type.models';
import { MatTableModule } from '@angular/material/table';
import { AdministratorTypeApiService } from '../../../services/administrator-type-api.service';
import { AdminTypePipePipe } from '../../../pipes/admin-type-pipe.pipe';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'all-admin-types',
  standalone: true,
  imports: [
    MatTableModule,
    AdminTypePipePipe,
    CardModule,
    ButtonModule
  ],
  templateUrl: './all-admin-types.component.html',
  styleUrl: './all-admin-types.component.css'
})
export class AllAdminTypesComponent {

  displayedColumns: string[] = ['description', 'photo'];

  adminTypeList = input.required<IAdminType[]>();
  

}
