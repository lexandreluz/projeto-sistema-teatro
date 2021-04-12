jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEvento, Evento } from '../evento.model';
import { EventoService } from '../service/evento.service';

import { EventoRoutingResolveService } from './evento-routing-resolve.service';

describe('Service Tests', () => {
  describe('Evento routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EventoRoutingResolveService;
    let service: EventoService;
    let resultEvento: IEvento | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EventoRoutingResolveService);
      service = TestBed.inject(EventoService);
      resultEvento = undefined;
    });

    describe('resolve', () => {
      it('should return IEvento returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEvento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEvento).toEqual({ id: 123 });
      });

      it('should return new IEvento if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEvento = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEvento).toEqual(new Evento());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEvento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEvento).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
