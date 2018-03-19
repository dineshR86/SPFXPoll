import {IPollObject} from "../common/IObject";

export interface IPollSpfxState{
    pollItems?:IPollObject[];
    isErrorOccured?: boolean;
    errorMessage?:string;
}