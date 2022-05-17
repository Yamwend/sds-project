import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExamens, Examens } from '../examens.model';

import { ExamensService } from './examens.service';

describe('Examens Service', () => {
  let service: ExamensService;
  let httpMock: HttpTestingController;
  let elemDefault: IExamens;
  let expectedResult: IExamens | IExamens[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExamensService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      nomExamen: 'AAAAAAA',
      typeExamen: 'AAAAAAA',
      dateExamen: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateExamen: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Examens', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateExamen: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExamen: currentDate,
        },
        returnedFromService
      );

      service.create(new Examens()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Examens', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomExamen: 'BBBBBB',
          typeExamen: 'BBBBBB',
          dateExamen: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExamen: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Examens', () => {
      const patchObject = Object.assign(
        {
          nomExamen: 'BBBBBB',
          typeExamen: 'BBBBBB',
        },
        new Examens()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateExamen: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Examens', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomExamen: 'BBBBBB',
          typeExamen: 'BBBBBB',
          dateExamen: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateExamen: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Examens', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExamensToCollectionIfMissing', () => {
      it('should add a Examens to an empty array', () => {
        const examens: IExamens = { id: 123 };
        expectedResult = service.addExamensToCollectionIfMissing([], examens);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(examens);
      });

      it('should not add a Examens to an array that contains it', () => {
        const examens: IExamens = { id: 123 };
        const examensCollection: IExamens[] = [
          {
            ...examens,
          },
          { id: 456 },
        ];
        expectedResult = service.addExamensToCollectionIfMissing(examensCollection, examens);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Examens to an array that doesn't contain it", () => {
        const examens: IExamens = { id: 123 };
        const examensCollection: IExamens[] = [{ id: 456 }];
        expectedResult = service.addExamensToCollectionIfMissing(examensCollection, examens);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(examens);
      });

      it('should add only unique Examens to an array', () => {
        const examensArray: IExamens[] = [{ id: 123 }, { id: 456 }, { id: 44425 }];
        const examensCollection: IExamens[] = [{ id: 123 }];
        expectedResult = service.addExamensToCollectionIfMissing(examensCollection, ...examensArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const examens: IExamens = { id: 123 };
        const examens2: IExamens = { id: 456 };
        expectedResult = service.addExamensToCollectionIfMissing([], examens, examens2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(examens);
        expect(expectedResult).toContain(examens2);
      });

      it('should accept null and undefined values', () => {
        const examens: IExamens = { id: 123 };
        expectedResult = service.addExamensToCollectionIfMissing([], null, examens, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(examens);
      });

      it('should return initial array if no Examens is added', () => {
        const examensCollection: IExamens[] = [{ id: 123 }];
        expectedResult = service.addExamensToCollectionIfMissing(examensCollection, undefined, null);
        expect(expectedResult).toEqual(examensCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
