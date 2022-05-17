import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChambresService } from '../service/chambres.service';

import { ChambresComponent } from './chambres.component';

describe('Chambres Management Component', () => {
  let comp: ChambresComponent;
  let fixture: ComponentFixture<ChambresComponent>;
  let service: ChambresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChambresComponent],
    })
      .overrideTemplate(ChambresComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChambresComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChambresService);

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
    expect(comp.chambres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
