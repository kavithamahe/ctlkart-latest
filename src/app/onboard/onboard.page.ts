import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  constructor(public router: Router,public events: Events) { }

  ngOnInit() {
  }
  gettingstarted(){
    this.router.navigate(['dashboard']);
    this.events.publish('onboard');
  }
  signup(){
    this.router.navigate(['register']);
    this.events.publish('onboard');
  }
}
