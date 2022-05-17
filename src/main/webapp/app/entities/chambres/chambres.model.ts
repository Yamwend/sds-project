import { IHospitalisations } from 'app/entities/hospitalisations/hospitalisations.model';
import { ICategorieChambres } from 'app/entities/categorie-chambres/categorie-chambres.model';

export interface IChambres {
  id?: number;
  numeroChambre?: string | null;
  localisationChambre?: string | null;
  nombrebLit?: number | null;
  prixChambre?: number | null;
  hospitalisers?: IHospitalisations[] | null;
  categorie?: ICategorieChambres | null;
}

export class Chambres implements IChambres {
  constructor(
    public id?: number,
    public numeroChambre?: string | null,
    public localisationChambre?: string | null,
    public nombrebLit?: number | null,
    public prixChambre?: number | null,
    public hospitalisers?: IHospitalisations[] | null,
    public categorie?: ICategorieChambres | null
  ) {}
}

export function getChambresIdentifier(chambres: IChambres): number | undefined {
  return chambres.id;
}
