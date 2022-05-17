import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITraitements, getTraitementsIdentifier } from '../traitements.model';

export type EntityResponseType = HttpResponse<ITraitements>;
export type EntityArrayResponseType = HttpResponse<ITraitements[]>;

@Injectable({ providedIn: 'root' })
export class TraitementsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/traitements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(traitements: ITraitements): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(traitements);
    return this.http
      .post<ITraitements>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(traitements: ITraitements): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(traitements);
    return this.http
      .put<ITraitements>(`${this.resourceUrl}/${getTraitementsIdentifier(traitements) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(traitements: ITraitements): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(traitements);
    return this.http
      .patch<ITraitements>(`${this.resourceUrl}/${getTraitementsIdentifier(traitements) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITraitements>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITraitements[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTraitementsToCollectionIfMissing(
    traitementsCollection: ITraitements[],
    ...traitementsToCheck: (ITraitements | null | undefined)[]
  ): ITraitements[] {
    const traitements: ITraitements[] = traitementsToCheck.filter(isPresent);
    if (traitements.length > 0) {
      const traitementsCollectionIdentifiers = traitementsCollection.map(traitementsItem => getTraitementsIdentifier(traitementsItem)!);
      const traitementsToAdd = traitements.filter(traitementsItem => {
        const traitementsIdentifier = getTraitementsIdentifier(traitementsItem);
        if (traitementsIdentifier == null || traitementsCollectionIdentifiers.includes(traitementsIdentifier)) {
          return false;
        }
        traitementsCollectionIdentifiers.push(traitementsIdentifier);
        return true;
      });
      return [...traitementsToAdd, ...traitementsCollection];
    }
    return traitementsCollection;
  }

  protected convertDateFromClient(traitements: ITraitements): ITraitements {
    return Object.assign({}, traitements, {
      debutTraitement: traitements.debutTraitement?.isValid() ? traitements.debutTraitement.toJSON() : undefined,
      finTraitement: traitements.finTraitement?.isValid() ? traitements.finTraitement.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.debutTraitement = res.body.debutTraitement ? dayjs(res.body.debutTraitement) : undefined;
      res.body.finTraitement = res.body.finTraitement ? dayjs(res.body.finTraitement) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((traitements: ITraitements) => {
        traitements.debutTraitement = traitements.debutTraitement ? dayjs(traitements.debutTraitement) : undefined;
        traitements.finTraitement = traitements.finTraitement ? dayjs(traitements.finTraitement) : undefined;
      });
    }
    return res;
  }
}
