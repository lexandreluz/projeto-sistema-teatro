import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TeatroDetailComponent } from './teatro-detail.component';

describe('Component Tests', () => {
  describe('Teatro Management Detail Component', () => {
    let comp: TeatroDetailComponent;
    let fixture: ComponentFixture<TeatroDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TeatroDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ teatro: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TeatroDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeatroDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load teatro on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.teatro).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
