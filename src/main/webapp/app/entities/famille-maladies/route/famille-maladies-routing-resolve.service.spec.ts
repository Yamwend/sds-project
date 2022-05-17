import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFamilleMaladies, FamilleMaladies } from '../famille-maladies.model';
import { FamilleMaladiesService } from '../service/famille-maladies.service';

import { FamilleMaladiesRoutingResolveService } from './famille-maladies-routing-resolve.service';

describe('FamilleMaladies routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FamilleMaladiesRoutingResolveService;
  let service: FamilleMaladiesService;
  let resultFamilleMaladies: IFamilleMaladies | undefined;

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
    routingResolveService = TestBed.inject(FamilleMaladiesRoutingResolveService);
    service = TestBed.inject(FamilleMaladiesService);
    resultFamilleMaladies = undefined;
  });

  describe('resolve', () => {
    it('should return IFamilleMaladies returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilleMaladies = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFamilleMaladies).toEqual({ id: 123 });
    });

    it('should return new IFamilleMaladies if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilleMaladies = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFamilleMaladies).toEqual(new FamilleMaladies());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FamilleMaladies })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilleMaladies = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFamilleMaladies).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
