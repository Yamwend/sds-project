import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMaladies, getMaladiesIdentifier } from '../maladies.model';

export type EntityResponseType = HttpResponse<IMaladies>;
export type EntityArrayResponseType = HttpResponse<IMaladies[]>;

@Injectable({ providedIn: 'root' })
export class MaladiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/maladies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(maladies: IMaladies): Observable<EntityResponseType> {
    return this.http.post<IMaladies>(this.resourceUrl, maladies, { observe: 'response' });
  }

  update(maladies: IMaladies): Observable<EntityResponseType> {
    return this.http.put<IMaladies>(`${this.resourceUrl}/${getMaladiesIdentifier(maladies) as number}`, maladies, { observe: 'response' });
  }

  partialUpdate(maladies: IMaladies): Observable<EntityResponseType> {
    return this.http.patch<IMaladies>(`${this.resourceUrl}/${getMaladiesIdentifier(maladies) as number}`, maladies, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMaladies>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMaladies[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMaladiesToCollectionIfMissing(maladiesCollection: IMaladies[], ...maladiesToCheck: (IMaladies | null | undefined)[]): IMaladies[] {
    const maladies: IMaladies[] = maladiesToCheck.filter(isPresent);
    if (maladies.length > 0) {
      const maladiesCollectionIdentifiers = maladiesCollection.map(maladiesItem => getMaladiesIdentifier(maladiesItem)!);
      const maladiesToAdd = maladies.filter(maladiesItem => {
        const maladiesIdentifier = getMaladiesIdentifier(maladiesItem);
        if (maladiesIdentifier == null || maladiesCollectionIdentifiers.includes(maladiesIdentifier)) {
          return false;
        }
        maladiesCollectionIdentifiers.push(maladiesIdentifier);
        return true;
      });
      return [...maladiesToAdd, ...maladiesCollection];
    }
    return maladiesCollection;
  }
}
