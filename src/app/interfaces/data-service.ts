import { Member, Position } from "../models";

export interface IDataService {
    startDatabase(): void
    register(member: Member): Promise<Member>
    login(member: Member): Promise<Member>
    createPosition(position: Position): Promise<number>
}