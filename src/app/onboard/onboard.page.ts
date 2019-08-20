import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  gettingstarted(){
    this.router.navigate(['dashboard']);
  }
  signup(){
    this.router.navigate(['register']);
  }
}
