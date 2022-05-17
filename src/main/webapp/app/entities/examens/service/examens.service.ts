import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExamens, getExamensIdentifier } from '../examens.model';

export type EntityResponseType = HttpResponse<IExamens>;
export type EntityArrayResponseType = HttpResponse<IExamens[]>;

@Injectable({ providedIn: 'root' })
export class ExamensService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/examens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(examens: IExamens): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examens);
    return this.http
      .post<IExamens>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(examens: IExamens): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examens);
    return this.http
      .put<IExamens>(`${this.resourceUrl}/${getExamensIdentifier(examens) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(examens: IExamens): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(examens);
    return this.http
      .patch<IExamens>(`${this.resourceUrl}/${getExamensIdentifier(examens) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExamens>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExamens[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExamensToCollectionIfMissing(examensCollection: IExamens[], ...examensToCheck: (IExamens | null | undefined)[]): IExamens[] {
    const examens: IExamens[] = examensToCheck.filter(isPresent);
    if (examens.length > 0) {
      const examensCollectionIdentifiers = examensCollection.map(examensItem => getExamensIdentifier(examensItem)!);
      const examensToAdd = examens.filter(examensItem => {
        const examensIdentifier = getExamensIdentifier(examensItem);
        if (examensIdentifier == null || examensCollectionIdentifiers.includes(examensIdentifier)) {
          return false;
        }
        examensCollectionIdentifiers.push(examensIdentifier);
        return true;
      });
      return [...examensToAdd, ...examensCollection];
    }
    return examensCollection;
  }

  protected convertDateFromClient(examens: IExamens): IExamens {
    return Object.assign({}, examens, {
      dateExamen: examens.dateExamen?.isValid() ? examens.dateExamen.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateExamen = res.body.dateExamen ? dayjs(res.body.dateExamen) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((examens: IExamens) => {
        examens.dateExamen = examens.dateExamen ? dayjs(examens.dateExamen) : undefined;
      });
    }
    return res;
  }
}
