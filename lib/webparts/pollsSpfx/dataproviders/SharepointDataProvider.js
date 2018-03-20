"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sp_http_1 = require("@microsoft/sp-http");
var _ = require("lodash");
var SharepointDataProvider = (function () {
    function SharepointDataProvider(value) {
        console.log("Data provider log");
        this._webpartContext = value;
    }
    SharepointDataProvider.prototype.readsPollItemsFromList = function (pollsAnswered) {
        debugger;
        console.log("Data provider read poll items function");
        var querygetAllItems = "https://oaktondidata.sharepoint.com/tstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items?&$select=ID,Question,Options,Published_x0020_Date,Expiry_x0020_Date,PollCount";
        return this._webpartContext.spHttpClient.get(querygetAllItems, sp_http_1.SPHttpClient.configurations.v1).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        })
            .then(function (data) {
            debugger;
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
                    debugger;
                    var item = {
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
        }).catch(function (ex) {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    };
    SharepointDataProvider.prototype.submitPollResult = function (data) {
        var _this = this;
        var querypostitemurl = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items";
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
        var url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('Poll Questions')/Items(@v1)?&@v1=" + pollid;
        var httpclientoptions = {
            body: JSON.stringify({ PollCount: count })
        };
        httpclientoptions.headers = { 'IF-MATCH': '*', 'X-Http-Method': 'PATCH' };
        this._webpartContext.spHttpClient.post(url, sp_http_1.SPHttpClient.configurations.v1, httpclientoptions).then(function (response) {
            console.log(response.status);
        });
    };
    SharepointDataProvider.prototype.getResultsData = function (pollid, options) {
        //debugger;
        var url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=Answer,QuestionID,Author/Name &$expand=Author/Id &$filter=QuestionID eq " + pollid;
        return this._webpartContext.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        }).then(function (data) {
            //debugger;
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
    //Method for fetching all the polls answered by the user.
    SharepointDataProvider.prototype.getPollLogByUser = function (userId) {
        //debugger;
        var url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/Lists/getByTitle('PollLog')/Items?&$select=QuestionID,Editor/Name &$expand=Editor/Id &$filter=Editor/Id eq '11'";
        return this._webpartContext.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        }).then(function (data) {
            //debugger;
            var items = [];
            if (data) {
                _.forEach(data.value, function (obj) { items.push(obj.QuestionID); });
                items = _.uniq(items);
            }
            return items;
        }).catch(function (ex) {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    };
    SharepointDataProvider.prototype.getCurrentUser = function () {
        var _this = this;
        //debugger;
        var url = "https://oaktondidata.sharepoint.com/TstPoll/_api/Web/CurrentUser";
        return this._webpartContext.spHttpClient.get(url, sp_http_1.SPHttpClient.configurations.v1)
            .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                return Promise.reject(new Error(JSON.stringify(response)));
            }
        }).then(function (data) {
            //debugger;
            _this._currentUser = data;
            return data;
        }).catch(function (ex) {
            console.log("read poll items from list error catch", ex);
            throw ex;
        });
    };
    return SharepointDataProvider;
}());
exports.default = SharepointDataProvider;

//# sourceMappingURL=SharepointDataProvider.js.map
