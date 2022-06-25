import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'MainHeaderComponent',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(
    public coreService: CoreService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    
  }

}
