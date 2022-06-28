import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VoteSessionCandidate, Position, VoteSession } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VoteSessionDetailPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VoteSessionPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        voteSessionId: ['', [Validators.required]],
        votePositionId: ['', [Validators.required]],
        memberNin: ['0809090909090', [Validators.required]],
        suspended: ['0', [Validators.required]],
    });

    voteSession: VoteSession = new VoteSession()
    candidates: VoteSessionCandidate[] = [];
    positions: Position[] = [];

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.getVoteSession({rowid: Number(this.route.snapshot.paramMap.get("id"))} as VoteSession)
        this.fetchCadidates()
    }

    async getVoteSession(voteSession: VoteSession) {
        this.errorMessage = "";
        this.voteSession = await this.coreService.database.getVoteSession(voteSession)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return new VoteSession();
        })

        if(!this.voteSession.name) {
           this.coreService.router.navigate(["/vote-sessions"])
           alert(this.errorMessage || 'Vote session not found')
        }

        this.pageForm.controls.voteSessionId.setValue(this.voteSession.rowid.toString())

        // fetch Positions
        this.fetchPosition()

    }

    async fetchPosition() {
        this.errorMessage = "";
        this.positions = await this.coreService.database.fetchPositions()
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })
    }

    async createCandidate() {
        this.errorMessage = "";
        const success = await this.coreService.database.createCandidate(this.pageForm.value as any)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return false;
        })

        if(success) {
            alert("New Vote-Session candidate is created successfully")
            this.fetchCadidates();
        }
    }
    
    async fetchCadidates() {
        this.errorMessage = "";
        this.candidates = await this.coreService.database.fetchSessionCadidates({rowid: Number(this.route.snapshot.paramMap.get("id"))} as VoteSession)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })
    }
}
