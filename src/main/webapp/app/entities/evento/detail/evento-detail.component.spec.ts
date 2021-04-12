import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EventoDetailComponent } from './evento-detail.component';

describe('Component Tests', () => {
  describe('Evento Management Detail Component', () => {
    let comp: EventoDetailComponent;
    let fixture: ComponentFixture<EventoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EventoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ evento: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EventoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EventoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load evento on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.evento).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
