import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  gettermsdetails:any=[];
  constructor(private router: Router,public productservice:ProductsService) { }

  ngOnInit() {
    this.getterms();
  }
  back(){
    this.router.navigate(['']);
  }
  getterms(){
    this.productservice.presentLoading();
    this.productservice.getpagesDetails('terms').subscribe(data => {
      this.gettermsdetails = data.data[0];
      console.log(this.gettermsdetails.content)
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
}
