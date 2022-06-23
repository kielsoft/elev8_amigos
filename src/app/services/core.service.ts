import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "../models";
import { WebSQLService } from "./websql.service";

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    public member?: Member;
    public lastUrl = ""

    constructor(
        public router: Router,
        public database: WebSQLService
    ) {
        
    }
}