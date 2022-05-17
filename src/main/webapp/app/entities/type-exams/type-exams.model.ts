import { IExamens } from 'app/entities/examens/examens.model';

export interface ITypeExams {
  id?: number;
  libelleType?: string | null;
  descruptionType?: string | null;
  types?: IExamens[] | null;
}

export class TypeExams implements ITypeExams {
  constructor(
    public id?: number,
    public libelleType?: string | null,
    public descruptionType?: string | null,
    public types?: IExamens[] | null
  ) {}
}

export function getTypeExamsIdentifier(typeExams: ITypeExams): number | undefined {
  return typeExams.id;
}
