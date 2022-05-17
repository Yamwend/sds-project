import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConsultationsComponent } from './list/consultations.component';
import { ConsultationsDetailComponent } from './detail/consultations-detail.component';
import { ConsultationsUpdateComponent } from './update/consultations-update.component';
import { ConsultationsDeleteDialogComponent } from './delete/consultations-delete-dialog.component';
import { ConsultationsRoutingModule } from './route/consultations-routing.module';

@NgModule({
  imports: [SharedModule, ConsultationsRoutingModule],
  declarations: [ConsultationsComponent, ConsultationsDetailComponent, ConsultationsUpdateComponent, ConsultationsDeleteDialogComponent],
  entryComponents: [ConsultationsDeleteDialogComponent],
})
export class ConsultationsModule {}
