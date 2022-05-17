import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILaboratoires, Laboratoires } from '../laboratoires.model';

import { LaboratoiresService } from './laboratoires.service';

describe('Laboratoires Service', () => {
  let service: LaboratoiresService;
  let httpMock: HttpTestingController;
  let elemDefault: ILaboratoires;
  let expectedResult: ILaboratoires | ILaboratoires[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LaboratoiresService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nomLaboratoire: 'AAAAAAA',
      observationsExamens: 'AAAAAAA',
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

    it('should create a Laboratoires', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Laboratoires()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Laboratoires', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomLaboratoire: 'BBBBBB',
          observationsExamens: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Laboratoires', () => {
      const patchObject = Object.assign(
        {
          nomLaboratoire: 'BBBBBB',
        },
        new Laboratoires()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Laboratoires', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nomLaboratoire: 'BBBBBB',
          observationsExamens: 'BBBBBB',
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

    it('should delete a Laboratoires', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLaboratoiresToCollectionIfMissing', () => {
      it('should add a Laboratoires to an empty array', () => {
        const laboratoires: ILaboratoires = { id: 123 };
        expectedResult = service.addLaboratoiresToCollectionIfMissing([], laboratoires);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoires);
      });

      it('should not add a Laboratoires to an array that contains it', () => {
        const laboratoires: ILaboratoires = { id: 123 };
        const laboratoiresCollection: ILaboratoires[] = [
          {
            ...laboratoires,
          },
          { id: 456 },
        ];
        expectedResult = service.addLaboratoiresToCollectionIfMissing(laboratoiresCollection, laboratoires);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Laboratoires to an array that doesn't contain it", () => {
        const laboratoires: ILaboratoires = { id: 123 };
        const laboratoiresCollection: ILaboratoires[] = [{ id: 456 }];
        expectedResult = service.addLaboratoiresToCollectionIfMissing(laboratoiresCollection, laboratoires);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoires);
      });

      it('should add only unique Laboratoires to an array', () => {
        const laboratoiresArray: ILaboratoires[] = [{ id: 123 }, { id: 456 }, { id: 34246 }];
        const laboratoiresCollection: ILaboratoires[] = [{ id: 123 }];
        expectedResult = service.addLaboratoiresToCollectionIfMissing(laboratoiresCollection, ...laboratoiresArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const laboratoires: ILaboratoires = { id: 123 };
        const laboratoires2: ILaboratoires = { id: 456 };
        expectedResult = service.addLaboratoiresToCollectionIfMissing([], laboratoires, laboratoires2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(laboratoires);
        expect(expectedResult).toContain(laboratoires2);
      });

      it('should accept null and undefined values', () => {
        const laboratoires: ILaboratoires = { id: 123 };
        expectedResult = service.addLaboratoiresToCollectionIfMissing([], null, laboratoires, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(laboratoires);
      });

      it('should return initial array if no Laboratoires is added', () => {
        const laboratoiresCollection: ILaboratoires[] = [{ id: 123 }];
        expectedResult = service.addLaboratoiresToCollectionIfMissing(laboratoiresCollection, undefined, null);
        expect(expectedResult).toEqual(laboratoiresCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
