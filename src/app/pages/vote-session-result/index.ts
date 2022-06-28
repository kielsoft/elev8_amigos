import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoteSession } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VoteSessionResultPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VoteSessionResultPage implements OnInit {

    errorMessage = ""

    voteSession: VoteSession = new VoteSession()

    constructor(
        public coreService: CoreService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.getVoteSession({rowid: Number(this.route.snapshot.paramMap.get("id"))} as VoteSession)
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
    }
}
