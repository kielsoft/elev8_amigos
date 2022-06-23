import { IDataService } from "../interfaces/data-service";
import { Member } from "../models";

export class MongoService implements IDataService {

    startDatabase(): void {
        throw new Error("Method not implemented.");
    }

    register(member: Member): Promise<Member> {
        throw new Error("Method not implemented.");
    }
    
    login(member: Member): Member {
        throw new Error("Method not implemented.");
    }

}