/// <reference types="react" />
import * as React from 'react';
import { IPollsSpfxProps } from './IPollsSpfxProps';
import { IPollSpfxState } from './IPollSpfxState';
export default class PollsSpfx extends React.Component<IPollsSpfxProps, IPollSpfxState> {
    private _PrevIndex;
    private _NextIndex;
    private _selectedOption;
    private _currentIndex;
    constructor(props: IPollsSpfxProps);
    componentDidMount(): void;
    render(): React.ReactElement<IPollsSpfxProps>;
    private _onChange(ev, option);
    private _onVoteClick();
    private _onPrevClick();
    private _onNextClick();
    componentDidUpdate(): void;
}
