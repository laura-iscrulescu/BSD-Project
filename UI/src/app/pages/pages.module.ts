import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { CategoryAnalysisComponent } from './category-analysis/category-analysis.component';
import { NgChartsModule } from 'ng2-charts';
// import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    MainPageComponent,
    AllTransactionsComponent,
    PredictionsComponent,
    CategoryAnalysisComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NgChartsModule
    // ModalModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
