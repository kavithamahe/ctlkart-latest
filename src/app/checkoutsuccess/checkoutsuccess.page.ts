import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-checkoutsuccess',
  templateUrl: './checkoutsuccess.page.html',
  styleUrls: ['./checkoutsuccess.page.scss'],
})
export class CheckoutsuccessPage implements OnInit {

  status: any;
  order_id: any;
  constructor(public router:Router,public events: Events,private route: ActivatedRoute,) {
    this.order_id = route.snapshot.paramMap.get('order_id');
    this.status = route.snapshot.paramMap.get('status');
   }

  ngOnInit() {
                    
                    localStorage.removeItem('category_id');
                    localStorage.removeItem('subcategory_id');
                    localStorage.removeItem('subcategoryname');
                    localStorage.removeItem('singleid');
                    localStorage.removeItem('status');
                    localStorage.removeItem('fromorder');
                    // localStorage.removeItem('cart_items');
                    // this.events.publish('cart');
  }
  continueshopping(){
    this.router.navigate(['']);
  }
  vieworder(){
    this.router.navigate(['/vieworderhistory',{"orderid":this.order_id,"status":this.status}]);
  }
}
