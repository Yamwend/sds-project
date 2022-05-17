import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatients, getPatientsIdentifier } from '../patients.model';

export type EntityResponseType = HttpResponse<IPatients>;
export type EntityArrayResponseType = HttpResponse<IPatients[]>;

@Injectable({ providedIn: 'root' })
export class PatientsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/patients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(patients: IPatients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patients);
    return this.http
      .post<IPatients>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(patients: IPatients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patients);
    return this.http
      .put<IPatients>(`${this.resourceUrl}/${getPatientsIdentifier(patients) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(patients: IPatients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(patients);
    return this.http
      .patch<IPatients>(`${this.resourceUrl}/${getPatientsIdentifier(patients) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPatients>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPatients[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPatientsToCollectionIfMissing(patientsCollection: IPatients[], ...patientsToCheck: (IPatients | null | undefined)[]): IPatients[] {
    const patients: IPatients[] = patientsToCheck.filter(isPresent);
    if (patients.length > 0) {
      const patientsCollectionIdentifiers = patientsCollection.map(patientsItem => getPatientsIdentifier(patientsItem)!);
      const patientsToAdd = patients.filter(patientsItem => {
        const patientsIdentifier = getPatientsIdentifier(patientsItem);
        if (patientsIdentifier == null || patientsCollectionIdentifiers.includes(patientsIdentifier)) {
          return false;
        }
        patientsCollectionIdentifiers.push(patientsIdentifier);
        return true;
      });
      return [...patientsToAdd, ...patientsCollection];
    }
    return patientsCollection;
  }

  protected convertDateFromClient(patients: IPatients): IPatients {
    return Object.assign({}, patients, {
      agePat: patients.agePat?.isValid() ? patients.agePat.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.agePat = res.body.agePat ? dayjs(res.body.agePat) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((patients: IPatients) => {
        patients.agePat = patients.agePat ? dayjs(patients.agePat) : undefined;
      });
    }
    return res;
  }
}
