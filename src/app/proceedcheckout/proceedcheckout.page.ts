import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { environment } from '../../environments/environment';
import { Events, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

declare var RazorpayCheckout: any;


@Component({
  selector: 'app-proceedcheckout',
  templateUrl: './proceedcheckout.page.html',
  styleUrls: ['./proceedcheckout.page.scss'],
  
})
export class ProceedcheckoutPage implements OnInit {
  totalamount: number;
  selectedlength: any;
  totalpricecart: any;
  productListsfromcart: string;
  cartcount: any;
  cartDetails: any;
  fromcart: string;
  customer_id: any;
  user_id: string;
  price: any;
  totalprice: any;
  obj: any;
  quantityperproduct: { "quantityperproduct": any; };
  public imageUrl = environment.imageUrl;
  quantity: string;
  singleid: any;
  
  submitAttempt: boolean = false;
  addaddress:boolean = false;
  getsingleProductList:any=[];
  item_qty:any="1";
  getalladdress:any =[];
  address = { addvalue: ''};
  getaddress:any=[];
  fromorder:any;
  item_qtycheck :any=1;
  totalQty:any;
  qtycheck:any;

  constructor(private location:Location,public alertController: AlertController,public events: Events,public formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,public productservice:ProductsService) {
    
    this.singleid = route.snapshot.paramMap.get('id');
    this.quantity = route.snapshot.paramMap.get('quantity');
    this.fromcart = route.snapshot.paramMap.get('fromcart');
    this.totalpricecart = route.snapshot.paramMap.get('totalamount');
    this.customer_id = route.snapshot.paramMap.get('customer_id');
    this.quantityperproduct = {"quantityperproduct":this.quantity};
    this.fromorder = route.snapshot.paramMap.get('fromorder');
    this.getsingleaddress(this.customer_id);
    if(this.fromcart != "1"){
      this.getsingleproductlist(this.singleid);
    }
    this.item_qty=+(this.quantity);
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);

   }
 
  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    // localStorage.setItem('cartDetails',(JSON.parse(localStorage.getItem('cart_items'))));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
    this.user_id = localStorage.getItem("user_id");

  }
  editaddress(){

  }


  ionViewWillEnter(){
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
    if(this.cartDetails){
      this.selectedlength = this.cartDetails.length;
      let total = 0;
      for (var i = 0; i < this.cartDetails.length; i++) {
          if (this.cartDetails[i].totalproductprice) {
              total += (this.cartDetails[i].price * this.cartDetails[i].quantityperproduct);
              this.totalamount = total;
          }
      }
      return total;
    }
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.quantity = this.route.snapshot.paramMap.get('quantity');
    this.fromcart = this.route.snapshot.paramMap.get('fromcart');
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    this.totalpricecart = this.route.snapshot.paramMap.get('totalamount');
    this.customer_id = this.route.snapshot.paramMap.get('customer_id');
    this.quantityperproduct = {"quantityperproduct":this.quantity};
    this.getsingleaddress(this.customer_id);
    if(this.fromcart != "1"){
      this.getsingleproductlist(this.singleid);
    }
    this.item_qty=+(this.quantity);
    this.user_id = localStorage.getItem("user_id");
    this.allgetAddress(this.user_id);
  }
  getsingleaddress(id){
    this.productservice.presentLoading();
    this.productservice.viewsingleaddress(id)
    .subscribe(getsinaddress =>{ 
      this.getaddress = getsinaddress.data;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  changeaddress(){
    if(this.fromcart == "1"){
    this.router.navigate(['address',{"fromcart":"1","productLists":this.cartDetails,"totalamount":this.totalamount,'fromorder':this.fromorder}]);
    }
    else{
      this.router.navigate(['address',{"id":this.singleid,"quantity":this.quantity,'fromorder':this.fromorder}]);
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
  getsingleproductlist(id){
    this.productservice.presentLoading();
    this.productservice.getproductlistsingle(id)
    .subscribe(product =>{ 
      this.productservice.loadingdismiss();
      this.getsingleProductList = product.data;
      this.price = product.data[0].price;
      this.obj = Object.assign(product.data[0], this.quantityperproduct);
      this.totalprice = (product.data[0].price * this.item_qty);
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  incrementQty(quantity){

    var qty = this.item_qty;
    var qnty = qty +=1;
    this.productservice.quantityavailcheck(qnty,this.singleid)
    .subscribe(qtny =>{ 
      this.qtycheck = qtny.message;
      if(this.qtycheck == "true"){
        this.item_qty += 1;
        this.totalprice = (this.price * this.item_qty);
        }
        else{
          this.productservice.presentToast( this.qtycheck)
        }
    },
    err =>{
      this.productservice.presentToast(err.error.message);
   })
    // if(quantity > this.item_qty){
    //   this.item_qty += 1;
    //   this.totalprice = (this.price * this.item_qty);
    //   }
    //   else{
    //     this.productservice.presentToast('Only available this quatity only., Sorry !!')
    //   }

    }
    
   
    decrementQty(){
    if(this.item_qty-1 < 1){
      this.item_qty = 1;
      this.totalprice = (this.price * this.item_qty);
    }
    else{
      this.item_qty -= 1;
      this.totalprice = (this.price * this.item_qty);
    }
    }
  proceedtobuyitems(){
    if(this.fromcart == '1'){
      this.proceedtobuycart();
    }
    else{
      this.proceedtobuy(this.singleid);
    }
  }
    async proceedtobuycart() {
      localStorage.setItem('totalcostsingleproductcart', this.totalpricecart);
      if(this.customer_id == "" || this.customer_id == undefined){
        this.productservice.presentToast("Please Select The Delivery Address");
      }
      else{
      const alert = await this.alertController.create({
        header: '',
        message: 'Do you want to submit this order?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.proceedtobuycartconfirm();
            }
          }
        ]
      });

  
      await alert.present();
    }
    }
    proceedtobuycartconfirm(){
     console.log(JSON.parse(localStorage.getItem('cart_items')));
        this.productservice.presentLoading();
        this.productservice.checkoutcart(this.user_id,this.customer_id,this.cartDetails,this.totalpricecart)
        .subscribe(product =>{ 
          this.productservice.loadingdismiss();
          var options = {
            description: 'CTLKART',
            currency: 'INR',
            key: 'rzp_test_cGa8WOh98HS217',
            amount: (this.totalpricecart * 100),
            prefill: {
              email: localStorage.getItem('email'),
              contact: localStorage.getItem('mobile'),
              name: localStorage.getItem('username')
            },
            "notes": {
              "email": localStorage.getItem('email'),
              "service_cost":(this.totalpricecart * 100),
            },
            // theme: {
            //   color: '#F37254'
            // }
          }
              
           
          var successCallback = function(success) {
            // alert(success.razorpay_payment_id)
            // var orderId = success.razorpay_order_id;
            // var signature = success.razorpay_signature;
            var url  = localStorage.getItem("rootUrl")+"razorPaymentResponse";
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
         xmlhttp.open("POST", url,true);
         
         xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         xmlhttp.setRequestHeader("Authorization", "Bearer "+ localStorage.getItem("token"));
         xmlhttp.send(JSON.stringify({ "razorpay_payment_id": success.razorpay_payment_id,"product_cost": localStorage.getItem('totalcostsingleproductcart'),"user_id": localStorage.getItem("user_id"),"productListsfromcart": JSON.parse(localStorage.getItem('cart_items'))}));
         
         xmlhttp.onload = function () {
           var users = JSON.parse(xmlhttp.responseText);
           var error = users.error;
          var result=users.result;
          localStorage.removeItem('cart_items');
          // localStorage.removeItem('cart_items');
        
           // if(result){
           //    nav.presentConfirm(result);
           // }
           //  if(error){
           //    nav.presentConfirm(error);
           // }
           }
          }
           
          var cancelCallback = function(error) {
            alert(error.description + ' (Error '+error.code+')')
          }
           
          RazorpayCheckout.on('payment.success', successCallback)
          RazorpayCheckout.on('payment.cancel', cancelCallback)
          RazorpayCheckout.open(options)


          this.productservice.presentToast(product.message);
          this.router.navigate(['checkoutsuccess']);
        
          
        },
        err =>{
          this.productservice.loadingdismiss();
          this.productservice.presentToast(err.error.message);
       })
      
      
    }
    async proceedtobuy(product_id) {
      localStorage.setItem('totalcostsingleproduct', this.totalprice);
      localStorage.setItem('product_id', product_id);
      if(this.customer_id == "" || this.customer_id == undefined){
        this.productservice.presentToast("Please Select The Delivery Address");
      }
      else{
      const alert = await this.alertController.create({
        header: '',
        message: 'DO you want to submit this order?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.proceedtobuyconfirm(product_id);
            }
          }
        ]
      });

  
      await alert.present();
    }
    }
    proceedtobuyconfirm(product_id){
        this.productservice.presentLoading();
        this.productservice.checkout(this.user_id,this.customer_id,product_id,this.totalprice,this.item_qty)
        .subscribe(product =>{ 
          this.productservice.loadingdismiss();
          var options = {
            description: 'CTLKART',
            currency: 'INR',
            key: 'rzp_test_cGa8WOh98HS217',
            amount: (this.totalprice * 100),
            prefill: {
              email: localStorage.getItem('email'),
              contact: localStorage.getItem('mobile'),
              name: localStorage.getItem('username')
            },
            "notes": {
              "email": localStorage.getItem('email'),
              "service_cost":(this.totalprice * 100),
            },
            // theme: {
            //   color: '#F37254'
            // }
          }
              
           
          var successCallback = function(success) {
            // alert(success.razorpay_payment_id)
            // var orderId = success.razorpay_order_id;
            // var signature = success.razorpay_signature;
            var url  = localStorage.getItem("rootUrl")+"razorPaymentResponse";
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
         xmlhttp.open("POST", url,true);
         
         xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         xmlhttp.setRequestHeader("Authorization", "Bearer "+ localStorage.getItem("token"));
         xmlhttp.send(JSON.stringify({ "razorpay_payment_id": success.razorpay_payment_id,"product_cost":  localStorage.getItem('totalcostsingleproduct'),"user_id": localStorage.getItem("user_id"),"product_id":  localStorage.getItem('product_id')}));
         
         xmlhttp.onload = function () {
           var users = JSON.parse(xmlhttp.responseText);
           var error = users.error;
          var result=users.result;
         
           // if(result){
           //    nav.presentConfirm(result);
           // }
           //  if(error){
           //    nav.presentConfirm(error);
           // }
           }
          }
           
          var cancelCallback = function(error) {
            alert(error.description + ' (Error '+error.code+')')
          }
           
          RazorpayCheckout.on('payment.success', successCallback)
          RazorpayCheckout.on('payment.cancel', cancelCallback)
          RazorpayCheckout.open(options)
          
          this.productservice.presentToast(product.message);
          this.router.navigate(['checkoutsuccess']);
         
        },
        err =>{
          this.productservice.loadingdismiss();
          this.productservice.presentToast(err.error.message);
       })
      
      
    }
    viewcart(){
      this.router.navigate(['/viewcartproduct']);
    }
    back(){
      this.location.back();
    }
}
