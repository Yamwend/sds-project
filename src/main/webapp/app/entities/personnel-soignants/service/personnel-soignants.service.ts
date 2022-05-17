import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonnelSoignants, getPersonnelSoignantsIdentifier } from '../personnel-soignants.model';

export type EntityResponseType = HttpResponse<IPersonnelSoignants>;
export type EntityArrayResponseType = HttpResponse<IPersonnelSoignants[]>;

@Injectable({ providedIn: 'root' })
export class PersonnelSoignantsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personnel-soignants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(personnelSoignants: IPersonnelSoignants): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personnelSoignants);
    return this.http
      .post<IPersonnelSoignants>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(personnelSoignants: IPersonnelSoignants): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personnelSoignants);
    return this.http
      .put<IPersonnelSoignants>(`${this.resourceUrl}/${getPersonnelSoignantsIdentifier(personnelSoignants) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(personnelSoignants: IPersonnelSoignants): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personnelSoignants);
    return this.http
      .patch<IPersonnelSoignants>(`${this.resourceUrl}/${getPersonnelSoignantsIdentifier(personnelSoignants) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPersonnelSoignants>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPersonnelSoignants[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPersonnelSoignantsToCollectionIfMissing(
    personnelSoignantsCollection: IPersonnelSoignants[],
    ...personnelSoignantsToCheck: (IPersonnelSoignants | null | undefined)[]
  ): IPersonnelSoignants[] {
    const personnelSoignants: IPersonnelSoignants[] = personnelSoignantsToCheck.filter(isPresent);
    if (personnelSoignants.length > 0) {
      const personnelSoignantsCollectionIdentifiers = personnelSoignantsCollection.map(
        personnelSoignantsItem => getPersonnelSoignantsIdentifier(personnelSoignantsItem)!
      );
      const personnelSoignantsToAdd = personnelSoignants.filter(personnelSoignantsItem => {
        const personnelSoignantsIdentifier = getPersonnelSoignantsIdentifier(personnelSoignantsItem);
        if (personnelSoignantsIdentifier == null || personnelSoignantsCollectionIdentifiers.includes(personnelSoignantsIdentifier)) {
          return false;
        }
        personnelSoignantsCollectionIdentifiers.push(personnelSoignantsIdentifier);
        return true;
      });
      return [...personnelSoignantsToAdd, ...personnelSoignantsCollection];
    }
    return personnelSoignantsCollection;
  }

  protected convertDateFromClient(personnelSoignants: IPersonnelSoignants): IPersonnelSoignants {
    return Object.assign({}, personnelSoignants, {
      dateDeNaissPersonne: personnelSoignants.dateDeNaissPersonne?.isValid() ? personnelSoignants.dateDeNaissPersonne.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDeNaissPersonne = res.body.dateDeNaissPersonne ? dayjs(res.body.dateDeNaissPersonne) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((personnelSoignants: IPersonnelSoignants) => {
        personnelSoignants.dateDeNaissPersonne = personnelSoignants.dateDeNaissPersonne
          ? dayjs(personnelSoignants.dateDeNaissPersonne)
          : undefined;
      });
    }
    return res;
  }
}
