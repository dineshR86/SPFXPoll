/// <reference types="react" />
import * as React from 'react';
import { IResultProps } from "./IResultProps";
import { IResultState } from "./IResultState";
export declare class Results extends React.Component<IResultProps, IResultState> {
    private data;
    private options;
    constructor(props: IResultProps);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: IResultProps): void;
    render(): React.ReactElement<IResultProps>;
}
