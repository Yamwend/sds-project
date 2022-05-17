import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMaladies, Maladies } from '../maladies.model';

import { MaladiesService } from './maladies.service';

describe('Maladies Service', () => {
  let service: MaladiesService;
  let httpMock: HttpTestingController;
  let elemDefault: IMaladies;
  let expectedResult: IMaladies | IMaladies[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MaladiesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nomMaladie: 'AAAAAAA',
      familleMaladie: 'AAAAAAA',
      descriptionMaladie: 'AAAAAAA',
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

    it('should create a Maladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Maladies()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Maladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomMaladie: 'BBBBBB',
          familleMaladie: 'BBBBBB',
          descriptionMaladie: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Maladies', () => {
      const patchObject = Object.assign(
        {
          familleMaladie: 'BBBBBB',
        },
        new Maladies()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Maladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomMaladie: 'BBBBBB',
          familleMaladie: 'BBBBBB',
          descriptionMaladie: 'BBBBBB',
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

    it('should delete a Maladies', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMaladiesToCollectionIfMissing', () => {
      it('should add a Maladies to an empty array', () => {
        const maladies: IMaladies = { id: 123 };
        expectedResult = service.addMaladiesToCollectionIfMissing([], maladies);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(maladies);
      });

      it('should not add a Maladies to an array that contains it', () => {
        const maladies: IMaladies = { id: 123 };
        const maladiesCollection: IMaladies[] = [
          {
            ...maladies,
          },
          { id: 456 },
        ];
        expectedResult = service.addMaladiesToCollectionIfMissing(maladiesCollection, maladies);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Maladies to an array that doesn't contain it", () => {
        const maladies: IMaladies = { id: 123 };
        const maladiesCollection: IMaladies[] = [{ id: 456 }];
        expectedResult = service.addMaladiesToCollectionIfMissing(maladiesCollection, maladies);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(maladies);
      });

      it('should add only unique Maladies to an array', () => {
        const maladiesArray: IMaladies[] = [{ id: 123 }, { id: 456 }, { id: 37464 }];
        const maladiesCollection: IMaladies[] = [{ id: 123 }];
        expectedResult = service.addMaladiesToCollectionIfMissing(maladiesCollection, ...maladiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const maladies: IMaladies = { id: 123 };
        const maladies2: IMaladies = { id: 456 };
        expectedResult = service.addMaladiesToCollectionIfMissing([], maladies, maladies2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(maladies);
        expect(expectedResult).toContain(maladies2);
      });

      it('should accept null and undefined values', () => {
        const maladies: IMaladies = { id: 123 };
        expectedResult = service.addMaladiesToCollectionIfMissing([], null, maladies, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(maladies);
      });

      it('should return initial array if no Maladies is added', () => {
        const maladiesCollection: IMaladies[] = [{ id: 123 }];
        expectedResult = service.addMaladiesToCollectionIfMissing(maladiesCollection, undefined, null);
        expect(expectedResult).toEqual(maladiesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
