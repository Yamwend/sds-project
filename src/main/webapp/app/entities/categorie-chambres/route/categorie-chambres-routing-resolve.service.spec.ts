import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICategorieChambres, CategorieChambres } from '../categorie-chambres.model';
import { CategorieChambresService } from '../service/categorie-chambres.service';

import { CategorieChambresRoutingResolveService } from './categorie-chambres-routing-resolve.service';

describe('CategorieChambres routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CategorieChambresRoutingResolveService;
  let service: CategorieChambresService;
  let resultCategorieChambres: ICategorieChambres | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(CategorieChambresRoutingResolveService);
    service = TestBed.inject(CategorieChambresService);
    resultCategorieChambres = undefined;
  });

  describe('resolve', () => {
    it('should return ICategorieChambres returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieChambres = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategorieChambres).toEqual({ id: 123 });
    });

    it('should return new ICategorieChambres if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieChambres = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCategorieChambres).toEqual(new CategorieChambres());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CategorieChambres })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategorieChambres = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategorieChambres).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
