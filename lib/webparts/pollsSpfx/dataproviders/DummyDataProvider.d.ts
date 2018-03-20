import IDataProvider from "./IDataprovider";
import { IPollObject } from "../common/IObject";
export default class MockUpDataProvider implements IDataProvider {
    /**
     * Returns sample data
     */
    readsPollItemsFromList(): Promise<IPollObject[]>;
    submitPollResult(data: IPollObject): Promise<any>;
    updatePollCount(pollid: number, count: number): void;
    getResultsData(pollid: number, options: string[]): Promise<number[]>;
    getPollLogByUser(userId: number): Promise<number[]>;
    getCurrentUser(): Promise<any>;
}
