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
  public toggled: boolean = false;

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
  public toggle(): void {
    this.toggled = !this.toggled;
 }
 cancelSearch(event){
   this.toggle();
   this.getproductbysubcategory(this.subcategory_id);
   this.term.searchText = "";
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
  triggerInput( ev: any ) {
    // Reset items back to all of the items
    // this.getproductList();
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.getProductLists = this.getProductLists.filter((item) => {
        return (item.product_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }  
}
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
    this.router.navigate(['tabs/viewcartproduct']);
  }
  back(){
    this.location.back();
  }
}
