import { IPollObject } from './../common/IObject';
import IDataProvider from "./IDataprovider";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
export default class SharepointDataProvider implements IDataProvider {
    private _webpartContext;
    constructor(value: IWebPartContext);
    readsPollItemsFromList(): Promise<IPollObject[]>;
    submitPollResult(data: IPollObject): Promise<any>;
    updatePollCount(pollid: number, count: number): void;
    getResultsData(pollid: number, options: string[]): Promise<number[]>;
}
