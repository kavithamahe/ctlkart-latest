import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: '../category/category.module#CategoryPageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
          }
        ]
      },
      {
        path: 'viewcartproduct',
        children: [
          {
            path: '',
            loadChildren: '../viewcartproduct/viewcartproduct.module#ViewcartproductPageModule'
          }
        ]
      },
      {
        path: '',
        loadChildren: '../dashboard/dashboard.module#DashboardPageModule',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    loadChildren: '../dashboard/dashboard.module#DashboardPageModule',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}