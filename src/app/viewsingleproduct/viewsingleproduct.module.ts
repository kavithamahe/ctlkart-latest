import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { IonicModule } from '@ionic/angular';

import { ViewsingleproductPage } from './viewsingleproduct.page';

const routes: Routes = [
  {
    path: '',
    component: ViewsingleproductPage
  }
];
library.add(fas, far, fab);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ViewsingleproductPage],
})
export class ViewsingleproductPageModule {}
