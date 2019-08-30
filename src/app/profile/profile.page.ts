import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Events, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  lastname: any;
  mobile: any;
  email: any;
  name: any;
  user_id: any;
  getprofile:any=[];
  getaddresslist:any=[];
  constructor(private location:Location,public alertController: AlertController,public events: Events,private route: ActivatedRoute,private router: Router,public productservice:ProductsService) { 
    this.user_id = localStorage.getItem("user_id");
    this.getprofileDetail(this.user_id);
  }

  ngOnInit() {
    this.events.subscribe('profileedit', ()=>{
      this.user_id = localStorage.getItem("user_id");
      this.getprofileDetail(this.user_id);
    })
  }
  ionViewWillEnter(){
    this.user_id = localStorage.getItem("user_id");
    this.getprofileDetail(this.user_id);
  }
  getprofileDetail(user_id){
    this.productservice.presentLoading();
    this.productservice.getprofile(user_id)
    .subscribe(profile =>{ 
      this.productservice.loadingdismiss();
      this.getprofile = profile.data;
      this.name = this.getprofile[0].firstname;
      this.lastname = this.getprofile[0].lastname;
      this.email = this.getprofile[0].email;
      this.mobile = this.getprofile[0].mobile;
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
 
  async logout() {
    const alert = await this.alertController.create({
      header: '',
      message: 'Are you sure want to logout from ctlkart!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.logoutconfirm();
          }
        }
      ]
    });
  
    await alert.present();


}
logoutconfirm(){
  this.events.publish('loggedout');
  localStorage.removeItem('token');
  localStorage.removeItem('cart_items');
  this.router.navigate(['']);
}
async deleteaccount() {
  const alert = await this.alertController.create({
    header: '',
    message: 'Are you sure want to remove from ctlkart!!!',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        handler: () => {
          this.deleteaccountconfirm();
        }
      }
    ]
  });

  await alert.present();
}
deleteaccountconfirm(){
  this.productservice.presentLoading();
  this.productservice.removeaccount(this.user_id)
  .subscribe(profile =>{ 
    this.productservice.loadingdismiss();
    this.productservice.presentToast(profile.message);
    this.events.publish('loggedout');
    localStorage.removeItem('token');
    localStorage.removeItem('cart_items');
    this.router.navigate(['']);
  },
  err =>{
    this.productservice.loadingdismiss();
    this.productservice.presentToast(err.error.message);
 })
}
  editProfile(){
    this.router.navigate(['editprofile']);
  }
 
 
  changepassword(){
    this.router.navigate(['changepasword']);
  }
  address(){
    this.router.navigate(['getaddress']);
  }
  back(){
    this.router.navigate(['']);
  }
}
