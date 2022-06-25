import { IDataService } from "../interfaces/data-service";
import { Member, Position } from "../models";

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

}