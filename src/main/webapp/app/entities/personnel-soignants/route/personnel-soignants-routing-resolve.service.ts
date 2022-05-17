import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersonnelSoignants, PersonnelSoignants } from '../personnel-soignants.model';
import { PersonnelSoignantsService } from '../service/personnel-soignants.service';

@Injectable({ providedIn: 'root' })
export class PersonnelSoignantsRoutingResolveService implements Resolve<IPersonnelSoignants> {
  constructor(protected service: PersonnelSoignantsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPersonnelSoignants> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((personnelSoignants: HttpResponse<PersonnelSoignants>) => {
          if (personnelSoignants.body) {
            return of(personnelSoignants.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PersonnelSoignants());
  }
}
