import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {
  type: string;
  user_id: string;
  checkoutForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(private location:Location,public formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute,public productservice:ProductsService,) {
    this.user_id = localStorage.getItem("user_id");
    this.type = this.route.snapshot.paramMap.get('type');
    this.initForm();
   }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
  }
  ionViewWillEnter(){
    this.type = this.route.snapshot.paramMap.get('type');
   
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
      this.checkoutForm.reset();
      if(this.type == "address"){
        this.router.navigate(['getaddress']);
      }
      else{
        this.router.navigate(['address']);
      }

      
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
    }
    back(){
      this.location.back();
    }
}
