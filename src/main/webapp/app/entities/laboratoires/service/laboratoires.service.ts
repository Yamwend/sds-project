import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaboratoires, getLaboratoiresIdentifier } from '../laboratoires.model';

export type EntityResponseType = HttpResponse<ILaboratoires>;
export type EntityArrayResponseType = HttpResponse<ILaboratoires[]>;

@Injectable({ providedIn: 'root' })
export class LaboratoiresService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/laboratoires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(laboratoires: ILaboratoires): Observable<EntityResponseType> {
    return this.http.post<ILaboratoires>(this.resourceUrl, laboratoires, { observe: 'response' });
  }

  update(laboratoires: ILaboratoires): Observable<EntityResponseType> {
    return this.http.put<ILaboratoires>(`${this.resourceUrl}/${getLaboratoiresIdentifier(laboratoires) as number}`, laboratoires, {
      observe: 'response',
    });
  }

  partialUpdate(laboratoires: ILaboratoires): Observable<EntityResponseType> {
    return this.http.patch<ILaboratoires>(`${this.resourceUrl}/${getLaboratoiresIdentifier(laboratoires) as number}`, laboratoires, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILaboratoires>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILaboratoires[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLaboratoiresToCollectionIfMissing(
    laboratoiresCollection: ILaboratoires[],
    ...laboratoiresToCheck: (ILaboratoires | null | undefined)[]
  ): ILaboratoires[] {
    const laboratoires: ILaboratoires[] = laboratoiresToCheck.filter(isPresent);
    if (laboratoires.length > 0) {
      const laboratoiresCollectionIdentifiers = laboratoiresCollection.map(
        laboratoiresItem => getLaboratoiresIdentifier(laboratoiresItem)!
      );
      const laboratoiresToAdd = laboratoires.filter(laboratoiresItem => {
        const laboratoiresIdentifier = getLaboratoiresIdentifier(laboratoiresItem);
        if (laboratoiresIdentifier == null || laboratoiresCollectionIdentifiers.includes(laboratoiresIdentifier)) {
          return false;
        }
        laboratoiresCollectionIdentifiers.push(laboratoiresIdentifier);
        return true;
      });
      return [...laboratoiresToAdd, ...laboratoiresCollection];
    }
    return laboratoiresCollection;
  }
}
