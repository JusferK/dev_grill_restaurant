import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IPhone } from '../../models/phone.model';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProviderService } from '../../services/provider-api.service';
import { IProvider } from '../../models/provider.model';


@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    NgIf,
    TableModule,
    NgClass,
    NgFor,
    ReactiveFormsModule,
    KeyFilterModule
  ],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.css'
})

export class AddProviderComponent {

  addPhoneList = signal<boolean>(false);
  newProvderForm: FormGroup;
  phoneList = signal<IPhone[]>([]);
  public _dialog = inject(MatDialogRef<AddProviderComponent>);
  private _fb = inject(FormBuilder);
  private _providerApiService = inject(ProviderService);

  constructor() {
    this.newProvderForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(45)]],
      nit: ['', [Validators.required]],
      added_date: [''],
      phone_list: this._fb.array([])
    })
  }

  addPhones(): void {
    this.addPhoneList.set(true);
    this.phoneListArray.push(this._fb.control('', [Validators.required]));
    const emptyPhone: IPhone = {phone: 0}
    this.phoneList.update((prev) => [...prev, emptyPhone]);
  }

  oneMorePhone(): void {
    this.phoneListArray.push(this._fb.control('', [Validators.required]))
    const emptyPhone: IPhone = {phone: 0}
    this.phoneList.update((prev) => [...prev, emptyPhone]);
  }

  sendProvider(): void {
    this.newProvderForm.get('added_date')?.setValue(new Date());
    const phoneListBody: IPhone[] = [];

    this.phoneListArray.value.forEach((phone: number) => phoneListBody.push({ phone: phone }));
    this.phoneListArray.setValue(phoneListBody);
    
    this._providerApiService.newProvider(this.newProvderForm.value).subscribe({
      next: (data: IProvider) => {
        this._dialog.close(data);
      }
    })
  }

  get phoneListArray() {
    return this.newProvderForm.get('phone_list') as FormArray;
  }

  hasError(value: string) {
    return this.newProvderForm.get(value)?.invalid && this.newProvderForm.get(value)?.touched;
  }

}