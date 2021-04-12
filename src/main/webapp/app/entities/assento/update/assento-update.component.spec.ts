jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AssentoService } from '../service/assento.service';
import { IAssento, Assento } from '../assento.model';
import { ITeatro } from 'app/entities/teatro/teatro.model';
import { TeatroService } from 'app/entities/teatro/service/teatro.service';

import { AssentoUpdateComponent } from './assento-update.component';

describe('Component Tests', () => {
  describe('Assento Management Update Component', () => {
    let comp: AssentoUpdateComponent;
    let fixture: ComponentFixture<AssentoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let assentoService: AssentoService;
    let teatroService: TeatroService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AssentoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AssentoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AssentoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      assentoService = TestBed.inject(AssentoService);
      teatroService = TestBed.inject(TeatroService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Teatro query and add missing value', () => {
        const assento: IAssento = { id: 456 };
        const teatro: ITeatro = { id: 83269 };
        assento.teatro = teatro;

        const teatroCollection: ITeatro[] = [{ id: 96990 }];
        spyOn(teatroService, 'query').and.returnValue(of(new HttpResponse({ body: teatroCollection })));
        const additionalTeatros = [teatro];
        const expectedCollection: ITeatro[] = [...additionalTeatros, ...teatroCollection];
        spyOn(teatroService, 'addTeatroToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ assento });
        comp.ngOnInit();

        expect(teatroService.query).toHaveBeenCalled();
        expect(teatroService.addTeatroToCollectionIfMissing).toHaveBeenCalledWith(teatroCollection, ...additionalTeatros);
        expect(comp.teatrosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const assento: IAssento = { id: 456 };
        const teatro: ITeatro = { id: 26033 };
        assento.teatro = teatro;

        activatedRoute.data = of({ assento });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(assento));
        expect(comp.teatrosSharedCollection).toContain(teatro);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const assento = { id: 123 };
        spyOn(assentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ assento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: assento }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(assentoService.update).toHaveBeenCalledWith(assento);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const assento = new Assento();
        spyOn(assentoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ assento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: assento }));
        saveSubject.complete();

        // THEN
        expect(assentoService.create).toHaveBeenCalledWith(assento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const assento = { id: 123 };
        spyOn(assentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ assento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(assentoService.update).toHaveBeenCalledWith(assento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTeatroById', () => {
        it('Should return tracked Teatro primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTeatroById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
