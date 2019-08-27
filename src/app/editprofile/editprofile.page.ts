import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import {Location} from '@angular/common';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  singleid: string;
  quantity: string;
  totalpricecart: string;
  fromcart: string;
  fromaddress: string;
  address_type: any;
  lastname: any;
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
  addresss= { address: '',landmark:'',city:'',state:'',zipcode:''};
  type:any;
  getaddress:any=[];
  profileForm: FormGroup;
  addressForm:FormGroup;
  submitAttempt: boolean = false;
  constructor(public location:Location,private route: ActivatedRoute,public formBuilder: FormBuilder,private router: Router,public productservice:ProductsService) { 
    this.user_id = localStorage.getItem("user_id");
    this.param = route.snapshot.paramMap.get('param');
    this.type = route.snapshot.paramMap.get('type');
    this.id = route.snapshot.paramMap.get('id');
    this.fromaddress =  route.snapshot.paramMap.get('fromaddress');
    this.singleid = this.route.snapshot.paramMap.get('ids');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    if(this.type == 'address'){
      this.getsingleaddress(this.id);
    }
    this.getprofileDetail(this.user_id);
  }

  ngOnInit() {
    this.initForm();
    this.initaddressForm();
  }
  initForm(){
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),Validators.required])],
      mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10), Validators.required])],
     
       });
  }
  initaddressForm(){
    this.addressForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      landmark: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      address_type: ['', Validators.compose([Validators.required])],
       });
  }
  ionViewWillEnter(){
    this.user_id = localStorage.getItem("user_id");
    this.param = this.route.snapshot.paramMap.get('param');
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    this.fromaddress =  this.route.snapshot.paramMap.get('fromaddress');
    this.singleid = this.route.snapshot.paramMap.get('ids');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
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
      this.addressForm.controls['name'].setValue(this.getaddress.name);
      this.addressForm.controls['mobile'].setValue(this.getaddress.mobile);
      this.addressForm.controls['address'].setValue(this.getaddress.address);
      this.addressForm.controls['landmark'].setValue(this.getaddress.landmark);
      this.addressForm.controls['city'].setValue(this.getaddress.city);
      this.addressForm.controls['state'].setValue(this.getaddress.state);
      this.addressForm.controls['zipcode'].setValue(this.getaddress.zipcode);
      // this.addressForm.controls['address_type'].setValue(this.getaddress.address_type);
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
      this.profileForm.controls['firstname'].setValue(this.name);
      this.profileForm.controls['lastname'].setValue(this.getprofile[0].lastname);
      this.profileForm.controls['email'].setValue(this.getprofile[0].email);
      this.profileForm.controls['mobile'].setValue(this.getprofile[0].mobile);
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  editprofile(){
    if(!this.profileForm.valid){
      this.submitAttempt = true;
      this.productservice.presentToast("Please Enter All The Details");
    }else{
    this.productservice.presentLoading();
    this.productservice.editprofile(this.user_id,this.profileForm.value)
    .subscribe(profile =>{ 
      this.productservice.loadingdismiss();
      this.productservice.presentToast(profile.message);
      this.router.navigate(['tabs/profile']);
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  }
  radioGroupChange(ev){
    console.log(ev.detail.value)
    this.address_type = ev.detail.value;
      }
  editaddress(id){
    this.addressForm.value.address_type = this.address_type;
    if(!this.addressForm.valid){
      this.submitAttempt = true;
      this.productservice.presentToast("Please Enter All The Details");
    }else{
    this.productservice.presentLoading();
    let addressedit = {"name":this.addressForm.value.name,"mobile":this.addressForm.value.mobile,"address":this.addressForm.value.address,"landmark":this.addressForm.value.landmark,
    "city":this.addressForm.value.city,
    "state":this.addressForm.value.state,"zipcode":this.addressForm.value.zipcode,"address_type":this.addressForm.value.address_type}
    this.productservice.editaddress(id,addressedit)
    .subscribe(editadd =>{ 
      this.productservice.loadingdismiss();
      this.productservice.presentToast(editadd.message);
      if(this.fromaddress == "1"){
        this.router.navigate(['address',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart,"totalamount":this.totalpricecart}]);
      }
      else{
        this.router.navigate(['tabs/profile']);
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
