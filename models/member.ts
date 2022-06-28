class BaseModel {
    rowid = 0
    private cTime: Date = null as any;

    load(data: any) {
        Object.getOwnPropertyNames(this).forEach(k => {
            (this as any)[k] = data[k]
        })

        if(data.createdTime) this.createdTime = data.createdTime;

        return this;
    }

    public get createdTime(): Date {
        return this.cTime;
    }
    
    set createdTime(cTime: Date | string) {
        if(typeof cTime !== 'object'){
            cTime = new Date(cTime)
        }

        this.cTime = cTime;
    }
}

export class Member extends BaseModel {
    nin: string = ""
    status: string = ""
    fullname: string = ""
    phone: string = ""
    stateOfOrigin: string = ""
    password: string = ""
}

export class Position extends BaseModel {
    name = ""
    description = ""
}

export class VoteSession extends BaseModel {
    name = ""
    description = ""
    startTime: Date = null as any
    endTime: Date = null as any
}

export class VoteSessionCandidate extends BaseModel {
    voteSessionId = 0
    votePositionId = 0
    memberNin = ""
    suspended = false
    member: Member = null as any
    position: Position = null as any
    totalVotes = 0
}

export class SessionMemberVote extends BaseModel {
    voteSessionId = 0
    votePositionId = 0
    voteCandidateId = 0
    memberNin = ""
    candidataFullname = ""
}
