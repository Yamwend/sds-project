import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrdonnances, getOrdonnancesIdentifier } from '../ordonnances.model';

export type EntityResponseType = HttpResponse<IOrdonnances>;
export type EntityArrayResponseType = HttpResponse<IOrdonnances[]>;

@Injectable({ providedIn: 'root' })
export class OrdonnancesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ordonnances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ordonnances: IOrdonnances): Observable<EntityResponseType> {
    return this.http.post<IOrdonnances>(this.resourceUrl, ordonnances, { observe: 'response' });
  }

  update(ordonnances: IOrdonnances): Observable<EntityResponseType> {
    return this.http.put<IOrdonnances>(`${this.resourceUrl}/${getOrdonnancesIdentifier(ordonnances) as number}`, ordonnances, {
      observe: 'response',
    });
  }

  partialUpdate(ordonnances: IOrdonnances): Observable<EntityResponseType> {
    return this.http.patch<IOrdonnances>(`${this.resourceUrl}/${getOrdonnancesIdentifier(ordonnances) as number}`, ordonnances, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrdonnances>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrdonnances[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrdonnancesToCollectionIfMissing(
    ordonnancesCollection: IOrdonnances[],
    ...ordonnancesToCheck: (IOrdonnances | null | undefined)[]
  ): IOrdonnances[] {
    const ordonnances: IOrdonnances[] = ordonnancesToCheck.filter(isPresent);
    if (ordonnances.length > 0) {
      const ordonnancesCollectionIdentifiers = ordonnancesCollection.map(ordonnancesItem => getOrdonnancesIdentifier(ordonnancesItem)!);
      const ordonnancesToAdd = ordonnances.filter(ordonnancesItem => {
        const ordonnancesIdentifier = getOrdonnancesIdentifier(ordonnancesItem);
        if (ordonnancesIdentifier == null || ordonnancesCollectionIdentifiers.includes(ordonnancesIdentifier)) {
          return false;
        }
        ordonnancesCollectionIdentifiers.push(ordonnancesIdentifier);
        return true;
      });
      return [...ordonnancesToAdd, ...ordonnancesCollection];
    }
    return ordonnancesCollection;
  }
}
