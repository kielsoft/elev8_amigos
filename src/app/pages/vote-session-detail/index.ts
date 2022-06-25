import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VoteSessionCandidate } from 'src/app/models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VoteSessionDetailPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VoteSessionDetailPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        name: ['Club Executives 2022/2023', [Validators.required]],
        description: ['Club Executives 2022/2023', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
    });

    candidates: VoteSessionCandidate[] = [];

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        //this.fetchVoteSessions()
    }

    async createCandidate() {
        this.errorMessage = "";
        const candidateId = await this.coreService.database.createCandidate(this.pageForm.value as any)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(candidateId) {
            alert("New Vote-Session created with Id: " + candidateId)
            //this.fetchVoteSessions();
        }
    }
    
    async fetchCadidate() {
        this.errorMessage = "";
        this.candidates = await this.coreService.database.fetchCadidate()
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })
    }
}
