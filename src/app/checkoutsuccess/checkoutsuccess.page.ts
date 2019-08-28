import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkoutsuccess',
  templateUrl: './checkoutsuccess.page.html',
  styleUrls: ['./checkoutsuccess.page.scss'],
})
export class CheckoutsuccessPage implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }
  continueshopping(){
    this.router.navigate(['']);
  }
}
