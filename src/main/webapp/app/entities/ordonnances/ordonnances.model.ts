import { ILigneOrdonnances } from 'app/entities/ligne-ordonnances/ligne-ordonnances.model';
import { ITraitements } from 'app/entities/traitements/traitements.model';

export interface IOrdonnances {
  id?: number;
  numero?: string | null;
  lignes?: ILigneOrdonnances[] | null;
  ordonners?: ITraitements[] | null;
}

export class Ordonnances implements IOrdonnances {
  constructor(
    public id?: number,
    public numero?: string | null,
    public lignes?: ILigneOrdonnances[] | null,
    public ordonners?: ITraitements[] | null
  ) {}
}

export function getOrdonnancesIdentifier(ordonnances: IOrdonnances): number | undefined {
  return ordonnances.id;
}
