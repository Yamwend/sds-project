import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILigneOrdonnances, LigneOrdonnances } from '../ligne-ordonnances.model';
import { LigneOrdonnancesService } from '../service/ligne-ordonnances.service';

@Injectable({ providedIn: 'root' })
export class LigneOrdonnancesRoutingResolveService implements Resolve<ILigneOrdonnances> {
  constructor(protected service: LigneOrdonnancesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILigneOrdonnances> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ligneOrdonnances: HttpResponse<LigneOrdonnances>) => {
          if (ligneOrdonnances.body) {
            return of(ligneOrdonnances.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LigneOrdonnances());
  }
}
