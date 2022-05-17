import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExamensService } from '../service/examens.service';

import { ExamensComponent } from './examens.component';

describe('Examens Management Component', () => {
  let comp: ExamensComponent;
  let fixture: ComponentFixture<ExamensComponent>;
  let service: ExamensService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExamensComponent],
    })
      .overrideTemplate(ExamensComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamensComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExamensService);

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
    expect(comp.examens?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
