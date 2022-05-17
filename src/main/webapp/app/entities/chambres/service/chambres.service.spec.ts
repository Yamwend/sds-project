import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChambres, Chambres } from '../chambres.model';

import { ChambresService } from './chambres.service';

describe('Chambres Service', () => {
  let service: ChambresService;
  let httpMock: HttpTestingController;
  let elemDefault: IChambres;
  let expectedResult: IChambres | IChambres[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChambresService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numeroChambre: 'AAAAAAA',
      localisationChambre: 'AAAAAAA',
      nombrebLit: 0,
      prixChambre: 0,
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

    it('should create a Chambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Chambres()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroChambre: 'BBBBBB',
          localisationChambre: 'BBBBBB',
          nombrebLit: 1,
          prixChambre: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chambres', () => {
      const patchObject = Object.assign(
        {
          numeroChambre: 'BBBBBB',
          nombrebLit: 1,
        },
        new Chambres()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chambres', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroChambre: 'BBBBBB',
          localisationChambre: 'BBBBBB',
          nombrebLit: 1,
          prixChambre: 1,
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

    it('should delete a Chambres', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChambresToCollectionIfMissing', () => {
      it('should add a Chambres to an empty array', () => {
        const chambres: IChambres = { id: 123 };
        expectedResult = service.addChambresToCollectionIfMissing([], chambres);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chambres);
      });

      it('should not add a Chambres to an array that contains it', () => {
        const chambres: IChambres = { id: 123 };
        const chambresCollection: IChambres[] = [
          {
            ...chambres,
          },
          { id: 456 },
        ];
        expectedResult = service.addChambresToCollectionIfMissing(chambresCollection, chambres);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chambres to an array that doesn't contain it", () => {
        const chambres: IChambres = { id: 123 };
        const chambresCollection: IChambres[] = [{ id: 456 }];
        expectedResult = service.addChambresToCollectionIfMissing(chambresCollection, chambres);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chambres);
      });

      it('should add only unique Chambres to an array', () => {
        const chambresArray: IChambres[] = [{ id: 123 }, { id: 456 }, { id: 9934 }];
        const chambresCollection: IChambres[] = [{ id: 123 }];
        expectedResult = service.addChambresToCollectionIfMissing(chambresCollection, ...chambresArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chambres: IChambres = { id: 123 };
        const chambres2: IChambres = { id: 456 };
        expectedResult = service.addChambresToCollectionIfMissing([], chambres, chambres2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chambres);
        expect(expectedResult).toContain(chambres2);
      });

      it('should accept null and undefined values', () => {
        const chambres: IChambres = { id: 123 };
        expectedResult = service.addChambresToCollectionIfMissing([], null, chambres, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chambres);
      });

      it('should return initial array if no Chambres is added', () => {
        const chambresCollection: IChambres[] = [{ id: 123 }];
        expectedResult = service.addChambresToCollectionIfMissing(chambresCollection, undefined, null);
        expect(expectedResult).toEqual(chambresCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
