import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAdministrator } from '../models/administrator.model';
import { AdministratorApiService } from '../services/administrator-api.service';
import { ProfileServiceService } from '../services/profile-service.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnDestroy {

  isVisible: boolean = false;
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  attemptWasMade = signal(false);
  private suscription?: Subscription;
  private _adminApiService = inject(AdministratorApiService);
  private _profileService = inject(ProfileServiceService);
  private _router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  toggle(): void {
    this.isVisible = this.isVisible ? false : true;
  }

  hasErrors(property: string, errorType: string) {
    return this.loginForm.get(property)?.hasError(errorType) && this.loginForm.get(property)?.touched;
  }

  onSubmit(): void {
    this.suscription = this._adminApiService.loginAdmin(this.loginForm.get('user')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (data: IAdministrator | boolean) => {
        if(data !== false && data !== true) {
          const profileRetrieved: IAdministrator = data;
          this._profileService.setProfileSaved(profileRetrieved);
          this._router.navigate(['']);
        } else if(data === false) {
          this.attemptWasMade.set(true);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}
