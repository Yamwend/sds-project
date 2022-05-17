import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IHospitalisations, Hospitalisations } from '../hospitalisations.model';
import { HospitalisationsService } from '../service/hospitalisations.service';

import { HospitalisationsRoutingResolveService } from './hospitalisations-routing-resolve.service';

describe('Hospitalisations routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HospitalisationsRoutingResolveService;
  let service: HospitalisationsService;
  let resultHospitalisations: IHospitalisations | undefined;

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
    routingResolveService = TestBed.inject(HospitalisationsRoutingResolveService);
    service = TestBed.inject(HospitalisationsService);
    resultHospitalisations = undefined;
  });

  describe('resolve', () => {
    it('should return IHospitalisations returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHospitalisations = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHospitalisations).toEqual({ id: 123 });
    });

    it('should return new IHospitalisations if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHospitalisations = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHospitalisations).toEqual(new Hospitalisations());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Hospitalisations })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHospitalisations = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHospitalisations).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
