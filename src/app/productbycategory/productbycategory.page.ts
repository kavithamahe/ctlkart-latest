import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Events,ActionSheetController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-productbycategory',
  templateUrl: './productbycategory.page.html',
  styleUrls: ['./productbycategory.page.scss'],
})
export class ProductbycategoryPage implements OnInit {
  subcategory_name: string;
  subcategory_id: string;
  getsubcategorylocal: any;
  cartcount: any;
  cartDetails: any;
  private imageUrl = environment.imageUrl;
  imgURl: any;
  getProductLists:any=[];
  sortby = { level: ''};
  sliderConfig = {
    slidesPerView: 3,
    spaceBetween: 6,
    autoplay:true,
    loop:true
  };
  getallsubcategory:any=[];
  term = { searchText: ''};

  constructor(private location:Location,public actionSheetController: ActionSheetController,public events: Events,public productservice:ProductsService,public router: Router,private route: ActivatedRoute) { 
    this.subcategory_id = route.snapshot.paramMap.get('id');
    this.subcategory_name = route.snapshot.paramMap.get('subcategoryname');
    if(this.subcategory_name){
      this.subcategory_name = this.subcategory_name;
    }
    else{
      this.subcategory_name = "Products";
    }
    this.getproductbysubcategory(this.subcategory_id);
  }

  ngOnInit() {
    this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
    if(this.cartDetails){
      this.cartcount = this.cartDetails.length;
    }
    this.imgURl = this.imageUrl;
  }
  ionViewWillEnter(){
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
    this.subcategory_id = this.route.snapshot.paramMap.get('id');
    this.subcategory_name = this.route.snapshot.paramMap.get('subcategoryname');
    if(this.subcategory_name){
      this.subcategory_name = this.subcategory_name;
    }
    else{
      this.subcategory_name = "Products";
    }
    this.getproductbysubcategory(this.subcategory_id);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  // getsubcategories(category_id){
  //   this.productservice.presentLoading();
  //   this.productservice.getsubcategory(category_id)
  //   .subscribe(product =>{ 
  //     this.getallsubcategory = product.data;
  //     this.productservice.loadingdismiss();
  //   },
  //   err =>{
  //     this.productservice.loadingdismiss();
  //     this.productservice.presentToast(err.error.message);
  //  })
  // }
  getproductbysubcategory(subcategory_id){
    this.productservice.presentLoading();
    this.productservice.getproductlist("",subcategory_id,"","")
    .subscribe(product =>{ 
      this.getProductLists = product.data;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  getItems(searchItem) {
    this.productservice.getproductlistsearch(this.term.searchText)
    .subscribe(product =>{ 
      this.getProductLists = product.data;
    },
    err =>{
      this.productservice.presentToast(err.error.message);
   })
  }
  filterbyCategory(id,getsubcategorylocal,val){
    this.productservice.presentLoading();
    this.productservice.getproductlist("",getsubcategorylocal,val,'')
    .subscribe(product =>{ 
      this.getProductLists = product.data;
      this.productservice.loadingdismiss();
    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
  // filterbySubategory(subcategory_id){
  //   localStorage.setItem('key',subcategory_id);
  //   this.productservice.presentLoading();
  //   this.productservice.getproductlist(this.category_id,subcategory_id,'','')
  //   .subscribe(product =>{ 
  //     this.getProductLists = product.data;
  //     this.productservice.loadingdismiss();
  //   },
  //   err =>{
  //     this.productservice.loadingdismiss();
  //     this.productservice.presentToast(err.error.message);
  //  })
  // }
  viewsingleproduct(id){
    this.router.navigate(['/viewsingleproduct',{"id":id}]);
  }
  sorybyvalue(val){
    this.getsubcategorylocal = localStorage.getItem('key');
    this.filterbyCategory('',this.getsubcategorylocal,val);
  }
  viewcart(){
    this.router.navigate(['/viewcartproduct']);
  }
  back(){
    this.location.back();
  }
}
