import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProfileServiceService } from '../services/profile-service.service';
import { IAdministrator } from '../models/administrator.model';
import { NgIf, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdministratorApiService } from '../services/administrator-api.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from './dialog-component/dialog-component.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  editSignal = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);
  adminPassword = signal<string>('');
  editBtnText = signal<string>('edit');
  profileLoad?: IAdministrator;
  updateForm: FormGroup;
  dialog = inject(MatDialog);
  notificationSignalSend = signal<boolean>(false);
  private _profileService = inject(ProfileServiceService);
  private _adminApiService = inject(AdministratorApiService);
  private suscription?: Subscription;

  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      idAdministrator: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const pivot = this._profileService.getProfileSaved();
    if(pivot) {
      this.profileLoad = JSON.parse(pivot);
    }

    this.updateForm.patchValue({
      idAdministrator: this.profileLoad?.idAdministrator,
      user: this.profileLoad?.user,
      password: this.profileLoad?.password
    });
    
    this.updateForm?.get('idAdministrator')?.disable();
    this.updateForm?.get('user')?.disable();
    this.updateForm?.get('password')?.disable();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  toggleEdit(): void {
    this.editSignal() ? this.editSignal.set(false) : this.editSignal.set(true);
    this.editSignal() ? this.updateForm?.get('password')?.enable() : this.updateForm?.get('password')?.disable();
    this.editSignal() ? this.editBtnText.set('cancel') : this.editBtnText.set('edit');

    if(!this.editSignal()) {
      this.updateForm.patchValue({
        idAdministrator: this.profileLoad?.idAdministrator,
        user: this.profileLoad?.user,
        password: this.profileLoad?.password
      });
    }
  }

  toggleViewPassword(): void {
    !this.isPasswordVisible() ? this.isPasswordVisible.set(true) : this.isPasswordVisible.set(false);
  }

  hasError() {
    return this.updateForm.get('password')?.hasError('required') && this.updateForm.get('password')?.touched;
  }

  onSubmit(): void {
    if(this.updateForm.get('password')?.value === this.profileLoad?.password) {
      this.dialog.open(DialogComponentComponent);
    } else if(this.updateForm.valid && this.profileLoad?.idAdministrator) {
      this.suscription = this._adminApiService.updatePassword(this.profileLoad?.idAdministrator, this.updateForm.value).subscribe({
        next: (data: IAdministrator) => {
          console.log(data);
          if(data) {
            this._profileService.setProfileSaved(data);
            this.profileLoad = data;
            this.updateForm.patchValue({
              idAdministrator: data.idAdministrator,
              user: data.user,
              password: data.password
            });
          }
          this.sendNotification();
          this.editBtnText.set('edit');
          this.editSignal.set(false);
          this.updateForm?.get('password')?.disable();
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }

  sendNotification(): void {
    this.notificationSignalSend.set(true);

    setTimeout(() => {
      this.notificationSignalSend.set(false);
    }, 10000);
  }
}