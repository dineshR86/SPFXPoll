import * as React from 'react';
import { IResultProps } from "./IResultProps";
import { IResultState } from "./IResultState";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { HorizontalBar } from 'react-chartjs-2';
import { merge } from '@microsoft/sp-lodash-subset';
import { IResultObject } from '../common/IObject';
import * as _ from "lodash";
//const defaults = require('react-chartjs-2').defaults;
const Chart : any = require('chart.js');
const defaults : any = Chart.defaults;



interface IColorInfo {
  backgroundColor: string;
  pointBackgroundColor: string;
  pointHoverBackgroundColor: string;
  borderColor: string;
  pointBorderColor: string;
  pointHoverBorderColor: string;
}

export class Results extends React.Component<IResultProps,IResultState>{

private useExcanvas: boolean = typeof (window as any).G_vmlCanvasManager === 'object' &&
(window as any).G_vmlCanvasManager !== null &&
typeof (window as any).G_vmlCanvasManager.initElement === 'function';
private convertedColors: IColorInfo[] = undefined;
private data: { labels: string[], datasets: any[] };
private options: any;

constructor(props:IResultProps){
    super(props);

    this.state={
        results:this.data
    };
}

public componentDidMount():void{
       // from angular-chart.js
       defaults.global.tooltips.mode = 'label';
       defaults.global.elements.line.borderWidth = 2;
       defaults.global.elements.rectangle.borderWidth = 2;
       defaults.global.legend.display = false;
       defaults.global.colors = [
         '#97BBCD', // blue
         '#DCDCDC', // light grey
         '#F7464A', // red
         '#46BFBD', // green
         '#FDB45C', // yellow
         '#949FB1', // grey
         '#4D5360'  // dark grey
       ];
       this.convertedColors = defaults.global.colors.map((txt) => this.convertColor(txt));
       // -- from angular-chart.js
       debugger;
       var options:string[]=[];
       _.forEach(this.props.pollobject.Options,(value)=>{options.push(value.text);});
       this.props.dataProvider.getResultsData(this.props.pollobject.Id,options)
       .then(
           (items:number[])=>{
            this.data={
                labels:options,
                datasets:[merge({},this.convertedColors[0],{
                    label:this.props.pollobject.PollQuestion,
                    data:items
                })]
            };
            this.setState({results:this.data});
           },
           (data:any) =>{
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

public render(): React.ReactElement<IResultProps>{

    return (
        <div>
            <h2>Poll Result Example</h2>
            <HorizontalBar data={this.data} />
        </div>
    );
}

      // from angular-chart.js
  @autobind
  private convertColor(color: IColorInfo | string): IColorInfo {
    if (typeof color === 'object' && color !== null) return color;
    if (typeof color === 'string' && color[0] === '#') return this.getColor(Results.hexToRgb(color.substr(1)));
    return this.getRandomColor();
  }

  private getRandomColor(): IColorInfo {
    const color: number[] = [Results.getRandomInt(0, 255), Results.getRandomInt(0, 255), Results.getRandomInt(0, 255)];
    return this.getColor(color);
  }

  private getColor(color: number[]): IColorInfo {
    return {
      backgroundColor: this.rgba(color, 0.2),
      pointBackgroundColor: this.rgba(color, 1),
      pointHoverBackgroundColor: this.rgba(color, 0.8),
      borderColor: this.rgba(color, 1),
      pointBorderColor: '#fff',
      pointHoverBorderColor: this.rgba(color, 1)
    };
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private rgba(color: number[], alpha: number): string {
    // rgba not supported by IE8
    return this.useExcanvas ? 'rgb(' + color.join(',') + ')' : 'rgba(' + color.concat(alpha).join(',') + ')';
  }

  // Credit: http://stackoverflow.com/a/11508164/1190235
  private static hexToRgb(hex: string): number[] {
    const bigint: number = parseInt(hex, 16),
      r: number = (bigint >> 16) & 255,
      g: number = (bigint >> 8) & 255,
      b: number = bigint & 255;

    return [r, g, b];
  }
  // -- from angular-chart.js
}