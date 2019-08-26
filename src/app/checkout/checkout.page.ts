import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from '../products.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {Location} from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  cartcount: any;
  cartDetails: any;
  fromcart: string;
  quantity: string;
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  employee = { mobileotp: ''};
  verificationId: any;
  singleid:any;
  numberverify:boolean = false;
  verify = { mobile: ''};

  constructor(public firebaseAuthentication:FirebaseAuthentication,private _location: Location ,public events: Events,private route: ActivatedRoute,private alertCtrl: AlertController,private router: Router,public formBuilder: FormBuilder,public productservice:ProductsService,public toastController: ToastController) { 
    this.singleid = route.snapshot.paramMap.get('id');
    console.log(this.singleid)
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
    // firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
    //   if(user){
    //     router.navigate(['/dashboard']);
    //   }
    //   else{
    //     router.navigate(['']);
    //   }
    // })

  }
  ionViewWillEnter(){
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
  }
  ngOnInit() {
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
    this.initForm();
  }
  initForm(){
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),Validators.required])],
      password: ['', Validators.compose([Validators.required])]
      });
  }
  
  register(){
    this.router.navigate(['register',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
  }
  login(){
    if(!this.loginForm.valid){
      this.submitAttempt = true;
    }else{
      this.submitAttempt = false;
      this.productservice.login(this.loginForm.value).subscribe(data =>{
        localStorage.setItem("token", data['refreshToken']);
        let token = localStorage.setItem("token", data['refreshToken']);
        localStorage.setItem("user_id", data['userid']);
        this.events.publish('loggedin');
        if(this.fromcart || this.singleid){
          this.router.navigate(['address',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
        }
        else{
          this.router.navigate(['dashboard']);
        }
        
      },
      err =>{
        if(err.status == 401){
          if(err.error.mobile){
          const phoneNumberString = "+91" + err.error.mobile;
          this.firebaseAuthentication.verifyPhoneNumber(phoneNumberString, 30000)
          .then( confirmationResult => {
            this.verificationId = confirmationResult;
            this.alert(this.verificationId);
            
          })
        .catch((error) => {
          this.alert(error);
          console.error(error)
        });
        this.presentToast(err.error.message);
      }
          this.presentToast(err.error.message);
      }
        
        else{
          this.presentToast(err.error.message);
        }
        
            })
    }
  }
  // verifynumber(mobilenumber){
  //     this.productservice.presentLoading();
  //       this.productservice.loadingdismiss();
  //       const phoneNumberString = "+91" + mobilenumber;

  //       this.firebaseAuthentication.verifyPhoneNumber(phoneNumberString, 30000)
  //       .then( confirmationResult => {
  //         this.verificationId = confirmationResult;
  //         this.alert(this.verificationId);
          
  //       })
  //     .catch((error) => {
  //       this.alert(error);
  //       console.error(error)
  //     });
  // }
  back(){
      this._location.back();
  }
  async alert(verificationId){
    const prompt = await this.alertCtrl.create({
      header: 'Enter the Confirmation code',
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        { text: 'Cancel',
          handler: data => { console.log('Cancel clicked'); }
        },
        { text: 'Send',
          handler: data => {
            let otp = "1";
          this.firebaseAuthentication.signInWithVerificationId(verificationId,data.confirmationCode).then((user) => {
            this.productservice.onetimepassword(this.verify.mobile,otp).subscribe(otpdata =>{
              this.numberverify = false;
            },
            err =>{
              this.productservice.presentToast(err.error.message);
           })
          // this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
          this.events.publish('loggedin');
        if(this.fromcart || this.singleid){
          this.router.navigate(['address',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
        }
        else{
          this.router.navigate(['dashboard']);
        }  
        })
          .catch((error) => {
            // this.alert(error);
            this.productservice.presentToast(error);
            console.error(error)});
          }
        }
      ]
    });
    await prompt.present();
  }
  forgetpassword(){
    this.router.navigate(['forgetpassword',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
  }
  async presentToast(datamessage) {
    const toast = await this.toastController.create({
      message: datamessage,
      duration: 2000
    });
    toast.present();
  }
  viewcart(){
    this.router.navigate(['/viewcartproduct']);
  }
}
