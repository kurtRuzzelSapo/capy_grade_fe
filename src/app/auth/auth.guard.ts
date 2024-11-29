import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userData = JSON.parse(window.sessionStorage.getItem('user') || '{}') || null;
  return userData && userData.user_id ? true : router.navigate(['/login']);
};

// export const mainGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const userData = JSON.parse(window.sessionStorage.getItem('user') || '{}') || null;
//   return userData && userData.user_id ? router.navigate(['/login']) : true;
// };
