import dayjs from 'dayjs/esm';
import { IChambres } from 'app/entities/chambres/chambres.model';
import { IPatients } from 'app/entities/patients/patients.model';

export interface IHospitalisations {
  id?: number;
  dateArrivee?: dayjs.Dayjs | null;
  dateSortie?: dayjs.Dayjs | null;
  observationsHospitalisation?: string | null;
  chambre?: IChambres | null;
  patient?: IPatients | null;
}

export class Hospitalisations implements IHospitalisations {
  constructor(
    public id?: number,
    public dateArrivee?: dayjs.Dayjs | null,
    public dateSortie?: dayjs.Dayjs | null,
    public observationsHospitalisation?: string | null,
    public chambre?: IChambres | null,
    public patient?: IPatients | null
  ) {}
}

export function getHospitalisationsIdentifier(hospitalisations: IHospitalisations): number | undefined {
  return hospitalisations.id;
}
