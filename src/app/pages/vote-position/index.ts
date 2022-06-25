import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Member, Position } from 'src/app/models';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'VotePosition',
  templateUrl: './template.html',
  styleUrls: ['./style.scss']
})
export class VotePosition implements OnInit {

    errorMessage = ""

    pageForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
    });

    constructor(
        public coreService: CoreService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        
    }

    async createPosition() {
        this.errorMessage = "";
        const position = await this.coreService.database.createPosition(this.pageForm.value as Position)
        .catch(e => {
            this.errorMessage = e.message || "Unknown error has occurred."
            return null;
        })

        if(position) {
            alert("New position created with Id: " + position)
        }
    }

}
