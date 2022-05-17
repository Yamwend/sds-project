import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFamilleMaladies, FamilleMaladies } from '../famille-maladies.model';
import { FamilleMaladiesService } from '../service/famille-maladies.service';

@Injectable({ providedIn: 'root' })
export class FamilleMaladiesRoutingResolveService implements Resolve<IFamilleMaladies> {
  constructor(protected service: FamilleMaladiesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFamilleMaladies> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((familleMaladies: HttpResponse<FamilleMaladies>) => {
          if (familleMaladies.body) {
            return of(familleMaladies.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FamilleMaladies());
  }
}
