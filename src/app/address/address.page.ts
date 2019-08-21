import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  type: string;
  customer_id: any;
  user_id: string;
  addaddress:boolean = false;
  checkoutForm: FormGroup;
  getalladdress:any=[];
  quantity: string;
  singleid: any;
  cartcount: any;
  cartDetails: any;
  fromcart: string;
  totalpricecart: string;
  submitAttempt: boolean = false;
  constructor(private location:Location,private router: Router,private route: ActivatedRoute,public productservice:ProductsService,public formBuilder: FormBuilder) { 
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.type = this.route.snapshot.paramMap.get('type');
    if(this.type == 'address'){
      this.addaddress = true;
    }
    this.initForm();
  }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.type = this.route.snapshot.paramMap.get('type');
    if(this.type == 'address'){
      this.addaddress = true;
    }
  }
  ionViewWillEnter(){
    this.type = this.route.snapshot.paramMap.get('type');
    if(this.type == 'address'){
      this.addaddress = true;
    }
  }
  addAddress(){
    this.addaddress = true;
  }
  cancel(){
    this.addaddress = false;
  }
  initForm(){
    this.checkoutForm = this.formBuilder.group({
      address: ['', Validators.compose([Validators.required])],
      landmark: [''],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])]
     
       });
  }
  radioSelects(event,id) {
    this.customer_id = id;
  }
  submitaddress(){
    let user_id = {"user_id":this.user_id};
    let obj = Object.assign(this.checkoutForm.value,user_id);
    if(!this.checkoutForm.valid){
      this.submitAttempt = true;
    }else{
      this.submitAttempt = false;
    this.productservice.presentLoading();
      this.productservice.addaddress(obj)
    .subscribe(product =>{ 
      this.productservice.loadingdismiss();
      this.addaddress = false;
      this.allgetAddress(this.user_id);
      if(this.type == 'address'){
        this.router.navigate(['getaddress']);
      }
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
    }
    allgetAddress(user_id){
      this.productservice.presentLoading();
      this.productservice.getaddress(user_id)
      .subscribe(product =>{ 
        this.getalladdress = product.data;
        this.productservice.loadingdismiss();
      },
      err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
    }
    next(){
      if(this.customer_id){
      this.router.navigate(['proceedcheckout',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
      }
      else{
        this.productservice.presentToast("Please Select the delivery address");
    }
  }
    back(){
      this.location.back();
    }
}
