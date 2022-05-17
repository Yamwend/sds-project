import { ITraitements } from 'app/entities/traitements/traitements.model';
import { IFamilleMaladies } from 'app/entities/famille-maladies/famille-maladies.model';

export interface IMaladies {
  id?: number;
  nomMaladie?: string | null;
  familleMaladie?: string | null;
  descriptionMaladie?: string | null;
  traiters?: ITraitements[] | null;
  famille?: IFamilleMaladies | null;
}

export class Maladies implements IMaladies {
  constructor(
    public id?: number,
    public nomMaladie?: string | null,
    public familleMaladie?: string | null,
    public descriptionMaladie?: string | null,
    public traiters?: ITraitements[] | null,
    public famille?: IFamilleMaladies | null
  ) {}
}

export function getMaladiesIdentifier(maladies: IMaladies): number | undefined {
  return maladies.id;
}
