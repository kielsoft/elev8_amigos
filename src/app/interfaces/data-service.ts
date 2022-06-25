import { Member, Position, VoteSession, VoteSessionCandidate } from "../models";

export interface IDataService {
    startDatabase(): void
    register(member: Member): Promise<Member>
    login(member: Member): Promise<Member>
    createPosition(position: Position): Promise<number>
    fetchPositions(): Promise<Position[]>
    createSession(voteSession: VoteSession): Promise<number>
    fetchVoteSessions(): Promise<VoteSession[]>
    createCandidate(candidate: VoteSessionCandidate): Promise<number>
    fetchCadidate(): Promise<VoteSessionCandidate[]>
}