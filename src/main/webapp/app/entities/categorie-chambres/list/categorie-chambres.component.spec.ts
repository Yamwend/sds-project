import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CategorieChambresService } from '../service/categorie-chambres.service';

import { CategorieChambresComponent } from './categorie-chambres.component';

describe('CategorieChambres Management Component', () => {
  let comp: CategorieChambresComponent;
  let fixture: ComponentFixture<CategorieChambresComponent>;
  let service: CategorieChambresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CategorieChambresComponent],
    })
      .overrideTemplate(CategorieChambresComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategorieChambresComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CategorieChambresService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
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
    expect(comp.categorieChambres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
