jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TeatroService } from '../service/teatro.service';
import { ITeatro, Teatro } from '../teatro.model';
import { ICidade } from 'app/entities/cidade/cidade.model';
import { CidadeService } from 'app/entities/cidade/service/cidade.service';

import { TeatroUpdateComponent } from './teatro-update.component';

describe('Component Tests', () => {
  describe('Teatro Management Update Component', () => {
    let comp: TeatroUpdateComponent;
    let fixture: ComponentFixture<TeatroUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let teatroService: TeatroService;
    let cidadeService: CidadeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeatroUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TeatroUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeatroUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      teatroService = TestBed.inject(TeatroService);
      cidadeService = TestBed.inject(CidadeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Cidade query and add missing value', () => {
        const teatro: ITeatro = { id: 456 };
        const cidade: ICidade = { id: 2660 };
        teatro.cidade = cidade;

        const cidadeCollection: ICidade[] = [{ id: 10713 }];
        spyOn(cidadeService, 'query').and.returnValue(of(new HttpResponse({ body: cidadeCollection })));
        const additionalCidades = [cidade];
        const expectedCollection: ICidade[] = [...additionalCidades, ...cidadeCollection];
        spyOn(cidadeService, 'addCidadeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ teatro });
        comp.ngOnInit();

        expect(cidadeService.query).toHaveBeenCalled();
        expect(cidadeService.addCidadeToCollectionIfMissing).toHaveBeenCalledWith(cidadeCollection, ...additionalCidades);
        expect(comp.cidadesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const teatro: ITeatro = { id: 456 };
        const cidade: ICidade = { id: 21623 };
        teatro.cidade = cidade;

        activatedRoute.data = of({ teatro });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(teatro));
        expect(comp.cidadesSharedCollection).toContain(cidade);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const teatro = { id: 123 };
        spyOn(teatroService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ teatro });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teatro }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(teatroService.update).toHaveBeenCalledWith(teatro);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const teatro = new Teatro();
        spyOn(teatroService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ teatro });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teatro }));
        saveSubject.complete();

        // THEN
        expect(teatroService.create).toHaveBeenCalledWith(teatro);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const teatro = { id: 123 };
        spyOn(teatroService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ teatro });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(teatroService.update).toHaveBeenCalledWith(teatro);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCidadeById', () => {
        it('Should return tracked Cidade primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCidadeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
