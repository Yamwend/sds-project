import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { TypeConsultation } from 'app/entities/enumerations/type-consultation.model';
import { IConsultations, Consultations } from '../consultations.model';

import { ConsultationsService } from './consultations.service';

describe('Consultations Service', () => {
  let service: ConsultationsService;
  let httpMock: HttpTestingController;
  let elemDefault: IConsultations;
  let expectedResult: IConsultations | IConsultations[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConsultationsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      typeConsultation: TypeConsultation.CPN,
      observationsConsltation: 'AAAAAAA',
      fraisConsultion: 0,
      dateConsultion: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateConsultion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Consultations', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateConsultion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateConsultion: currentDate,
        },
        returnedFromService
      );

      service.create(new Consultations()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Consultations', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          typeConsultation: 'BBBBBB',
          observationsConsltation: 'BBBBBB',
          fraisConsultion: 1,
          dateConsultion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateConsultion: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Consultations', () => {
      const patchObject = Object.assign(
        {
          observationsConsltation: 'BBBBBB',
          fraisConsultion: 1,
          dateConsultion: currentDate.format(DATE_TIME_FORMAT),
        },
        new Consultations()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateConsultion: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Consultations', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          typeConsultation: 'BBBBBB',
          observationsConsltation: 'BBBBBB',
          fraisConsultion: 1,
          dateConsultion: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateConsultion: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Consultations', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addConsultationsToCollectionIfMissing', () => {
      it('should add a Consultations to an empty array', () => {
        const consultations: IConsultations = { id: 123 };
        expectedResult = service.addConsultationsToCollectionIfMissing([], consultations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consultations);
      });

      it('should not add a Consultations to an array that contains it', () => {
        const consultations: IConsultations = { id: 123 };
        const consultationsCollection: IConsultations[] = [
          {
            ...consultations,
          },
          { id: 456 },
        ];
        expectedResult = service.addConsultationsToCollectionIfMissing(consultationsCollection, consultations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Consultations to an array that doesn't contain it", () => {
        const consultations: IConsultations = { id: 123 };
        const consultationsCollection: IConsultations[] = [{ id: 456 }];
        expectedResult = service.addConsultationsToCollectionIfMissing(consultationsCollection, consultations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consultations);
      });

      it('should add only unique Consultations to an array', () => {
        const consultationsArray: IConsultations[] = [{ id: 123 }, { id: 456 }, { id: 39561 }];
        const consultationsCollection: IConsultations[] = [{ id: 123 }];
        expectedResult = service.addConsultationsToCollectionIfMissing(consultationsCollection, ...consultationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const consultations: IConsultations = { id: 123 };
        const consultations2: IConsultations = { id: 456 };
        expectedResult = service.addConsultationsToCollectionIfMissing([], consultations, consultations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consultations);
        expect(expectedResult).toContain(consultations2);
      });

      it('should accept null and undefined values', () => {
        const consultations: IConsultations = { id: 123 };
        expectedResult = service.addConsultationsToCollectionIfMissing([], null, consultations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consultations);
      });

      it('should return initial array if no Consultations is added', () => {
        const consultationsCollection: IConsultations[] = [{ id: 123 }];
        expectedResult = service.addConsultationsToCollectionIfMissing(consultationsCollection, undefined, null);
        expect(expectedResult).toEqual(consultationsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
