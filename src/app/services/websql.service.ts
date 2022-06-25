import { HostListener, Injectable } from "@angular/core";
import { IDataService } from "../interfaces/data-service";
import { Member, Position } from "../models";

type BrowserWindow = Window & typeof globalThis & { openDatabase: any }

@Injectable({
    providedIn: "root"
})
export class WebSQLService implements IDataService {
    public window?: BrowserWindow;
    private database: any;

    register(member: Member): Promise<Member> {
        return new Promise((resolve, reject) => {
            this.database.transaction((tx: any) => {
                tx.executeSql(`
                INSERT INTO member VALUES (?,?,?,?,?,?,?)
                `, [
                    member.nin,
                    member.status,
                    member.fullname,
                    member.phone,
                    member.stateOfOrigin,
                    member.password,
                    new Date(),
                ], (_: any, result: any) => {
                    console.log(result)
                    resolve(result)
                }, (_: any, e: Error) => {
                    console.log(e)
                    if(String(e.message).indexOf("UNIQUE constraint") >=0) {
                        reject(new Error(`NIN: ${member.nin} or phone number: ${member.phone} already exists in the database`))
                    } else {
                        reject(new Error("Error creating a new member!!!"))
                    }
                });
            });
        })
    }

    login(member: Member): Promise<Member> {
        return new Promise((resolve, reject) => {
            this.database.transaction((tx: any) => {
                tx.executeSql(`
                select rowid, * from member where nin=? and password=?
                `, [
                    member.nin,
                    member.password,
                ], (_: any, result: any) => {
                    console.log(result)
                    if(!result.rows.length) {
                        return reject(new Error("Invalid nin or password"))
                    }
                    else if(result.rows[0].status == "Blocked"){
                        return reject(new Error("This account is inactive, please contact the admin"))
                    }
                    resolve(result.rows[0] as Member)
                }, (_: any, e: Error) => {
                    console.log(e)
                    reject(new Error("Error logging in at the momemt"))
                });
            });
        })
    }

    createPosition(position: Position): Promise<number> {
        return new Promise((resolve, reject) => {
            this.database.transaction((tx: any) => {
                tx.executeSql(`
                INSERT INTO votePosition VALUES (?,?,?)
                `, [
                    position.name,
                    position.description,
                    new Date(),
                ], (_: any, result: any) => {
                    console.log(result)
                    resolve(result.insertId)
                }, (_: any, e: Error) => {
                    console.log(e)
                    if(String(e.message).indexOf("UNIQUE constraint") >=0) {
                        reject(new Error(`Position: ${position.name} already exists in the database`))
                    } else {
                        reject(new Error("Error creating a new position!!!"))
                    }
                });
            });
        })
    }


    public startDatabase() {
        this.window = window as BrowserWindow
        this.database = this.window?.openDatabase('amigosDatabase', '1.0', 'this is a client side database', 5 * 1024 * 1024);
        console.log(this.database)

        // To check whether the database is created or not.
        if (!this.database) { console.log('database not created'); }
        else {
            this.database.transaction((tx: any) => {
                // create members table
                tx.executeSql(`
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
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`voteSession\` (
                    name varchar(50) unique, 
                    description varchar(50), 
                    createdTime datetime, 
                    startTime datetime, 
                    endTime datetime
                )`);
                // votePosition - id, name, description, createdTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`votePosition\` (
                    name varchar(50) unique, 
                    description varchar(50), 
                    createdTime datetime
                )`);
                // voteSessionPositionCandidate - id, voteSessionId, votePositionId, memberId, createdTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`voteSessionPositionCandidate\` (
                    voteSessionId int(5), 
                    votePositionId int(5), 
                    memberNin varchar(11),
                    createdTime datetime
                )`);
                // sessionMemberVote - id, voteSession, votePositionId, voteCandidateId, memberId, createdTime
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS \`sessionMemberVote\` (
                    voteSessionId int(5), 
                    votePositionId int(5), 
                    voteCandidateId int(5), 
                    memberNin varchar(11),
                    createdTime datetime
                )`);
            });
        }
    }
}