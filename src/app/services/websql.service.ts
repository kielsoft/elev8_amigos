import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, } from "@angular/common/http"
import { IDataService, IHttpClientResponse } from "src/../interfaces/data-service";
import { Member, Position, VoteSession, VoteSessionCandidate } from "src/../models";
import { lastValueFrom } from "rxjs";

type BrowserWindow = Window & typeof globalThis & { openDatabase: any }

@Injectable({
    providedIn: "root"
})
export class WebSQLService implements IDataService {
    public window?: BrowserWindow;
    private database: any;

    constructor(
        public http: HttpClient
    ) {

    }

    apiClient<T>(command: string, body?: any) {
        const headers: any = {};
        headers['Content-Type'] = 'application/json';

        const config = new HttpRequest("POST", `http://localhost:4000/api/${command}`, body, {
            responseType: 'json',
            headers: new HttpHeaders(headers),
        })
        return lastValueFrom(this.http.request<IHttpClientResponse<T>>(config)).then(response => {
            // console.log(response)
            return (response as any)?.body as IHttpClientResponse<T>
        }).catch(e => {
            // console.log)
            return (e as any)?.error as IHttpClientResponse<T>
        })
    }

    async register(member: Member): Promise<boolean> {
        const response = await this.apiClient<Member>('register', member);
        if(response.status) return response.status;
        throw new Error(response.message)
    }

    async login(member: Member): Promise<Member> {
        const result = await this.apiClient<Member>('login', member);
        if(result.status) return new Member().load(result.data);
        throw new Error(result.message);
    }

    async createPosition(position: Position): Promise<boolean> {
        const result = await this.apiClient<Position>('createPosition', position);
        if(result.status) return result.status;
        throw new Error(result.message);
    }

    async fetchPositions(): Promise<Position[]> {
        const result = await this.apiClient<Position[]>('fetchPositions');
        console.log(result)
        if(result.status) {
            const votePositions: Position[] = (result.data || []).map(votePosition => {
                return new Position().load(votePosition);
            })
            return votePositions
        }
        throw new Error(result.message);
    }

    async createSession(voteSession: VoteSession): Promise<boolean> {
        const result = await this.apiClient<Position>('createSession', voteSession);
        if(result.status) return result.status;
        throw new Error(result.message);
    }

    async fetchVoteSessions(): Promise<VoteSession[]> {
        const result = await this.apiClient<VoteSession[]>('fetchVoteSessions');
        if(result.status) {
            const voteSessions: VoteSession[] = (result.data || []).map(voteSession => {
                return new VoteSession().load(voteSession);
            })
            return voteSessions
        }
        throw new Error(result.message);
    }

    async createCandidate(candidate: VoteSessionCandidate): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    fetchCadidate(): Promise<VoteSessionCandidate[]> {
        throw new Error("Method not implemented.");
    }


    public startDatabase() {
        this.window = window as BrowserWindow
        this.database = this.window?.openDatabase('amigosDatabase', '1.0', 'this is a client side database', 5 * 1024 * 1024);
        console.log(this.database)

        // To check whether the database is created or not.
        if (!this.database) { console.log('database not created'); }
        else {
            this.database.transaction((tx: any) => {
                // create members table
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`member\` (
                    nin varchar(11) unique,
                    status varchar(20),
                    fullname varchar(50),
                    phone varchar(15) unique,
                    stateOfOrigin varchar(20), 
                    password varchar(40),
                    createdTime datetime
                );`);

                // voteSession - id, name, description, createdTime, startTime, endTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`voteSession\` (
                    name varchar(50) unique, 
                    description varchar(50), 
                    createdTime datetime, 
                    startTime datetime, 
                    endTime datetime
                )`);
                // votePosition - id, name, description, createdTime
                tx.executeSql(`
               CREATE TABLE IF NOT EXISTS \`votePosition\` (
                    name varchar(50) unique, 
                    description varchar(50), 
                    createdTime datetime 
                )`);
                // voteSessionPositionCandidate - id, voteSessionId, votePositionId, memberId, createdTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`voteSessionPositionCandidate\` (
                    voteSessionId int(5), 
                    votePositionId int(5), 
                    memberNin varchar(11),
                    suspended int(1),
                    createdTime datetime
                )`);
                // sessionMemberVote - id, voteSession, votePositionId, voteCandidateId, memberId, createdTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`sessionMemberVote\` (
                    voteSessionId int(5), 
                    votePositionId int(5), 
                    voteCandidateId int(5), 
                    memberNin varchar(11),
                    createdTime datetime
                )`);
            });
        }
    }
}