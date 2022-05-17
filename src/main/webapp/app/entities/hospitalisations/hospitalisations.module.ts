import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HospitalisationsComponent } from './list/hospitalisations.component';
import { HospitalisationsDetailComponent } from './detail/hospitalisations-detail.component';
import { HospitalisationsUpdateComponent } from './update/hospitalisations-update.component';
import { HospitalisationsDeleteDialogComponent } from './delete/hospitalisations-delete-dialog.component';
import { HospitalisationsRoutingModule } from './route/hospitalisations-routing.module';

@NgModule({
  imports: [SharedModule, HospitalisationsRoutingModule],
  declarations: [
    HospitalisationsComponent,
    HospitalisationsDetailComponent,
    HospitalisationsUpdateComponent,
    HospitalisationsDeleteDialogComponent,
  ],
  entryComponents: [HospitalisationsDeleteDialogComponent],
})
export class HospitalisationsModule {}
