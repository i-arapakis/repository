export class ServiceIDAssignmentGroupMap {
    ID: string;
    ServiceID: number;
    AssignmentGroup: string;
    LastUpdate: Date;
    Checked: boolean;
    Modified: boolean;

    constructor(ID: string, ServiceID: number, AssignmentGroup: string, LastUpdate: Date, Checked: boolean, Modified: boolean = false)
    {
        this.ID = ID;
        this.ServiceID = ServiceID;
        this.AssignmentGroup = AssignmentGroup;
        this.LastUpdate = LastUpdate;
        this.Checked = Checked;
        this.Modified = Modified;
    }
}