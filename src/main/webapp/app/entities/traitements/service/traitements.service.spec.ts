import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITraitements, Traitements } from '../traitements.model';

import { TraitementsService } from './traitements.service';

describe('Traitements Service', () => {
  let service: TraitementsService;
  let httpMock: HttpTestingController;
  let elemDefault: ITraitements;
  let expectedResult: ITraitements | ITraitements[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TraitementsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      observationsTraitement: 'AAAAAAA',
      debutTraitement: currentDate,
      finTraitement: currentDate,
      etatFinPatient: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          debutTraitement: currentDate.format(DATE_TIME_FORMAT),
          finTraitement: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Traitements', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          debutTraitement: currentDate.format(DATE_TIME_FORMAT),
          finTraitement: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          debutTraitement: currentDate,
          finTraitement: currentDate,
        },
        returnedFromService
      );

      service.create(new Traitements()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Traitements', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          observationsTraitement: 'BBBBBB',
          debutTraitement: currentDate.format(DATE_TIME_FORMAT),
          finTraitement: currentDate.format(DATE_TIME_FORMAT),
          etatFinPatient: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          debutTraitement: currentDate,
          finTraitement: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Traitements', () => {
      const patchObject = Object.assign(
        {
          observationsTraitement: 'BBBBBB',
          etatFinPatient: 'BBBBBB',
        },
        new Traitements()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          debutTraitement: currentDate,
          finTraitement: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Traitements', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          observationsTraitement: 'BBBBBB',
          debutTraitement: currentDate.format(DATE_TIME_FORMAT),
          finTraitement: currentDate.format(DATE_TIME_FORMAT),
          etatFinPatient: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          debutTraitement: currentDate,
          finTraitement: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Traitements', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTraitementsToCollectionIfMissing', () => {
      it('should add a Traitements to an empty array', () => {
        const traitements: ITraitements = { id: 123 };
        expectedResult = service.addTraitementsToCollectionIfMissing([], traitements);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(traitements);
      });

      it('should not add a Traitements to an array that contains it', () => {
        const traitements: ITraitements = { id: 123 };
        const traitementsCollection: ITraitements[] = [
          {
            ...traitements,
          },
          { id: 456 },
        ];
        expectedResult = service.addTraitementsToCollectionIfMissing(traitementsCollection, traitements);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Traitements to an array that doesn't contain it", () => {
        const traitements: ITraitements = { id: 123 };
        const traitementsCollection: ITraitements[] = [{ id: 456 }];
        expectedResult = service.addTraitementsToCollectionIfMissing(traitementsCollection, traitements);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(traitements);
      });

      it('should add only unique Traitements to an array', () => {
        const traitementsArray: ITraitements[] = [{ id: 123 }, { id: 456 }, { id: 9180 }];
        const traitementsCollection: ITraitements[] = [{ id: 123 }];
        expectedResult = service.addTraitementsToCollectionIfMissing(traitementsCollection, ...traitementsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const traitements: ITraitements = { id: 123 };
        const traitements2: ITraitements = { id: 456 };
        expectedResult = service.addTraitementsToCollectionIfMissing([], traitements, traitements2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(traitements);
        expect(expectedResult).toContain(traitements2);
      });

      it('should accept null and undefined values', () => {
        const traitements: ITraitements = { id: 123 };
        expectedResult = service.addTraitementsToCollectionIfMissing([], null, traitements, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(traitements);
      });

      it('should return initial array if no Traitements is added', () => {
        const traitementsCollection: ITraitements[] = [{ id: 123 }];
        expectedResult = service.addTraitementsToCollectionIfMissing(traitementsCollection, undefined, null);
        expect(expectedResult).toEqual(traitementsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
