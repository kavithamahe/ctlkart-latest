import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vieworderhistory',
  templateUrl: './vieworderhistory.page.html',
  styleUrls: ['./vieworderhistory.page.scss'],
})
export class VieworderhistoryPage implements OnInit {
  singleid: string;
  private imageUrl = environment.imageUrl;
  imgURl: any;
  getsingleorder:any=[];

  constructor(private location:Location,private router: Router,public productservice:ProductsService,private route: ActivatedRoute) {
    this.singleid = route.snapshot.paramMap.get('id');
    this.getsingleorderdetails(this.singleid);
   }

  ngOnInit() {
    this.imgURl = this.imageUrl;
    this.singleid = this.route.snapshot.paramMap.get('id');
    this.getsingleorderdetails(this.singleid);
  }
  getsingleorderdetails(id){
    this.productservice.presentLoading();
    this.productservice.getsingleorderdetailsservice(id)
    .subscribe(product =>{ 
      this.getsingleorder = product.data;
      this.productservice.loadingdismiss();
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
