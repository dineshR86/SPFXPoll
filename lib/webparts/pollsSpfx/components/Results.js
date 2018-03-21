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
var Utilities_1 = require("office-ui-fabric-react/lib/Utilities");
var react_chartjs_2_1 = require("react-chartjs-2");
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var _ = require("lodash");
//const defaults = require('react-chartjs-2').defaults;
var Chart = require('chart.js');
var defaults = Chart.defaults;
var Results = (function (_super) {
    __extends(Results, _super);
    function Results(props) {
        var _this = _super.call(this, props) || this;
        _this.useExcanvas = typeof window.G_vmlCanvasManager === 'object' &&
            window.G_vmlCanvasManager !== null &&
            typeof window.G_vmlCanvasManager.initElement === 'function';
        _this.convertedColors = undefined;
        _this.state = {
            results: _this.data
        };
        return _this;
    }
    Results.prototype.componentDidMount = function () {
        var _this = this;
        // from angular-chart.js
        defaults.global.tooltips.mode = 'label';
        defaults.global.elements.line.borderWidth = 2;
        defaults.global.elements.rectangle.borderWidth = 2;
        defaults.global.legend.display = false;
        defaults.global.colors = [
            '#97BBCD',
            '#DCDCDC',
            '#F7464A',
            '#46BFBD',
            '#FDB45C',
            '#949FB1',
            '#4D5360' // dark grey
        ];
        this.convertedColors = defaults.global.colors.map(function (txt) { return _this.convertColor(txt); });
        // -- from angular-chart.js
        debugger;
        var options = [];
        _.forEach(this.props.pollobject.Options, function (value) { options.push(value.text); });
        this.props.dataProvider.getResultsData(this.props.pollobject.Id, options)
            .then(function (items) {
            debugger;
            _this.data = {
                labels: options,
                datasets: [sp_lodash_subset_1.merge({}, _this.convertedColors[0], {
                        label: _this.props.pollobject.PollQuestion,
                        data: items
                    })]
            };
            _this.setState({ results: _this.data });
        }, function (data) {
            _this.setState({
                errorMessage: data
            });
        }).catch(function (ex) {
            _this.setState({
                errorMessage: ex.errorMessage
            });
        });
    };
    Results.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        debugger;
        var options = [];
        var chartLabel = nextProps.pollobject.PollQuestion;
        _.forEach(nextProps.pollobject.Options, function (value) { options.push(value.text); });
        this.props.dataProvider.getResultsData(nextProps.pollobject.Id, options)
            .then(function (items) {
            debugger;
            _this.data = {
                labels: options,
                datasets: [sp_lodash_subset_1.merge({}, _this.convertedColors[2], {
                        label: chartLabel,
                        data: items
                    })]
            };
            _this.setState({ results: _this.data });
        }, function (data) {
            _this.setState({
                errorMessage: data
            });
        }).catch(function (ex) {
            _this.setState({
                errorMessage: ex.errorMessage
            });
        });
    };
    Results.prototype.render = function () {
        debugger;
        return (React.createElement("div", null,
            React.createElement(react_chartjs_2_1.HorizontalBar, { data: this.state.results })));
    };
    // from angular-chart.js
    Results.prototype.convertColor = function (color) {
        if (typeof color === 'object' && color !== null)
            return color;
        if (typeof color === 'string' && color[0] === '#')
            return this.getColor(Results.hexToRgb(color.substr(1)));
        return this.getRandomColor();
    };
    Results.prototype.getRandomColor = function () {
        var color = [Results.getRandomInt(0, 255), Results.getRandomInt(0, 255), Results.getRandomInt(0, 255)];
        return this.getColor(color);
    };
    Results.prototype.getColor = function (color) {
        return {
            backgroundColor: this.rgba(color, 0.2),
            pointBackgroundColor: this.rgba(color, 1),
            pointHoverBackgroundColor: this.rgba(color, 0.8),
            borderColor: this.rgba(color, 1),
            pointBorderColor: '#fff',
            pointHoverBorderColor: this.rgba(color, 1)
        };
    };
    Results.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Results.prototype.rgba = function (color, alpha) {
        // rgba not supported by IE8
        return this.useExcanvas ? 'rgb(' + color.join(',') + ')' : 'rgba(' + color.concat(alpha).join(',') + ')';
    };
    // Credit: http://stackoverflow.com/a/11508164/1190235
    Results.hexToRgb = function (hex) {
        var bigint = parseInt(hex, 16), r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
        return [r, g, b];
    };
    __decorate([
        Utilities_1.autobind
    ], Results.prototype, "convertColor", null);
    return Results;
}(React.Component));
exports.Results = Results;

//# sourceMappingURL=Results.js.map
