import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeExams, TypeExams } from '../type-exams.model';
import { TypeExamsService } from '../service/type-exams.service';

@Injectable({ providedIn: 'root' })
export class TypeExamsRoutingResolveService implements Resolve<ITypeExams> {
  constructor(protected service: TypeExamsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeExams> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeExams: HttpResponse<TypeExams>) => {
          if (typeExams.body) {
            return of(typeExams.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeExams());
  }
}
