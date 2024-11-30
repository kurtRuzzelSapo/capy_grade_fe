import { Injectable } from '@angular/core';
import { ROUTES } from '../../config/routes.config';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  getRoutesForRole(role: 'STUDENT' | 'TEACHER') {
    return ROUTES[role];
  }
}
