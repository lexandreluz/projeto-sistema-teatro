jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITeatro, Teatro } from '../teatro.model';
import { TeatroService } from '../service/teatro.service';

import { TeatroRoutingResolveService } from './teatro-routing-resolve.service';

describe('Service Tests', () => {
  describe('Teatro routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TeatroRoutingResolveService;
    let service: TeatroService;
    let resultTeatro: ITeatro | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TeatroRoutingResolveService);
      service = TestBed.inject(TeatroService);
      resultTeatro = undefined;
    });

    describe('resolve', () => {
      it('should return ITeatro returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeatro = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeatro).toEqual({ id: 123 });
      });

      it('should return new ITeatro if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeatro = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTeatro).toEqual(new Teatro());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeatro = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeatro).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
