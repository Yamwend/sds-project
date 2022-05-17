import { IOrdonnances } from 'app/entities/ordonnances/ordonnances.model';

export interface ILigneOrdonnances {
  id?: number;
  medicament?: string | null;
  posologie?: string | null;
  ordonnance?: IOrdonnances | null;
}

export class LigneOrdonnances implements ILigneOrdonnances {
  constructor(
    public id?: number,
    public medicament?: string | null,
    public posologie?: string | null,
    public ordonnance?: IOrdonnances | null
  ) {}
}

export function getLigneOrdonnancesIdentifier(ligneOrdonnances: ILigneOrdonnances): number | undefined {
  return ligneOrdonnances.id;
}
