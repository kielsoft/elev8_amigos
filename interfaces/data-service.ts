import { Member, Position, SessionMemberVote, VoteSession, VoteSessionCandidate } from "../models";

export interface IPagination {
    page: number
    limit: number
    size?: number
    pages?: number
}

export interface IMembersFilter {
    pagination: IPagination,
    data: Member
}

export interface IMembersFilterResponse {
    pagination: IPagination,
    members: Member[]
}

export interface IDataService {
    startDatabase(): void
    register(member: Member): Promise<boolean>
    login(member: Member): Promise<Member>
    createPosition(position: Position): Promise<boolean>
    fetchPositions(): Promise<Position[]>
    getVotePosition(position: Position): Promise<Position>
    createSession(voteSession: VoteSession): Promise<boolean>
    fetchVoteSessions(): Promise<VoteSession[]>
    getVoteSession(voteSession: VoteSession): Promise<VoteSession>
    createCandidate(candidate: VoteSessionCandidate): Promise<boolean>
    fetchSessionCadidates(voteSession: VoteSession): Promise<VoteSessionCandidate[]>
    getCandidate(candidate: VoteSessionCandidate): Promise<VoteSessionCandidate>
    getCandiateVotesCount(candidate: VoteSessionCandidate): Promise<number>
    getMember(member: Member): Promise<Member>
    fetchMembers(filter?: IMembersFilter): Promise<IMembersFilterResponse>
    submitMemberVote(sessionMemberVote: SessionMemberVote): Promise<boolean>
    fetchMemberVotes(sessionMemberVote: SessionMemberVote): Promise<SessionMemberVote[]>
}

export interface IHttpClientResponse<T> {
    status: boolean, 
    message: string, 
    data: T,
}
