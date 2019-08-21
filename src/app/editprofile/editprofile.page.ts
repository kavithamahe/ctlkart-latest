import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  zipcode: string;
  state: string;
  city: string;
  landmark: any;
  address: any;
  id: any;
  param: string;
  mobile: any;
  email: any;
  name: any;
  user_id: any;
  getprofile:any=[];
  profile= { name: '',email:'',mobile:''};
  addresss= { address: '',landmark:'',city:'',state:'',zipcode:''};
  type:any;
  getaddress:any=[];
  constructor(public location:Location,private route: ActivatedRoute,private router: Router,public productservice:ProductsService) { 
    this.user_id = localStorage.getItem("user_id");
    this.param = route.snapshot.paramMap.get('param');
    this.type = route.snapshot.paramMap.get('type');
    this.id = route.snapshot.paramMap.get('id');
    if(this.type == 'address'){
      this.getsingleaddress(this.id);
    }
    this.getprofileDetail(this.user_id);
  }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    this.user_id = localStorage.getItem("user_id");
    this.param = this.route.snapshot.paramMap.get('param');
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.type == 'address'){
      this.getsingleaddress(this.id);
    }
    this.getprofileDetail(this.user_id);
  }
  getsingleaddress(id){
    this.productservice.presentLoading();
    this.productservice.viewsingleaddress(id)
    .subscribe(getsinaddress =>{ 
      this.getaddress = getsinaddress.data;
      this.address = this.getaddress.address;
      this.landmark = this.getaddress.landmark;
      this.city = this.getaddress.city;
      this.state = this.getaddress.state;
      this.zipcode = this.getaddress.zipcode;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  getprofileDetail(user_id){
    this.productservice.presentLoading();
    this.productservice.getprofile(user_id)
    .subscribe(profile =>{ 
      this.getprofile = profile.data;
      this.name = this.getprofile[0].firstname;
      this.email = this.getprofile[0].email;
      this.mobile = this.getprofile[0].mobile;
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  editprofile(){
    if(this.profile.name == ""){
      this.name = this.name;
    }
    else{
      this.name = this.profile.name;
    }
    if(this.profile.email == ""){
      this.email = this.email;
    }
    else{
      this.email = this.profile.email;
    }
    if(this.profile.mobile == ""){
      this.mobile = this.mobile;
    }
    else{
      this.mobile = this.profile.mobile;
    }
    this.productservice.presentLoading();
    this.productservice.editprofile(this.user_id,this.name,this.email,this.mobile)
    .subscribe(profile =>{ 
      this.productservice.loadingdismiss();
      this.productservice.presentToast(profile.message);
      this.router.navigate(['profile']);
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  editaddress(id){
    if(this.addresss.address == ""){
      this.address = this.address;
    }
    else{
      this.address = this.addresss.address;
    }
    if(this.addresss.landmark == ""){
      this.landmark = this.landmark;
    }
    else{
      this.landmark = this.addresss.landmark;
    }
    if(this.addresss.city == ""){
      this.city = this.city;
    }
    else{
      this.city = this.addresss.city;
    }
    if(this.addresss.state == ""){
      this.state = this.state;
    }
    else{
      this.state = this.addresss.state;
    }
    if(this.addresss.zipcode == ""){
      this.zipcode = this.zipcode;
    }
    else{
      this.zipcode = this.addresss.zipcode;
    }
    this.productservice.presentLoading();
    let addressedit = {"address":this.address,"landmark":this.addresss.landmark,"city":this.addresss.city,
    "state":this.addresss.state,"zipcode":this.addresss.zipcode}
    this.productservice.editaddress(id,addressedit)
    .subscribe(editadd =>{ 
      this.productservice.loadingdismiss();
      this.productservice.presentToast(editadd.message);
      this.router.navigate(['profile']);
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  back(){
    this.location.back();
  }
}
