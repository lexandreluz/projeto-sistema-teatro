import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITeatro, Teatro } from '../teatro.model';

import { TeatroService } from './teatro.service';

describe('Service Tests', () => {
  describe('Teatro Service', () => {
    let service: TeatroService;
    let httpMock: HttpTestingController;
    let elemDefault: ITeatro;
    let expectedResult: ITeatro | ITeatro[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TeatroService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        idTeatro: 0,
        nomeTeatro: 'AAAAAAA',
        endereco: 'AAAAAAA',
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

      it('should create a Teatro', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Teatro()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Teatro', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idTeatro: 1,
            nomeTeatro: 'BBBBBB',
            endereco: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Teatro', () => {
        const patchObject = Object.assign({}, new Teatro());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Teatro', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idTeatro: 1,
            nomeTeatro: 'BBBBBB',
            endereco: 'BBBBBB',
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

      it('should delete a Teatro', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTeatroToCollectionIfMissing', () => {
        it('should add a Teatro to an empty array', () => {
          const teatro: ITeatro = { id: 123 };
          expectedResult = service.addTeatroToCollectionIfMissing([], teatro);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teatro);
        });

        it('should not add a Teatro to an array that contains it', () => {
          const teatro: ITeatro = { id: 123 };
          const teatroCollection: ITeatro[] = [
            {
              ...teatro,
            },
            { id: 456 },
          ];
          expectedResult = service.addTeatroToCollectionIfMissing(teatroCollection, teatro);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Teatro to an array that doesn't contain it", () => {
          const teatro: ITeatro = { id: 123 };
          const teatroCollection: ITeatro[] = [{ id: 456 }];
          expectedResult = service.addTeatroToCollectionIfMissing(teatroCollection, teatro);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teatro);
        });

        it('should add only unique Teatro to an array', () => {
          const teatroArray: ITeatro[] = [{ id: 123 }, { id: 456 }, { id: 77146 }];
          const teatroCollection: ITeatro[] = [{ id: 123 }];
          expectedResult = service.addTeatroToCollectionIfMissing(teatroCollection, ...teatroArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const teatro: ITeatro = { id: 123 };
          const teatro2: ITeatro = { id: 456 };
          expectedResult = service.addTeatroToCollectionIfMissing([], teatro, teatro2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teatro);
          expect(expectedResult).toContain(teatro2);
        });

        it('should accept null and undefined values', () => {
          const teatro: ITeatro = { id: 123 };
          expectedResult = service.addTeatroToCollectionIfMissing([], null, teatro, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teatro);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
