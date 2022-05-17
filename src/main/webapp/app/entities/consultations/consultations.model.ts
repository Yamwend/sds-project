import dayjs from 'dayjs/esm';
import { IPatients } from 'app/entities/patients/patients.model';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';
import { IExamens } from 'app/entities/examens/examens.model';
import { TypeConsultation } from 'app/entities/enumerations/type-consultation.model';

export interface IConsultations {
  id?: number;
  typeConsultation?: TypeConsultation | null;
  observationsConsltation?: string | null;
  fraisConsultion?: number | null;
  dateConsultion?: dayjs.Dayjs | null;
  patient?: IPatients | null;
  personnel?: IPersonnelSoignants | null;
  examen?: IExamens | null;
}

export class Consultations implements IConsultations {
  constructor(
    public id?: number,
    public typeConsultation?: TypeConsultation | null,
    public observationsConsltation?: string | null,
    public fraisConsultion?: number | null,
    public dateConsultion?: dayjs.Dayjs | null,
    public patient?: IPatients | null,
    public personnel?: IPersonnelSoignants | null,
    public examen?: IExamens | null
  ) {}
}

export function getConsultationsIdentifier(consultations: IConsultations): number | undefined {
  return consultations.id;
}
