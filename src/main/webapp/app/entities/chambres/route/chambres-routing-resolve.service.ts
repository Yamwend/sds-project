import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChambres, Chambres } from '../chambres.model';
import { ChambresService } from '../service/chambres.service';

@Injectable({ providedIn: 'root' })
export class ChambresRoutingResolveService implements Resolve<IChambres> {
  constructor(protected service: ChambresService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChambres> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chambres: HttpResponse<Chambres>) => {
          if (chambres.body) {
            return of(chambres.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chambres());
  }
}
