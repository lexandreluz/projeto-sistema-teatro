jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TeatroService } from '../service/teatro.service';

import { TeatroDeleteDialogComponent } from './teatro-delete-dialog.component';

describe('Component Tests', () => {
  describe('Teatro Management Delete Component', () => {
    let comp: TeatroDeleteDialogComponent;
    let fixture: ComponentFixture<TeatroDeleteDialogComponent>;
    let service: TeatroService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeatroDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(TeatroDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeatroDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TeatroService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
