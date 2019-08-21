import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {
  fromcart: any;
  quantity: any;
  singleid: any;
  forget = {email:''};

  constructor(public location:Location,public productservice:ProductsService,public alertController: AlertController,public navctrl:NavController,private route: ActivatedRoute) {
    this.singleid = route.snapshot.paramMap.get('id');
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');

   }

  ngOnInit() {

  }
  forgetPassword(){
    if(this.forget.email == ""){
      this.productservice.presentToast("Please enter the email");
    }
    else{
      this.productservice.presentLoading();
      this.productservice.forgetpassword(this.forget.email)
      .subscribe(password =>{ 
        this.productservice.loadingdismiss();
        this.presentAlert(password.message);
        this.forget.email = "";
        this.navctrl.navigateBack(['/checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
      },
      err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    }
 
  }
  async presentAlert(message) {
    const alert = await this.alertController.create({
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  back(){
    this.location.back();
  }
}
