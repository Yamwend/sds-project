import dayjs from 'dayjs/esm';
import { ITraitements } from 'app/entities/traitements/traitements.model';
import { IHospitalisations } from 'app/entities/hospitalisations/hospitalisations.model';
import { IConsultations } from 'app/entities/consultations/consultations.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';

export interface IPatients {
  id?: number;
  codePat?: string | null;
  nomPat?: string | null;
  prenomPat?: string | null;
  sexePat?: Sexe | null;
  adressePat?: string | null;
  telephonePat?: string | null;
  emailPat?: string | null;
  originePat?: string | null;
  professionPat?: string | null;
  agePat?: dayjs.Dayjs | null;
  traitements?: ITraitements[] | null;
  hospitalisations?: IHospitalisations[] | null;
  consultations?: IConsultations[] | null;
}

export class Patients implements IPatients {
  constructor(
    public id?: number,
    public codePat?: string | null,
    public nomPat?: string | null,
    public prenomPat?: string | null,
    public sexePat?: Sexe | null,
    public adressePat?: string | null,
    public telephonePat?: string | null,
    public emailPat?: string | null,
    public originePat?: string | null,
    public professionPat?: string | null,
    public agePat?: dayjs.Dayjs | null,
    public traitements?: ITraitements[] | null,
    public hospitalisations?: IHospitalisations[] | null,
    public consultations?: IConsultations[] | null
  ) {}
}

export function getPatientsIdentifier(patients: IPatients): number | undefined {
  return patients.id;
}
