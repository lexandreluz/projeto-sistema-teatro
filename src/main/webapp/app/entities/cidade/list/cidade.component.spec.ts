import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CidadeService } from '../service/cidade.service';

import { CidadeComponent } from './cidade.component';

describe('Component Tests', () => {
  describe('Cidade Management Component', () => {
    let comp: CidadeComponent;
    let fixture: ComponentFixture<CidadeComponent>;
    let service: CidadeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CidadeComponent],
      })
        .overrideTemplate(CidadeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CidadeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CidadeService);

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
      expect(comp.cidades?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
