import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "../models";
import { WebSQLService } from "./websql.service";

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    loggedInUser: Member = null as any
    public lastUrl = ""

    constructor(
        public router: Router,
        public database: WebSQLService
    ) {
        this.loadExistingLoggedInMember()
    }

    get member(): Member{
        return this.loggedInUser;
    }

    set member(member: Member) {
        this.loggedInUser = member;
        localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser))
    }

    get isMemberLoggedIn(): boolean {
        return !!this.member?.status && this.member?.status != "Blocked"
    } 
    
    get isAdminLoggedIn(): boolean {
        return this.member?.status === 'Administrator'
    }

    private loadExistingLoggedInMember() {
        try {
            const data = localStorage.getItem("loggedInUser") || "";
            const savedLoggedInUserData = JSON.parse(data) as Member
            if(savedLoggedInUserData.rowid) this.member = savedLoggedInUserData;
        } catch (e: any) {
            console.log(e.message)
        }
    }

    getSimpleDate(cTime: Date | string) {
        if(typeof cTime == 'string'){
            cTime = new Date(cTime)
        }

        return cTime.toISOString();
    }
}