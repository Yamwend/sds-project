import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHospitalisations, Hospitalisations } from '../hospitalisations.model';

import { HospitalisationsService } from './hospitalisations.service';

describe('Hospitalisations Service', () => {
  let service: HospitalisationsService;
  let httpMock: HttpTestingController;
  let elemDefault: IHospitalisations;
  let expectedResult: IHospitalisations | IHospitalisations[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HospitalisationsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateArrivee: currentDate,
      dateSortie: currentDate,
      observationsHospitalisation: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateArrivee: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Hospitalisations', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateArrivee: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateArrivee: currentDate,
          dateSortie: currentDate,
        },
        returnedFromService
      );

      service.create(new Hospitalisations()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Hospitalisations', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateArrivee: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          observationsHospitalisation: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateArrivee: currentDate,
          dateSortie: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Hospitalisations', () => {
      const patchObject = Object.assign(
        {
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          observationsHospitalisation: 'BBBBBB',
        },
        new Hospitalisations()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateArrivee: currentDate,
          dateSortie: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Hospitalisations', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateArrivee: currentDate.format(DATE_TIME_FORMAT),
          dateSortie: currentDate.format(DATE_TIME_FORMAT),
          observationsHospitalisation: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateArrivee: currentDate,
          dateSortie: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Hospitalisations', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHospitalisationsToCollectionIfMissing', () => {
      it('should add a Hospitalisations to an empty array', () => {
        const hospitalisations: IHospitalisations = { id: 123 };
        expectedResult = service.addHospitalisationsToCollectionIfMissing([], hospitalisations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hospitalisations);
      });

      it('should not add a Hospitalisations to an array that contains it', () => {
        const hospitalisations: IHospitalisations = { id: 123 };
        const hospitalisationsCollection: IHospitalisations[] = [
          {
            ...hospitalisations,
          },
          { id: 456 },
        ];
        expectedResult = service.addHospitalisationsToCollectionIfMissing(hospitalisationsCollection, hospitalisations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Hospitalisations to an array that doesn't contain it", () => {
        const hospitalisations: IHospitalisations = { id: 123 };
        const hospitalisationsCollection: IHospitalisations[] = [{ id: 456 }];
        expectedResult = service.addHospitalisationsToCollectionIfMissing(hospitalisationsCollection, hospitalisations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hospitalisations);
      });

      it('should add only unique Hospitalisations to an array', () => {
        const hospitalisationsArray: IHospitalisations[] = [{ id: 123 }, { id: 456 }, { id: 18517 }];
        const hospitalisationsCollection: IHospitalisations[] = [{ id: 123 }];
        expectedResult = service.addHospitalisationsToCollectionIfMissing(hospitalisationsCollection, ...hospitalisationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hospitalisations: IHospitalisations = { id: 123 };
        const hospitalisations2: IHospitalisations = { id: 456 };
        expectedResult = service.addHospitalisationsToCollectionIfMissing([], hospitalisations, hospitalisations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hospitalisations);
        expect(expectedResult).toContain(hospitalisations2);
      });

      it('should accept null and undefined values', () => {
        const hospitalisations: IHospitalisations = { id: 123 };
        expectedResult = service.addHospitalisationsToCollectionIfMissing([], null, hospitalisations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hospitalisations);
      });

      it('should return initial array if no Hospitalisations is added', () => {
        const hospitalisationsCollection: IHospitalisations[] = [{ id: 123 }];
        expectedResult = service.addHospitalisationsToCollectionIfMissing(hospitalisationsCollection, undefined, null);
        expect(expectedResult).toEqual(hospitalisationsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
