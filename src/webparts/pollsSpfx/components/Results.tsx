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
    this.state = {
      results: this.data
    };
  }

  //This event is invoked immediately after a component is mounted. 
  public componentDidMount(): void {
    let options: any[] = [];
    _.forEach(this.props.pollobject.Options, (value) => {
      debugger; 
      if(value.text.length>20){
        let optarray:string[]=[];
          let sposition:number=0;
          for(let i=0; i<= (value.text.length/25); i++){
            optarray.push(value.text.substr(sposition,25));
            sposition=sposition+25;
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

  //this event is fired when ever a mounted component receives new props.  
  //If you need to update the state in response to prop changes (for example, to reset it), you may compare this.props and nextProps and perform state transitions using this.setState() in this method.
  // React dosent call this method intially when mounting.
  public componentWillReceiveProps(nextProps:IResultProps): void {
    debugger;
    let options: any[] = [];
    let chartLabel: string = nextProps.pollobject.PollQuestion;
    _.forEach(nextProps.pollobject.Options, (value) => { 
      if(value.text.length>25){
        let optarray:string[]=[];
          let sposition:number=0;
          for(let i=0; i<= (value.text.length/25); i++){
            optarray.push(value.text.substr(sposition,25));
            sposition=sposition+25;
          }
          options.push(optarray);
      }
      else{
        options.push(value.text);
      }
    });
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
              return label;
            }
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