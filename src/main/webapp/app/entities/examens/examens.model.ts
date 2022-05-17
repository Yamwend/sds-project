import dayjs from 'dayjs/esm';
import { IConsultations } from 'app/entities/consultations/consultations.model';
import { ITypeExams } from 'app/entities/type-exams/type-exams.model';
import { ILaboratoires } from 'app/entities/laboratoires/laboratoires.model';

export interface IExamens {
  id?: number;
  nomExamen?: string | null;
  typeExamen?: string | null;
  dateExamen?: dayjs.Dayjs | null;
  demanders?: IConsultations[] | null;
  typeExam?: ITypeExams | null;
  laboratoire?: ILaboratoires | null;
}

export class Examens implements IExamens {
  constructor(
    public id?: number,
    public nomExamen?: string | null,
    public typeExamen?: string | null,
    public dateExamen?: dayjs.Dayjs | null,
    public demanders?: IConsultations[] | null,
    public typeExam?: ITypeExams | null,
    public laboratoire?: ILaboratoires | null
  ) {}
}

export function getExamensIdentifier(examens: IExamens): number | undefined {
  return examens.id;
}
