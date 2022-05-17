import { IPersonnelSoignants } from 'app/entities/personnel-soignants/personnel-soignants.model';

export interface IServices {
  id?: number;
  libelleService?: string | null;
  services?: IPersonnelSoignants[] | null;
}

export class Services implements IServices {
  constructor(public id?: number, public libelleService?: string | null, public services?: IPersonnelSoignants[] | null) {}
}

export function getServicesIdentifier(services: IServices): number | undefined {
  return services.id;
}
