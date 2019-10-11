import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastController,LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CheckzipcodeService {
  token: string;
  private apiUrl = environment.apiUrl;
  headers: any;
  options: any;
  isLoading = false;
  constructor(private http : HttpClient,public toastController: ToastController,public alertController: AlertController,public loadingController: LoadingController) {
    this.token=localStorage.getItem("token");
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers= this.headers.append("Authorization", "Bearer " + this.token);
    
   }

   getallzipcode(): Observable<any> {
    const body= {};
    return this.http.post(this.apiUrl + 'getuserszipcode',body,this.headers);
  }
  }

  
