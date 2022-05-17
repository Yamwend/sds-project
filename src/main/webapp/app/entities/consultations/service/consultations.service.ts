import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsultations, getConsultationsIdentifier } from '../consultations.model';

export type EntityResponseType = HttpResponse<IConsultations>;
export type EntityArrayResponseType = HttpResponse<IConsultations[]>;

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/consultations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(consultations: IConsultations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultations);
    return this.http
      .post<IConsultations>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(consultations: IConsultations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultations);
    return this.http
      .put<IConsultations>(`${this.resourceUrl}/${getConsultationsIdentifier(consultations) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(consultations: IConsultations): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consultations);
    return this.http
      .patch<IConsultations>(`${this.resourceUrl}/${getConsultationsIdentifier(consultations) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConsultations>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConsultations[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConsultationsToCollectionIfMissing(
    consultationsCollection: IConsultations[],
    ...consultationsToCheck: (IConsultations | null | undefined)[]
  ): IConsultations[] {
    const consultations: IConsultations[] = consultationsToCheck.filter(isPresent);
    if (consultations.length > 0) {
      const consultationsCollectionIdentifiers = consultationsCollection.map(
        consultationsItem => getConsultationsIdentifier(consultationsItem)!
      );
      const consultationsToAdd = consultations.filter(consultationsItem => {
        const consultationsIdentifier = getConsultationsIdentifier(consultationsItem);
        if (consultationsIdentifier == null || consultationsCollectionIdentifiers.includes(consultationsIdentifier)) {
          return false;
        }
        consultationsCollectionIdentifiers.push(consultationsIdentifier);
        return true;
      });
      return [...consultationsToAdd, ...consultationsCollection];
    }
    return consultationsCollection;
  }

  protected convertDateFromClient(consultations: IConsultations): IConsultations {
    return Object.assign({}, consultations, {
      dateConsultion: consultations.dateConsultion?.isValid() ? consultations.dateConsultion.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateConsultion = res.body.dateConsultion ? dayjs(res.body.dateConsultion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((consultations: IConsultations) => {
        consultations.dateConsultion = consultations.dateConsultion ? dayjs(consultations.dateConsultion) : undefined;
      });
    }
    return res;
  }
}
