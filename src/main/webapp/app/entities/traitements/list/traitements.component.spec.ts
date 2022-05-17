import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TraitementsService } from '../service/traitements.service';

import { TraitementsComponent } from './traitements.component';

describe('Traitements Management Component', () => {
  let comp: TraitementsComponent;
  let fixture: ComponentFixture<TraitementsComponent>;
  let service: TraitementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TraitementsComponent],
    })
      .overrideTemplate(TraitementsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TraitementsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TraitementsService);

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
    expect(comp.traitements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
