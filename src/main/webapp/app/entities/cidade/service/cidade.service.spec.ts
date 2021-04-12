import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICidade, Cidade } from '../cidade.model';

import { CidadeService } from './cidade.service';

describe('Service Tests', () => {
  describe('Cidade Service', () => {
    let service: CidadeService;
    let httpMock: HttpTestingController;
    let elemDefault: ICidade;
    let expectedResult: ICidade | ICidade[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CidadeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nomeCidade: 'AAAAAAA',
        uf: 'AAAAAAA',
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

      it('should create a Cidade', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Cidade()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cidade', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nomeCidade: 'BBBBBB',
            uf: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cidade', () => {
        const patchObject = Object.assign({}, new Cidade());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cidade', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nomeCidade: 'BBBBBB',
            uf: 'BBBBBB',
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

      it('should delete a Cidade', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCidadeToCollectionIfMissing', () => {
        it('should add a Cidade to an empty array', () => {
          const cidade: ICidade = { id: 123 };
          expectedResult = service.addCidadeToCollectionIfMissing([], cidade);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cidade);
        });

        it('should not add a Cidade to an array that contains it', () => {
          const cidade: ICidade = { id: 123 };
          const cidadeCollection: ICidade[] = [
            {
              ...cidade,
            },
            { id: 456 },
          ];
          expectedResult = service.addCidadeToCollectionIfMissing(cidadeCollection, cidade);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cidade to an array that doesn't contain it", () => {
          const cidade: ICidade = { id: 123 };
          const cidadeCollection: ICidade[] = [{ id: 456 }];
          expectedResult = service.addCidadeToCollectionIfMissing(cidadeCollection, cidade);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cidade);
        });

        it('should add only unique Cidade to an array', () => {
          const cidadeArray: ICidade[] = [{ id: 123 }, { id: 456 }, { id: 57744 }];
          const cidadeCollection: ICidade[] = [{ id: 123 }];
          expectedResult = service.addCidadeToCollectionIfMissing(cidadeCollection, ...cidadeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cidade: ICidade = { id: 123 };
          const cidade2: ICidade = { id: 456 };
          expectedResult = service.addCidadeToCollectionIfMissing([], cidade, cidade2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cidade);
          expect(expectedResult).toContain(cidade2);
        });

        it('should accept null and undefined values', () => {
          const cidade: ICidade = { id: 123 };
          expectedResult = service.addCidadeToCollectionIfMissing([], null, cidade, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cidade);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
