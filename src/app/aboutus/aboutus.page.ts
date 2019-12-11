import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { CheckzipcodeService } from '../checkzipcode.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
  getaboutdetails:any=[];
  getzipcodelists:any=[];
  constructor(private router: Router,public productservice:ProductsService,public zipcodeservice:CheckzipcodeService) { }

  ngOnInit() {
    this.getaboutus();
    this.getzipcode();
  }
  back(){
    this.router.navigate(['']);
  }
  getaboutus(){
    this.productservice.presentLoading();
    this.productservice.getpagesDetails('about_us').subscribe(data => {
      this.getaboutdetails = data.data[0];
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  getzipcode(){
    this.productservice.presentLoading();
    this.zipcodeservice.getallzipcode().subscribe(data => {
      this.getzipcodelists = data.data;
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
}
