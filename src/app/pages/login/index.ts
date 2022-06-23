import { Component, HostListener, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'LoginPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class LoginPage implements OnInit {

  constructor(
    public coreService: CoreService
  ) {
   }

  ngOnInit(): void {

    
  }
}