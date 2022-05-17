import dayjs from 'dayjs/esm';
import { ITraitements } from 'app/entities/traitements/traitements.model';
import { IConsultations } from 'app/entities/consultations/consultations.model';
import { IServices } from 'app/entities/services/services.model';
import { Grade } from 'app/entities/enumerations/grade.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';

export interface IPersonnelSoignants {
  id?: number;
  codePersonne?: string | null;
  nomPersonne?: string | null;
  prenomPersonne?: string | null;
  gradePersonne?: Grade | null;
  fonctionPersonne?: string | null;
  telphonePersonne?: string | null;
  emailPersonne?: Sexe | null;
  adressePersonne?: string | null;
  dateDeNaissPersonne?: dayjs.Dayjs | null;
  proposers?: ITraitements[] | null;
  consulters?: IConsultations[] | null;
  service?: IServices | null;
}

export class PersonnelSoignants implements IPersonnelSoignants {
  constructor(
    public id?: number,
    public codePersonne?: string | null,
    public nomPersonne?: string | null,
    public prenomPersonne?: string | null,
    public gradePersonne?: Grade | null,
    public fonctionPersonne?: string | null,
    public telphonePersonne?: string | null,
    public emailPersonne?: Sexe | null,
    public adressePersonne?: string | null,
    public dateDeNaissPersonne?: dayjs.Dayjs | null,
    public proposers?: ITraitements[] | null,
    public consulters?: IConsultations[] | null,
    public service?: IServices | null
  ) {}
}

export function getPersonnelSoignantsIdentifier(personnelSoignants: IPersonnelSoignants): number | undefined {
  return personnelSoignants.id;
}
