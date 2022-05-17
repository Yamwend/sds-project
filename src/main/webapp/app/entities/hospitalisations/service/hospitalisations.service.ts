import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHospitalisations, getHospitalisationsIdentifier } from '../hospitalisations.model';

export type EntityResponseType = HttpResponse<IHospitalisations>;
export type EntityArrayResponseType = HttpResponse<IHospitalisations[]>;

@Injectable({ providedIn: 'root' })
export class HospitalisationsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hospitalisations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hospitalisations: IHospitalisations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(hospitalisations);
    return this.http
      .post<IHospitalisations>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(hospitalisations: IHospitalisations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(hospitalisations);
    return this.http
      .put<IHospitalisations>(`${this.resourceUrl}/${getHospitalisationsIdentifier(hospitalisations) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(hospitalisations: IHospitalisations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(hospitalisations);
    return this.http
      .patch<IHospitalisations>(`${this.resourceUrl}/${getHospitalisationsIdentifier(hospitalisations) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHospitalisations>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHospitalisations[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHospitalisationsToCollectionIfMissing(
    hospitalisationsCollection: IHospitalisations[],
    ...hospitalisationsToCheck: (IHospitalisations | null | undefined)[]
  ): IHospitalisations[] {
    const hospitalisations: IHospitalisations[] = hospitalisationsToCheck.filter(isPresent);
    if (hospitalisations.length > 0) {
      const hospitalisationsCollectionIdentifiers = hospitalisationsCollection.map(
        hospitalisationsItem => getHospitalisationsIdentifier(hospitalisationsItem)!
      );
      const hospitalisationsToAdd = hospitalisations.filter(hospitalisationsItem => {
        const hospitalisationsIdentifier = getHospitalisationsIdentifier(hospitalisationsItem);
        if (hospitalisationsIdentifier == null || hospitalisationsCollectionIdentifiers.includes(hospitalisationsIdentifier)) {
          return false;
        }
        hospitalisationsCollectionIdentifiers.push(hospitalisationsIdentifier);
        return true;
      });
      return [...hospitalisationsToAdd, ...hospitalisationsCollection];
    }
    return hospitalisationsCollection;
  }

  protected convertDateFromClient(hospitalisations: IHospitalisations): IHospitalisations {
    return Object.assign({}, hospitalisations, {
      dateArrivee: hospitalisations.dateArrivee?.isValid() ? hospitalisations.dateArrivee.toJSON() : undefined,
      dateSortie: hospitalisations.dateSortie?.isValid() ? hospitalisations.dateSortie.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateArrivee = res.body.dateArrivee ? dayjs(res.body.dateArrivee) : undefined;
      res.body.dateSortie = res.body.dateSortie ? dayjs(res.body.dateSortie) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((hospitalisations: IHospitalisations) => {
        hospitalisations.dateArrivee = hospitalisations.dateArrivee ? dayjs(hospitalisations.dateArrivee) : undefined;
        hospitalisations.dateSortie = hospitalisations.dateSortie ? dayjs(hospitalisations.dateSortie) : undefined;
      });
    }
    return res;
  }
}
