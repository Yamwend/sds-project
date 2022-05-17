import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PersonnelSoignantsComponent } from './list/personnel-soignants.component';
import { PersonnelSoignantsDetailComponent } from './detail/personnel-soignants-detail.component';
import { PersonnelSoignantsUpdateComponent } from './update/personnel-soignants-update.component';
import { PersonnelSoignantsDeleteDialogComponent } from './delete/personnel-soignants-delete-dialog.component';
import { PersonnelSoignantsRoutingModule } from './route/personnel-soignants-routing.module';

@NgModule({
  imports: [SharedModule, PersonnelSoignantsRoutingModule],
  declarations: [
    PersonnelSoignantsComponent,
    PersonnelSoignantsDetailComponent,
    PersonnelSoignantsUpdateComponent,
    PersonnelSoignantsDeleteDialogComponent,
  ],
  entryComponents: [PersonnelSoignantsDeleteDialogComponent],
})
export class PersonnelSoignantsModule {}
