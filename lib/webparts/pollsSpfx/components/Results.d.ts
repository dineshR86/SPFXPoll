/// <reference types="react" />
import * as React from 'react';
import { IResultProps } from "./IResultProps";
import { IResultState } from "./IResultState";
export declare class Results extends React.Component<IResultProps, IResultState> {
    private useExcanvas;
    private convertedColors;
    private data;
    private options;
    constructor(props: IResultProps);
    componentDidMount(): void;
    render(): React.ReactElement<IResultProps>;
    private convertColor(color);
    private getRandomColor();
    private getColor(color);
    private static getRandomInt(min, max);
    private rgba(color, alpha);
    private static hexToRgb(hex);
}
