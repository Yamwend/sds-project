import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFamilleMaladies, getFamilleMaladiesIdentifier } from '../famille-maladies.model';

export type EntityResponseType = HttpResponse<IFamilleMaladies>;
export type EntityArrayResponseType = HttpResponse<IFamilleMaladies[]>;

@Injectable({ providedIn: 'root' })
export class FamilleMaladiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/famille-maladies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(familleMaladies: IFamilleMaladies): Observable<EntityResponseType> {
    return this.http.post<IFamilleMaladies>(this.resourceUrl, familleMaladies, { observe: 'response' });
  }

  update(familleMaladies: IFamilleMaladies): Observable<EntityResponseType> {
    return this.http.put<IFamilleMaladies>(
      `${this.resourceUrl}/${getFamilleMaladiesIdentifier(familleMaladies) as number}`,
      familleMaladies,
      { observe: 'response' }
    );
  }

  partialUpdate(familleMaladies: IFamilleMaladies): Observable<EntityResponseType> {
    return this.http.patch<IFamilleMaladies>(
      `${this.resourceUrl}/${getFamilleMaladiesIdentifier(familleMaladies) as number}`,
      familleMaladies,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFamilleMaladies>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFamilleMaladies[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFamilleMaladiesToCollectionIfMissing(
    familleMaladiesCollection: IFamilleMaladies[],
    ...familleMaladiesToCheck: (IFamilleMaladies | null | undefined)[]
  ): IFamilleMaladies[] {
    const familleMaladies: IFamilleMaladies[] = familleMaladiesToCheck.filter(isPresent);
    if (familleMaladies.length > 0) {
      const familleMaladiesCollectionIdentifiers = familleMaladiesCollection.map(
        familleMaladiesItem => getFamilleMaladiesIdentifier(familleMaladiesItem)!
      );
      const familleMaladiesToAdd = familleMaladies.filter(familleMaladiesItem => {
        const familleMaladiesIdentifier = getFamilleMaladiesIdentifier(familleMaladiesItem);
        if (familleMaladiesIdentifier == null || familleMaladiesCollectionIdentifiers.includes(familleMaladiesIdentifier)) {
          return false;
        }
        familleMaladiesCollectionIdentifiers.push(familleMaladiesIdentifier);
        return true;
      });
      return [...familleMaladiesToAdd, ...familleMaladiesCollection];
    }
    return familleMaladiesCollection;
  }
}
