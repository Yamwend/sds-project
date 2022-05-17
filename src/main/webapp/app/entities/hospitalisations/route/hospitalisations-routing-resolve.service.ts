import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHospitalisations, Hospitalisations } from '../hospitalisations.model';
import { HospitalisationsService } from '../service/hospitalisations.service';

@Injectable({ providedIn: 'root' })
export class HospitalisationsRoutingResolveService implements Resolve<IHospitalisations> {
  constructor(protected service: HospitalisationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHospitalisations> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hospitalisations: HttpResponse<Hospitalisations>) => {
          if (hospitalisations.body) {
            return of(hospitalisations.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Hospitalisations());
  }
}
