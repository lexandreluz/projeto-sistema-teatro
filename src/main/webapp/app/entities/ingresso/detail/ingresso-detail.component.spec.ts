import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IngressoDetailComponent } from './ingresso-detail.component';

describe('Component Tests', () => {
  describe('Ingresso Management Detail Component', () => {
    let comp: IngressoDetailComponent;
    let fixture: ComponentFixture<IngressoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [IngressoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ ingresso: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(IngressoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(IngressoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ingresso on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ingresso).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
