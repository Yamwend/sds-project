import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFamilleMaladies, FamilleMaladies } from '../famille-maladies.model';

import { FamilleMaladiesService } from './famille-maladies.service';

describe('FamilleMaladies Service', () => {
  let service: FamilleMaladiesService;
  let httpMock: HttpTestingController;
  let elemDefault: IFamilleMaladies;
  let expectedResult: IFamilleMaladies | IFamilleMaladies[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FamilleMaladiesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelleFMaladie: 'AAAAAAA',
      descriptionFMaladie: 'AAAAAAA',
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

    it('should create a FamilleMaladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FamilleMaladies()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FamilleMaladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleFMaladie: 'BBBBBB',
          descriptionFMaladie: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FamilleMaladies', () => {
      const patchObject = Object.assign({}, new FamilleMaladies());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FamilleMaladies', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleFMaladie: 'BBBBBB',
          descriptionFMaladie: 'BBBBBB',
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

    it('should delete a FamilleMaladies', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFamilleMaladiesToCollectionIfMissing', () => {
      it('should add a FamilleMaladies to an empty array', () => {
        const familleMaladies: IFamilleMaladies = { id: 123 };
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing([], familleMaladies);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familleMaladies);
      });

      it('should not add a FamilleMaladies to an array that contains it', () => {
        const familleMaladies: IFamilleMaladies = { id: 123 };
        const familleMaladiesCollection: IFamilleMaladies[] = [
          {
            ...familleMaladies,
          },
          { id: 456 },
        ];
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing(familleMaladiesCollection, familleMaladies);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FamilleMaladies to an array that doesn't contain it", () => {
        const familleMaladies: IFamilleMaladies = { id: 123 };
        const familleMaladiesCollection: IFamilleMaladies[] = [{ id: 456 }];
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing(familleMaladiesCollection, familleMaladies);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familleMaladies);
      });

      it('should add only unique FamilleMaladies to an array', () => {
        const familleMaladiesArray: IFamilleMaladies[] = [{ id: 123 }, { id: 456 }, { id: 5115 }];
        const familleMaladiesCollection: IFamilleMaladies[] = [{ id: 123 }];
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing(familleMaladiesCollection, ...familleMaladiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const familleMaladies: IFamilleMaladies = { id: 123 };
        const familleMaladies2: IFamilleMaladies = { id: 456 };
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing([], familleMaladies, familleMaladies2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familleMaladies);
        expect(expectedResult).toContain(familleMaladies2);
      });

      it('should accept null and undefined values', () => {
        const familleMaladies: IFamilleMaladies = { id: 123 };
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing([], null, familleMaladies, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familleMaladies);
      });

      it('should return initial array if no FamilleMaladies is added', () => {
        const familleMaladiesCollection: IFamilleMaladies[] = [{ id: 123 }];
        expectedResult = service.addFamilleMaladiesToCollectionIfMissing(familleMaladiesCollection, undefined, null);
        expect(expectedResult).toEqual(familleMaladiesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
