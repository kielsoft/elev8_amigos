import { Component, Input, OnInit } from '@angular/core';
import { VoteSession, VoteSessionCandidate } from 'models';
import { CoreService } from 'src/app/services/core.service';

@Component({
    selector: 'VoteSessionComponent',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class VoteSessionComponent implements OnInit {

    @Input()
    voteSession: VoteSession = new VoteSession()

    @Input()
    forAdmin = false;

    errorMessage = "";
    candidatesGroups: VoteSessionCandidate[][] = []

    constructor(
        public coreService: CoreService
    ) { }

    ngOnInit(): void {
        if(this.voteSession.rowid){
            this.fetchCadidates()
        }
    }

    async fetchCadidates() {
        this.errorMessage = "";
        const candidates = await this.coreService.database.fetchSessionCadidates({rowid: this.voteSession.rowid} as VoteSession)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })

        const positions: {[key: string]: VoteSessionCandidate[]} = {}

        candidates.forEach(candidate => {
            if(typeof positions[candidate.position.name] == 'undefined'){
                positions[candidate.position.name] = [];
            }
            positions[candidate.position.name].push(candidate)
            this.candidatesGroups = Object.values(positions)
        })
    }

}
