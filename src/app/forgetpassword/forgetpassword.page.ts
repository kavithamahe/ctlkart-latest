import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {
  fromcart: any;
  quantity: any;
  singleid: any;
  forgotForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public location: Location,public formBuilder:FormBuilder, public productservice: ProductsService, public alertController: AlertController, public navctrl: NavController, private route: ActivatedRoute) {
    this.singleid = route.snapshot.paramMap.get('id');
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
    this.initForm();

  }

  ngOnInit() {

  }
  initForm(){
    this.forgotForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i), Validators.required])],
     
       });
  }
  forgetPassword() {
    if (!this.forgotForm.valid) {
      this.submitAttempt = true;
    } else {
      this.productservice.presentLoading();
      this.productservice.forgetpassword(this.forgotForm.value.email)
        .subscribe(password => {
          this.productservice.loadingdismiss();
          this.presentAlert(password.message);
          this.forgotForm.reset();
          this.navctrl.navigateBack(['/checkout', { "id": this.singleid, "quantity": this.quantity, "fromcart": this.fromcart }]);
        },
          err => {
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
  back() {
    this.location.back();
  }
}
