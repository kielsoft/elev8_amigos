import { Member, Position, VoteSession, VoteSessionCandidate } from "../models";
import { Database, RunResult, Statement } from "sqlite3";

const Sqlite3 = require('sqlite3').verbose();

export class CommandHandlier {
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
                console.log(e)
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

    createCandidate(candidate: VoteSessionCandidate): Promise<number> {
        throw new Error("Method not implemented.");
    }
    
    fetchCadidate(): Promise<VoteSessionCandidate[]> {
        throw new Error("Method not implemented.");
    }

    public startDatabase() {
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
        CREATE TABLE IF NOT EXISTS \`voteSessionPositionCandidate\` (
            voteSessionId int(5), 
            votePositionId int(5), 
            memberNin varchar(11),
            suspended int(1),
            createdTime datetime
        )`);
        // sessionMemberVote - id, voteSession, votePositionId, voteCandidateId, memberId, createdTime
        this.database.run(`
        CREATE TABLE IF NOT EXISTS \`sessionMemberVote\` (
            voteSessionId int(5), 
            votePositionId int(5), 
            voteCandidateId int(5), 
            memberNin varchar(11),
            createdTime datetime
        )`);
    }
}