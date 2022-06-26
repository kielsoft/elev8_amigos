import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VoteSession } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VoteSessionsPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VoteSessionsPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        name: ['Club Executives 2022/2023', [Validators.required]],
        description: ['Club Executives 2022/2023', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
    });

    voteSessions: VoteSession[] = [];

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.fetchVoteSessions()
    }

    async createSession() {
        this.errorMessage = "";
        const voteSession = await this.coreService.database.createSession(this.pageForm.value as any)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(voteSession) {
            alert("New Vote-Session created with Id: " + voteSession)
            this.fetchVoteSessions();
        }
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
