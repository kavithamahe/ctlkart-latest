import { Component,ViewChild } from '@angular/core';
// import {  ViewChildren, QueryList } from '@angular/core';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Platform,MenuController, Events, AlertController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ActivatedRoute,RouterStateSnapshot,RoutesRecognized,RouterState,ActivatedRouteSnapshot   } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  sub: any;
  quantity: string;
  fromcart: string;
  singleid: any;
  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
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
      console.log(this.token)
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
      
        const state: RouterState = this.router.routerState;
        const snapshot: RouterStateSnapshot = state.snapshot;
        const children: ActivatedRouteSnapshot["children"] = snapshot.root.children;
        const child = children[0].params;
        console.log(child.id);
        this.singleid =child.id;
        this.fromcart = child.fromcart;
        this.quantity =child.quantity;
        // this.sub = this.router.events.subscribe(val => {
        //   if (val instanceof RoutesRecognized) {
        //     console.log(val.state.root.firstChild.params);
        //     this.singleid = val.state.root.firstChild.params.id;
        //     this.fromcart = val.state.root.firstChild.params.fromcart;
        //     this.quantity = val.state.root.firstChild.params.quantity;
        //   }
        // });
        // console.log(this.sub);
          let urlTree = this.router.parseUrl(this.router.url);
          let urlWithoutParams = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
          console.log(urlWithoutParams);
          if (this.routerOutlet && this.routerOutlet.canGoBack()) {
            console.log(urlWithoutParams);
            if (urlWithoutParams === 'address'){
              console.log(this.singleid);
            if(this.fromcart == "1"){
              console.log("cart");
              this.router.navigate(['tabs/viewcartproduct']);
            }
            else{
              console.log("single");
              this.router.navigate(['viewsingleproduct',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
            }
              
            }
            else if(urlWithoutParams === 'checkout'){
              console.log(this.singleid);
              console.log("single");
              if(this.fromcart == "1"){
                console.log("cart");
                this.router.navigate(['tabs/viewcartproduct']);
              }
              else if(this.singleid != 'null'){
                console.log("single");
                this.router.navigate(['viewsingleproduct',{"id":this.singleid,"quantity":this.quantity,"fromcart":this.fromcart}]);
              }
              else{
                this.router.navigate(['tabs/dashboard']);
              }
            }
            
            else{
              if(urlWithoutParams == "viewsingleproduct"){
                this.router.navigate(['tabs/dashboard']);
              }
              else if(urlWithoutParams == "checkoutsuccess"){
                this.router.navigate(['tabs/dashboard']);
              }
              else if (urlWithoutParams == "tabs/dashboard"){
                this.menu.close();
                this.presentAlert("Exit App");
              }
              else if(urlWithoutParams == "tabs/checkout"){
                this.router.navigate(['tabs/dashboard']);
              }
              else if(urlWithoutParams == "tabs/profile"){
                this.router.navigate(['tabs/dashboard']);
              }
              else if(urlWithoutParams == "tabs/category"){
                this.router.navigate(['tabs/dashboard']);
              }
              else{
                if(urlWithoutParams == "tabs/viewcartproduct"){
                  this.router.navigate(['tabs/dashboard']);
                }
                else{
                  this.routerOutlet.pop();
                  this.menu.close();
                }
               
              }
           
            }
          
          } else if (this.router.url === 'tabs/dashboard') {
            console.log(urlWithoutParams);
            this.menu.close();
            // or if that doesn't work, try
            navigator['app'].exitApp();
          } else {
            console.log("cart");
            if(urlWithoutParams == "tabs/viewcartproduct"){
              this.router.navigate(['tabs/dashboard']);
            }
            else if(urlWithoutParams == "tabs/profile"){
              this.router.navigate(['tabs/dashboard']);
            }
            else if(urlWithoutParams == "tabs/category"){
              this.router.navigate(['tabs/dashboard']);
            }
            else if(urlWithoutParams == "tabs/checkout"){
              this.router.navigate(['tabs/dashboard']);
            }
            else{
            this.menu.close();
            this.presentAlert("Exit App");
            }
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
  this.router.navigate(['tabs/dashboard']);
  this.menu.close();
}
shopbycategory(){
  this.router.navigate(['tabs/category']);
  this.menu.close();
}

}
