jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EventoService } from '../service/evento.service';
import { IEvento, Evento } from '../evento.model';
import { ITeatro } from 'app/entities/teatro/teatro.model';
import { TeatroService } from 'app/entities/teatro/service/teatro.service';

import { EventoUpdateComponent } from './evento-update.component';

describe('Component Tests', () => {
  describe('Evento Management Update Component', () => {
    let comp: EventoUpdateComponent;
    let fixture: ComponentFixture<EventoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let eventoService: EventoService;
    let teatroService: TeatroService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EventoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EventoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EventoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      eventoService = TestBed.inject(EventoService);
      teatroService = TestBed.inject(TeatroService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Teatro query and add missing value', () => {
        const evento: IEvento = { id: 456 };
        const teatro: ITeatro = { id: 86738 };
        evento.teatro = teatro;

        const teatroCollection: ITeatro[] = [{ id: 69602 }];
        spyOn(teatroService, 'query').and.returnValue(of(new HttpResponse({ body: teatroCollection })));
        const additionalTeatros = [teatro];
        const expectedCollection: ITeatro[] = [...additionalTeatros, ...teatroCollection];
        spyOn(teatroService, 'addTeatroToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ evento });
        comp.ngOnInit();

        expect(teatroService.query).toHaveBeenCalled();
        expect(teatroService.addTeatroToCollectionIfMissing).toHaveBeenCalledWith(teatroCollection, ...additionalTeatros);
        expect(comp.teatrosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const evento: IEvento = { id: 456 };
        const teatro: ITeatro = { id: 20720 };
        evento.teatro = teatro;

        activatedRoute.data = of({ evento });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(evento));
        expect(comp.teatrosSharedCollection).toContain(teatro);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const evento = { id: 123 };
        spyOn(eventoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ evento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: evento }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(eventoService.update).toHaveBeenCalledWith(evento);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const evento = new Evento();
        spyOn(eventoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ evento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: evento }));
        saveSubject.complete();

        // THEN
        expect(eventoService.create).toHaveBeenCalledWith(evento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const evento = { id: 123 };
        spyOn(eventoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ evento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(eventoService.update).toHaveBeenCalledWith(evento);
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
