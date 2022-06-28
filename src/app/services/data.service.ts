import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, } from "@angular/common/http"
import { IDataService, IHttpClientResponse, IMembersFilter, IMembersFilterResponse } from "src/../interfaces/data-service";
import { Member, Position, SessionMemberVote, VoteSession, VoteSessionCandidate } from "src/../models";
import { lastValueFrom } from "rxjs";

type BrowserWindow = Window & typeof globalThis & { openDatabase: any }

@Injectable({
    providedIn: "root"
})
export class DataService implements IDataService {
    public window?: BrowserWindow;
    private database: any;

    constructor(
        public http: HttpClient
    ) {

    }

    apiClient<T>(command: string, body?: any) {
        const headers: any = {};
        headers['Content-Type'] = 'application/json';

        const config = new HttpRequest("POST", `/api/${command}`, body, {
            responseType: 'json',
            headers: new HttpHeaders(headers),
        })
        return lastValueFrom(this.http.request<IHttpClientResponse<T>>(config)).then(response => {
            return (response as any)?.body as IHttpClientResponse<T>
        }).catch(e => {
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
        const result = await this.apiClient<VoteSessionCandidate>('createCandidate', candidate);
        if(result.status) return result.status;
        throw new Error(result.message);
    }
    
    async fetchSessionCadidates(voteSession: VoteSession): Promise<VoteSessionCandidate[]> {
        const result = await this.apiClient<VoteSessionCandidate[]>('fetchSessionCadidates', voteSession);
        if(result.status) {
            const candidates: VoteSessionCandidate[] = (result.data || []).map(candidate => {
                return new VoteSessionCandidate().load(candidate);
            })
            return candidates
        }
        throw new Error(result.message);
    }

    async getVotePosition(position: Position): Promise<Position> {
        throw new Error("Method not implemented.");
    }

    async getVoteSession(voteSession: VoteSession): Promise<VoteSession> {
        const result = await this.apiClient<VoteSession>('getVoteSession', voteSession);
        if(result.status) return new VoteSession().load(result.data);
        throw new Error(result.message);
    }

    async getCandidate(candidate: VoteSessionCandidate): Promise<VoteSessionCandidate> {
        throw new Error("Method not implemented.");
    }

    async getMember(member: Member): Promise<Member> {
        throw new Error("Method not implemented.");
    }

    async fetchMembers(filter?: IMembersFilter | undefined): Promise<IMembersFilterResponse> {
        const result = await this.apiClient<IMembersFilterResponse>('fetchMembers', filter);
        if(result.status) {
            const members: Member[] = (result.data.members || []).map(member => {
                return new Member().load(member);
            })
            result.data.members = members || []
            return result.data
        }
        throw new Error(result.message);
    }

    getCandiateVotesCount(candidate: VoteSessionCandidate): Promise<number> {
        throw new Error("Method not implemented.");
    }

    async fetchMemberVotes(sessionMemberVote: SessionMemberVote): Promise<SessionMemberVote[]> {
        const result = await this.apiClient<SessionMemberVote[]>('fetchMemberVotes', sessionMemberVote);
        if(result.status) {
            const memberVotes: SessionMemberVote[] = (result.data || []).map(memberVote => {
                return new SessionMemberVote().load(memberVote);
            })
            return memberVotes
        }
        throw new Error(result.message);
    }

    async submitMemberVote(sessionMemberVote: SessionMemberVote): Promise<boolean> {
        const result = await this.apiClient<SessionMemberVote>('submitMemberVote', sessionMemberVote);
        if(result.status) return result.status;
        throw new Error(result.message);
    }

    public startDatabase() {
    }
}