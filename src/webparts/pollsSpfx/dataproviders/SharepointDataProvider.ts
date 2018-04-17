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
    private _webAbsoluteUrl: string;

    constructor(value: IWebPartContext) {
        console.log("Data provider log");
        this._webpartContext = value;
        this._webAbsoluteUrl=value.pageContext.web.absoluteUrl;
    }


    // for fetching the poll items from the list based on the published date and expiry date.
    public readsPollItemsFromList(pollsAnswered: number[]): Promise<IPollObject[]> {
        //debugger;
        console.log("Data provider read poll items function");
        let todaysDate = new Date().toISOString();
        //In rest api for filtering using date need to cast the value of datetime parameter using the datetime
        const querygetAllItems = this._webAbsoluteUrl+ "/_api/Web/Lists/getByTitle('Poll Questions')/Items?&$select=ID,Question,Options,Published_x0020_Date,Expiry_x0020_Date,PollCount&$filter=(Expiry_x0020_Date ge datetime'" + todaysDate + "') and (Published_x0020_Date le datetime'" + todaysDate + "')";
        return this._webpartContext.spHttpClient.get(querygetAllItems, SPHttpClient.configurations.v1).then(
            (response: any) => {
                //debugger;
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            })
            .then((data: any) => {
                //debugger;
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
                        //debugger;
                        var item: IPollObject = {
                            Id: data.value[i].ID,
                            PollQuestion: data.value[i].Question,
                            PublishedDate: data.value[i].Published_x0020_Date,
                            ExpiryDate: data.value[i].Expiry_x0020_Date,
                            Options: pollOptions,
                            CurrentPollItem: i == 0 ? true : false,
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

    //This method is for submitting the selected option to the list
    public submitPollResult(data: IPollObject): Promise<any> {
        const querypostitemurl = this._webAbsoluteUrl + "/_api/Web/Lists/getByTitle('PollLog')/Items";
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

    //This method is for updating the Poll count in the Poll Questions list
    public updatePollCount(pollid: number, count: number) {
        const url = this._webAbsoluteUrl + "/_api/Web/Lists/getByTitle('Poll Questions')/Items(@v1)?&@v1=" + pollid;
        const httpclientoptions: ISPHttpClientOptions = {
            body: JSON.stringify({ PollCount: count })
        };

        httpclientoptions.headers = { 'IF-MATCH': '*', 'X-Http-Method': 'PATCH' };

        this._webpartContext.spHttpClient.post(url, SPHttpClient.configurations.v1, httpclientoptions).then((response: SPHttpClientResponse) => {
            console.log(response.status);
        });

    }

    //This method is for getting the options by all the users for a poll question
    public getResultsData(pollid: number, options: string[]): Promise<number[]> {
        //debugger;
        const url = this._webAbsoluteUrl + "/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=Answer,QuestionID,Author/Name &$expand=Author/Id &$filter=QuestionID eq " + pollid;

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
        const url = this._webAbsoluteUrl + "/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=QuestionID,Editor/Name &$expand=Editor/Id &$filter=Editor/Id eq " + userId;

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

    // method for fetching the details of the current user
    public getCurrentUser(): Promise<any> {
        //debugger;
        const url = this._webAbsoluteUrl + "/_api/Web/CurrentUser";

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