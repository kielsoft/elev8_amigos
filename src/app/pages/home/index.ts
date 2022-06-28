import { Component, OnInit } from '@angular/core';
import { VoteSession } from 'models';
import { CoreService } from 'src/app/services/core.service';

@Component({
    selector: 'HomePage',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class HomePage implements OnInit {
    errorMessage = "";
    voteSessions: VoteSession[] = [];

    constructor(
        public coreService: CoreService,
    ) { }

    ngOnInit(): void {
        this.fetchVoteSessions()
    }

    async fetchVoteSessions() {
        this.errorMessage = "";
        this.voteSessions = await this.coreService.database.fetchVoteSessions()
            .catch(e => {
                this.errorMessage = e.message || "Unknown error has occurred."
                return [];
            })
    }

}
