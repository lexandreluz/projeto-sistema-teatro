import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CidadeDetailComponent } from './cidade-detail.component';

describe('Component Tests', () => {
  describe('Cidade Management Detail Component', () => {
    let comp: CidadeDetailComponent;
    let fixture: ComponentFixture<CidadeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CidadeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cidade: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CidadeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CidadeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cidade on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cidade).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
