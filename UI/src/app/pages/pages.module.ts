import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { CategoryAnalysisComponent } from './category-analysis/category-analysis.component';
import { NgChartsModule } from 'ng2-charts';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatSelectModule } from '@angular/material/select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionPanelComponent } from './category-analysis/expansion-panel/expansion-panel.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    MainPageComponent,
    AllTransactionsComponent,
    PredictionsComponent,
    CategoryAnalysisComponent,
    ExpansionPanelComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NgChartsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    MatSelectModule,
    CollapseModule,
    MatExpansionModule,
    AccordionModule.forRoot(),
    NgxDatatableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
