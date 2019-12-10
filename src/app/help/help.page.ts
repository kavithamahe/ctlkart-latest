import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  gethomedetails:any=[];
  constructor(private router: Router,public productservice:ProductsService) { }

  ngOnInit() {
    this.gethelp();
  }
  back(){
    this.router.navigate(['']);
  }
  gethelp(){
    this.productservice.presentLoading();
    this.productservice.getpagesDetails('help').subscribe(data => {
      this.gethomedetails = data.data[0];
      this.productservice.loadingdismiss();

    },
    err =>{
      this.productservice.loadingdismiss();
      this.productservice.presentToast(err.error.message);
   })
  }
 
}
