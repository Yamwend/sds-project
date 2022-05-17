import { IChambres } from 'app/entities/chambres/chambres.model';

export interface ICategorieChambres {
  id?: number;
  libelleCategory?: string | null;
  descriptionChambre?: string | null;
  chambres?: IChambres[] | null;
}

export class CategorieChambres implements ICategorieChambres {
  constructor(
    public id?: number,
    public libelleCategory?: string | null,
    public descriptionChambre?: string | null,
    public chambres?: IChambres[] | null
  ) {}
}

export function getCategorieChambresIdentifier(categorieChambres: ICategorieChambres): number | undefined {
  return categorieChambres.id;
}
