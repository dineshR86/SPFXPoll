import { IResultObject,IPollObject } from '../common/IObject';

export default interface IDataProvider{
    readsPollItemsFromList():Promise<IPollObject[]>;

    submitPollResult(data:IPollObject):Promise<any>;

    updatePollCount(pollid:number,count:number);

    getResultsData(pollid:number,options:string[]):Promise<number[]>;
    
}