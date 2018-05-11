import * as React from 'react';
import { IResultProps } from "./IResultProps";
import { IResultState } from "./IResultState";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { HorizontalBar } from 'react-chartjs-2';
import { merge } from '@microsoft/sp-lodash-subset';
import { IResultObject } from '../common/IObject';
import * as _ from "lodash";
//const defaults = require('react-chartjs-2').defaults;
const Chart: any = require('chart.js');
const defaults: any = Chart.defaults;

export class Results extends React.Component<IResultProps, IResultState>{
  private data: { labels: any[], datasets: any[] };
  private options: any;

  constructor(props: IResultProps) {
    super(props);

    this.state = {
      results: this.data
    };
  }

  public componentDidMount(): void {
    // from angular-chart.js
    defaults.global.tooltips.mode = 'label';
    defaults.global.elements.line.borderWidth = 2;
    defaults.global.elements.rectangle.borderWidth = 2;
    defaults.global.legend.display = true;
    defaults.global.colors = [
      '#97BBCD', // blue
      '#DCDCDC', // light grey
      '#F7464A', // red
      '#46BFBD', // green
      '#FDB45C', // yellow
      '#949FB1', // grey
      '#4D5360'  // dark grey
    ];
    debugger;
    let options: any[] = [];
    _.forEach(this.props.pollobject.Options, (value) => { 
      options.push(value.text); 
      if(value.text.length>20){
        let optarray:string[]=[];
          let sposition:number=0;
          for(let i=0; i<= (value.text.length/20); i++){
            optarray.push(value.text.substr(sposition,20));
            sposition=sposition+20;
          }
          options.push(optarray);
      }
      else{
        options.push(value.text);
      }
    });
    this.props.dataProvider.getResultsData(this.props.pollobject.Id, options)
      .then(
        (items: number[]) => {
          debugger;
          this.data = {
            labels: options,
            datasets: [{
              label: this.props.pollobject.PollQuestion,
              data: items
            }]
          };
          this.setState({ results: this.data });
        },
        (data: any) => {
          this.setState({
            errorMessage: data
          });
        }
      ).catch((ex) => {
        this.setState({
          errorMessage: ex.errorMessage
        });
      });

  }

  public componentWillReceiveProps(nextProps): void {
    debugger;
    let options: string[] = [];
    let chartLabel: string = nextProps.pollobject.PollQuestion;
    _.forEach(nextProps.pollobject.Options, (value: any) => { options.push(value.text); });
    this.props.dataProvider.getResultsData(nextProps.pollobject.Id, options)
      .then(
        (items: number[]) => {
          debugger;
          this.data = {
            labels: options,
            datasets: [{
              label: chartLabel,
              data: items
            }]
          };
          this.setState({ results: this.data });
        },
        (data: any) => {
          this.setState({
            errorMessage: data
          });
        }
      ).catch((ex) => {
        this.setState({
          errorMessage: ex.errorMessage
        });
      });

  }



  public render(): React.ReactElement<IResultProps> {
    debugger;

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
            callback: (label, index, labels) => { return label; }
          }
        }],
        yAxes: [{
          ticks: {
            callback: (label: string, index, labels) => {
              return label.length > 20 ? label.substring(0, 20) + "..." : label;
            },
            fontSize: 18,
            fontColor: 'black'
          },
          display: true
        }]
      }
    };

    return (
      <div>
        <HorizontalBar data={this.state.results} options={this.options} />
      </div>
    );
  }
}