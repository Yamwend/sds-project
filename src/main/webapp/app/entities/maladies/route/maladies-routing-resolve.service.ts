import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMaladies, Maladies } from '../maladies.model';
import { MaladiesService } from '../service/maladies.service';

@Injectable({ providedIn: 'root' })
export class MaladiesRoutingResolveService implements Resolve<IMaladies> {
  constructor(protected service: MaladiesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMaladies> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((maladies: HttpResponse<Maladies>) => {
          if (maladies.body) {
            return of(maladies.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Maladies());
  }
}
