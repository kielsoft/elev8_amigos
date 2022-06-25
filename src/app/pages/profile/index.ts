import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'ProfilePage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class ProfilePage implements OnInit {

  constructor(
    public coreService: CoreService
  ) { }

  ngOnInit(): void {
  }

}
