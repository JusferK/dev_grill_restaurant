import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAdminType } from '../../../models/admin-type.models';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgClass } from '@angular/common';
import { AdministratorTypeApiService } from '../../../services/administrator-type-api.service';

@Component({
  selector: 'new-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextareaModule,
    FormsModule,
    FloatLabelModule,
    ToastModule,
    NgClass
  ],
  templateUrl: './new-admin.component.html',
  styleUrl: './new-admin.component.css',
  providers: [MessageService]
})
export class NewAdminComponent {

  count = signal<number>(0);
  tracker = signal<string>('');
  imagePreview = signal<string>('preview_icon.svg');
  newAdminTypeForm: FormGroup;
  newAdminType = output<IAdminType>();
  private _fb = inject(FormBuilder);
  private _messageService = inject(MessageService);
  private _adminTypeApi = inject(AdministratorTypeApiService);

  
  constructor() {
    this.newAdminTypeForm = this._fb.group({
      description: ['', [Validators.required]],
      photo: ['', [Validators.required]]
    })
  }

  updateCount() {
    if(this.newAdminTypeForm.get('description')?.value.length <= 45) {  
      this.count.set(this.newAdminTypeForm.get('description')?.value.length);
      this.tracker.set(this.newAdminTypeForm.get('description')?.value);
    } else {
      this.tracker.update(prev => {
        this.newAdminTypeForm.get('description')?.patchValue(prev);
        return prev;
      })
    }
  }

  onFileSelected(event: any) {
    const file: File | null = event.target.files[0] as File | null;

    if(file) {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.newAdminTypeForm.get('photo')?.patchValue(e.target?.result as string);
        this.imagePreview.set(e.target?.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  sendNewAdminType() {
    this._adminTypeApi.newAdminType(this.newAdminTypeForm.value).subscribe({
      next: (response: IAdminType) => {
        this._messageService.add({ severity: 'success', summary: 'Type added', detail: 'New admin type was added', icon: 'pi pi-check' });
        this.imagePreview.set('preview_icon.svg');
        this.newAdminTypeForm.reset();
        this.sendNewType(response);
      }
    })
  }

  sendNewType(value: IAdminType) {
    this.newAdminType.emit(value);
  }



}
