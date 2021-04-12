import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAssento, Assento } from '../assento.model';

import { AssentoService } from './assento.service';

describe('Service Tests', () => {
  describe('Assento Service', () => {
    let service: AssentoService;
    let httpMock: HttpTestingController;
    let elemDefault: IAssento;
    let expectedResult: IAssento | IAssento[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AssentoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        numeracao: 0,
        status: false,
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

      it('should create a Assento', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Assento()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Assento', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            numeracao: 1,
            status: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Assento', () => {
        const patchObject = Object.assign(
          {
            numeracao: 1,
          },
          new Assento()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Assento', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            numeracao: 1,
            status: true,
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

      it('should delete a Assento', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAssentoToCollectionIfMissing', () => {
        it('should add a Assento to an empty array', () => {
          const assento: IAssento = { id: 123 };
          expectedResult = service.addAssentoToCollectionIfMissing([], assento);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(assento);
        });

        it('should not add a Assento to an array that contains it', () => {
          const assento: IAssento = { id: 123 };
          const assentoCollection: IAssento[] = [
            {
              ...assento,
            },
            { id: 456 },
          ];
          expectedResult = service.addAssentoToCollectionIfMissing(assentoCollection, assento);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Assento to an array that doesn't contain it", () => {
          const assento: IAssento = { id: 123 };
          const assentoCollection: IAssento[] = [{ id: 456 }];
          expectedResult = service.addAssentoToCollectionIfMissing(assentoCollection, assento);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(assento);
        });

        it('should add only unique Assento to an array', () => {
          const assentoArray: IAssento[] = [{ id: 123 }, { id: 456 }, { id: 11024 }];
          const assentoCollection: IAssento[] = [{ id: 123 }];
          expectedResult = service.addAssentoToCollectionIfMissing(assentoCollection, ...assentoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const assento: IAssento = { id: 123 };
          const assento2: IAssento = { id: 456 };
          expectedResult = service.addAssentoToCollectionIfMissing([], assento, assento2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(assento);
          expect(expectedResult).toContain(assento2);
        });

        it('should accept null and undefined values', () => {
          const assento: IAssento = { id: 123 };
          expectedResult = service.addAssentoToCollectionIfMissing([], null, assento, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(assento);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
