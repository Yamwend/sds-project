import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChambres, getChambresIdentifier } from '../chambres.model';

export type EntityResponseType = HttpResponse<IChambres>;
export type EntityArrayResponseType = HttpResponse<IChambres[]>;

@Injectable({ providedIn: 'root' })
export class ChambresService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chambres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chambres: IChambres): Observable<EntityResponseType> {
    return this.http.post<IChambres>(this.resourceUrl, chambres, { observe: 'response' });
  }

  update(chambres: IChambres): Observable<EntityResponseType> {
    return this.http.put<IChambres>(`${this.resourceUrl}/${getChambresIdentifier(chambres) as number}`, chambres, { observe: 'response' });
  }

  partialUpdate(chambres: IChambres): Observable<EntityResponseType> {
    return this.http.patch<IChambres>(`${this.resourceUrl}/${getChambresIdentifier(chambres) as number}`, chambres, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChambres>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChambres[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChambresToCollectionIfMissing(chambresCollection: IChambres[], ...chambresToCheck: (IChambres | null | undefined)[]): IChambres[] {
    const chambres: IChambres[] = chambresToCheck.filter(isPresent);
    if (chambres.length > 0) {
      const chambresCollectionIdentifiers = chambresCollection.map(chambresItem => getChambresIdentifier(chambresItem)!);
      const chambresToAdd = chambres.filter(chambresItem => {
        const chambresIdentifier = getChambresIdentifier(chambresItem);
        if (chambresIdentifier == null || chambresCollectionIdentifiers.includes(chambresIdentifier)) {
          return false;
        }
        chambresCollectionIdentifiers.push(chambresIdentifier);
        return true;
      });
      return [...chambresToAdd, ...chambresCollection];
    }
    return chambresCollection;
  }
}
