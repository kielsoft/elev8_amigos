import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Member } from 'src/app/models';
import { CoreService } from 'src/app/services/core.service';

@Component({
    selector: 'RegisterPage',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class RegisterPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        nin: ['78989887661', [Validators.required]],
        fullname: ['Olayode Ezekiel', [Validators.required]],
        phone: ['0808999001', [Validators.required]],
        stateOfOrigin: ['Lagos', [Validators.required]],
        password: ['1234', [Validators.required]],
        status: ['Administrator'],
    });

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
    }

    async createMember() {
        const member = await this.coreService.database.register(this.pageForm.value as Member)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(member) this.coreService.router.navigate(["/login"])
    }
}
