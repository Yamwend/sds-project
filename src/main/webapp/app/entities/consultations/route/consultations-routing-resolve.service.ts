import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsultations, Consultations } from '../consultations.model';
import { ConsultationsService } from '../service/consultations.service';

@Injectable({ providedIn: 'root' })
export class ConsultationsRoutingResolveService implements Resolve<IConsultations> {
  constructor(protected service: ConsultationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsultations> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consultations: HttpResponse<Consultations>) => {
          if (consultations.body) {
            return of(consultations.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Consultations());
  }
}
