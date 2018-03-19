"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sp_http_1 = require("@microsoft/sp-http");
var _ = require("lodash");
var SharepointDataProvider = (function () {
    function SharepointDataProvider(value) {
        this._webpartContext = value;
    }
    SharepointDataProvider.prototype.readsPollItemsFromList = function () {
        var querygetAllItems = "https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'fac3c0ce-247d-4ec2-bc5a-594241752ba4'&$select=ID,Question,Options,Published_x0020_Date,Expiry_x0020_Date,PollCount";
        return this._webpartContext.spHttpClient.get(querygetAllItems, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        })
            .then(function (data) {
            var items = [];
            if (data) {
                for (var i = 0; i < data.value.length; i++) {
                    //extracting the poll options from each item
                    var pollOptions = [];
                    var options = data.value[i].Options.split("\n");
                    if (options) {
                        for (var j = 0; j < options.length; j++) {
                            if (!_.isEmpty(options[j])) {
                                var pollOption = {
                                    key: j + "",
                                    text: options[j]
                                };
                                pollOptions.push(pollOption);
                            }
                        }
                    }
                    var item = {
                        Id: data.value[i].ID,
                        PollQuestion: data.value[i].Question,
                        PublishedDate: data.value[i].Published_x0020_Date,
                        ExpiryDate: data.value[i].Expiry_x0020_Date,
                        Options: pollOptions,
                        CurrentPollItem: data.value[i].ID == 1 ? true : false,
                        PollCount: data.value[i].PollCount
                    };
                    items.push(item);
                }
            }
            return items;
        }).catch(function (ex) {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    };
    SharepointDataProvider.prototype.submitPollResult = function (data) {
        var _this = this;
        var querypostitemurl = "https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'c0a6d775-96b1-44e9-a930-73fc9736e156'";
        var httpclientoptions = {
            body: JSON.stringify({ Title: data.PollQuestion, Answer: data.SelectedOptionkey, QuestionID: data.Id.toString() })
        };
        return this._webpartContext.spHttpClient.post(querypostitemurl, sp_http_1.SPHttpClient.configurations.v1, httpclientoptions)
            .then(function (response) {
            _this.updatePollCount(data.Id, data.PollCount + 1);
            if (response.status >= 200 && response.status < 300) {
                return response.status;
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        });
    };
    SharepointDataProvider.prototype.updatePollCount = function (pollid, count) {
        var url = "https://oaktondidata.sharepoint.com//_api/Web/Lists(@v0)/Items(@v1)?&@v0=guid'fac3c0ce-247d-4ec2-bc5a-594241752ba4'&@v1=" + pollid;
        var httpclientoptions = {
            body: JSON.stringify({ PollCount: count })
        };
        httpclientoptions.headers = { 'IF-MATCH': '*', 'X-Http-Method': 'PATCH' };
        this._webpartContext.spHttpClient.post(url, sp_http_1.SPHttpClient.configurations.v1, httpclientoptions).then(function (response) {
            console.log(response.status);
        });
    };
    SharepointDataProvider.prototype.getResultsData = function (pollid, options) {
        debugger;
        var url = "https://oaktondidata.sharepoint.com/_api/Web/Lists(@v0)/Items?&@v0=guid'c0a6d775-96b1-44e9-a930-73fc9736e156'&$select=Answer,QuestionID,Author/Name &$expand=Author/Id &$filter=QuestionID eq " + pollid;
        return this._webpartContext.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        }).then(function (data) {
            debugger;
            var items = [];
            if (data) {
                _.forEach(options, function (value) { items.push(_.filter(data.value, { 'Answer': value }).length); });
            }
            return items;
        }).catch(function (ex) {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    };
    return SharepointDataProvider;
}());
exports.default = SharepointDataProvider;

//# sourceMappingURL=SharepointDataProvider.js.map
