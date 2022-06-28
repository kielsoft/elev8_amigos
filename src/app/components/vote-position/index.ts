import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SessionMemberVote, VoteSessionCandidate } from 'models';
import { CoreService } from 'src/app/services/core.service';

@Component({
    selector: 'VotePositionComponent',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class VotePositionComponent implements OnInit {

    @Input()
    forAdmin = false
    
    @Input()
    voteSessionId = 0
    
    @Input()
    candidates: VoteSessionCandidate[] = []

    memberVote: SessionMemberVote = new SessionMemberVote()
    errorMessage = "";

    pageForm = this.fb.group({
        voteSessionId: [0, [Validators.required]],
        votePositionId: [0, [Validators.required]],
        voteCandidateId: ['', [Validators.required]],
        memberNin: ['', [Validators.required]],
    });

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }
    ngOnInit(): void {
        this.pageForm.controls.voteSessionId.setValue(this.voteSessionId)
        this.pageForm.controls.votePositionId.setValue(this.candidates[0].votePositionId)
        this.pageForm.controls.memberNin.setValue(this.coreService.member.nin)
        this.getMemberVote()
    }

    async submitMemberVote() {
        this.errorMessage = "";
        const position = await this.coreService.database.submitMemberVote(this.pageForm.value as any)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(position) {
            this.pageForm.controls.voteCandidateId.setValue("")
            alert("You have successfully voted a candidate of your choice for this position.")
        }
        this.getMemberVote()
    }

    async getMemberVote(){
        if(this.forAdmin) return;

        const sessionMemberVote: SessionMemberVote = {
            voteSessionId: this.voteSessionId,
            votePositionId: this.candidates[0].votePositionId,
            memberNin: this.coreService.member.nin
        } as any

        const votes = await this.coreService.database.fetchMemberVotes(sessionMemberVote as any)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [] as SessionMemberVote[];
        })

        if(votes.length === 1) {
            this.memberVote = votes[0]
            this.pageForm.controls.voteCandidateId.setValue(this.memberVote.voteCandidateId.toString())
        } else {
            this.memberVote = new SessionMemberVote()
        }
    }
}
