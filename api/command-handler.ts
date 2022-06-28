import { Member, Position, SessionMemberVote, VoteSession, VoteSessionCandidate } from "../models";
import { Database } from "sqlite3";
import { IDataService, IMembersFilter, IMembersFilterResponse, IPagination } from "interfaces/data-service";

const Sqlite3 = require('sqlite3').verbose();

export class CommandHandlier implements IDataService {
    database: Database;
    constructor() {
        this.database = new Sqlite3.Database("database.sqlite3")
        this.startDatabase()
    }

    register(member: Member): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(`
            INSERT INTO member VALUES (?,?,?,?,?,?,?)
            `, [
                member.nin,
                member.status,
                member.fullname,
                member.phone,
                member.stateOfOrigin,
                member.password,
                new Date(),
            ], (error: Error) => {
                if(String(error?.message).indexOf("UNIQUE constraint") >=0) {
                    return reject(new Error(`NIN: ${member.nin} or phone number: ${member.phone} already exists in the database`))
                }
                else if(error) {
                    return reject(new Error("Error creating a new member!!!"))
                }
                return resolve("member created successfully")
            });
        })
    }

    login(member: Member): Promise<Member> {
        return new Promise((resolve, reject) => {
            this.database.get(`
            select rowid, * from member where nin=? and password=?
            `, [
                member.nin,
                member.password,
            ], (error:Error, data?: Member ) => {
                if(error) {
                    return reject(new Error("Unable to login at the moment!"))
                }
                if(!data?.rowid) {
                    return reject(new Error("Invalid nin or password"))
                }
                else if(data.status == "Blocked"){
                    return reject(new Error("This account is inactive, please contact the admin"))
                }
                resolve(data)
            });
        })
    }

    createPosition(position: Position): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(`
            INSERT INTO votePosition VALUES (?,?,?)
            `, [
                position.name,
                position.description,
                new Date(),
            ], (error: Error) => {
                if(String(error?.message).indexOf("UNIQUE constraint") >=0) {
                    return reject(new Error(`Position: ${position.name} already exists in the database`))
                }
                else if(error) {
                    return reject(new Error("Error creating a new position!!!"))
                }
                return resolve("new position created successfully")
            });
        })
    }

    fetchPositions(): Promise<Position[]> {
        return new Promise((resolve, reject) => {
            this.database.all(`
            select rowid, * from votePosition
            `, 
            [],
            (error: Error, positions: Position[]) => {
                if(error) {
                    return reject(new Error("Unable to fetch positions at the moment!"))
                }
                if(!positions.length) {
                    return reject(new Error("No position found"))
                }
                resolve(positions)
            });
        })
    }

    createSession(voteSession: VoteSession): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(`
            INSERT INTO voteSession VALUES (?,?,?,?,?)
            `, [
                voteSession.name,
                voteSession.description,
                new Date(),
                voteSession.startTime,
                voteSession.endTime,
            ], (e: Error) => {
                if(String(e?.message).indexOf("UNIQUE constraint") >=0) {
                    return reject(new Error(`Session: ${voteSession.name} already exists in the database`))
                } 
                else if(e) {
                    return reject(new Error("Error creating a new vote session!!!"))
                }

                resolve("vote session created successfully")
            });
        })
    }

    fetchVoteSessions(): Promise<VoteSession[]> {
        return new Promise((resolve, reject) => {
            this.database.all(`
            select rowid, * from voteSession
            `, 
            [],
            (e: Error, voteSessions: VoteSession[]) => {
                if(e) {
                    return reject(new Error("Error fetching positions"))
                }
                if(!voteSessions?.length) {
                    return reject(new Error("No vote-session found"))
                }
                resolve(voteSessions)
            });
        })
    }

    createCandidate(candidate: VoteSessionCandidate): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(`
            INSERT INTO voteSessionCandidate VALUES (?,?,?,?,?)
            `, [
                candidate.voteSessionId,
                candidate.votePositionId,
                candidate.memberNin,
                candidate.suspended,
                new Date(),
            ], (e: Error) => {
                if(String(e?.message).indexOf("FOREIGN KEY constraint") >=0) {
                    return reject(new Error(`Session candidate member does not exists in the database`))
                } 
                else if(String(e?.message).indexOf("UNIQUE constraint") >=0) {
                    return reject(new Error(`the candidate: ${candidate.memberNin} is already added to a position in this vote session`))
                } 
                else if(e) {
                    return reject(new Error("Error creating a new vote session candidate!!!"))
                }

                resolve("vote session candidate created successfully")
            });
        })
    }
    
    fetchSessionCadidates(voteSession: VoteSession): Promise<VoteSessionCandidate[]> {
        return new Promise((resolve, reject) => {
            this.database.all(`
            select rowid, * from voteSessionCandidate where voteSessionId=?
            `, 
            [voteSession.rowid],
            async (e: Error, candidates: VoteSessionCandidate[]) => {
                if(e) {
                    return reject(new Error("Error fetching vote-session candidates"))
                }
                if(!candidates?.length) {
                    return reject(new Error("No vote-session candidates found"))
                }
                candidates = await Promise.all(candidates.map(async candidate => {
                    candidate.member = await this.getMember({nin: candidate.memberNin} as Member)
                    candidate.position = await this.getVotePosition({rowid: candidate.votePositionId} as any)
                    candidate.totalVotes = await this.getCandiateVotesCount(candidate)
                    return candidate;
                }))
                resolve(candidates)
            });
        })
    }

    async getVotePosition(position: Position): Promise<Position> {
        return new Promise((resolve, reject) => {
            this.database.get(`
            select rowid, * from votePosition where rowid=?
            `, [
                position.rowid,
            ], (error:Error, data?: Position ) => {
                if(error) {
                    return reject(new Error("error get a vote positions at the moment!"))
                }
                if(!data?.rowid) {
                    return reject(new Error("vote-position not found"))
                }
                resolve(data)
            });
        })
    }

    async getVoteSession(voteSession: VoteSession): Promise<VoteSession> {
        return new Promise((resolve, reject) => {
            this.database.get(`
            select rowid, * from voteSession where rowid=?
            `, [
                voteSession.rowid,
            ], (error:Error, data?: VoteSession ) => {
                if(error) {
                    return reject(new Error("error get a vote session at the moment!"))
                }
                if(!data?.rowid) {
                    return reject(new Error("vote-session not found"))
                }
                resolve(data)
            });
        })
    }

    async getCandidate(candidate: VoteSessionCandidate): Promise<VoteSessionCandidate> {
        return new Promise((resolve, reject) => {
            this.database.get(`
            select rowid, * from voteSessionCandidate where rowid=?
            `, 
            [candidate.rowid],
            async (e: Error, candidate: VoteSessionCandidate) => {
                if(e) {
                    return reject(new Error("Error fetching a candidate"))
                }
                if(!candidate?.rowid) {
                    return reject(new Error("candidates not found"))
                }
                candidate.member = await this.getMember({nin: candidate.memberNin} as Member)
                candidate.position = await this.getVotePosition({rowid: candidate.votePositionId} as any)
                candidate.totalVotes = await this.getCandiateVotesCount(candidate)
                resolve(candidate)
            });
        })
    }

    getCandiateVotesCount(candidate: VoteSessionCandidate): Promise<number> {
        return new Promise((resolve, _) => {
            this.database.get(`select count(rowid) as total from sessionMemberVote where voteSessionId=? and voteCandidateId=?`, [
                candidate.voteSessionId,
                candidate.rowid,
            ], (_:Error, data?: {total: number} ) => {
                resolve(Number(data?.total || 0))
            });
        })
    }

    getMember(member: Member): Promise<Member> {
        return new Promise((resolve, reject) => {
            let query = `select rowid, * from member where rowid=?`
            if(member.nin) {
                query = `select rowid, * from member where nin=?`
            }

            this.database.get(query, [
                member.nin || member.rowid,
            ], (error:Error, data?: Member ) => {
                if(error) {
                    return reject(new Error("error getting a member at the moment!"))
                }
                if(!data?.rowid) {
                    return reject(new Error("member not found"))
                }
                resolve(data)
            });
        })
    }

    async fetchMembers(filter?: IMembersFilter | undefined): Promise<IMembersFilterResponse> {
        const pagination: IPagination = {
            limit: 50,
            page: 1,
        }
        if(filter?.pagination?.limit) pagination.limit = Number(filter?.pagination?.limit || 50)
        if(filter?.pagination?.page) pagination.page = Number(filter?.pagination?.limit || 1)

        const offset = (pagination.page-1) * pagination.limit

        return new Promise((resolve, reject) => {
            this.database.all(`
            select rowid, * from member LIMIT ? OFFSET ?
            `, [
                pagination.limit,
                offset,
            ], (error:Error, data: Member[] = [] ) => {
                if(error) {
                    return reject(new Error("error fetcting members at the moment!"))
                }
                pagination.size = data?.length || 0;
                resolve({members:data, pagination})
            });
        })
    }

    submitMemberVote(sessionMemberVote: SessionMemberVote): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.run(`
            INSERT INTO sessionMemberVote VALUES (?,?,?,?,?)
            `, [
                sessionMemberVote.voteSessionId,
                sessionMemberVote.votePositionId,
                sessionMemberVote.voteCandidateId,
                sessionMemberVote.memberNin,
                new Date(),
            ], (e: Error) => {
                if(String(e?.message).indexOf("FOREIGN KEY constraint") >=0) {
                    return reject(new Error(`Unable to register your vote for this position`))
                } 
                else if(String(e?.message).indexOf("UNIQUE constraint") >=0) {
                    return reject(new Error(`You have already voted a candidate of your choice before`))
                } 
                else if(e) {
                    return reject(new Error("Unable to register your vote at the moment"))
                }

                resolve("your vote is successfully registered")
            });
        })
    }

    fetchMemberVotes(sessionMemberVote: SessionMemberVote): Promise<SessionMemberVote[]> {
        return new Promise((resolve, reject) => {
            let query = `select rowid, * from sessionMemberVote where memberNin=?`;
            const params: any = [sessionMemberVote.memberNin]

            if(sessionMemberVote.voteSessionId){
                query += ' and voteSessionId=?';
                params.push(sessionMemberVote.voteSessionId)
            }
            
            if(sessionMemberVote.votePositionId){
                query += ' and votePositionId=?';
                params.push(sessionMemberVote.votePositionId)
            }

            query += " order by rowid"

            this.database.all(query, params,
            async (e: Error, memberVotes: SessionMemberVote[]) => {
                if(e) {
                    return reject(new Error("Error fetching member votes"))
                }
                memberVotes = await Promise.all(memberVotes.map(async memberVote => {
                    memberVote.candidataFullname = (await this.getCandidate({rowid: memberVote.voteCandidateId} as VoteSessionCandidate)).member.fullname                    
                    return memberVote;
                }))
                resolve(memberVotes)
            });
        })
    }

    public startDatabase() {

        // enforce foreign_keys check
        this.database.run("PRAGMA foreign_keys = ON;")

        // create members table
        this.database.run(`
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
        this.database.run(`
        CREATE TABLE IF NOT EXISTS \`voteSession\` (
            name varchar(50) unique, 
            description varchar(50), 
            createdTime datetime, 
            startTime datetime, 
            endTime datetime
        )`);

        // votePosition - id, name, description, createdTime
        this.database.run(`
        CREATE TABLE IF NOT EXISTS \`votePosition\` (
            name varchar(50) unique, 
            description varchar(50), 
            createdTime datetime
        )`);

        // voteSessionPositionCandidate - id, voteSessionId, votePositionId, memberId, createdTime
        this.database.run(`
        CREATE TABLE IF NOT EXISTS \`voteSessionCandidate\` (
            voteSessionId int(5), 
            votePositionId int(5), 
            memberNin varchar(11),
            suspended int(1),
            createdTime datetime,
            FOREIGN KEY(memberNin) REFERENCES member(nin)
        )`);

        this.database.run("CREATE UNIQUE INDEX IF NOT EXISTS voteSessionCandidate_session_member ON voteSessionCandidate(voteSessionId, memberNin);")

        // sessionMemberVote - id, voteSession, votePositionId, voteCandidateId, memberId, createdTime
        this.database.run(`
        CREATE TABLE IF NOT EXISTS \`sessionMemberVote\` (
            voteSessionId int(5), 
            votePositionId int(5), 
            voteCandidateId int(5), 
            memberNin varchar(11),
            createdTime datetime,
            FOREIGN KEY(memberNin) REFERENCES member(nin)
        )`);

        this.database.run("CREATE UNIQUE INDEX IF NOT EXISTS sessionMemberVote_session_member ON sessionMemberVote(voteSessionId, votePositionId, memberNin);")
    }
}