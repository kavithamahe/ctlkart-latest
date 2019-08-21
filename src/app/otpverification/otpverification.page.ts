import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.page.html',
  styleUrls: ['./otpverification.page.scss'],
})
export class OtpverificationPage implements OnInit {
  cartcount: any;
  cartDetails: any;
  verificationId: string;
  mobilenumber: string;
  mobileotp = { firebasemobileotp: ''};
  data:any;
  constructor(private location:Location,public router: Router,public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public productservice:ProductsService) { 
    this.mobilenumber = route.snapshot.paramMap.get('mobile');
    this.verificationId = route.snapshot.paramMap.get('verificationId');
  }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
  }
  otpsubmit(){
    this.data = this.mobileotp.firebasemobileotp;
    let otp = "1";
    this.firebaseAuthentication.signInWithVerificationId(this.verificationId,this.data).then((user) => {
      this.productservice.onetimepassword(this.mobilenumber,otp).subscribe(otpdata =>{
        console.log(otpdata);
      },
      err =>{
        this.productservice.presentToast(err.error.message);
     })
    console.log(user);
    this.router.navigate(['checkout']);
    })
  }
  back(){
    this.location.back();
  }
}
