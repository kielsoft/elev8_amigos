import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VoteSessionCandidate, Position } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VoteSessionDetailPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VoteSessionPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        name: ['Club Executives 2022/2023', [Validators.required]],
        description: ['Club Executives 2022/2023', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
    });

    candidates: VoteSessionCandidate[] = [];
    positions: Position[] = [];

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
    
    async fetchPosition() {
        this.errorMessage = "";
        this.positions = await this.coreService.database.fetchPositions()
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })
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
