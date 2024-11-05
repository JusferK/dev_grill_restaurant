import { Component, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewAdminComponent } from './new-admin/new-admin.component';
import { AllAdminTypesComponent } from './all-admin-types/all-admin-types.component';
import { AdministratorTypeApiService } from '../../services/administrator-type-api.service';
import { IAdminType } from '../../models/admin-type.models';


@Component({
  selector: 'app-admin-type',
  standalone: true,
  imports: [
    MatTabsModule,
    NgIf,
    MatProgressSpinnerModule,
    NewAdminComponent,
    AllAdminTypesComponent
  ],
  templateUrl: './admin-type.component.html',
  styleUrl: './admin-type.component.css'
})
export class AdminTypeComponent {

  adminTypeList = signal<IAdminType[]>([]);
  private _adminTypeApi = inject(AdministratorTypeApiService);

  constructor() {
    this._adminTypeApi.getAllAdminTypes().subscribe({
      next: (response: IAdminType[]) => {
        this.adminTypeList.set(response);
      }
    })
  }

  newAdminHandler(newType: IAdminType) {
    if(newType) {
      this.adminTypeList.update((prev: IAdminType[]) => [...prev, newType]);
    }
  }

}
