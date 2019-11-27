import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicRatingModule } from 'ionic4-rating';

import { AngularFireAuth } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductPipeModule } from './pipes/productPipe.module';
import { ProductfilterPipe } from './pipes/productfilter.pipe';
import { custumePipeModule } from './pipes/custumepipe.module';

import { IonicSelectableModule } from 'ionic-selectable';



export const firebaseConfig = {
  apikey:"AIzaSyDVF3cXrQr7t7Ab9eTJ0QTtOOUecZVIZvw",
  authDomain: "313104804796-2n9i4k22k3d0voqnrljsurf9paqlgmnc.apps.googleusercontent.com",
  databaseURL: "https://ctlkart.firebaseio.com",
  projectId: "ctlkart",
  storageBucket: "ctlkart.appspot.com",
  messagingSenderId: "313104804796"
  };
  library.add(fas, far, fab);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
     BrowserModule,
     FormsModule,
     ReactiveFormsModule,
     HttpClientModule,
     ProductPipeModule,
     custumePipeModule,
     IonicModule.forRoot(), 
     AngularFireModule.initializeApp(firebaseConfig),
     AppRoutingModule,
     IonicRatingModule,
     FontAwesomeModule,
     IonicSelectableModule
     
     
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseAuthentication,AngularFireAuth,Camera,File,Keyboard,FirebaseX ],
  bootstrap: [AppComponent]
})
export class AppModule {}
