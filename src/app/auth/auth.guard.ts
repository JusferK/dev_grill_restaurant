import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileServiceService } from '../services/profile-service.service';

export const authGuard: CanActivateFn = (route, state) => {

  const _profileService = inject(ProfileServiceService);
  const _router = inject(Router);


  if(_profileService.getProfileSaved()) {
    return true;
  } else {
    _router.navigate(['login']);
    return false;
  }

};