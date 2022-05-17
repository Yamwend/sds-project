import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FamilleMaladiesComponent } from './list/famille-maladies.component';
import { FamilleMaladiesDetailComponent } from './detail/famille-maladies-detail.component';
import { FamilleMaladiesUpdateComponent } from './update/famille-maladies-update.component';
import { FamilleMaladiesDeleteDialogComponent } from './delete/famille-maladies-delete-dialog.component';
import { FamilleMaladiesRoutingModule } from './route/famille-maladies-routing.module';

@NgModule({
  imports: [SharedModule, FamilleMaladiesRoutingModule],
  declarations: [
    FamilleMaladiesComponent,
    FamilleMaladiesDetailComponent,
    FamilleMaladiesUpdateComponent,
    FamilleMaladiesDeleteDialogComponent,
  ],
  entryComponents: [FamilleMaladiesDeleteDialogComponent],
})
export class FamilleMaladiesModule {}
