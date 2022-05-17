jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CategorieChambresService } from '../service/categorie-chambres.service';

import { CategorieChambresDeleteDialogComponent } from './categorie-chambres-delete-dialog.component';

describe('CategorieChambres Management Delete Component', () => {
  let comp: CategorieChambresDeleteDialogComponent;
  let fixture: ComponentFixture<CategorieChambresDeleteDialogComponent>;
  let service: CategorieChambresService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CategorieChambresDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(CategorieChambresDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CategorieChambresDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CategorieChambresService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

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
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
