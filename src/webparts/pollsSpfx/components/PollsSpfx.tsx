import * as React from 'react';
import styles from './PollsSpfx.module.scss';
import { IPollsSpfxProps } from './IPollsSpfxProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IButtonProps, DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IPollObject } from '../common/IObject';
import { IPollSpfxState } from './IPollSpfxState';
import * as _ from "lodash";
import { HorizontalBar } from 'react-chartjs-2';
import { Results } from './Results';
import { Label } from 'office-ui-fabric-react/lib/Label';

export default class PollsSpfx extends React.Component<IPollsSpfxProps, IPollSpfxState> {
  private _PrevIndex: number;
  private _NextIndex: number;
  private _selectedOption: string;
  private _currentIndex: number;

  constructor(props: IPollsSpfxProps) {
    super(props);

    this.state = {
      pollItems: []
    };
  }

  public componentDidMount() {

    //this.props.dataProvider.readsPollItemsFromList()
    this.props.sharepointdataProvider.readsPollItemsFromList()
      .then(
        //resolve
        (items: IPollObject[]) => {
          this.setState({
            pollItems: items
          });
        },
        //reject
        (data: any) => {
          this.setState({
            isErrorOccured: true,
            errorMessage: data
          });
        }
      ).catch((ex) => {
        this.setState({
          isErrorOccured: true,
          errorMessage: ex.errorMessage
        });
      });
  }

  public render(): React.ReactElement<IPollsSpfxProps> {
    this._currentIndex = _.findIndex(this.state.pollItems, { CurrentPollItem: true });

    this._PrevIndex = this._currentIndex < this.state.pollItems.length - 1 ? this._currentIndex + 1 : -1;
    this._NextIndex = this._currentIndex > 0 ? this._currentIndex - 1 : -1;
    let pollitem = _.nth(this.state.pollItems, this._currentIndex);

    if (this._currentIndex < 0) {
      //TODO: Add the loading component
      return <div>Loading poll</div>;
    }

    return (
      <div className={styles.pollsSpfx}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>Survey</h2>
              <div>
                {pollitem.Showresults ? <div ><Results pollobject={pollitem} dataProvider={this.props.sharepointdataProvider} /></div> : <ChoiceGroup options={pollitem.Options} label={pollitem.PollQuestion} required={false} onChange={this._onChange} defaultSelectedKey="A" />}
              </div>
              <div>
                <Label disabled={false} className={styles.label}>
                  Total no of votes polled: <span>{pollitem.PollCount}</span>
                </Label>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.columnbuttons}>
              <IconButton data-automation-id='test' title='Previous Poll' iconProps={{ iconName: 'DoubleChevronLeftMed' }} onClick={this._onPrevClick} disabled={this._PrevIndex >= 0 ? false : true} />
              <DefaultButton data-automation-id='test' onClick={this._onVoteClick} hidden={pollitem.Showresults} title='Vote'> Vote </DefaultButton>
              <IconButton data-automation-id='test' title='Next Poll' iconProps={{ iconName: 'DoubleChevronLeftMedMirrored' }} onClick={this._onNextClick} disabled={this._NextIndex >= 0 ? false : true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private _onChange(ev: React.FormEvent<HTMLInputElement>, option: any) {
    console.dir(option);
    this._selectedOption = option.text;
  }

  @autobind
  private _onVoteClick() {
    //ev.preventDefault();
    let locpollItems = this.state.pollItems;
    let rendpollitem = _.nth(locpollItems, this._currentIndex);
    rendpollitem.Showresults = true;
    rendpollitem.SelectedOptionkey = this._selectedOption;
    //submitting the poll result
    this.props.sharepointdataProvider.submitPollResult(rendpollitem)
      .then(
        (data: any) => {
          debugger;

          rendpollitem.PollCount = rendpollitem.PollCount + 1;
          locpollItems[this._currentIndex] = rendpollitem;
          this.setState({ pollItems: locpollItems });
        },
        (data: any) => {
          debugger;
          this.setState({
            isErrorOccured: true,
            errorMessage: data
          });
        }
      ).catch((ex) => {
        this.setState({
          isErrorOccured: true,
          errorMessage: ex.errorMessage
        });
      });

  }

  @autobind
  private _onPrevClick() {
    //ev.preventDefault();
    debugger;
    let locpollItems = this.state.pollItems;
    let prevpollitem = _.nth(locpollItems, this._PrevIndex);
    let rendpollitem = _.nth(locpollItems, this._currentIndex);
    //setting the current poll to the previous one
    prevpollitem.CurrentPollItem = true;
    locpollItems[this._PrevIndex] = prevpollitem;

    //setting the current poll to false
    rendpollitem.CurrentPollItem = false;
    locpollItems[this._currentIndex] = rendpollitem;

    this.setState({ pollItems: locpollItems });

  }

  @autobind
  private _onNextClick() {
    //ev.preventDefault();
    debugger;
    let locpollItems = this.state.pollItems;
    let nextpollitem = _.nth(locpollItems, this._NextIndex);
    let rendpollitem = _.nth(locpollItems, this._currentIndex);
    //setting the current poll to the Next one
    nextpollitem.CurrentPollItem = true;
    locpollItems[this._NextIndex] = nextpollitem;

    //setting the current poll to false
    rendpollitem.CurrentPollItem = false;
    locpollItems[this._currentIndex] = rendpollitem;

    this.setState({ pollItems: locpollItems });
  }

  public componentDidUpdate() {
    console.log("component got updated");
  }
}


