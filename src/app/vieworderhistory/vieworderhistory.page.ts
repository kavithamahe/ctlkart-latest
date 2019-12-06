import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';
import { AlertController, ActionSheetController, BooleanValueAccessor, Events } from '@ionic/angular';

@Component({
  selector: 'app-vieworderhistory',
  templateUrl: './vieworderhistory.page.html',
  styleUrls: ['./vieworderhistory.page.scss'],
})
export class VieworderhistoryPage implements OnInit {
  status: any;
  totalamount: any;
  singleid: string;
  private imageUrl = environment.imageUrl;
  imgURl: any;
  getsingleorder:any=[];
  getsingleorderprice:any=[];
  user_id:any;
  review = { rating: '',ratingcomments:''};
  closerating:boolean = false;
  number: number;
  color: string;
  orderstatus:any;
  saturation:any;
  stock_status: any;
  currency_icon: any;
  getreview:any;
  constructor(public actionSheetController: ActionSheetController,public events: Events,private location:Location,private router: Router,private alertCtrl: AlertController,public productservice:ProductsService,private route: ActivatedRoute) {
    this.singleid = route.snapshot.paramMap.get('orderid');
    this.status = route.snapshot.paramMap.get('status');
    this.user_id = localStorage.getItem("user_id");
    this.getsingleorderdetails(this.singleid,this.status,this.user_id);
   }

  ngOnInit() {
    this.currency_icon = localStorage.getItem('currency_icon');
    this.stock_status = localStorage.getItem('stock_status');
    this.imgURl = this.imageUrl;
    this.singleid = this.route.snapshot.paramMap.get('orderid');
    this.status = this.route.snapshot.paramMap.get('status');
    this.user_id = localStorage.getItem("user_id");
    this.getsingleorderdetails(this.singleid,this.status,this.user_id);
    if(this.status == 3){
    this.getproductreview(this.singleid);
    }
  }
  
  onRangeChangeHandler() {

    if (this.number > 0 && this.number < 26) {
        this.color = 'dark';
    }
    else if (this.number > 25 && this.number < 51) {
      this.color = 'primary';
    }
    else if (this.number > 50 && this.number < 76) {
      this.color = 'secondary';
    }
    else {
      this.color = 'danger';
    }
  }
  getproductreview(singleid){
    this.productservice.getproductreviews(singleid)
    .subscribe(product =>{ 
      this.getreview = product.data;
    })
  }
  getsingleorderdetails(id,status,user_id){
    this.productservice.presentLoading();
    this.productservice.getsingleorderdetailsservice(id,status,user_id)
    .subscribe(product =>{ 
      this.getsingleorder = product.data;
      this.orderstatus = this.getsingleorder[0].status;
      
    //   if(this.orderstatus == "0"){
    //     this.saturation = "1";
    //     this.color = 'dark';
    // }
    // if(this.orderstatus == "1"){
    //   this.saturation = "2";
    //   this.color = 'primary';
    // }
    // if(this.orderstatus == "2"){
    //   this.saturation = "3";
    //   this.color = 'secondary';
    // }
      if(product.data){
      this.getsingleorderprice = product.data[0].items;
      if(this.getsingleorderprice){
      let total = 0;
      for (var i = 0; i < this.getsingleorderprice.length; i++) {
          if (this.getsingleorderprice[i].amount) {
              total +=(this.getsingleorderprice[i].amount * this.getsingleorderprice[i].quantity);
              this.totalamount = total;
          }
      }
      
      this.productservice.loadingdismiss();
      return total;
    }
  }
    this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  ordereview(){
    this.closerating = true;
  }
  onRateChange(event) {
    this.review.rating = event;
     console.log("‘Your rate:’", event);
     }
  viewProduct(id){
    this.router.navigate(['viewsingleproduct',{'id':id,'fromorder':'1','singleid':this.singleid,'status':this.status}]);
  }

  async presentAlertConfirm(id,status) {
    if(status == "2"){
      const alert = await this.alertCtrl.create({
        header: '',
        message: 'Your order is shipped,Please contact our store.',
        buttons: [
         {
            text: 'ok',
            handler: () => {
            }
          }
        ]
      });
  
      await alert.present();
    }
else{
  const alert = await this.alertCtrl.create({
    header: '',
    message: 'Do you want to cancel this order?',
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
          this.cancelorders(id);
        }
      }
    ]
  });

  await alert.present();
}
  }
  cancelorders(id){
    this.productservice.presentLoading();
    this.productservice.cancelorderbyuser(id)
    .subscribe(product =>{ 
      this.productservice.presentToast(product.message);
      this.getsingleorderdetails(this.singleid,this.status,this.user_id);
      this.events.publish('cancelitems');
      this.router.navigate(['tabs/myorders']);
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  reviewsent(id,order_id,orderId){
    this.productservice.presentLoading();
    this.productservice.reviewsentuser(id,this.user_id,this.review.rating,this.review.ratingcomments,order_id,orderId)
    .subscribe(product =>{ 
      this.getproductreview(this.singleid);
      this.productservice.presentToast(product.data);
      this.review.rating = "";
      this.review.ratingcomments = "";
      this.closerating = false;
      this.getsingleorderdetails(this.singleid,this.status,this.user_id);
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  back(){
    this.router.navigateByUrl('tabs/myorders');
  }
}
