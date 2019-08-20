import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-subcategorylist',
  templateUrl: './subcategorylist.page.html',
  styleUrls: ['./subcategorylist.page.scss'],
})
export class SubcategorylistPage implements OnInit {

  category_id: any;
  imgURl: any;
  cartcount: any;
  cartDetails: any;
  private imageUrl = environment.imageUrl;
  getallcategories:any=[];
  getallsubcategory:any=[];
  constructor(private router: Router,public events: Events,public productservice:ProductsService,private route: ActivatedRoute) {
    this.category_id = route.snapshot.paramMap.get('id');
    this.getsubCategory(this.category_id);
   }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
    this.imgURl = this.imageUrl;
  }
  ionViewWillEnter(){
    this.category_id = this.route.snapshot.paramMap.get('id');
    this.getsubCategory(this.category_id);
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
  }
  getsubCategory(category_id){
    this.productservice.presentLoading();
    this.productservice.getsubcategory(category_id)
    .subscribe(product =>{ 
      this.getallsubcategory = product.data;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  viewcart(){
    this.router.navigate(['/viewcartproduct']);
  }
  getsubcategory(id){
    this.router.navigate(['/productbycategory',{"id":id}],{skipLocationChange: true});
  }
}