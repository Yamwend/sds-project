import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICategorieChambres, CategorieChambres } from '../categorie-chambres.model';

import { CategorieChambresService } from './categorie-chambres.service';

describe('CategorieChambres Service', () => {
  let service: CategorieChambresService;
  let httpMock: HttpTestingController;
  let elemDefault: ICategorieChambres;
  let expectedResult: ICategorieChambres | ICategorieChambres[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CategorieChambresService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelleCategory: 'AAAAAAA',
      descriptionChambre: 'AAAAAAA',
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

    it('should create a CategorieChambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CategorieChambres()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CategorieChambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleCategory: 'BBBBBB',
          descriptionChambre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CategorieChambres', () => {
      const patchObject = Object.assign(
        {
          libelleCategory: 'BBBBBB',
        },
        new CategorieChambres()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CategorieChambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelleCategory: 'BBBBBB',
          descriptionChambre: 'BBBBBB',
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

    it('should delete a CategorieChambres', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCategorieChambresToCollectionIfMissing', () => {
      it('should add a CategorieChambres to an empty array', () => {
        const categorieChambres: ICategorieChambres = { id: 123 };
        expectedResult = service.addCategorieChambresToCollectionIfMissing([], categorieChambres);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieChambres);
      });

      it('should not add a CategorieChambres to an array that contains it', () => {
        const categorieChambres: ICategorieChambres = { id: 123 };
        const categorieChambresCollection: ICategorieChambres[] = [
          {
            ...categorieChambres,
          },
          { id: 456 },
        ];
        expectedResult = service.addCategorieChambresToCollectionIfMissing(categorieChambresCollection, categorieChambres);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CategorieChambres to an array that doesn't contain it", () => {
        const categorieChambres: ICategorieChambres = { id: 123 };
        const categorieChambresCollection: ICategorieChambres[] = [{ id: 456 }];
        expectedResult = service.addCategorieChambresToCollectionIfMissing(categorieChambresCollection, categorieChambres);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieChambres);
      });

      it('should add only unique CategorieChambres to an array', () => {
        const categorieChambresArray: ICategorieChambres[] = [{ id: 123 }, { id: 456 }, { id: 62 }];
        const categorieChambresCollection: ICategorieChambres[] = [{ id: 123 }];
        expectedResult = service.addCategorieChambresToCollectionIfMissing(categorieChambresCollection, ...categorieChambresArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const categorieChambres: ICategorieChambres = { id: 123 };
        const categorieChambres2: ICategorieChambres = { id: 456 };
        expectedResult = service.addCategorieChambresToCollectionIfMissing([], categorieChambres, categorieChambres2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieChambres);
        expect(expectedResult).toContain(categorieChambres2);
      });

      it('should accept null and undefined values', () => {
        const categorieChambres: ICategorieChambres = { id: 123 };
        expectedResult = service.addCategorieChambresToCollectionIfMissing([], null, categorieChambres, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieChambres);
      });

      it('should return initial array if no CategorieChambres is added', () => {
        const categorieChambresCollection: ICategorieChambres[] = [{ id: 123 }];
        expectedResult = service.addCategorieChambresToCollectionIfMissing(categorieChambresCollection, undefined, null);
        expect(expectedResult).toEqual(categorieChambresCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
