import { IResultObject,IPollObject } from './../common/IObject';
import IDataProvider from "./IDataprovider";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClientResponse, SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import { IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup";
import * as _ from "lodash";


export default class SharepointDataProvider implements IDataProvider {

    private _webpartContext: IWebPartContext;

    constructor(value: IWebPartContext) {
        this._webpartContext = value;
    }

    public readsPollItemsFromList(): Promise<IPollObject[]> {
        const querygetAllItems = "https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'fac3c0ce-247d-4ec2-bc5a-594241752ba4'&$select=ID,Question,Options,Published_x0020_Date,Expiry_x0020_Date,PollCount";

        return this._webpartContext.spHttpClient.get(querygetAllItems, SPHttpClient.configurations.v1).then(
            (response: any) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            })
            .then((data: any) => {
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

                        var item: IPollObject = {
                            Id: data.value[i].ID,
                            PollQuestion: data.value[i].Question,
                            PublishedDate: data.value[i].Published_x0020_Date,
                            ExpiryDate: data.value[i].Expiry_x0020_Date,
                            Options: pollOptions,
                            CurrentPollItem: data.value[i].ID == 1 ? true : false,
                            PollCount:data.value[i].PollCount
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
        const querypostitemurl = "https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'c0a6d775-96b1-44e9-a930-73fc9736e156'";
        const httpclientoptions: ISPHttpClientOptions = {
            body: JSON.stringify({ Title: data.PollQuestion, Answer: data.SelectedOptionkey, QuestionID: data.Id.toString() })
        };

        return this._webpartContext.spHttpClient.post(querypostitemurl, SPHttpClient.configurations.v1, httpclientoptions)
            .then((response: SPHttpClientResponse) => {
                this.updatePollCount(data.Id,data.PollCount+1);
                if (response.status >= 200 && response.status < 300) {
                    return response.status;
                }
                else { return Promise.reject(new Error(JSON.stringify(response))); }
            });
    }

    public updatePollCount(pollid:number,count:number){
        const url="https://oaktondidata.sharepoint.com//_api/Web/Lists(@v0)/Items(@v1)?&@v0=guid'fac3c0ce-247d-4ec2-bc5a-594241752ba4'&@v1="+pollid;
        const httpclientoptions:ISPHttpClientOptions={
            body:JSON.stringify({PollCount:count})
        };

        httpclientoptions.headers={'IF-MATCH': '*','X-Http-Method': 'PATCH'};
        
        this._webpartContext.spHttpClient.post(url,SPHttpClient.configurations.v1,httpclientoptions).then((response:SPHttpClientResponse)=>{
            console.log(response.status);
        });
        
    }

    public getResultsData(pollid:number,options:string[]):Promise<number[]>{
        debugger;
        const url="https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'c0a6d775-96b1-44e9-a930-73fc9736e156'&$select=Answer,QuestionID,Author/Name &$expand=Author/Id &$filter=QuestionID eq "+pollid;

        return this._webpartContext.spHttpClient.get(url,SPHttpClient.configurations.v1)
        .then((response:any) =>{
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else { return Promise.reject(new Error(JSON.stringify(response))); }
        }).then((data:any)=>{
            debugger;
            let items:number[]=[];
            if(data){
                _.forEach(options,(value)=>{items.push(_.filter(data.value,{'Answer':value}).length);});
            }
            return items;
        }).catch((ex) => {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    }
}