import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AlertController, Events } from '@ionic/angular';
import {Location} from '@angular/common';
import { CheckzipcodeService } from '../checkzipcode.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';

class Country {
  public dial_code: number;
  public name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
 
  checkavailusersmobile: any;
  checkavailusersemail: any;
  checkavailusers: any;
  checkzipcode: any;
  subcategory_name: any;
  category_id: any;
  subcategory_id: any;
  totalpricecart: string;
  onboard: any;
  quantity: string;
  fromcart: string;
  singleid: any;
  registerForm: FormGroup;
  submitAttempt: boolean = false;
  verificationId: any;
  fromorder:any;
  gelallcheckcodedetails:any=[];
  getallusers:any=[];
  phoneNumberString:any;
  country_code:Country[];
  country:Country[];
  countrycode:any = "";
  constructor(public http : HttpClient,public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public events: Events,private _location: Location, private alertCtrl: AlertController,private router: Router,public formBuilder: FormBuilder,public productservice:ProductsService) { 
    this.singleid = route.snapshot.paramMap.get('id');
    console.log(this.singleid);
    this.subcategory_id = route.snapshot.paramMap.get('subcategory_id');
    this.category_id = route.snapshot.paramMap.get('category_id');
    this.subcategory_name = route.snapshot.paramMap.get('subcategoryname');
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = route.snapshot.paramMap.get('totalamount');
    this.onboard = route.snapshot.paramMap.get('onboard');
    this.fromorder = route.snapshot.paramMap.get('fromorder');
  }
  ngOnInit() {
    this.initForm();
    this.getUsers();
    this.getJSON().subscribe(data =>{
      this.country_code = data;
    });
  }
  public getJSON(): Observable<any> {
    return this.http.get("./assets/country_code.json");

}
portChange(event: {
  component: IonicSelectableComponent,
  value: any
}) {
  console.log('port:', event.value);
  // this.country = event.value.dial_code;
  this.countrycode = event.value.dial_code;
 
}
countryChange(event){
  this.country = event.detail.value;
  console.log(this.country);
}
  initForm(){
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),Validators.required])],
      country_code: ['', Validators.compose([Validators.required])],
      mobile: ['',  [Validators.required, this.productservice.checkLimit(1000000000,999999999999)]],
      password: ['', Validators.compose([Validators.required])],
     
       });
  }
  getUsers(){
    this.productservice.getusersservice().subscribe(data =>{
      this.getallusers = data.data;
    }, 
     err =>{
      this.productservice.loadingdismiss();
      // this.productservice.presentToast(err.error.message);
   })
  }
  submit(){
    this.phoneNumberString = this.registerForm.value.country_code + this.registerForm.value.mobile;
    this.registerForm.value.country_code = this.countrycode;
    console.log(this.registerForm.value.mobile);
    this.checkavailusersmobile = this.getallusers.find(p => this.phoneNumberString == p.mobile);
    this.checkavailusersemail = this.getallusers.find(p => this.registerForm.value.email == p.email);
    if(this.checkavailusersmobile){
      this.productservice.presentAlert("Your mobile number was already registered,Please log in with your associated email.");
    }
    else{
        if(this.checkavailusersemail){
      this.productservice.presentAlert("Your email id was already registered,Please log in with your associated email.");
        }
        else{
      let mobileapp = {"mobileapp":""};
    let obj = Object.assign(this.registerForm.value,mobileapp);

    if(!this.registerForm.valid){
      this.submitAttempt = true;
    }else{
      this.productservice.presentLoading();
      this.submitAttempt = false;
      // // console.log(phoneNumberString)
      // var str = this.registerForm.value.country_code;
      // var n = str.includes("+");
      // if(n == true){
        this.phoneNumberString = this.registerForm.value.country_code + this.registerForm.value.mobile;
      // }
      // else{
      //   this.phoneNumberString = "+" +this.registerForm.value.country_code + this.registerForm.value.mobile;
      // }
      console.log(this.phoneNumberString)
  this.firebaseAuthentication.verifyPhoneNumber(this.phoneNumberString, 30000)
  .then( confirmationResult => {
    // console.log("this.verificationId")
    // console.log(confirmationResult)
    this.verificationId = confirmationResult;
    // console.log(this.verificationId)
    if(this.verificationId){
      this.productservice.userregister(obj).subscribe(data =>{
        // this.productservice.loadingdismiss();
        
        // this.firebase(phoneNumberString);
        this.productservice.presentToast(data.message);
        this.router.navigate(['otpverification',{"mobile":this.phoneNumberString,"verificationId":this.verificationId,"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,"onboard":this.onboard,'fromorder':this.fromorder}]);
       this.registerForm.reset();
      }, 
       err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    
    }
    
    
  })
.catch((error) => {
  console.error(error)
  // this.alert(error);
  this.productservice.presentAlert(error);
  // this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,'fromorder':this.fromorder}]);
  console.error(error)});

   
    }
  }
    }
  
  
  }
  back(){
    if(this.onboard == "1"){
      this.router.navigate(['onboard']);
    }
    else{
      this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,'fromorder':this.fromorder}]);
    }

  }

  Login(){
    this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart,"onboard":this.onboard,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id,'fromorder':this.fromorder}]);

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
