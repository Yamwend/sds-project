import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrdonnances, Ordonnances } from '../ordonnances.model';

import { OrdonnancesService } from './ordonnances.service';

describe('Ordonnances Service', () => {
  let service: OrdonnancesService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrdonnances;
  let expectedResult: IOrdonnances | IOrdonnances[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrdonnancesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numero: 'AAAAAAA',
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

    it('should create a Ordonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Ordonnances()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ordonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ordonnances', () => {
      const patchObject = Object.assign({}, new Ordonnances());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ordonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 'BBBBBB',
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

    it('should delete a Ordonnances', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrdonnancesToCollectionIfMissing', () => {
      it('should add a Ordonnances to an empty array', () => {
        const ordonnances: IOrdonnances = { id: 123 };
        expectedResult = service.addOrdonnancesToCollectionIfMissing([], ordonnances);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ordonnances);
      });

      it('should not add a Ordonnances to an array that contains it', () => {
        const ordonnances: IOrdonnances = { id: 123 };
        const ordonnancesCollection: IOrdonnances[] = [
          {
            ...ordonnances,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrdonnancesToCollectionIfMissing(ordonnancesCollection, ordonnances);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ordonnances to an array that doesn't contain it", () => {
        const ordonnances: IOrdonnances = { id: 123 };
        const ordonnancesCollection: IOrdonnances[] = [{ id: 456 }];
        expectedResult = service.addOrdonnancesToCollectionIfMissing(ordonnancesCollection, ordonnances);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ordonnances);
      });

      it('should add only unique Ordonnances to an array', () => {
        const ordonnancesArray: IOrdonnances[] = [{ id: 123 }, { id: 456 }, { id: 5046 }];
        const ordonnancesCollection: IOrdonnances[] = [{ id: 123 }];
        expectedResult = service.addOrdonnancesToCollectionIfMissing(ordonnancesCollection, ...ordonnancesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ordonnances: IOrdonnances = { id: 123 };
        const ordonnances2: IOrdonnances = { id: 456 };
        expectedResult = service.addOrdonnancesToCollectionIfMissing([], ordonnances, ordonnances2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ordonnances);
        expect(expectedResult).toContain(ordonnances2);
      });

      it('should accept null and undefined values', () => {
        const ordonnances: IOrdonnances = { id: 123 };
        expectedResult = service.addOrdonnancesToCollectionIfMissing([], null, ordonnances, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ordonnances);
      });

      it('should return initial array if no Ordonnances is added', () => {
        const ordonnancesCollection: IOrdonnances[] = [{ id: 123 }];
        expectedResult = service.addOrdonnancesToCollectionIfMissing(ordonnancesCollection, undefined, null);
        expect(expectedResult).toEqual(ordonnancesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
