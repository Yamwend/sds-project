import { IExamens } from 'app/entities/examens/examens.model';

export interface ILaboratoires {
  id?: number;
  nomLaboratoire?: string | null;
  observationsExamens?: string | null;
  faireExams?: IExamens[] | null;
}

export class Laboratoires implements ILaboratoires {
  constructor(
    public id?: number,
    public nomLaboratoire?: string | null,
    public observationsExamens?: string | null,
    public faireExams?: IExamens[] | null
  ) {}
}

export function getLaboratoiresIdentifier(laboratoires: ILaboratoires): number | undefined {
  return laboratoires.id;
}
