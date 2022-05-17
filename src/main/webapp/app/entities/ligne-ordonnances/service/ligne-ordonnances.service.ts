import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILigneOrdonnances, getLigneOrdonnancesIdentifier } from '../ligne-ordonnances.model';

export type EntityResponseType = HttpResponse<ILigneOrdonnances>;
export type EntityArrayResponseType = HttpResponse<ILigneOrdonnances[]>;

@Injectable({ providedIn: 'root' })
export class LigneOrdonnancesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ligne-ordonnances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ligneOrdonnances: ILigneOrdonnances): Observable<EntityResponseType> {
    return this.http.post<ILigneOrdonnances>(this.resourceUrl, ligneOrdonnances, { observe: 'response' });
  }

  update(ligneOrdonnances: ILigneOrdonnances): Observable<EntityResponseType> {
    return this.http.put<ILigneOrdonnances>(
      `${this.resourceUrl}/${getLigneOrdonnancesIdentifier(ligneOrdonnances) as number}`,
      ligneOrdonnances,
      { observe: 'response' }
    );
  }

  partialUpdate(ligneOrdonnances: ILigneOrdonnances): Observable<EntityResponseType> {
    return this.http.patch<ILigneOrdonnances>(
      `${this.resourceUrl}/${getLigneOrdonnancesIdentifier(ligneOrdonnances) as number}`,
      ligneOrdonnances,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILigneOrdonnances>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILigneOrdonnances[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLigneOrdonnancesToCollectionIfMissing(
    ligneOrdonnancesCollection: ILigneOrdonnances[],
    ...ligneOrdonnancesToCheck: (ILigneOrdonnances | null | undefined)[]
  ): ILigneOrdonnances[] {
    const ligneOrdonnances: ILigneOrdonnances[] = ligneOrdonnancesToCheck.filter(isPresent);
    if (ligneOrdonnances.length > 0) {
      const ligneOrdonnancesCollectionIdentifiers = ligneOrdonnancesCollection.map(
        ligneOrdonnancesItem => getLigneOrdonnancesIdentifier(ligneOrdonnancesItem)!
      );
      const ligneOrdonnancesToAdd = ligneOrdonnances.filter(ligneOrdonnancesItem => {
        const ligneOrdonnancesIdentifier = getLigneOrdonnancesIdentifier(ligneOrdonnancesItem);
        if (ligneOrdonnancesIdentifier == null || ligneOrdonnancesCollectionIdentifiers.includes(ligneOrdonnancesIdentifier)) {
          return false;
        }
        ligneOrdonnancesCollectionIdentifiers.push(ligneOrdonnancesIdentifier);
        return true;
      });
      return [...ligneOrdonnancesToAdd, ...ligneOrdonnancesCollection];
    }
    return ligneOrdonnancesCollection;
  }
}
