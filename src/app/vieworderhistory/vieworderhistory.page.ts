import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

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

  constructor(private location:Location,private router: Router,private alertCtrl: AlertController,public productservice:ProductsService,private route: ActivatedRoute) {
    this.singleid = route.snapshot.paramMap.get('id');
    this.status = route.snapshot.paramMap.get('status');
    this.getsingleorderdetails(this.singleid,this.status);
   }

  ngOnInit() {
    this.imgURl = this.imageUrl;
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.status = this.route.snapshot.paramMap.get('status');
    this.getsingleorderdetails(this.singleid,this.status);
  }
  getsingleorderdetails(id,status){
    this.productservice.presentLoading();
    this.productservice.getsingleorderdetailsservice(id,status)
    .subscribe(product =>{ 
      this.getsingleorder = product.data;
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
  async presentAlertConfirm(id) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: 'Are you sure want to cancel this product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.cancelorders(id);
          }
        }
      ]
    });

    await alert.present();
  }
  cancelorders(id){
    this.productservice.presentLoading();
    this.productservice.cancelorderbyuser(id)
    .subscribe(product =>{ 
      this.productservice.presentToast(product.message);
      this.getsingleorderdetails(this.singleid,this.status);
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  back(){
    this.router.navigateByUrl('/myorders');
  }
}
