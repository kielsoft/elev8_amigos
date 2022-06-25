import { IDataService } from "../interfaces/data-service";
import { Member, Position, VoteSession, VoteSessionCandidate } from "../models";

export class MongoService implements IDataService {
    
    startDatabase(): void {
        throw new Error("Method not implemented.");
    }

    register(member: Member): Promise<Member> {
        throw new Error("Method not implemented.");
    }
    
    login(member: Member): Promise<Member> {
        throw new Error("Method not implemented.");
    }

    createPosition(position: Position): Promise<number> {
        throw new Error("Method not implemented.");
    }

    fetchPositions(): Promise<Position[]> {
        throw new Error("Method not implemented.");
    }

    createSession(voteSession: VoteSession): Promise<number> {
        throw new Error("Method not implemented.");
    }

    fetchVoteSessions(): Promise<VoteSession[]> {
        throw new Error("Method not implemented.");
    }

    createCandidate(candidate: VoteSessionCandidate): Promise<number> {
        throw new Error("Method not implemented.");
    }

    fetchCadidate(): Promise<VoteSessionCandidate[]> {
        throw new Error("Method not implemented.");
    }

}