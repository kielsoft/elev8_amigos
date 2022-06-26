import { Member, Position, VoteSession, VoteSessionCandidate } from "../models";

export interface IDataService {
    startDatabase(): void
    register(member: Member): Promise<boolean>
    login(member: Member): Promise<Member>
    createPosition(position: Position): Promise<boolean>
    fetchPositions(): Promise<Position[]>
    createSession(voteSession: VoteSession): Promise<boolean>
    fetchVoteSessions(): Promise<VoteSession[]>
    createCandidate(candidate: VoteSessionCandidate): Promise<boolean>
    fetchCadidate(): Promise<VoteSessionCandidate[]>
}

export interface IHttpClientResponse<T> {
    status: boolean, 
    message: string, 
    data: T,
}
