import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { GeneralLayoutComponent } from './general-layout/general-layout.component';
import { RouterModule } from '@angular/router';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    GeneralLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedRoutingModule
  ],
  exports: [
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
