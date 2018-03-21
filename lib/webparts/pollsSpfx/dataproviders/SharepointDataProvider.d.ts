import { IPollObject } from './../common/IObject';
import IDataProvider from "./IDataprovider";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
export default class SharepointDataProvider implements IDataProvider {
    private _webpartContext;
    private _pollsAnswered;
    private _currentUser;
    private _webAbsoluteUrl;
    constructor(value: IWebPartContext);
    readsPollItemsFromList(pollsAnswered: number[]): Promise<IPollObject[]>;
    submitPollResult(data: IPollObject): Promise<any>;
    updatePollCount(pollid: number, count: number): void;
    getResultsData(pollid: number, options: string[]): Promise<number[]>;
    getPollLogByUser(userId: number): Promise<number[]>;
    getCurrentUser(): Promise<any>;
}
