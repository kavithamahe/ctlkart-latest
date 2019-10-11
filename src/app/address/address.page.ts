import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { CheckzipcodeService } from '../checkzipcode.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  zipcode: any;
  getaddress: any =[];
  checkzipcode: any;
  subcategory_name: any;
  category_id: any;
  subcategory_id: any;
  type: string;
  customer_id: any;
  user_id: string;
  checkoutForm: FormGroup;
  getalladdress: any = [];
  quantity: string;
  singleid: any;
  cartcount: any;
  cartDetails: any;
  fromcart: string;
  totalpricecart: string;
  submitAttempt: boolean = false;
  public selectedAsset;
  fromorder:any;
  gelallcheckcodedetails:any=[];
  
  constructor(private location: Location, private router: Router, public check:CheckzipcodeService,private route: ActivatedRoute, public productservice: ProductsService, public formBuilder: FormBuilder) {
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);
    this.subcategory_id = route.snapshot.paramMap.get('subcategory_id');
    this.category_id = route.snapshot.paramMap.get('category_id');
    this.subcategory_name = route.snapshot.paramMap.get('subcategoryname');
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.type = this.route.snapshot.paramMap.get('type');
    this.fromorder = route.snapshot.paramMap.get('fromorder');

    this.initForm();
  }

  ngOnInit() {
    this.getzipcode();
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if (this.cartDetails) {
      this.cartcount = this.cartDetails.length;
    }
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.type = this.route.snapshot.paramMap.get('type');
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);

  }
  ionViewWillEnter() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);

  }
  getzipcode(){
    this.check.getallzipcode().subscribe(data =>{
     this.gelallcheckcodedetails = data.data;
    }, 
     err =>{
      this.productservice.presentToast(err.error.message);
   })
  }
  addAddress() {
    this.router.navigate(['addaddress', { "id": this.singleid, "quantity": this.quantity, "fromcart": this.fromcart, "customer_id": this.customer_id, "totalamount": this.totalpricecart }])
  }

  initForm() {
    this.checkoutForm = this.formBuilder.group({
      address: ['', Validators.compose([Validators.required])],
      landmark: [''],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])]

    });
  }
  radioSelects(event, id) {
    console.log(event)
    this.customer_id = id;
      this.productservice.presentLoading();
      this.productservice.viewsingleaddress(id)
      .subscribe(getsinaddress =>{ 
        this.getaddress = getsinaddress.data;
        this.zipcode = this.getaddress.zipcode
        this.productservice.loadingdismiss();
      },
      err =>{
        this.productservice.loadingdismiss();
        this.productservice.presentToast(err.error.message);
     })
  }
  allgetAddress(user_id) {
    this.productservice.presentLoading();
    this.productservice.getaddress(user_id)
      .subscribe(product => {
        this.getalladdress = product.data;
        this.productservice.loadingdismiss();
      },
        err => {
          this.productservice.loadingdismiss();
          this.productservice.presentToast(err.error.message);
        })
  }
  next(id) {
    this.customer_id = id;
    this.productservice.presentLoading();
    this.productservice.viewsingleaddress(id)
    .subscribe(getsinaddress =>{ 
      this.getaddress = getsinaddress.data;
      this.zipcode = this.getaddress.zipcode
      this.productservice.loadingdismiss();
      this.checkzipcode = this.gelallcheckcodedetails.find(p => this.zipcode == p.zipcode);
      console.log(this.checkzipcode)
      if(this.checkzipcode == undefined){
        this.productservice.presentToast("your zipcode is not availble,please select another address");
      }
      else{
        if (this.customer_id) {
          this.router.navigate(['proceedcheckout', { "id": this.singleid, "quantity": this.quantity, "fromcart": this.fromcart, "customer_id": this.customer_id, "totalamount": this.totalpricecart }]);
        }
        else {
          this.productservice.presentToast("Please Select the delivery address");
        }
      }
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
   
 
  }
  editaddress(id) {
    this.router.navigate(['editprofile', {
      "type": "address", "id": id, "fromaddress": "1",
      "ids": this.singleid, "quantity": this.quantity, "fromcart": this.fromcart, "totalamount": this.totalpricecart
    }]);
  }
  back() {
    console.log(this.fromcart)
    if (this.fromcart == "1") {
      this.router.navigate(['tabs/viewcartproduct']);
    }
    else {
      this.router.navigate(['viewsingleproduct', { "id": this.singleid, "quantity": this.quantity, "fromcart": this.fromcart, "customer_id": this.customer_id, "totalamount": this.totalpricecart,"category_id":this.category_id,"subcategoryname":this.subcategory_name,"subcategory_id":this.subcategory_id }]);
    }
  }
}
