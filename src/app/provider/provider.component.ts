import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IProvider } from '../models/provider.model';
import { ProviderService } from '../services/provider-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AddProviderComponent } from './add-provider/add-provider.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TableRowExpandEvent } from 'primeng/table';
import { IPhone } from '../models/phone.model';
import { PhoneApiService } from '../services/phone-api.service';
import { InputTextModule } from 'primeng/inputtext';
import { SearchProviderComponent } from './search-provider/search-provider.component';


@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ButtonModule,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ToastModule,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    SearchProviderComponent
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css',
  providers: [
    MessageService
  ]
})
export class ProviderComponent {

  isLoading = signal<boolean>(true);
  expandedRows: { [key: string]: boolean } = {};
  providersList = signal<IProvider[]>([]);
  updateList = signal<boolean[]>([]);
  phoneUpdateList = signal<boolean[]>([]);
  displayedColumns = ['proveedor id', 'nombre', 'nit', 'fecha de creacion'];
  isBusy = signal<boolean>(false);
  updateForm: FormGroup;
  updatePhoneForm: FormGroup;
  newPhoneForm: FormGroup;
  openRowsManager = signal<IPhone[]>([]);
  addNewPhoneSignal = signal<boolean>(false);
  private _providerApiService = inject(ProviderService);
  private _dialog = inject(MatDialog);
  private _messageService = inject(MessageService);
  private _phoneApiSerivce = inject(PhoneApiService);
  private _fb = inject(FormBuilder);

  constructor() {
    this._providerApiService.getAllProviders().subscribe({
      next: (data: IProvider[]) => {
        this.providersList.set(data);
        data.forEach(() => this.updateList.update((prev) => [...prev, false]));
        this.isLoading.set(false);
      }
    })

    this.updateForm = this._fb.group({
      name: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      provider_id: [''],
    })

    this.updatePhoneForm = this._fb.group({
      phone_list: this._fb.array([])
    })

    this.newPhoneForm = this._fb.group({
      provider_id: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    })
    
  }

  onAddProvider(): void {
    const dialog = this._dialog.open(AddProviderComponent, {
      disableClose: true,
      height: '60%',
      width: '50%',
      maxWidth: '50vw',
      minHeight: '40%'
    })

    dialog.afterClosed().subscribe(data => {
      if(data) {
        this.providersList.update((prev: IProvider[]) => [...prev, data]);
        this._messageService.add({ severity: 'success', summary: 'Added', detail: 'Provider added', life: 3000 })
      }
    })
  }

  removeProvider(provider: IProvider) {
    this.providersList.update((prev: IProvider[]) => prev.filter((provider_iterator: IProvider) => provider_iterator.provider_id !== provider.provider_id));
    this._providerApiService.removeProvider(provider).subscribe({
      next: () => this._messageService.add({ severity: 'error', summary: 'Removed', detail: 'Provider remove', life: 3000 })
    })
  }

  updateProvider(index: number, provider: IProvider) {
    this.updateList.update((prev: boolean[]) => {
      prev[index] = true;
      return prev;
    });

    this.updateForm.get('name')?.setValue(provider.name);
    this.updateForm.get('nit')?.setValue(provider.nit);
    this.updateForm.get('provider_id')?.setValue(provider.provider_id);

    this.isBusy.set(true);
  }

  cancelAction(index: number) {
    this.updateList.update((prev: boolean[]) => {
      prev[index] = false;
      return prev;
    });
    this.isBusy.set(false);
  }

  sendUpdateRequest(index: number) {
    if(this.checkForValue(this.updateForm.value, index)) {
      this._providerApiService.updateProvider(this.updateForm.value).subscribe({
        next: (data: IProvider) => {
          this.cancelAction(index);
          this.providersList.update((prev) => {
            prev[index] = data;
            return prev;
          });
          this._messageService.add({ severity: 'success', summary: 'Change made', detail: 'Provider updated', life: 3000 });
        }
      })
    } else {
      this._messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No changes were', life: 3000 });
    }
  }

  hasError(value: string) {
    return this.updateForm.get(value)?.invalid && this.updateForm.get(value)?.touched;
  }

  checkForValue(provider_value: IProvider, index: number): boolean {
    let response: boolean[] = [];
    this.providersList()[index].name === provider_value.name ? response.push(true) : response.push(false);
    this.providersList()[index].nit === provider_value.nit ? response.push(true) : response.push(false);
    return response.includes(false);
  }

  onRowExpand(event: TableRowExpandEvent) {

    this.phoneListArray.clear();

    this.phoneUpdateList.set([]);
    
    this.expandedRows = {};
    this.expandedRows[event.data.provider_id] = true;

    event.data.phone_list.forEach((item: IPhone) => this.phoneListArray.push(this._fb.control(item.phone, [Validators.required])));
    event.data.phone_list.forEach(() => this.phoneUpdateList.update(prev => [...prev, false]));
  }

  onRowCollapse(event: TableRowExpandEvent) {
    this.phoneListArray.clear();
    delete this.expandedRows[event.data.provider_id];
    this.phoneUpdateList.set([]);
    event.data.phone_list.forEach((_: IPhone, index: number) => this.phoneListArray.removeAt(index));
  }

  get phoneListArray() {
    return this.updatePhoneForm.get('phone_list') as FormArray;
  }

  updateListTrigger(index: number) {
    this.isBusy.set(true);
    this.phoneUpdateList.update(prev => {
      prev[index] = true;
      return prev;
    });
  }

  cancelUpdateListTrigger(index: number, phones: IPhone[]) {
    this.isBusy.set(false);
    this.phoneUpdateList.update(prev => {
      prev[index] = false;
      return prev;
    });

    phones.forEach((phone, index_iterator) => this.phoneListArray.at(index_iterator).setValue(phone.phone));

  }

  removePhoneHandler(phone: IPhone) {
    if(phone.phone_id) {
      this._phoneApiSerivce.removePhone(phone.phone_id).subscribe({
        next: () => {
          this._messageService.add({ severity: 'error', summary: 'Phone removed', detail: 'Phone number has been removed', life: 3000 });
          this.providersList.update((prev: IProvider[]) => {
            const array_pivot = prev.map((provider: IProvider) => {
              if(provider.provider_id === phone.provider_id) {
                const new_phone_list = provider.phone_list!.filter((phone_iter: IPhone) => phone_iter.phone_id !== phone.phone_id);
                provider.phone_list = new_phone_list
                return provider;
              } else {
                return provider
              }
            })
      
            return array_pivot;
          });
        }
      })
    }
  }

  updatePhoneHandler(phone: IPhone, index: number) {

    const body: IPhone = {
      phone_id: phone.phone_id,
      phone: this.phoneListArray.value[index],
      provider_id: phone.phone_id
    }

    this._phoneApiSerivce.updatePhone(body).subscribe({
      next: (phone_updated: IPhone) => {
        this._messageService.add({ severity: 'success', summary: 'Change made', detail: 'Phone number updated', life: 3000 });
        this.isBusy.set(false);
        this.phoneUpdateList.update(prev => {
          prev[index] = false;
          return prev;
        });
        
        this.providersList.update((prev: IProvider[]) => prev.filter(provider_update => {
          if(provider_update.provider_id === phone.provider_id) {
            const newRecord = provider_update.phone_list![index] = phone_updated;
            return newRecord;
          } else {
            return provider_update
          }
        }));
      }, error: () => {
        this._messageService.add({ severity: 'error', summary: 'Change not made', detail: 'Try again', life: 3000 });
      }
    })
  }

  addNewPhoneTrigger(provider: IProvider): void {
    this.phoneUpdateList.update(prev => [...prev, true]);
    this.newPhoneForm.get('provider_id')?.patchValue(provider.provider_id)
    provider.phone_list?.push({provider_id: provider.provider_id, phone: 0 })
    this.addNewPhoneSignal.set(true);
  }

  cancelNewPhone(provider: IProvider): void {
    this.phoneUpdateList.update((prev) => prev.slice(0, -1));
    provider.phone_list?.pop();
    this.addNewPhoneSignal.set(false);
  }

  addNewPhone(provider: IProvider): void {
    this._phoneApiSerivce.addPhone(this.newPhoneForm.value).subscribe({
      next: (phone: IPhone) => {
        provider.phone_list?.pop();
        provider.phone_list?.push(phone);
        this.phoneUpdateList.update(prev => prev.map((value, index) => index === (this.phoneUpdateList().length - 1) ? value = false : value))
        this.newPhoneForm.reset();
        this._messageService.add({ severity: 'success', summary: 'Change made', detail: 'Phone number added', life: 3000 });
        this.addNewPhoneSignal.set(false);
      },
      error: () => {
        this._messageService.add({ severity: 'error', summary: 'Change not made', detail: 'Try again', life: 3000 });
        this.addNewPhoneSignal.set(false);
      }
    })
  }

  onSearchProvider(): void {
    this._dialog.open(SearchProviderComponent, {
      height: '60%',
      width: '50%',
      maxWidth: '50vw',
      minHeight: '40%'
    })
  }

}