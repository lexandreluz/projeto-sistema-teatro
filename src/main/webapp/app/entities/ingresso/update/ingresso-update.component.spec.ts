jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IngressoService } from '../service/ingresso.service';
import { IIngresso, Ingresso } from '../ingresso.model';
import { IEvento } from 'app/entities/evento/evento.model';
import { EventoService } from 'app/entities/evento/service/evento.service';

import { IngressoUpdateComponent } from './ingresso-update.component';

describe('Component Tests', () => {
  describe('Ingresso Management Update Component', () => {
    let comp: IngressoUpdateComponent;
    let fixture: ComponentFixture<IngressoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ingressoService: IngressoService;
    let eventoService: EventoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IngressoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(IngressoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IngressoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ingressoService = TestBed.inject(IngressoService);
      eventoService = TestBed.inject(EventoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Evento query and add missing value', () => {
        const ingresso: IIngresso = { id: 456 };
        const evento: IEvento = { id: 73962 };
        ingresso.evento = evento;

        const eventoCollection: IEvento[] = [{ id: 43952 }];
        spyOn(eventoService, 'query').and.returnValue(of(new HttpResponse({ body: eventoCollection })));
        const additionalEventos = [evento];
        const expectedCollection: IEvento[] = [...additionalEventos, ...eventoCollection];
        spyOn(eventoService, 'addEventoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ingresso });
        comp.ngOnInit();

        expect(eventoService.query).toHaveBeenCalled();
        expect(eventoService.addEventoToCollectionIfMissing).toHaveBeenCalledWith(eventoCollection, ...additionalEventos);
        expect(comp.eventosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ingresso: IIngresso = { id: 456 };
        const evento: IEvento = { id: 94618 };
        ingresso.evento = evento;

        activatedRoute.data = of({ ingresso });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ingresso));
        expect(comp.eventosSharedCollection).toContain(evento);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingresso = { id: 123 };
        spyOn(ingressoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingresso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ingresso }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ingressoService.update).toHaveBeenCalledWith(ingresso);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingresso = new Ingresso();
        spyOn(ingressoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingresso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ingresso }));
        saveSubject.complete();

        // THEN
        expect(ingressoService.create).toHaveBeenCalledWith(ingresso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingresso = { id: 123 };
        spyOn(ingressoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingresso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ingressoService.update).toHaveBeenCalledWith(ingresso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEventoById', () => {
        it('Should return tracked Evento primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEventoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
