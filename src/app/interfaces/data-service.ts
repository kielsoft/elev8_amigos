import { Member } from "../models";

export interface IDataService {
    startDatabase(): void
    register(member: Member): Promise<Member>
    login(member: Member): Member
}