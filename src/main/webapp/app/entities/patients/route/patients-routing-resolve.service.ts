import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatients, Patients } from '../patients.model';
import { PatientsService } from '../service/patients.service';

@Injectable({ providedIn: 'root' })
export class PatientsRoutingResolveService implements Resolve<IPatients> {
  constructor(protected service: PatientsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatients> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patients: HttpResponse<Patients>) => {
          if (patients.body) {
            return of(patients.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Patients());
  }
}
