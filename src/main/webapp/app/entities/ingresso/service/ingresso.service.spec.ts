import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IIngresso, Ingresso } from '../ingresso.model';

import { IngressoService } from './ingresso.service';

describe('Service Tests', () => {
  describe('Ingresso Service', () => {
    let service: IngressoService;
    let httpMock: HttpTestingController;
    let elemDefault: IIngresso;
    let expectedResult: IIngresso | IIngresso[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(IngressoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idIngresso: 0,
        dataCompra: currentDate,
        valor: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataCompra: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ingresso', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataCompra: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCompra: currentDate,
          },
          returnedFromService
        );

        service.create(new Ingresso()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ingresso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idIngresso: 1,
            dataCompra: currentDate.format(DATE_TIME_FORMAT),
            valor: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCompra: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ingresso', () => {
        const patchObject = Object.assign(
          {
            idIngresso: 1,
            valor: 1,
          },
          new Ingresso()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dataCompra: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ingresso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idIngresso: 1,
            dataCompra: currentDate.format(DATE_TIME_FORMAT),
            valor: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataCompra: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Ingresso', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addIngressoToCollectionIfMissing', () => {
        it('should add a Ingresso to an empty array', () => {
          const ingresso: IIngresso = { id: 123 };
          expectedResult = service.addIngressoToCollectionIfMissing([], ingresso);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ingresso);
        });

        it('should not add a Ingresso to an array that contains it', () => {
          const ingresso: IIngresso = { id: 123 };
          const ingressoCollection: IIngresso[] = [
            {
              ...ingresso,
            },
            { id: 456 },
          ];
          expectedResult = service.addIngressoToCollectionIfMissing(ingressoCollection, ingresso);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ingresso to an array that doesn't contain it", () => {
          const ingresso: IIngresso = { id: 123 };
          const ingressoCollection: IIngresso[] = [{ id: 456 }];
          expectedResult = service.addIngressoToCollectionIfMissing(ingressoCollection, ingresso);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ingresso);
        });

        it('should add only unique Ingresso to an array', () => {
          const ingressoArray: IIngresso[] = [{ id: 123 }, { id: 456 }, { id: 16762 }];
          const ingressoCollection: IIngresso[] = [{ id: 123 }];
          expectedResult = service.addIngressoToCollectionIfMissing(ingressoCollection, ...ingressoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ingresso: IIngresso = { id: 123 };
          const ingresso2: IIngresso = { id: 456 };
          expectedResult = service.addIngressoToCollectionIfMissing([], ingresso, ingresso2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ingresso);
          expect(expectedResult).toContain(ingresso2);
        });

        it('should accept null and undefined values', () => {
          const ingresso: IIngresso = { id: 123 };
          expectedResult = service.addIngressoToCollectionIfMissing([], null, ingresso, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ingresso);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
