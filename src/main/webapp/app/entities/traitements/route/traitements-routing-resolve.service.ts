import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITraitements, Traitements } from '../traitements.model';
import { TraitementsService } from '../service/traitements.service';

@Injectable({ providedIn: 'root' })
export class TraitementsRoutingResolveService implements Resolve<ITraitements> {
  constructor(protected service: TraitementsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITraitements> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((traitements: HttpResponse<Traitements>) => {
          if (traitements.body) {
            return of(traitements.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Traitements());
  }
}
