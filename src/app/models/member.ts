class BaseModel {
    private cTime: Date = null as any;

    load(data: any) {
        console.log(Object.getOwnPropertyNames(this))
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
        if(typeof cTime == 'string'){
            cTime = new Date(cTime)
        }

        this.cTime = cTime;
    }
}

export class Member extends BaseModel {
    rowid: number = 0
    nin: string = ""
    status: string = ""
    fullname: string = ""
    phone: string = ""
    stateOfOrigin: string = ""
    password: string = ""
}

export class Position extends BaseModel {
    rowid = 0
    name = ""
    description = ""
}

export class VoteSession extends BaseModel {
    rowid = 0
    name = ""
    description = ""
    startTime: Date = null as any
    endTime: Date = null as any
}

export class VoteSessionCandidate extends BaseModel {
    rowid = 0
    voteSessionId = ""
    votePositionId = ""
    memberNin = ""
    suspended = false
    member: Member = null as any
    position: Position = null as any
}
