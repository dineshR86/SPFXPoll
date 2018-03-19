import { IPollObject } from '../common/IObject';
export default interface IDataProvider {
    readsPollItemsFromList(): Promise<IPollObject[]>;
    submitPollResult(data: IPollObject): Promise<any>;
    updatePollCount(pollid: number, count: number): any;
    getResultsData(pollid: number, options: string[]): Promise<number[]>;
}
