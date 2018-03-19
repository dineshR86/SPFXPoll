"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PollsSpfx_module_scss_1 = require("./PollsSpfx.module.scss");
var ChoiceGroup_1 = require("office-ui-fabric-react/lib/ChoiceGroup");
var Button_1 = require("office-ui-fabric-react/lib/Button");
var Utilities_1 = require("office-ui-fabric-react/lib/Utilities");
var _ = require("lodash");
var Results_1 = require("./Results");
var Label_1 = require("office-ui-fabric-react/lib/Label");
var PollsSpfx = (function (_super) {
    __extends(PollsSpfx, _super);
    function PollsSpfx(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            pollItems: []
        };
        return _this;
    }
    PollsSpfx.prototype.componentDidMount = function () {
        var _this = this;
        //this.props.dataProvider.readsPollItemsFromList()
        this.props.sharepointdataProvider.readsPollItemsFromList()
            .then(
        //resolve
        function (items) {
            _this.setState({
                pollItems: items
            });
        }, 
        //reject
        function (data) {
            _this.setState({
                isErrorOccured: true,
                errorMessage: data
            });
        }).catch(function (ex) {
            _this.setState({
                isErrorOccured: true,
                errorMessage: ex.errorMessage
            });
        });
    };
    PollsSpfx.prototype.render = function () {
        this._currentIndex = _.findIndex(this.state.pollItems, { CurrentPollItem: true });
        this._PrevIndex = this._currentIndex < this.state.pollItems.length - 1 ? this._currentIndex + 1 : -1;
        this._NextIndex = this._currentIndex > 0 ? this._currentIndex - 1 : -1;
        var pollitem = _.nth(this.state.pollItems, this._currentIndex);
        if (this._currentIndex < 0) {
            //TODO: Add the loading component
            return React.createElement("div", null, "Loading poll");
        }
        return (React.createElement("div", { className: PollsSpfx_module_scss_1.default.pollsSpfx },
            React.createElement("div", { className: PollsSpfx_module_scss_1.default.container },
                React.createElement("div", { className: PollsSpfx_module_scss_1.default.row },
                    React.createElement("div", { className: PollsSpfx_module_scss_1.default.column },
                        React.createElement("h2", null, "Survey"),
                        React.createElement("div", null, pollitem.Showresults ? React.createElement("div", null,
                            React.createElement(Results_1.Results, { pollobject: pollitem, dataProvider: this.props.sharepointdataProvider })) : React.createElement(ChoiceGroup_1.ChoiceGroup, { options: pollitem.Options, label: pollitem.PollQuestion, required: false, onChange: this._onChange, defaultSelectedKey: "A" })),
                        React.createElement("div", null,
                            React.createElement(Label_1.Label, { disabled: false, className: PollsSpfx_module_scss_1.default.label },
                                "Total no of votes polled: ",
                                React.createElement("span", null, pollitem.PollCount))))),
                React.createElement("div", { className: PollsSpfx_module_scss_1.default.row },
                    React.createElement("div", { className: PollsSpfx_module_scss_1.default.columnbuttons },
                        React.createElement(Button_1.IconButton, { "data-automation-id": 'test', title: 'Previous Poll', iconProps: { iconName: 'DoubleChevronLeftMed' }, onClick: this._onPrevClick, disabled: this._PrevIndex >= 0 ? false : true }),
                        React.createElement(Button_1.DefaultButton, { "data-automation-id": 'test', onClick: this._onVoteClick, hidden: pollitem.Showresults, title: 'Vote' }, " Vote "),
                        React.createElement(Button_1.IconButton, { "data-automation-id": 'test', title: 'Next Poll', iconProps: { iconName: 'DoubleChevronLeftMedMirrored' }, onClick: this._onNextClick, disabled: this._NextIndex >= 0 ? false : true }))))));
    };
    PollsSpfx.prototype._onChange = function (ev, option) {
        console.dir(option);
        this._selectedOption = option.text;
    };
    PollsSpfx.prototype._onVoteClick = function () {
        var _this = this;
        //ev.preventDefault();
        var locpollItems = this.state.pollItems;
        var rendpollitem = _.nth(locpollItems, this._currentIndex);
        rendpollitem.Showresults = true;
        rendpollitem.SelectedOptionkey = this._selectedOption;
        //submitting the poll result
        this.props.sharepointdataProvider.submitPollResult(rendpollitem)
            .then(function (data) {
            debugger;
            rendpollitem.PollCount = rendpollitem.PollCount + 1;
            locpollItems[_this._currentIndex] = rendpollitem;
            _this.setState({ pollItems: locpollItems });
        }, function (data) {
            debugger;
            _this.setState({
                isErrorOccured: true,
                errorMessage: data
            });
        }).catch(function (ex) {
            _this.setState({
                isErrorOccured: true,
                errorMessage: ex.errorMessage
            });
        });
    };
    PollsSpfx.prototype._onPrevClick = function () {
        //ev.preventDefault();
        debugger;
        var locpollItems = this.state.pollItems;
        var prevpollitem = _.nth(locpollItems, this._PrevIndex);
        var rendpollitem = _.nth(locpollItems, this._currentIndex);
        //setting the current poll to the previous one
        prevpollitem.CurrentPollItem = true;
        locpollItems[this._PrevIndex] = prevpollitem;
        //setting the current poll to false
        rendpollitem.CurrentPollItem = false;
        locpollItems[this._currentIndex] = rendpollitem;
        this.setState({ pollItems: locpollItems });
    };
    PollsSpfx.prototype._onNextClick = function () {
        //ev.preventDefault();
        debugger;
        var locpollItems = this.state.pollItems;
        var nextpollitem = _.nth(locpollItems, this._NextIndex);
        var rendpollitem = _.nth(locpollItems, this._currentIndex);
        //setting the current poll to the Next one
        nextpollitem.CurrentPollItem = true;
        locpollItems[this._NextIndex] = nextpollitem;
        //setting the current poll to false
        rendpollitem.CurrentPollItem = false;
        locpollItems[this._currentIndex] = rendpollitem;
        this.setState({ pollItems: locpollItems });
    };
    PollsSpfx.prototype.componentDidUpdate = function () {
        console.log("component got updated");
    };
    __decorate([
        Utilities_1.autobind
    ], PollsSpfx.prototype, "_onChange", null);
    __decorate([
        Utilities_1.autobind
    ], PollsSpfx.prototype, "_onVoteClick", null);
    __decorate([
        Utilities_1.autobind
    ], PollsSpfx.prototype, "_onPrevClick", null);
    __decorate([
        Utilities_1.autobind
    ], PollsSpfx.prototype, "_onNextClick", null);
    return PollsSpfx;
}(React.Component));
exports.default = PollsSpfx;

//# sourceMappingURL=PollsSpfx.js.map
