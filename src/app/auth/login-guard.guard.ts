import { CanActivateFn, Router } from '@angular/router';
import { ProfileServiceService } from '../services/profile-service.service';
import { inject } from '@angular/core';

export const loginGuardGuard: CanActivateFn = (route, state) => {

  const _profileService = inject(ProfileServiceService);
  const _router = inject(Router);

  if(!_profileService.getProfileSaved()) {
    return true;
  } else {
    _router.navigate(['']);
    return false;
  }
};
