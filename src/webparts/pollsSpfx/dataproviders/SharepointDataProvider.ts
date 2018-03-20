import { IResultObject, IPollObject } from './../common/IObject';
import IDataProvider from "./IDataprovider";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClientResponse, SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import { IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup";
import * as _ from "lodash";


export default class SharepointDataProvider implements IDataProvider {

    private _webpartContext: IWebPartContext;
    private _pollsAnswered: number[];
    private _currentUser: any;

    constructor(value: IWebPartContext) {
        console.log("Data provider log");
        this._webpartContext = value;
        
    }

   

    public readsPollItemsFromList(pollsAnswered:number[]): Promise<IPollObject[]> {
        debugger;
        console.log("Data provider read poll items function");
        const querygetAllItems = "https://oaktondidata.sharepoint.com/tstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items?&$select=ID,Question,Options,Published_x0020_Date,Expiry_x0020_Date,PollCount";

        return this._webpartContext.spHttpClient.get(querygetAllItems, SPHttpClient.configurations.v1).then(
            (response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            })
            .then((data: any) => {
                debugger;
                let items: IPollObject[] = [];
                if (data) {
                    for (let i = 0; i < data.value.length; i++) {
                        //extracting the poll options from each item
                        let pollOptions: IChoiceGroupOption[] = [];
                        let options = data.value[i].Options.split("\n");
                        if (options) {
                            for (let j = 0; j < options.length; j++) {
                                if (!_.isEmpty(options[j])) {
                                    var pollOption: IChoiceGroupOption = {
                                        key: j + "",
                                        text: options[j]
                                    };

                                    pollOptions.push(pollOption);
                                }
                            }
                        }
                        debugger;
                        var item: IPollObject = {
                            Id: data.value[i].ID,
                            PollQuestion: data.value[i].Question,
                            PublishedDate: data.value[i].Published_x0020_Date,
                            ExpiryDate: data.value[i].Expiry_x0020_Date,
                            Options: pollOptions,
                            CurrentPollItem: data.value[i].ID == 1 ? true : false,
                            Showresults: _.indexOf(pollsAnswered, data.value[i].ID.toString()) >= 0 ? true : false,
                            PollCount: data.value[i].PollCount
                        };
                        items.push(item);
                    }
                }
                return items;
            }).catch((ex) => {
                console.log("read poll items from list error catch", ex);
                throw ex;
            });
    }

    public submitPollResult(data: IPollObject): Promise<any> {
        const querypostitemurl = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items";
        const httpclientoptions: ISPHttpClientOptions = {
            body: JSON.stringify({ Title: data.PollQuestion, Answer: data.SelectedOptionkey, QuestionID: data.Id.toString() })
        };

        return this._webpartContext.spHttpClient.post(querypostitemurl, SPHttpClient.configurations.v1, httpclientoptions)
            .then((response: SPHttpClientResponse) => {
                this.updatePollCount(data.Id, data.PollCount + 1);
                if (response.status >= 200 && response.status < 300) {
                    return response.status;
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            });
    }

    public updatePollCount(pollid: number, count: number) {
        const url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items(@v1)?&@v1=" + pollid;
        const httpclientoptions: ISPHttpClientOptions = {
            body: JSON.stringify({ PollCount: count })
        };

        httpclientoptions.headers = { 'IF-MATCH': '*', 'X-Http-Method': 'PATCH' };

        this._webpartContext.spHttpClient.post(url, SPHttpClient.configurations.v1, httpclientoptions).then((response: SPHttpClientResponse) => {
            console.log(response.status);
        });

    }

    public getResultsData(pollid: number, options: string[]): Promise<number[]> {
        //debugger;
        const url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=Answer,QuestionID,Author/Name &$expand=Author/Id &$filter=QuestionID eq " + pollid;

        return this._webpartContext.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            }).then((data: any) => {
                //debugger;
                let items: number[] = [];
                if (data) {
                    _.forEach(options, (value) => { items.push(_.filter(data.value, { 'Answer': value }).length); });
                }
                return items;
            }).catch((ex) => {
                console.log("read poll items from list error catch", ex);
                throw ex;
            });
    }

    //Method for fetching all the polls answered by the user.
    public getPollLogByUser(userId: number): Promise<number[]> {
        //debugger;
        const url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=QuestionID,Editor/Name &$expand=Editor/Id &$filter=Editor/Id eq '11'";

        return this._webpartContext.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            }).then((data: any) => {
                //debugger;
                let items: number[] = [];
                if (data) {
                    _.forEach(data.value, (obj: any) => { items.push(obj.QuestionID); });
                    items = _.uniq(items);
                }
                return items;
            }).catch((ex) => {
                console.log("read poll items from list error catch", ex);
                throw ex;
            });
    }

    public getCurrentUser(): Promise<any> {
        //debugger;
        const url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/CurrentUser";

        return this._webpartContext.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            }).then((data: any) => {
                //debugger;
                this._currentUser = data;
                return data;
            }).catch((ex) => {
                console.log("read poll items from list error catch", ex);
                throw ex;
            });
    }
}