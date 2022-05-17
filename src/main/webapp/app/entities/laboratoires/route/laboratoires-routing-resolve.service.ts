import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaboratoires, Laboratoires } from '../laboratoires.model';
import { LaboratoiresService } from '../service/laboratoires.service';

@Injectable({ providedIn: 'root' })
export class LaboratoiresRoutingResolveService implements Resolve<ILaboratoires> {
  constructor(protected service: LaboratoiresService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILaboratoires> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((laboratoires: HttpResponse<Laboratoires>) => {
          if (laboratoires.body) {
            return of(laboratoires.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Laboratoires());
  }
}
