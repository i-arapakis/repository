import { StringifyOptions } from "querystring";

export class UpdateServiceIDAssignmentGroupMapRowsResponse {
    Result: boolean;
    Info: string;

    constructor(Result: boolean, Info: string)
    {
        this.Result = Result;
        this.Info = Info;
    }
}