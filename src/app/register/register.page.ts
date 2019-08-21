import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AlertController } from '@ionic/angular';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  submitAttempt: boolean = false;
  verificationId: any;
  constructor(public firebaseAuthentication:FirebaseAuthentication,private _location: Location, private alertCtrl: AlertController,private router: Router,public formBuilder: FormBuilder,public productservice:ProductsService) { 

  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
     
       });
  }
  submit(){
    let mobileapp = {"mobileapp":""};
    let obj = Object.assign(this.registerForm.value,mobileapp);
    if(!this.registerForm.valid){
      this.submitAttempt = true;
    }else{
      this.productservice.presentLoading();
      this.submitAttempt = false;
      this.productservice.userregister(obj).subscribe(data =>{
        this.productservice.loadingdismiss();
        this.registerForm.reset();
        const phoneNumberString = "+91" + this.registerForm.value.mobile;

        // this.firebaseAuthentication.verifyPhoneNumber(phoneNumberString, 30000)
        // .then( confirmationResult => {
          this.verificationId = "9874566";
          console.log(this.verificationId)
          this.router.navigate(['otpverification',{"mobile":this.registerForm.value.mobile,"verificationId":this.verificationId}]);
          // this.alert(this.verificationId);
          
      //   })
      // .catch((error) => {
      //   // this.alert(error);
      //   this.productservice.presentToast(error);
      //   console.error(error)});
       
      }, 
       err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    }
  }

  back(){
    this._location.back();
  }

  Login(){
    this.router.navigateByUrl('/checkout');
  }

  // async alert(verificationId){
  //   const prompt = await this.alertCtrl.create({
  //     header: 'Enter the Confirmation code',
  //     inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
  //     buttons: [
  //       { text: 'Cancel',
  //         handler: data => { console.log('Cancel clicked'); }
  //       },
  //       { text: 'Send',
  //         handler: data => {
  //           let otp = "1";
  //         this.firebaseAuthentication.signInWithVerificationId(verificationId,data.confirmationCode).then((user) => {
  //           this.productservice.onetimepassword(this.registerForm.value.mobile,otp).subscribe(otpdata =>{
  //             console.log(otpdata);
  //           },
  //           err =>{
  //             this.productservice.presentToast(err.error.message);
  //          })
  //         console.log(user);
  //         this.router.navigate(['checkout']);
  //         })
  //         }
  //       }
  //     ]
  //   });
  //   await prompt.present();
  // }
}
