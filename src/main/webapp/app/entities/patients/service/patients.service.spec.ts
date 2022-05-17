import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Sexe } from 'app/entities/enumerations/sexe.model';
import { IPatients, Patients } from '../patients.model';

import { PatientsService } from './patients.service';

describe('Patients Service', () => {
  let service: PatientsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPatients;
  let expectedResult: IPatients | IPatients[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PatientsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePat: 'AAAAAAA',
      nomPat: 'AAAAAAA',
      prenomPat: 'AAAAAAA',
      sexePat: Sexe.MASCULIN,
      adressePat: 'AAAAAAA',
      telephonePat: 'AAAAAAA',
      emailPat: 'AAAAAAA',
      originePat: 'AAAAAAA',
      professionPat: 'AAAAAAA',
      agePat: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          agePat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Patients', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          agePat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          agePat: currentDate,
        },
        returnedFromService
      );

      service.create(new Patients()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Patients', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePat: 'BBBBBB',
          nomPat: 'BBBBBB',
          prenomPat: 'BBBBBB',
          sexePat: 'BBBBBB',
          adressePat: 'BBBBBB',
          telephonePat: 'BBBBBB',
          emailPat: 'BBBBBB',
          originePat: 'BBBBBB',
          professionPat: 'BBBBBB',
          agePat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          agePat: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Patients', () => {
      const patchObject = Object.assign(
        {
          nomPat: 'BBBBBB',
          prenomPat: 'BBBBBB',
          sexePat: 'BBBBBB',
          adressePat: 'BBBBBB',
          professionPat: 'BBBBBB',
        },
        new Patients()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          agePat: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Patients', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePat: 'BBBBBB',
          nomPat: 'BBBBBB',
          prenomPat: 'BBBBBB',
          sexePat: 'BBBBBB',
          adressePat: 'BBBBBB',
          telephonePat: 'BBBBBB',
          emailPat: 'BBBBBB',
          originePat: 'BBBBBB',
          professionPat: 'BBBBBB',
          agePat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          agePat: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Patients', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPatientsToCollectionIfMissing', () => {
      it('should add a Patients to an empty array', () => {
        const patients: IPatients = { id: 123 };
        expectedResult = service.addPatientsToCollectionIfMissing([], patients);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patients);
      });

      it('should not add a Patients to an array that contains it', () => {
        const patients: IPatients = { id: 123 };
        const patientsCollection: IPatients[] = [
          {
            ...patients,
          },
          { id: 456 },
        ];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, patients);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Patients to an array that doesn't contain it", () => {
        const patients: IPatients = { id: 123 };
        const patientsCollection: IPatients[] = [{ id: 456 }];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, patients);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patients);
      });

      it('should add only unique Patients to an array', () => {
        const patientsArray: IPatients[] = [{ id: 123 }, { id: 456 }, { id: 73963 }];
        const patientsCollection: IPatients[] = [{ id: 123 }];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, ...patientsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const patients: IPatients = { id: 123 };
        const patients2: IPatients = { id: 456 };
        expectedResult = service.addPatientsToCollectionIfMissing([], patients, patients2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(patients);
        expect(expectedResult).toContain(patients2);
      });

      it('should accept null and undefined values', () => {
        const patients: IPatients = { id: 123 };
        expectedResult = service.addPatientsToCollectionIfMissing([], null, patients, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(patients);
      });

      it('should return initial array if no Patients is added', () => {
        const patientsCollection: IPatients[] = [{ id: 123 }];
        expectedResult = service.addPatientsToCollectionIfMissing(patientsCollection, undefined, null);
        expect(expectedResult).toEqual(patientsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
