import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILigneOrdonnances, LigneOrdonnances } from '../ligne-ordonnances.model';

import { LigneOrdonnancesService } from './ligne-ordonnances.service';

describe('LigneOrdonnances Service', () => {
  let service: LigneOrdonnancesService;
  let httpMock: HttpTestingController;
  let elemDefault: ILigneOrdonnances;
  let expectedResult: ILigneOrdonnances | ILigneOrdonnances[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LigneOrdonnancesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      medicament: 'AAAAAAA',
      posologie: 'AAAAAAA',
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

    it('should create a LigneOrdonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LigneOrdonnances()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LigneOrdonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          medicament: 'BBBBBB',
          posologie: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LigneOrdonnances', () => {
      const patchObject = Object.assign(
        {
          medicament: 'BBBBBB',
        },
        new LigneOrdonnances()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LigneOrdonnances', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          medicament: 'BBBBBB',
          posologie: 'BBBBBB',
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

    it('should delete a LigneOrdonnances', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLigneOrdonnancesToCollectionIfMissing', () => {
      it('should add a LigneOrdonnances to an empty array', () => {
        const ligneOrdonnances: ILigneOrdonnances = { id: 123 };
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing([], ligneOrdonnances);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ligneOrdonnances);
      });

      it('should not add a LigneOrdonnances to an array that contains it', () => {
        const ligneOrdonnances: ILigneOrdonnances = { id: 123 };
        const ligneOrdonnancesCollection: ILigneOrdonnances[] = [
          {
            ...ligneOrdonnances,
          },
          { id: 456 },
        ];
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing(ligneOrdonnancesCollection, ligneOrdonnances);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LigneOrdonnances to an array that doesn't contain it", () => {
        const ligneOrdonnances: ILigneOrdonnances = { id: 123 };
        const ligneOrdonnancesCollection: ILigneOrdonnances[] = [{ id: 456 }];
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing(ligneOrdonnancesCollection, ligneOrdonnances);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ligneOrdonnances);
      });

      it('should add only unique LigneOrdonnances to an array', () => {
        const ligneOrdonnancesArray: ILigneOrdonnances[] = [{ id: 123 }, { id: 456 }, { id: 79585 }];
        const ligneOrdonnancesCollection: ILigneOrdonnances[] = [{ id: 123 }];
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing(ligneOrdonnancesCollection, ...ligneOrdonnancesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ligneOrdonnances: ILigneOrdonnances = { id: 123 };
        const ligneOrdonnances2: ILigneOrdonnances = { id: 456 };
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing([], ligneOrdonnances, ligneOrdonnances2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ligneOrdonnances);
        expect(expectedResult).toContain(ligneOrdonnances2);
      });

      it('should accept null and undefined values', () => {
        const ligneOrdonnances: ILigneOrdonnances = { id: 123 };
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing([], null, ligneOrdonnances, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ligneOrdonnances);
      });

      it('should return initial array if no LigneOrdonnances is added', () => {
        const ligneOrdonnancesCollection: ILigneOrdonnances[] = [{ id: 123 }];
        expectedResult = service.addLigneOrdonnancesToCollectionIfMissing(ligneOrdonnancesCollection, undefined, null);
        expect(expectedResult).toEqual(ligneOrdonnancesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
