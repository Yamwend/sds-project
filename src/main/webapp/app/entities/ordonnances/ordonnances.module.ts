import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrdonnancesComponent } from './list/ordonnances.component';
import { OrdonnancesDetailComponent } from './detail/ordonnances-detail.component';
import { OrdonnancesUpdateComponent } from './update/ordonnances-update.component';
import { OrdonnancesDeleteDialogComponent } from './delete/ordonnances-delete-dialog.component';
import { OrdonnancesRoutingModule } from './route/ordonnances-routing.module';

@NgModule({
  imports: [SharedModule, OrdonnancesRoutingModule],
  declarations: [OrdonnancesComponent, OrdonnancesDetailComponent, OrdonnancesUpdateComponent, OrdonnancesDeleteDialogComponent],
  entryComponents: [OrdonnancesDeleteDialogComponent],
})
export class OrdonnancesModule {}
