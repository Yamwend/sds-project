import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeExams, getTypeExamsIdentifier } from '../type-exams.model';

export type EntityResponseType = HttpResponse<ITypeExams>;
export type EntityArrayResponseType = HttpResponse<ITypeExams[]>;

@Injectable({ providedIn: 'root' })
export class TypeExamsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-exams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeExams: ITypeExams): Observable<EntityResponseType> {
    return this.http.post<ITypeExams>(this.resourceUrl, typeExams, { observe: 'response' });
  }

  update(typeExams: ITypeExams): Observable<EntityResponseType> {
    return this.http.put<ITypeExams>(`${this.resourceUrl}/${getTypeExamsIdentifier(typeExams) as number}`, typeExams, {
      observe: 'response',
    });
  }

  partialUpdate(typeExams: ITypeExams): Observable<EntityResponseType> {
    return this.http.patch<ITypeExams>(`${this.resourceUrl}/${getTypeExamsIdentifier(typeExams) as number}`, typeExams, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeExams>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeExams[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeExamsToCollectionIfMissing(
    typeExamsCollection: ITypeExams[],
    ...typeExamsToCheck: (ITypeExams | null | undefined)[]
  ): ITypeExams[] {
    const typeExams: ITypeExams[] = typeExamsToCheck.filter(isPresent);
    if (typeExams.length > 0) {
      const typeExamsCollectionIdentifiers = typeExamsCollection.map(typeExamsItem => getTypeExamsIdentifier(typeExamsItem)!);
      const typeExamsToAdd = typeExams.filter(typeExamsItem => {
        const typeExamsIdentifier = getTypeExamsIdentifier(typeExamsItem);
        if (typeExamsIdentifier == null || typeExamsCollectionIdentifiers.includes(typeExamsIdentifier)) {
          return false;
        }
        typeExamsCollectionIdentifiers.push(typeExamsIdentifier);
        return true;
      });
      return [...typeExamsToAdd, ...typeExamsCollection];
    }
    return typeExamsCollection;
  }
}
