import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExamens, Examens } from '../examens.model';
import { ExamensService } from '../service/examens.service';

@Injectable({ providedIn: 'root' })
export class ExamensRoutingResolveService implements Resolve<IExamens> {
  constructor(protected service: ExamensService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExamens> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((examens: HttpResponse<Examens>) => {
          if (examens.body) {
            return of(examens.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Examens());
  }
}
