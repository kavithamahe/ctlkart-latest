import { Component,ViewChild } from '@angular/core';
// import {  ViewChildren, QueryList } from '@angular/core';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Platform,MenuController, Events, AlertController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  cartDetails: any;
  token: any;
  showButton : any=false;
  login_status: any=false;
  cartcount: any;
  public href: string = "";
  tabsbar :any = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private router: Router,
    public firebaseAuthentication:FirebaseAuthentication,
    public events: Events,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');
    this.href = this.router.url;
    if(this.href == "/" && !this.token){
      this.router.navigate(['onboard']);
     
    }
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
      
    this.events.subscribe('loggedin', ()=>{
      this.showButton = true;  
      this.token = localStorage.getItem('token');
    })
    this.events.subscribe('loggedout', ()=>{
      this.showButton = false;   
      this.token = localStorage.removeItem('token');
      this.cartDetails = localStorage.removeItem('cart_items');
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
      }
    })
   
    this.initializeApp();
  }

  initializeApp() {
    console.log(this.activatedRoute.snapshot.url); // array of states
    // console.log(this.activatedRoute.snapshot.url[0].path); 
    this.events.subscribe('cart', ()=>{
      this.cartDetails = (JSON.parse(localStorage.getItem('cart_items')));
      if(this.cartDetails){
        this.cartcount = this.cartDetails.length;
        console.log(this.cartcount)
      }
    })
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });


      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
         if (this.platform.is('android')) {
          this.statusBar.overlaysWebView(false);
          this.statusBar.backgroundColorByHexString('#000000');
              }
              if (this.platform.is('ios')) {
                 // StatusBar.overlaysWebView(false);
                 //  StatusBar.styleLightContent();
                 this.statusBar.hide();
              }
         setTimeout(() => {
          this.statusBar.hide();
        }, 100);
        
        this.platform.backButton.subscribeWithPriority(0, () => {
          console.log(this.router.url)
          console.log(this.activatedRoute.snapshot.url);
          if (this.routerOutlet && this.routerOutlet.canGoBack()) {
            if (this.router.url === '/address;id=2;quantity=1;fromcart=null'){
              this.router.navigate(['']);
            }
            else{
              
            this.routerOutlet.pop();
            this.menu.close();
            }
          
          } else if (this.router.url === '/dashboard') {
            this.menu.close();
            // or if that doesn't work, try
            navigator['app'].exitApp();
          } else {
            this.menu.close();
            this.presentAlert("Exit App");
          }
        });
      });
  }
  async presentAlert(message) {
    let alert  = await this.alertController.create({
      header: 'Do you want to exit the app?',
      //message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert =null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }
  logout() {
    this.events.publish('loggedout');
    localStorage.removeItem('token');
    localStorage.removeItem('cart_items');
    this.menu.close();
    this.router.navigate(['']);
    this.login_status = true;

}
login(){
  this.menu.close();
  this.router.navigate(['checkout']);
}
changepassword(){
  this.router.navigate(['changepasword']);
  this.menu.close();
}
getmyorders(){
  this.router.navigate(['myorders']);
  this.menu.close();
}
home(){
  this.router.navigate(['tabs/dashboard']);
  this.menu.close();
}
viewaccount(){
  this.router.navigate(['profile']);
  this.menu.close();
}
shopbycategory(){
  this.router.navigate(['tabs/category']);
  this.menu.close();
}

}
