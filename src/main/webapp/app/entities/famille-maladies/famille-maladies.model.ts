import { IMaladies } from 'app/entities/maladies/maladies.model';

export interface IFamilleMaladies {
  id?: number;
  libelleFMaladie?: string | null;
  descriptionFMaladie?: string | null;
  maladies?: IMaladies[] | null;
}

export class FamilleMaladies implements IFamilleMaladies {
  constructor(
    public id?: number,
    public libelleFMaladie?: string | null,
    public descriptionFMaladie?: string | null,
    public maladies?: IMaladies[] | null
  ) {}
}

export function getFamilleMaladiesIdentifier(familleMaladies: IFamilleMaladies): number | undefined {
  return familleMaladies.id;
}
