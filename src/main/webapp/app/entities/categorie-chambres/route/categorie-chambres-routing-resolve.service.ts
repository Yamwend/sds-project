import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICategorieChambres, CategorieChambres } from '../categorie-chambres.model';
import { CategorieChambresService } from '../service/categorie-chambres.service';

@Injectable({ providedIn: 'root' })
export class CategorieChambresRoutingResolveService implements Resolve<ICategorieChambres> {
  constructor(protected service: CategorieChambresService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategorieChambres> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((categorieChambres: HttpResponse<CategorieChambres>) => {
          if (categorieChambres.body) {
            return of(categorieChambres.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CategorieChambres());
  }
}
