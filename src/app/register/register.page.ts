import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AlertController, Events } from '@ionic/angular';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  quantity: string;
  fromcart: string;
  singleid: string;
  registerForm: FormGroup;
  submitAttempt: boolean = false;
  verificationId: any;
  constructor(public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public events: Events,private _location: Location, private alertCtrl: AlertController,private router: Router,public formBuilder: FormBuilder,public productservice:ProductsService) { 
    this.singleid = route.snapshot.paramMap.get('id');
    console.log(this.singleid)
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),Validators.required])],
      mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10), Validators.required])],
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
        const phoneNumberString = "+91" + this.registerForm.value.mobile;
        this.productservice.presentToast(data.message);
;        this.firebaseAuthentication.verifyPhoneNumber(phoneNumberString, 30000)
        .then( confirmationResult => {
          this.verificationId = confirmationResult;
          this.router.navigate(['otpverification',{"mobile":this.registerForm.value.mobile,"verificationId":this.verificationId}]);
          this.registerForm.reset();
          
        })
      .catch((error) => {
        // this.alert(error);
        this.productservice.presentToast(error);
        this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
        console.error(error)});
       
      }, 
       err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    }
  }

  back(){
    this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);

  }

  Login(){
    this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);

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
