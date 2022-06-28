import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Member, Position } from 'src/../models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VotePositionPage',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VotePositionPage implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
    });

    positions: Position[] = [];

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.fetchPositions()

    }

    async createPosition() {
        this.errorMessage = "";
        const position = await this.coreService.database.createPosition(this.pageForm.value as Position)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(position) {
            alert("New position created successfully")
            this.pageForm.reset()
            this.fetchPositions();
        }
    }
    
    async fetchPositions() {
        this.errorMessage = "";
        this.positions = await this.coreService.database.fetchPositions()
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return [];
        })
    }

}
