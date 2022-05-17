import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Grade } from 'app/entities/enumerations/grade.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';
import { IPersonnelSoignants, PersonnelSoignants } from '../personnel-soignants.model';

import { PersonnelSoignantsService } from './personnel-soignants.service';

describe('PersonnelSoignants Service', () => {
  let service: PersonnelSoignantsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPersonnelSoignants;
  let expectedResult: IPersonnelSoignants | IPersonnelSoignants[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonnelSoignantsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePersonne: 'AAAAAAA',
      nomPersonne: 'AAAAAAA',
      prenomPersonne: 'AAAAAAA',
      gradePersonne: Grade.INFIRMIER,
      fonctionPersonne: 'AAAAAAA',
      telphonePersonne: 'AAAAAAA',
      emailPersonne: Sexe.MASCULIN,
      adressePersonne: 'AAAAAAA',
      dateDeNaissPersonne: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateDeNaissPersonne: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PersonnelSoignants', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDeNaissPersonne: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDeNaissPersonne: currentDate,
        },
        returnedFromService
      );

      service.create(new PersonnelSoignants()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PersonnelSoignants', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePersonne: 'BBBBBB',
          nomPersonne: 'BBBBBB',
          prenomPersonne: 'BBBBBB',
          gradePersonne: 'BBBBBB',
          fonctionPersonne: 'BBBBBB',
          telphonePersonne: 'BBBBBB',
          emailPersonne: 'BBBBBB',
          adressePersonne: 'BBBBBB',
          dateDeNaissPersonne: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDeNaissPersonne: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PersonnelSoignants', () => {
      const patchObject = Object.assign(
        {
          codePersonne: 'BBBBBB',
          nomPersonne: 'BBBBBB',
          gradePersonne: 'BBBBBB',
          fonctionPersonne: 'BBBBBB',
          emailPersonne: 'BBBBBB',
          adressePersonne: 'BBBBBB',
        },
        new PersonnelSoignants()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDeNaissPersonne: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PersonnelSoignants', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePersonne: 'BBBBBB',
          nomPersonne: 'BBBBBB',
          prenomPersonne: 'BBBBBB',
          gradePersonne: 'BBBBBB',
          fonctionPersonne: 'BBBBBB',
          telphonePersonne: 'BBBBBB',
          emailPersonne: 'BBBBBB',
          adressePersonne: 'BBBBBB',
          dateDeNaissPersonne: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDeNaissPersonne: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PersonnelSoignants', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPersonnelSoignantsToCollectionIfMissing', () => {
      it('should add a PersonnelSoignants to an empty array', () => {
        const personnelSoignants: IPersonnelSoignants = { id: 123 };
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing([], personnelSoignants);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personnelSoignants);
      });

      it('should not add a PersonnelSoignants to an array that contains it', () => {
        const personnelSoignants: IPersonnelSoignants = { id: 123 };
        const personnelSoignantsCollection: IPersonnelSoignants[] = [
          {
            ...personnelSoignants,
          },
          { id: 456 },
        ];
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing(personnelSoignantsCollection, personnelSoignants);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PersonnelSoignants to an array that doesn't contain it", () => {
        const personnelSoignants: IPersonnelSoignants = { id: 123 };
        const personnelSoignantsCollection: IPersonnelSoignants[] = [{ id: 456 }];
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing(personnelSoignantsCollection, personnelSoignants);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personnelSoignants);
      });

      it('should add only unique PersonnelSoignants to an array', () => {
        const personnelSoignantsArray: IPersonnelSoignants[] = [{ id: 123 }, { id: 456 }, { id: 23899 }];
        const personnelSoignantsCollection: IPersonnelSoignants[] = [{ id: 123 }];
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing(personnelSoignantsCollection, ...personnelSoignantsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const personnelSoignants: IPersonnelSoignants = { id: 123 };
        const personnelSoignants2: IPersonnelSoignants = { id: 456 };
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing([], personnelSoignants, personnelSoignants2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personnelSoignants);
        expect(expectedResult).toContain(personnelSoignants2);
      });

      it('should accept null and undefined values', () => {
        const personnelSoignants: IPersonnelSoignants = { id: 123 };
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing([], null, personnelSoignants, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personnelSoignants);
      });

      it('should return initial array if no PersonnelSoignants is added', () => {
        const personnelSoignantsCollection: IPersonnelSoignants[] = [{ id: 123 }];
        expectedResult = service.addPersonnelSoignantsToCollectionIfMissing(personnelSoignantsCollection, undefined, null);
        expect(expectedResult).toEqual(personnelSoignantsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
