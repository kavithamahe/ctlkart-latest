import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { environment } from '../../environments/environment';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  cartcount: any;
  cartDetails: any;
  public imageUrl = environment.imageUrl;
  user_id: string;
  getallmyorderlists:any=[];
  constructor(public location:Location,public productservice:ProductsService,public events: Events,private router: Router) { 
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
    this.user_id = localStorage.getItem("user_id");
    this.getallmyorders(this.user_id);
  }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
  }
  ionViewWillEnter(){
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
    this.user_id = localStorage.getItem("user_id");
    this.getallmyorders(this.user_id);
  }
  getallmyorders(user_id){
    this.productservice.presentLoading();
    this.productservice.getallorders(user_id)
    .subscribe(product =>{ 
      this.getallmyorderlists = product.data;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  viewsingleorder(id){
    this.router.navigate(['/vieworderhistory',{"id":id}]);
  }
  viewcart(){
    this.router.navigate(['/viewcartproduct']);
  }
  back(){
    this.router.navigate(['']);
  }
}
