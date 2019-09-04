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
  totalpricecart: string;
  fromcart: string;
  quantity: string;
  singleid: string;
  cartcount: any;
  cartDetails: any;
  verificationId: string;
  mobilenumber: string;
  mobileotp = { firebasemobileotp: ''};
  data:any;
  constructor(private location:Location,public router: Router,public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public productservice:ProductsService) { 
    this.mobilenumber = route.snapshot.paramMap.get('mobile');
    this.verificationId = route.snapshot.paramMap.get('verificationId');
    this.singleid = route.snapshot.paramMap.get('id');
    console.log(this.singleid)
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = route.snapshot.paramMap.get('totalamount');
  }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
  }
  otpsubmit(){
    this.productservice.presentLoading();
    this.data = this.mobileotp.firebasemobileotp;
    let otp = "1";
    this.firebaseAuthentication.signInWithVerificationId(this.verificationId,this.data).then((user) => {
      console.log(user);
      this.productservice.loadingdismiss();
      this.productservice.onetimepassword(this.mobilenumber,otp).subscribe(otpdata =>{
        console.log(otpdata);
        this.router.navigate(['checkout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalpricecart":this.totalpricecart}]);
        this.productservice.loadingdismiss();
      },
      err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    console.log(user);
    
    })
    .catch((error) => {
      // this.alert(error);
      this.productservice.loadingdismiss();
      this.productservice.presentToast("Your OTP is invallid");
      console.error(error)});
  }
  back(){
    this.router.navigateByUrl('/checkout');
  }
}
