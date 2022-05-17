import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LigneOrdonnancesComponent } from './list/ligne-ordonnances.component';
import { LigneOrdonnancesDetailComponent } from './detail/ligne-ordonnances-detail.component';
import { LigneOrdonnancesUpdateComponent } from './update/ligne-ordonnances-update.component';
import { LigneOrdonnancesDeleteDialogComponent } from './delete/ligne-ordonnances-delete-dialog.component';
import { LigneOrdonnancesRoutingModule } from './route/ligne-ordonnances-routing.module';

@NgModule({
  imports: [SharedModule, LigneOrdonnancesRoutingModule],
  declarations: [
    LigneOrdonnancesComponent,
    LigneOrdonnancesDetailComponent,
    LigneOrdonnancesUpdateComponent,
    LigneOrdonnancesDeleteDialogComponent,
  ],
  entryComponents: [LigneOrdonnancesDeleteDialogComponent],
})
export class LigneOrdonnancesModule {}
