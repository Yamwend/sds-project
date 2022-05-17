import dayjs from 'dayjs/esm';
import { IPatients } from 'app/entities/patients/patients.model';
import { IMaladies } from 'app/entities/maladies/maladies.model';
import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';
import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';

export interface ITraitements {
  id?: number;
  observationsTraitement?: string | null;
  debutTraitement?: dayjs.Dayjs | null;
  finTraitement?: dayjs.Dayjs | null;
  etatFinPatient?: string | null;
  patient?: IPatients | null;
  maladie?: IMaladies | null;
  ordonnance?: IOrdonnances | null;
  personnel?: IPersonnelSoignants | null;
}

export class Traitements implements ITraitements {
  constructor(
    public id?: number,
    public observationsTraitement?: string | null,
    public debutTraitement?: dayjs.Dayjs | null,
    public finTraitement?: dayjs.Dayjs | null,
    public etatFinPatient?: string | null,
    public patient?: IPatients | null,
    public maladie?: IMaladies | null,
    public ordonnance?: IOrdonnances | null,
    public personnel?: IPersonnelSoignants | null
  ) {}
}

export function getTraitementsIdentifier(traitements: ITraitements): number | undefined {
  return traitements.id;
}
