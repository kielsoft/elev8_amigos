import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Member } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'MembersPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class MembersPage implements OnInit {

    errorMessage = ""
    members: Member[] = [];

    constructor(
        public coreService: CoreService,
    ) {
    }

    ngOnInit(): void {
        this.fetchMembers()
    }

    async fetchMembers() {
        this.errorMessage = "";
        const result = await this.coreService.database.fetchMembers()
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        this.members = result?.members || []
    }

}
