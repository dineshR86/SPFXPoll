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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var _ = require("lodash");
//const defaults = require('react-chartjs-2').defaults;
var Chart = require('chart.js');
var defaults = Chart.defaults;
var Results = (function (_super) {
    __extends(Results, _super);
    function Results(props) {
        var _this = _super.call(this, props) || this;
        defaults.global.tooltips.mode = 'label';
        defaults.global.elements.line.borderWidth = 2;
        defaults.global.elements.rectangle.borderWidth = 2;
        defaults.global.legend.display = true;
        defaults.global.colors = [
            '#97BBCD',
            '#DCDCDC',
            '#F7464A',
            '#46BFBD',
            '#FDB45C',
            '#949FB1',
            '#4D5360' // dark grey
        ];
        _this.state = {
            results: _this.data
        };
        return _this;
    }
    //This event is invoked immediately after a component is mounted. 
    Results.prototype.componentDidMount = function () {
        var _this = this;
        var options = [];
        _.forEach(this.props.pollobject.Options, function (value) {
            debugger;
            if (value.text.length > 20) {
                var optarray = [];
                var sposition = 0;
                for (var i = 0; i <= (value.text.length / 25); i++) {
                    optarray.push(value.text.substr(sposition, 25));
                    sposition = sposition + 25;
                }
                options.push(optarray);
            }
            else {
                options.push(value.text);
            }
        });
        this.props.dataProvider.getResultsData(this.props.pollobject.Id, options)
            .then(function (items) {
            debugger;
            _this.data = {
                labels: options,
                datasets: [{
                        label: _this.props.pollobject.PollQuestion,
                        data: items
                    }]
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
    //this event is fired when ever a mounted component receives new props.  
    //If you need to update the state in response to prop changes (for example, to reset it), you may compare this.props and nextProps and perform state transitions using this.setState() in this method.
    // React dosent call this method intially when mounting.
    Results.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        debugger;
        var options = [];
        var chartLabel = nextProps.pollobject.PollQuestion;
        _.forEach(nextProps.pollobject.Options, function (value) {
            if (value.text.length > 25) {
                var optarray = [];
                var sposition = 0;
                for (var i = 0; i <= (value.text.length / 25); i++) {
                    optarray.push(value.text.substr(sposition, 25));
                    sposition = sposition + 25;
                }
                options.push(optarray);
            }
            else {
                options.push(value.text);
            }
        });
        this.props.dataProvider.getResultsData(nextProps.pollobject.Id, options)
            .then(function (items) {
            debugger;
            _this.data = {
                labels: options,
                datasets: [{
                        label: chartLabel,
                        data: items
                    }]
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
        this.options = {
            scales: {
                xAxes: [{
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of votes'
                        },
                        ticks: {
                            callback: function (label, index, labels) { return label; }
                        }
                    }],
                yAxes: [{
                        ticks: {
                            callback: function (label, index, labels) {
                                return label;
                            }
                        },
                        display: true
                    }]
            }
        };
        return (React.createElement("div", null,
            React.createElement(react_chartjs_2_1.HorizontalBar, { data: this.state.results, options: this.options })));
    };
    return Results;
}(React.Component));
exports.Results = Results;

//# sourceMappingURL=Results.js.map
