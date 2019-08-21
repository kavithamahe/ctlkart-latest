import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'viewsingleproduct', loadChildren: './viewsingleproduct/viewsingleproduct.module#ViewsingleproductPageModule' },
  { path: 'viewcartproduct', loadChildren: './viewcartproduct/viewcartproduct.module#ViewcartproductPageModule' },
  { path: 'productbycategory', loadChildren: './productbycategory/productbycategory.module#ProductbycategoryPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutPageModule' },
  { path: 'proceedcheckout', loadChildren: './proceedcheckout/proceedcheckout.module#ProceedcheckoutPageModule' },
  { path: 'changepasword', loadChildren: './changepasword/changepasword.module#ChangepaswordPageModule' },
  { path: 'myorders', loadChildren: './myorders/myorders.module#MyordersPageModule' },
  { path: 'forgetpassword', loadChildren: './forgetpassword/forgetpassword.module#ForgetpasswordPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'editprofile', loadChildren: './editprofile/editprofile.module#EditprofilePageModule' },
  { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'onboard', loadChildren: './onboard/onboard.module#OnboardPageModule' },

  // ..................................tabs...........................
  { path: 'dashboard/dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'dashboard/category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'dashboard/viewcartproduct', loadChildren: './viewcartproduct/viewcartproduct.module#ViewcartproductPageModule' },
  { path: 'dashboard/profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'dashboard/checkout', loadChildren: './checkout/checkout.module#CheckoutPageModule' },
  { path: 'register/dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'register/category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'register/viewcartproduct', loadChildren: './viewcartproduct/viewcartproduct.module#ViewcartproductPageModule' },
  { path: 'register/profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'register/checkout', loadChildren: './checkout/checkout.module#CheckoutPageModule' },
  // ..................................tabs end.......................
  { path: 'subcategorylist', loadChildren: './subcategorylist/subcategorylist.module#SubcategorylistPageModule' },
  { path: 'otpverification', loadChildren: './otpverification/otpverification.module#OtpverificationPageModule' },
  { path: 'address', loadChildren: './address/address.module#AddressPageModule' },  { path: 'getaddress', loadChildren: './getaddress/getaddress.module#GetaddressPageModule' }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules,onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
