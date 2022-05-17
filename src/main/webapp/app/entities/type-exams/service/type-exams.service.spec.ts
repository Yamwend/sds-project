import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeExams, TypeExams } from '../type-exams.model';

import { TypeExamsService } from './type-exams.service';

describe('TypeExams Service', () => {
  let service: TypeExamsService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeExams;
  let expectedResult: ITypeExams | ITypeExams[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeExamsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelleType: 'AAAAAAA',
      descruptionType: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TypeExams', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeExams()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeExams', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleType: 'BBBBBB',
          descruptionType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeExams', () => {
      const patchObject = Object.assign(
        {
          libelleType: 'BBBBBB',
          descruptionType: 'BBBBBB',
        },
        new TypeExams()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeExams', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleType: 'BBBBBB',
          descruptionType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TypeExams', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeExamsToCollectionIfMissing', () => {
      it('should add a TypeExams to an empty array', () => {
        const typeExams: ITypeExams = { id: 123 };
        expectedResult = service.addTypeExamsToCollectionIfMissing([], typeExams);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeExams);
      });

      it('should not add a TypeExams to an array that contains it', () => {
        const typeExams: ITypeExams = { id: 123 };
        const typeExamsCollection: ITypeExams[] = [
          {
            ...typeExams,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeExamsToCollectionIfMissing(typeExamsCollection, typeExams);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeExams to an array that doesn't contain it", () => {
        const typeExams: ITypeExams = { id: 123 };
        const typeExamsCollection: ITypeExams[] = [{ id: 456 }];
        expectedResult = service.addTypeExamsToCollectionIfMissing(typeExamsCollection, typeExams);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeExams);
      });

      it('should add only unique TypeExams to an array', () => {
        const typeExamsArray: ITypeExams[] = [{ id: 123 }, { id: 456 }, { id: 96334 }];
        const typeExamsCollection: ITypeExams[] = [{ id: 123 }];
        expectedResult = service.addTypeExamsToCollectionIfMissing(typeExamsCollection, ...typeExamsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeExams: ITypeExams = { id: 123 };
        const typeExams2: ITypeExams = { id: 456 };
        expectedResult = service.addTypeExamsToCollectionIfMissing([], typeExams, typeExams2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeExams);
        expect(expectedResult).toContain(typeExams2);
      });

      it('should accept null and undefined values', () => {
        const typeExams: ITypeExams = { id: 123 };
        expectedResult = service.addTypeExamsToCollectionIfMissing([], null, typeExams, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeExams);
      });

      it('should return initial array if no TypeExams is added', () => {
        const typeExamsCollection: ITypeExams[] = [{ id: 123 }];
        expectedResult = service.addTypeExamsToCollectionIfMissing(typeExamsCollection, undefined, null);
        expect(expectedResult).toEqual(typeExamsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
