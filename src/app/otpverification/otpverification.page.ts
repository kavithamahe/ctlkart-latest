import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.page.html',
  styleUrls: ['./otpverification.page.scss'],
})
export class OtpverificationPage implements OnInit {
  subcategory_name: any;
  category_id: any;
  subcategory_id: any;
  totalpricecart: string;
  fromcart: string;
  quantity: string;
  singleid: any;
  cartcount: any;
  cartDetails: any;
  verificationId: string;
  mobilenumber: string;
  mobileotp = { firebasemobileotp: ''};
  data:any;
  fromlogin:any;
  onboard:any;
  userid:any;
  refreshToken:any;
  fromorder:any;
  constructor(private location:Location,public router: Router,public events: Events,public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public productservice:ProductsService) { 
    this.mobilenumber = this.route.snapshot.paramMap.get('mobile');
    console.log(this.mobilenumber)

  }

  ngOnInit() {
    this.mobilenumber = this.route.snapshot.paramMap.get('mobile');
    this.verificationId = this.route.snapshot.paramMap.get('verificationId');
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.subcategory_id = this.route.snapshot.paramMap.get('subcategory_id');
    this.category_id = this.route.snapshot.paramMap.get('category_id');
    this.subcategory_name = this.route.snapshot.paramMap.get('subcategoryname');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.fromlogin = this.route.snapshot.paramMap.get('fromlogin');
    this.onboard = this.route.snapshot.paramMap.get('onboard');
    this.refreshToken = this.route.snapshot.paramMap.get('refreshToken');
    this.userid = this.route.snapshot.paramMap.get('userid');
    this.fromorder = this.route.snapshot.paramMap.get('fromorder');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
  }
  ionViewWillEnter(){
    this.mobilenumber = this.route.snapshot.paramMap.get('mobile');
    this.verificationId = this.route.snapshot.paramMap.get('verificationId');
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.subcategory_id = this.route.snapshot.paramMap.get('subcategory_id');
    this.category_id = this.route.snapshot.paramMap.get('category_id');
    this.subcategory_name = this.route.snapshot.paramMap.get('subcategoryname');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.fromlogin = this.route.snapshot.paramMap.get('fromlogin');
  }
  resendotp(){
    const phoneNumberString =this.mobilenumber;
    console.log(phoneNumberString)
    this.firebaseAuthentication.verifyPhoneNumber(phoneNumberString, 30000)
    .then( confirmationResult => {
      console.log(confirmationResult)
      this.verificationId = confirmationResult;
      if(this.verificationId){
        this.productservice.presentAlert("The sms verification code is sent to your mobile number");
      }
      
    })
  .catch((error) => {
    this.productservice.presentAlert(error);
    console.error(error)
  });
  }
  otpsubmit(){
    this.data = this.mobileotp.firebasemobileotp;
    // this.productservice.presentLoading();
    this.firebaseAuthentication.signInWithVerificationId(this.verificationId,this.data).then((user) => {
      console.log(user);
      // this.productservice.loadingdismiss();   
    })
    .catch((error) => {
      // this.alert(error);
      // this.productservice.loadingdismiss();
    
      if(error == "This credential is already associated with a different user account."){
        this.otpsend();
      }
      else if(error == "The sms verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user."){
        this.productservice.presentAlert(error);
      }
      else{
        this.otpsend();
      }
      console.error(error)});
  }
  otpsend(){
    let otp = "1";
    this.productservice.presentLoading();
    this.productservice.onetimepassword(this.mobilenumber,otp).subscribe(otpdata =>{
      
      
      localStorage.setItem("token", this.refreshToken);
      localStorage.setItem("user_id", this.userid);
      this.events.publish('loggedin');
      this.productservice.presentToast("Mobile Number Verified Successfully,Please login.");
      this.productservice.loadingdismiss();
      if(this.fromlogin == "1"){
        if(this.fromcart == null || this.fromcart == "null"){
          this.fromcart = "";
        }
        if(this.singleid == null || this.singleid == "null"){
          this.singleid = "";
        }
        if(this.onboard == 1){
          
          this.router.navigate(['']);
        }
        
        else if(this.fromcart || this.singleid && this.onboard != 1){
          this.router.navigate(['address',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,'fromorder':this.fromorder}]);
        }
        else{
          this.router.navigate(['']);
        }
      }
      else if(this.fromlogin == null){
        console.log(this.fromlogin);
        this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalpricecart":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,"onboard":this.onboard,'fromorder':this.fromorder}]);
      }
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  back(){
    this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalpricecart":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,"onboard":this.onboard,'fromorder':this.fromorder}]);
  }
}
