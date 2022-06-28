import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Member } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'LoginPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class LoginPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        nin: ['78989887661', [Validators.required]],
        password: ['1234', [Validators.required]],
    });

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
    }

    async login() {
        const member = await this.coreService.database.login(this.pageForm.value as Member)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        const nextPageUrl = this.coreService.lastUrl || "/home"
        if(member) {
            this.coreService.member = member;
            this.coreService.router.navigate([nextPageUrl]);
        }
    }
}
