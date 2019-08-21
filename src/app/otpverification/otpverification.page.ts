import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.page.html',
  styleUrls: ['./otpverification.page.scss'],
})
export class OtpverificationPage implements OnInit {
  verificationId: string;
  mobilenumber: string;
  mobileotp = { firebasemobileotp: ''};
  data:any;
  constructor(public router: Router,public firebaseAuthentication:FirebaseAuthentication,private route: ActivatedRoute,public productservice:ProductsService) { 
    this.mobilenumber = route.snapshot.paramMap.get('mobile');
    this.verificationId = route.snapshot.paramMap.get('verificationId');
  }

  ngOnInit() {
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
}
