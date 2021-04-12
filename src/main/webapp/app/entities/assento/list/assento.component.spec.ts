import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AssentoService } from '../service/assento.service';

import { AssentoComponent } from './assento.component';

describe('Component Tests', () => {
  describe('Assento Management Component', () => {
    let comp: AssentoComponent;
    let fixture: ComponentFixture<AssentoComponent>;
    let service: AssentoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AssentoComponent],
      })
        .overrideTemplate(AssentoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AssentoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AssentoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.assentos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
