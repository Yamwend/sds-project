import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategorieChambres, getCategorieChambresIdentifier } from '../categorie-chambres.model';

export type EntityResponseType = HttpResponse<ICategorieChambres>;
export type EntityArrayResponseType = HttpResponse<ICategorieChambres[]>;

@Injectable({ providedIn: 'root' })
export class CategorieChambresService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorie-chambres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(categorieChambres: ICategorieChambres): Observable<EntityResponseType> {
    return this.http.post<ICategorieChambres>(this.resourceUrl, categorieChambres, { observe: 'response' });
  }

  update(categorieChambres: ICategorieChambres): Observable<EntityResponseType> {
    return this.http.put<ICategorieChambres>(
      `${this.resourceUrl}/${getCategorieChambresIdentifier(categorieChambres) as number}`,
      categorieChambres,
      { observe: 'response' }
    );
  }

  partialUpdate(categorieChambres: ICategorieChambres): Observable<EntityResponseType> {
    return this.http.patch<ICategorieChambres>(
      `${this.resourceUrl}/${getCategorieChambresIdentifier(categorieChambres) as number}`,
      categorieChambres,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategorieChambres>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorieChambres[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategorieChambresToCollectionIfMissing(
    categorieChambresCollection: ICategorieChambres[],
    ...categorieChambresToCheck: (ICategorieChambres | null | undefined)[]
  ): ICategorieChambres[] {
    const categorieChambres: ICategorieChambres[] = categorieChambresToCheck.filter(isPresent);
    if (categorieChambres.length > 0) {
      const categorieChambresCollectionIdentifiers = categorieChambresCollection.map(
        categorieChambresItem => getCategorieChambresIdentifier(categorieChambresItem)!
      );
      const categorieChambresToAdd = categorieChambres.filter(categorieChambresItem => {
        const categorieChambresIdentifier = getCategorieChambresIdentifier(categorieChambresItem);
        if (categorieChambresIdentifier == null || categorieChambresCollectionIdentifiers.includes(categorieChambresIdentifier)) {
          return false;
        }
        categorieChambresCollectionIdentifiers.push(categorieChambresIdentifier);
        return true;
      });
      return [...categorieChambresToAdd, ...categorieChambresCollection];
    }
    return categorieChambresCollection;
  }
}
