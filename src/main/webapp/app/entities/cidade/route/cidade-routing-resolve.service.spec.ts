jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICidade, Cidade } from '../cidade.model';
import { CidadeService } from '../service/cidade.service';

import { CidadeRoutingResolveService } from './cidade-routing-resolve.service';

describe('Service Tests', () => {
  describe('Cidade routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CidadeRoutingResolveService;
    let service: CidadeService;
    let resultCidade: ICidade | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CidadeRoutingResolveService);
      service = TestBed.inject(CidadeService);
      resultCidade = undefined;
    });

    describe('resolve', () => {
      it('should return ICidade returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCidade = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCidade).toEqual({ id: 123 });
      });

      it('should return new ICidade if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCidade = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCidade).toEqual(new Cidade());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCidade = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCidade).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
