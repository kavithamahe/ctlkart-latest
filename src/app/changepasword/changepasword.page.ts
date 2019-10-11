import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-changepasword',
  templateUrl: './changepasword.page.html',
  styleUrls: ['./changepasword.page.scss'],
})
export class ChangepaswordPage implements OnInit {
  
submitAttempt:any;
password_submit:any;
nav:any;
changepasswordForm: FormGroup;
mytype:string ="password";
show_password:boolean = false;
allow:any;
strongRegex:any;
mediumRegex:any;
newPassword:any;
user_type:any;
  constructor(public formBuilder:FormBuilder,private _location:Location,private route: ActivatedRoute,private router: Router,public productservice:ProductsService) { 

//   ngOnInit() {
//   }

//   changePassword(){

//     if(this.password.currentpassword && this.password.newpassword && this.password.confirmpassword){
//       this.productservice.presentLoading();
//       this.productservice.changepassword(this.password)
//       .subscribe(password =>{ 
//         this.productservice.loadingdismiss();
//         this.router.navigate(['']);
//       },
//       err =>{
//         this.productservice.loadingdismiss();
//         this.productservice.presentToast(err.error.message);
//      })
//     }
//     else{
//       this.productservice.presentToast("Please Enter The Password");
//     }
 
//   }
//   back(){
//     this._location.back();
// }
// }
this.password_submit = false;
this.changepasswordForm = formBuilder.group({
    currentPassword: ['',Validators.compose([Validators.required])],
    newPassword: ['',Validators.compose([Validators.required])],
    re_enterPassword: ['',Validators.compose([Validators.required])]
    
});
  this.strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  this.mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

}
  ngOnInit() {
  }
reEnter(){
 this.password_submit = false;
}
showPassword(){
 if(this.show_password == false){
   this.mytype = "password";
 }else{
   this.mytype = "text";
 }
}
  back(){
    this._location.back();
}

  changePassword() {
 if(this.changepasswordForm.value.currentPassword == this.changepasswordForm.value.newPassword){
    this.productservice.presentToast("Current pasword and new password to be different");
  }
  else{
    if(this.changepasswordForm.valid){
 
if(this.changepasswordForm.value.newPassword != this.changepasswordForm.value.re_enterPassword){
  this.password_submit = true;
  this.submitAttempt = false;
}else{
  this.submitAttempt = false;
  this.password_submit = false; 
  let change_password_data = {"current_password": this.changepasswordForm.value.currentPassword, "new_password": this.changepasswordForm.value.newPassword, "confirm_password": this.changepasswordForm.value.re_enterPassword};
  this.productservice.changepassword(change_password_data)
  .subscribe(result =>{       
      this.productservice.presentToast(result.message);
      this.changepasswordForm.reset();
      this.router.navigate(['']);
  },
    error =>{
      if(error.status===400){
  this.productservice.presentToast(error.error.message);  
  }
  else{
   this.productservice.presentToast("Something went wrong");   
  }
  })
}
}else{
this.submitAttempt = true;
}
  }


}

ionViewDidLoad() {
console.log('ionViewDidLoad ChangePasswordPage');
}

}