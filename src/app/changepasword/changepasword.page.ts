import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-changepasword',
  templateUrl: './changepasword.page.html',
  styleUrls: ['./changepasword.page.scss'],
})
export class ChangepaswordPage implements OnInit {
  password = {currentpassword:'',newpassword:'',confirmpassword:''};
  constructor(private _location:Location,private route: ActivatedRoute,private router: Router,public productservice:ProductsService) { }

  ngOnInit() {
  }

  changePassword(){
    this.productservice.presentLoading();
    this.productservice.changepassword(this.password)
    .subscribe(password =>{ 
      this.productservice.loadingdismiss();
      this.router.navigate(['dashboard']);
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  back(){
    this._location.back();
}
}
