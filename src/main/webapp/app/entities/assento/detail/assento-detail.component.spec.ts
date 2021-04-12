import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AssentoDetailComponent } from './assento-detail.component';

describe('Component Tests', () => {
  describe('Assento Management Detail Component', () => {
    let comp: AssentoDetailComponent;
    let fixture: ComponentFixture<AssentoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AssentoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ assento: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AssentoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AssentoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load assento on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.assento).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
